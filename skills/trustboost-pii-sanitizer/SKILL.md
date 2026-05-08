---
name: trustboost-pii-sanitizer
description: Sanitize PII from text before sending to LLMs or external APIs. Use when handling user-generated text that may contain emails, phone numbers, national IDs, private keys, or financial data. Required for GDPR, HIPAA, LGPD, EU AI Act compliance. Supports EN, ES (LATAM), PT (BR/PT), DE, JA. No wallet needed for preview — try instantly with a single POST request.
metadata:
  author: teodorofodocrispin-cmyk
  version: "2.2.0"
  endpoint: https://api.trustboost.dev/sanitize
  preview: https://api.trustboost.dev/sanitize/preview
  health: https://api.trustboost.dev/health
  homepage: https://github.com/teodorofodocrispin-cmyk/TrustBoost-PII-Sanitizer
---

# TrustBoost PII Sanitizer

Blockchain-verified PII redaction layer for autonomous AI agent pipelines.
Detects and redacts personally identifiable information **before** it reaches
LLM providers or external APIs. Solana-native, no SDK required.

## Try it in 10 seconds — no wallet needed

```bash
curl -X POST https://api.trustboost.dev/sanitize/preview \
  -H "Content-Type: application/json" \
  -d '{"text": "My name is John Doe, email john@gmail.com, SSN 123-45-6789"}'
```

## How It Works

1. Send raw text to TrustBoost API
2. PII is detected and redacted server-side
3. Returns sanitized text + safety score + risk category
4. Only sanitized output is logged — raw input is never stored

## Access Modes

| Mode | How | Cost | Quota |
|------|-----|------|-------|
| **Preview** | `POST /sanitize/preview` | Free | 3 per IP/day |
| **Trial** | `tx_hash: "TRIAL"` | Free | 50 per wallet |
| **Paid** | Real Solana tx hash | 149 USDC | 10,000 sanitizations |

## Multilingual PII Support

| Language | Region | PII Patterns |
|----------|--------|--------------|
| 🇺🇸 English | Global | SSN, API keys, credit cards, passwords |
| 🇲🇽🇨🇴🇦🇷 Spanish | Latin America | RFC, CUIT, RUT, DNI, CURP, Cédula |
| 🇧🇷🇵🇹 Portuguese | Brazil & Portugal | CPF, CNPJ, RG, NIF |
| 🇩🇪 German | Germany/Austria/CH | Personalausweis, Steuernummer, IBAN |
| 🇯🇵 Japanese | Japan | マイナンバー, 運転免許証, パスポート番号 |

## Compliance

GDPR · LGPD · APPI · HIPAA · CCPA · EU AI Act (Aug 2026)

## When to Use This Skill

- Before passing user input to any LLM provider
- Before forwarding data through x402/Pay.sh to external APIs
- When processing text in regulated industries (healthcare, finance, legal)
- When handling multilingual content with country-specific PII formats

## Resources

- GitHub: https://github.com/teodorofodocrispin-cmyk/TrustBoost-PII-Sanitizer
- Health: https://api.trustboost.dev/health
- ClawHub: https://clawhub.ai/teodorofodocrispin-cmyk/trustboost-pii-sanitizer
