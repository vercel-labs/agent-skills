/**
 * Reference encrypted upload for Agent Relay agents.
 * Matches Web Crypto in arelay src/lib/e2ee.ts — do not hand-roll Python ECDH/HKDF.
 *
 * Usage:
 *   AGENT_RELAY_URL=https://arelay.app AGENT_API_TOKEN=ar_... node e2ee-upload.mjs "Title" "file.md"
 */
import { webcrypto } from 'node:crypto';

const relayUrl = (process.env.AGENT_RELAY_URL ?? 'https://arelay.app').replace(/\/$/, '');
const apiToken = process.env.AGENT_API_TOKEN;
if (!apiToken) {
	console.error('AGENT_API_TOKEN is required');
	process.exit(1);
}

const TEXT_ENCODER = new TextEncoder();

function bytesToBase64Url(bytes) {
	let binary = '';
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function toArrayBuffer(bytes) {
	return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

async function importPublicKey(publicKeyJwk) {
	return webcrypto.subtle.importKey(
		'jwk',
		{ kty: publicKeyJwk.kty, crv: publicKeyJwk.crv, x: publicKeyJwk.x, y: publicKeyJwk.y },
		{ name: 'ECDH', namedCurve: 'P-256' },
		true,
		[]
	);
}

async function deriveContentKey(privateKey, publicKey, usages) {
	return webcrypto.subtle.deriveKey(
		{ name: 'ECDH', public: publicKey },
		privateKey,
		{ name: 'AES-GCM', length: 256 },
		false,
		usages
	);
}

async function encryptBytes(plaintext, recipientPublicKeyJwk) {
	const recipientPublicKey = await importPublicKey(recipientPublicKeyJwk);
	const ephemeralKeyPair = await webcrypto.subtle.generateKey(
		{ name: 'ECDH', namedCurve: 'P-256' },
		true,
		['deriveKey']
	);
	const contentKey = await deriveContentKey(ephemeralKeyPair.privateKey, recipientPublicKey, [
		'encrypt'
	]);
	const iv = webcrypto.getRandomValues(new Uint8Array(12));
	const ciphertext = await webcrypto.subtle.encrypt(
		{ name: 'AES-GCM', iv: toArrayBuffer(iv) },
		contentKey,
		toArrayBuffer(plaintext)
	);
	const epk = await webcrypto.subtle.exportKey('jwk', ephemeralKeyPair.publicKey);
	return {
		v: 1,
		alg: 'P-256-ECDH-A256GCM',
		epk: { kty: epk.kty, crv: epk.crv, x: epk.x, y: epk.y },
		iv: bytesToBase64Url(iv),
		ciphertext: bytesToBase64Url(new Uint8Array(ciphertext))
	};
}

async function encryptString(plaintext, recipientPublicKeyJwk) {
	return encryptBytes(TEXT_ENCODER.encode(plaintext), recipientPublicKeyJwk);
}

function envelopeToPayload(envelope) {
	const { ciphertext, ...payload } = envelope;
	const base64 = ciphertext.replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(ciphertext.length / 4) * 4, '=');
	return {
		payload,
		ciphertextBytes: Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
	};
}

async function agentFetch(path, init = {}) {
	const res = await fetch(`${relayUrl}${path}`, {
		...init,
		headers: { Authorization: `Bearer ${apiToken}`, ...(init.headers ?? {}) }
	});
	const body = await res.json().catch(() => null);
	if (!res.ok) throw new Error(`${init.method ?? 'GET'} ${path} failed (${res.status}): ${JSON.stringify(body)}`);
	return body;
}

const title = process.argv[2] ?? 'Encrypted delivery';
const filename = process.argv[3] ?? 'delivery.md';
const content = process.argv[4] ?? '# Encrypted delivery\n\nSent via agent-relay-e2ee reference script.\n';
const contentType = filename.endsWith('.md') ? 'text/markdown' : 'text/plain';

const config = await agentFetch('/api/agent/e2ee/config');
if (!config?.configured) throw new Error('E2EE is not configured for this account');

const publicKeyJwk = config.publicKeyJwk;
const { session } = await agentFetch('/api/agent/sessions', {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		encrypted: true,
		encrypted_title: await encryptString(title, publicKeyJwk),
		encrypted_summary: await encryptString('Encrypted artifact upload', publicKeyJwk)
	})
});

const fileEnvelope = await encryptBytes(TEXT_ENCODER.encode(content), publicKeyJwk);
const { payload, ciphertextBytes } = envelopeToPayload(fileEnvelope);

const { artifact } = await agentFetch(`/api/agent/sessions/${session.id}/artifacts`, {
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		encrypted: true,
		encrypted_filename: await encryptString(filename, publicKeyJwk),
		encrypted_content_type: await encryptString(contentType, publicKeyJwk),
		encrypted_payload: payload,
		ciphertext_base64: bytesToBase64Url(ciphertextBytes),
		size_bytes: ciphertextBytes.byteLength
	})
});

console.log(JSON.stringify({ sessionId: session.id, artifactId: artifact.id }, null, 2));
