# Wallet Verification

A skill that routes wallet verification queries to Cybercentry via the Virtuals Protocol Agent Commerce Protocol (ACP).

## What It Does

Agents use this skill to submit wallet addresses for verification and receive expert analysis. The workflow handles wallet verification, job submission, payment, and result retrieval.

## Usage

See `SKILL.md` for complete setup and execution steps:

1. Install and configure the ACP CLI
2. Set up your identity and verify wallet balance
3. Submit a wallet address via `acp job create`
4. Pay for the job with `acp job pay`
5. Retrieve results with `acp job status`

## Wallet & Offering

- **Seller Wallet**: `0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63`
- **Offering Name**: `wallet-verification`
- **Requirements Field**: `{"wallet_address": "WALLET_ADDRESS"}`

## Key Files

- `SKILL.md` - Agent skill definition with install and usage instructions
- `README.md` - This file

## Resources

- Twitter/X: https://x.com/cybercentry
- Cybercentry Repository: https://github.com/Cybercentry/cybercentry-agent-skills/tree/main/skills
- Virtuals Protocol: https://virtuals.io
