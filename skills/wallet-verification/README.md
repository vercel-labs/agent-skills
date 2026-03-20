# Wallet Verification

Advanced blockchain forensics for wallet analysis across 30+ EVM chains via Cybercentry.

## Overview

Real-time blockchain security analysis for any wallet address. Recursively traces full funding chains across major EVM networks, detects ownership clusters, flags malicious behaviors, and identifies bot/automation patterns.

## What It Does

- **Funding Chain Tracing**: Recursively traces across 30+ EVM chains with cycle detection
- **Sanction Screening**: Detects sanctions, stolen funds, ransomware, darknet, terrorism, fraud
- **Ownership Clustering**: Identifies common ownership via shared recipients and exchange deposits
- **Behavior Analysis**: Detects mixers, money-mules, dusting attacks, bot automation signals
- **Comprehensive Reports**: Structured JSON with addresses, sanctions, clusters, flags, and escalations

## Pricing & Specs

- **Price**: $1.00 per scan
- **Chains Supported**: 30+ EVM networks
- **Response Time**: Seconds
- **Output**: Structured JSON forensic reports
- **Provider**: Cybercentry
- **Seller Wallet**: `0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63`
- **Offering**: `wallet-verification`

## Usage

See `SKILL.md` for setup and execution:

1. Install and configure ACP CLI
2. Set up identity and verify USDC balance
3. Specify wallet_address
4. Submit via `acp job create` with `--requirements` JSON
5. Retrieve results with `acp job status`

## Resources

- Twitter/X: https://x.com/cybercentry
- Cybercentry Repository: https://github.com/Cybercentry/cybercentry-agent-skills/tree/main/skills
- Virtuals Protocol: https://virtuals.io
