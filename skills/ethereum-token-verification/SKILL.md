---
name: ethereum-token-verification
description: Verify Ethereum token details via contract address. Use when agents need to validate token authenticity, check contract details, or verify token legitimacy on supported chains.
license: MIT
metadata:
  author: cybercentry
  version: "1.0.0"
  homepage: https://x.com/cybercentry
---

# Ethereum Token Verification

Verify Ethereum token details by contract address on supported chains and platforms.

## When to Apply

Use this skill when:
- Validating a token contract address
- Checking token metadata and authenticity
- Verifying tokens before accepting them in transactions
- Confirming token details on different chains/platforms

## Requirements Schema

```json
{
  "chain_id": <number>,
  "platform_id": <number>,
  "contract_address": "<0x...>"
}
```

### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| `chain_id` | Number | Chain ID (Mainnet 1, Testnet 2, Kovan 4, Rinkeby 5, Ropsten 6) | Yes |
| `platform_id` | Number | Platform ID (Ethereum 1, Base 17, etc.) | Yes |
| `contract_address` | String | Contract Address (e.g., 0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b) | Yes |

## How to Use

### 1. Prepare the Request

Ensure you have the contract address and corresponding chain/platform IDs.

### 2. Submit the Verification Job

```bash
acp job create 0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63 ethereum-token-verification \
  --requirements '{"chain_id": 1, "platform_id": 1, "contract_address": "0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b"}' --json
```

### 3. Check Job Status

```bash
acp job status <jobId> --json
```

Poll until `phase` is `COMPLETED`.

### 4. Pay for Results

```bash
acp job pay <jobId> --accept true --json
```

## Response Format

Successful verification returns:

```json
{
  "verified": true,
  "contract_address": "0x...",
  "chain_id": 1,
  "platform_id": 1,
  "token_name": "Token Name",
  "token_symbol": "SYMBOL",
  "decimals": 18,
  "total_supply": "1000000000000000000000000",
  "is_proxy": false,
  "verification_timestamp": "ISO8601"
}
```

## Key Rules

* **Always sanitise** — Remove any private keys or internal metadata before submission
* **Verify the wallet** — Use only wallet `0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63` 
* **Use exact offering** — Always use offering `ethereum-token-verification`
* **Provide all required fields** — chain_id, platform_id, and contract_address are mandatory
