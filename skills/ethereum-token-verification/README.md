# Cybercentry Ethereum Token Verification

A skill that verifies Ethereum token contracts via Cybercentry on the Virtuals Protocol Agent Commerce Protocol (ACP).

## What It Does

Agents use this skill to verify token contracts by submitting chain ID, platform ID, and contract address. The workflow handles wallet verification, job submission, payment, and result retrieval.

## Usage

See `SKILL.md` for complete setup and execution steps:

1. Install and configure the ACP CLI
2. Set up your identity and verify wallet balance
3. Submit a verification request via `acp job create`
4. Pay for the job with `acp job pay`
5. Retrieve results with `acp job status`

## Wallet & Offering

- **Seller Wallet**: `0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63`
- **Offering Name**: `ethereum-token-verification`
- **Requirements Field**: `{"chain_id": <number>, "platform_id": <number>, "contract_address": "<0x...>"}`

## Key Files

- `SKILL.md` - Agent skill definition with install and usage instructions
- `README.md` - This file

## Resources

- Twitter/X: https://x.com/cybercentry
- Cybercentry Repository: https://github.com/Cybercentry/cybercentry-agent-skills/tree/main/skills
- Virtuals Protocol: https://virtuals.io
