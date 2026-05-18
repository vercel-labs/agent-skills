import { test } from 'node:test';
import assert from 'node:assert/strict';
import { scan, metadata } from '../../../skills/vercel-optimize/lib/scanners/edge-heavy-import.mjs';

const f = (path, content) => ({ path, content });

test('edge-heavy-import: catches @aws-sdk/* in middleware.ts', () => {
  const findings = scan({
    files: [f('middleware.ts', "import { S3Client } from '@aws-sdk/client-s3';\nexport function middleware() {}")],
  });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].importedModule, '@aws-sdk/client-s3');
  assert.equal(findings[0].edgeReason, 'middleware (always edge)');
  assert.equal(findings[0].line, 1);
});

test('edge-heavy-import: catches sharp in a route with export const runtime = "edge"', () => {
  const findings = scan({
    files: [
      f('app/api/thumb/route.ts',
        "import sharp from 'sharp';\nexport const runtime = 'edge';\nexport async function GET() {}"),
    ],
  });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].importedModule, 'sharp');
  assert.equal(findings[0].edgeReason, 'export const runtime = "edge"');
});

test('edge-heavy-import: catches node:fs / node:crypto', () => {
  const findings = scan({
    files: [
      f('app/api/x/route.ts',
        "export const runtime = 'edge';\nimport fs from 'node:fs/promises';\nimport crypto from 'node:crypto';"),
    ],
  });
  const modules = findings.map((f) => f.importedModule).sort();
  assert.deepEqual(modules, ['node:crypto', 'node:fs/promises']);
});

test('edge-heavy-import: catches @prisma/client + pg + mysql2 (db drivers)', () => {
  const findings = scan({
    files: [
      f('middleware.ts',
        "import { PrismaClient } from '@prisma/client';\nimport pg from 'pg';\nimport mysql from 'mysql2/promise';"),
    ],
  });
  const modules = findings.map((f) => f.importedModule).sort();
  assert.deepEqual(modules, ['@prisma/client', 'mysql2/promise', 'pg']);
});

test('edge-heavy-import: SILENT on non-edge files even with heavy imports', () => {
  // Default Node.js runtime — heavy imports are fine.
  const findings = scan({
    files: [
      f('app/api/upload/route.ts',
        "import { S3Client } from '@aws-sdk/client-s3';\nexport async function POST() {}"),
    ],
  });
  assert.equal(findings.length, 0);
});

test('edge-heavy-import: SILENT on light imports inside edge file', () => {
  const findings = scan({
    files: [
      f('middleware.ts',
        "import { NextResponse } from 'next/server';\nimport { decode } from 'jose';"),
    ],
  });
  assert.equal(findings.length, 0);
});

test('edge-heavy-import: ignores `import type` (erased at compile time)', () => {
  const findings = scan({
    files: [
      f('middleware.ts',
        "import type { S3Client } from '@aws-sdk/client-s3';\nexport function middleware() {}"),
    ],
  });
  assert.equal(findings.length, 0);
});

test('edge-heavy-import: catches dynamic import()', () => {
  const findings = scan({
    files: [
      f('app/api/x/route.ts',
        "export const runtime = 'edge';\nexport async function GET() { const s = await import('sharp'); }"),
    ],
  });
  assert.equal(findings.length, 1);
  assert.equal(findings[0].importedModule, 'sharp');
});

test('edge-heavy-import: metadata + trafficIndependent + severity', () => {
  assert.equal(metadata.id, 'edge-heavy-import');
  assert.equal(metadata.trafficIndependent, true);
  assert.equal(metadata.severity, 'high');
});
