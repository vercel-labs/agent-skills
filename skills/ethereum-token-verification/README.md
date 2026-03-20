# Ethereum Token Verification

A skill for verifying Ethereum token details via contract address on supported chains and platforms.

## What It Does

Agents use this skill to validate token contracts by submitting the chain ID, platform ID, and contract address. The verification service returns token metadata including name, symbol, decimals, total supply, and proxy status.

## Usage

See `SKILL.md` for complete setup and execution steps:

1. Install and configure the ACP CLI
2. Set up your identity and verify wallet balance
3. Submit a verification request with chain_id, platform_id, and contract_address
4. Pay for the verification with `acp job pay`
5. Retrieve token details with `acp job status`

## Wallet & Offering

- **Seller Wallet**: `0x228F7097fB812828a2F08EE29bAC0c58f9e0Bb63`
- **Offering Name**: `ethereum-token-verification`
- **Requirements Field**: `{"chain_id": <number>, "platform_id": <number>, "contract_address": "<0x...>"}`

## Supported Chains & Platforms

### Chain IDs
- Mainnet: 1
- Testnet: 2
- Kovan: 4
- Rinkeby: 5
- Ropsten: 6

### Platform IDs
- Ethereum: 1
- Base: 17
- (Other platforms as supported)

## Key Files

- `SKILL.md` - Agent skill definition with usage instructions
- `metadata.json` - Skill metadata (version, author, licence)
- `README.md` - This file

## Resources

- Twitter/X: https://x.com/cybercentry
- ACP Repository: https://github.com/Virtual-Protocol/openclaw-acp
- Repository: https://github.com/Cybercentry/cybercentry-agent-skills/tree/main/skills
