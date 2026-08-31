---
name: trustboost-pii-sanitizer
description: Context-aware PII sanitization for autonomous AI agent pipelines. Sanitizes text before LLMs with 5 context modes (legal/financial/medical/code/general), Privacy Budget per agent, and TrustBoost Score for M2M trust verification. Supports EN, ES (LATAM), PT (BR/PT), DE, JA, FR, IT, KO with country-specific patterns (RFC, CUIT, CPF, CNPJ, Personalausweis, マイナンバー, NIR, Codice Fiscale, 주민등록번호). Returns sanitized text, safety_score (0.0-1.0), risk_category (CRITICAL/PRIVATE/SENSITIVE/CLEAN), and context_applied. No SDK required — single POST request. 50 free requests per wallet with tx_hash="TRIAL".
metadata:
  author: teodorofodocrispin-cmyk
  version: "2.6.0"
  endpoint: https://api.trustboost.dev/sanitize
  preview: https://api.trustboost.dev/sanitize/preview
  health: https://api.trustboost.dev/health
  homepage: https://github.com/teodorofodocrispin-cmyk/TrustBoost-PII-Sanitizer
---

# TrustBoost PII Sanitizer v2.6.0

Privacy firewall for autonomous AI agent pipelines. Sanitizes PII before text reaches LLMs. Every paid sanitization anchored on Solana — verifiable forever.

## Try it in 10 seconds — no wallet needed

```bash
curl -X POST https://api.trustboost.dev/sanitize/preview \
  -H "Content-Type: application/json" \
  -d '{"text": "My name is John Doe, email john@gmail.com, SSN 123-45-6789"}'
```

## How It Works

1. Agent sends text to TrustBoost API
2. GPT-4o-mini detects PII server-side
3. enforce_redaction() applies entities to original text
4. Returns sanitized text + safety_score + risk_category + proof
5. Raw input is never stored — only sanitized output logged

## Context Modes

| Context | Use case |
|---------|----------|
| `general` | Standard PII detection (default) |
| `legal` | Maximum redaction for legal documents |
| `financial` | Financial identifiers + wallet addresses |
| `medical` | HIPAA-grade sanitization |
| `code` | API keys and credentials only |

## Access Modes

| Mode | How | Cost | Quota |
|------|-----|------|-------|
| Preview | POST /sanitize/preview | Free | 3 per IP/hour |
| Trial | tx_hash="TRIAL" | Free | 50 per wallet |
| Paid | Real Solana tx hash | 149 USDC | 10,000 sanitizations |

## Multilingual PII Support

| Language | Region | PII Patterns |
|----------|--------|-------------|
| 🇺🇸 English | Global | SSN, API keys, credit cards, passwords |
| 🇲🇽🇨🇴 Spanish LATAM | Latin America | RFC, CUIT, CURP, DNI, Cédula |
| 🇧🇷🇵🇹 Portuguese | Brazil & Portugal | CPF, CNPJ, RG, NIF |
| 🇩🇪 German | DE/AT/CH | Personalausweis, Steuernummer, IBAN DE |
| 🇯🇵 Japanese | Japan | マイナンバー, 運転免許証, 住所 |
| 🇫🇷 French | FR/BE/CA | NIR, SIRET, Carte Vitale, IBAN FR |
| 🇮🇹 Italian | Italy | Codice Fiscale, Partita IVA, Tessera Sanitaria |
| 🇰🇷 Korean | Korea | 주민등록번호 (RRN), 사업자등록번호 |

## Proof of Sanitization on Solana

Every paid sanitization is anchored on Solana via Helius — verifiable by anyone forever.

```bash
curl https://api.trustboost.dev/verify/{anchor_tx}
```

Supports EU AI Act Articles 12, 13, 26.

## MCP Integration

```json
{
  "mcpServers": {
    "trustboost": {
      "url": "https://api.trustboost.dev/mcp"
    }
  }
}
```

Compatible with: Claude Code · Cursor · Windsurf · Glama

## Compliance

GDPR · LGPD · APPI · CCPA · EU AI Act (August 2, 2026)

## Resources

- GitHub: https://github.com/teodorofodocrispin-cmyk/TrustBoost-PII-Sanitizer
- Agent Card: https://api.trustboost.dev/.well-known/agent-card.json
- OpenAPI: https://api.trustboost.dev/openapi.json
- Health: https://api.trustboost.dev/health
- Live Demo: https://huggingface.co/spaces/TrustBoost/pii-sanitizer
- ClawHub: https://clawhub.ai/teodorofodocrispin-cmyk/trustboost-pii-sanitizer
