---
name: tenderly-testnet
description: Set up a Tenderly Virtual TestNet, deploy + verify Solidity contracts on it (or on any public testnet Tenderly indexes), and get them properly named in the Tenderly dashboard. Use when the user says "set up tenderly", "fork base sepolia in tenderly", "deploy to tenderly", "name my contracts in tenderly", or "verify my contracts to tenderly".
metadata:
  author: criptopoeta
  version: "1.0.0"
---

# Tenderly Virtual TestNet + Contract Verification

Spin up a Tenderly Virtual TestNet, broadcast a `forge` deploy against it (or against a real public testnet), and end with every contract verified, named, and rendered properly in the Tenderly dashboard's **Contracts** tab — not the Wallets tab.

This skill is **TESTNET ONLY**. Refuses mainnet by design.

## Step 0 — Safety gate (non-negotiable)

Refuse and stop immediately if any of these network IDs are involved:

| Mainnet (BLOCKED) | Chain |
|---|---|
| 1 | Ethereum |
| 10 | Optimism |
| 137 | Polygon |
| 8453 | Base |
| 42161 | Arbitrum |
| 43114 | Avalanche |
| 130 | Unichain |

Allowed testnets: 11155111 (Sepolia), 84532 (Base Sepolia), 421614 (Arb Sepolia), 11155420 (OP Sepolia), 80002 (Polygon Amoy), 43113 (Fuji), 5042002 (Arc Testnet), 10143 (Monad Testnet), 1301 (Unichain Sepolia).

If the user asks for a mainnet fork: explain that Tenderly Virtual TestNets are sandboxes, but this skill is opinionated about TESTNET-only forks to keep blast radius tiny. Suggest they use a dedicated mainnet-staging skill.

## Prerequisites

The user must provide:
- **Tenderly access token** (Settings → Access Tokens at https://dashboard.tenderly.co/account/authorization)
- **Tenderly account slug** (their username in the URL)
- **Tenderly project slug** (the project they want the vnet in)

These go in `.env.local` (gitignored) at the repo root. **Never** commit, log, or echo the token back.

## Step 1 — Verify access + create `.env.local`

```bash
TOKEN="<user-supplied>"
ACCOUNT="<account-slug>"
PROJECT="<project-slug>"

curl -s -L -H "X-Access-Key: $TOKEN" \
  "https://api.tenderly.co/api/v1/account/$ACCOUNT/project/$PROJECT/vnets" \
  | head -c 400
```

JSON array (even `[]`) means auth works. Hard 401 means invalid token.

```bash
cat > .env.local <<EOF
# LOCAL ONLY — gitignored. Rotate this token after each session.
TENDERLY_ACCESS_KEY=$TOKEN
TENDERLY_ACCOUNT=$ACCOUNT
TENDERLY_PROJECT=$PROJECT
EOF
grep -q '^\.env\.local$' .gitignore || echo '.env.local' >> .gitignore
git check-ignore .env.local
```

## Step 2 — Choose the source testnet

Pick the chainId that has the public-infra dependencies your contracts need (Morpho, Uniswap v4, CCTP V2, etc.). When in doubt, **Base Sepolia (84532)** has the deepest protocol coverage today.

## Step 3 — Create the Virtual TestNet

`network_id` and `chain_id` MUST be numbers (Tenderly rejects strings). Slug is lowercase-kebab.

```bash
SOURCE_CHAIN_ID=84532
SLUG="<project>-base-sepolia"
DISPLAY="<Project> Base Sepolia"

VNET_JSON=$(curl -s -L -X POST \
  -H "X-Access-Key: $TOKEN" \
  -H "Content-Type: application/json" \
  "https://api.tenderly.co/api/v1/account/$ACCOUNT/project/$PROJECT/vnets" \
  -d "{
    \"slug\": \"$SLUG\",
    \"display_name\": \"$DISPLAY\",
    \"fork_config\": { \"network_id\": $SOURCE_CHAIN_ID, \"block_number\": \"latest\" },
    \"virtual_network_config\": { \"chain_config\": { \"chain_id\": $SOURCE_CHAIN_ID } },
    \"sync_state_config\": { \"enabled\": false, \"commitment_level\": \"latest\" },
    \"explorer_page_config\": { \"enabled\": true, \"verification_visibility\": \"src\" }
  }")
```

Extract RPC URLs:

```bash
ADMIN_RPC=$(echo "$VNET_JSON" | jq -r '.rpcs[] | select(.name == "Admin RPC") | .url')
PUBLIC_RPC=$(echo "$VNET_JSON" | jq -r '.rpcs[] | select(.name == "Public RPC") | .url')
VNET_ID=$(echo "$VNET_JSON" | jq -r '.id')

cat >> .env.local <<EOF

TENDERLY_VNET_ID=$VNET_ID
TENDERLY_ADMIN_RPC=$ADMIN_RPC
TENDERLY_PUBLIC_RPC=$PUBLIC_RPC
EOF
```

## Step 4 — Fund the deployer via admin RPC

Use `tenderly_setBalance` to give your deployer arbitrary native gas. Anvil's test key #0 (`0xac0974…ff80` → `0xf39F…b92266`) is safest in shared workflows — it's well-known and obviously throwaway.

```bash
DEPLOYER=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
curl -s -X POST -H "Content-Type: application/json" "$ADMIN_RPC" \
  -d "{\"jsonrpc\":\"2.0\",\"method\":\"tenderly_setBalance\",\"params\":[\"$DEPLOYER\",\"0x8AC7230489E80000\"],\"id\":1}"
```

For ERC-20 balances: `tenderly_setErc20Balance` with the token + holder + hex amount.

## Step 5 — Broadcast a forge script against the vnet

```bash
set -a; source .env.local; set +a

DEPLOYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  forge script script/Deploy.s.sol \
    --rpc-url "$TENDERLY_ADMIN_RPC" \
    --broadcast \
    --skip-simulation \
    --slow
```

`--skip-simulation` is necessary because the vnet has admin-mutated state. `--slow` adds per-tx delay so the explorer renders each tx sequentially AND avoids the TUs/s rate limit (see Step 9 quotas).

## Step 6 — Persist live addresses

Write a JSON manifest under `deployments/` (NOT gitignored — it's the canonical record):

```json
{
  "network": "tenderly-base-sepolia-vnet",
  "chainId": 84532,
  "tenderlyVnetId": "<VNET_ID>",
  "deployer": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "contracts": {
    "MyContract": "0x...",
    "MyVault":    "0x..."
  }
}
```

## Step 7 — Useful admin RPC patterns

POST'd to the **Admin RPC** URL:

| Method | Use |
|---|---|
| `tenderly_setBalance(addr, hex)` | Fund any wallet with native gas |
| `tenderly_setErc20Balance(token, holder, hex)` | Fund any ERC-20 balance directly |
| `tenderly_setStorageAt(addr, slot, value)` | Mutate any storage slot |
| `tenderly_setCode(addr, bytecode)` | Replace a deployed contract's code |
| `evm_increaseTime(seconds)` | Time-travel forward |
| `evm_mine` | Mine a single block |

## Step 8 — Dashboard

```
https://dashboard.tenderly.co/<ACCOUNT>/<PROJECT>/testnet/<VNET_ID>
```

What's available for free:
- Live tx list with full call traces (the killer feature — **only readable AFTER verification, see Step 9**)
- Auto-decoded events (only AFTER verification)
- Gas profiler per call
- Web3 Actions (event-driven serverless)

## Step 9 — Name + verify contracts (so the dashboard is readable)

This is the step nearly every guide skips. **Deploying to a Tenderly vnet (or any chain Tenderly indexes) does NOT automatically register your contracts in the project.** Without this step traces show raw bytecode, the Contracts tab is empty, and events don't decode.

### What works (and what doesn't)

| Path | Result | When to use |
|---|---|---|
| `POST /api/v1/account/{a}/project/{p}/wallet` | `account_type=wallet`. Even contract addresses land in the **Wallets** tab. | **EOAs only**. Don't use for contracts. |
| `forge verify-contract --verifier custom --verifier-url <tenderly>` | Uploads source, sets `account_type=contract`, attaches verified source for full trace decoding. | **All contracts.** This is the right path. |
| `POST .../contracts` with Truffle-style artifact | The CLI's heavy upload path. Frequently 500s. | Avoid — use forge instead. |

### The verifier URL

Different for vnets vs public networks:

```bash
# Public network (Base Sepolia, Unichain Sepolia, Fuji, ...)
VURL="https://api.tenderly.co/api/v1/account/$TENDERLY_ACCOUNT/project/$TENDERLY_PROJECT/etherscan/verify/network/$CHAIN_ID"

# Virtual TestNet — append /verify/etherscan to the vnet RPC URL
VURL="${TENDERLY_PUBLIC_RPC}/verify/etherscan"
```

### Per-contract command

```bash
# 1. Encode constructor args. Tenderly REJECTS forge --guess-constructor-args
#    ("Action not supported") — you must encode manually for each contract.
ARGS=$(cast abi-encode "constructor(address,uint256)" 0x... 600)

# 2. Verify against Tenderly.
forge verify-contract <DEPLOYED_ADDR> src/MyContract.sol:MyContract \
  --constructor-args "$ARGS" \
  --verifier custom \
  --verifier-url "$VURL" \
  --etherscan-api-key "$TENDERLY_ACCESS_KEY" \
  --watch
```

Idempotent — re-verifying an already-verified contract returns `Pass - Verified` again, no error.

### Custom display names (multi-instance contracts)

When the same source produces multiple deployed instances (e.g. two ERC-4626 vaults wrapping different assets), `forge verify-contract` attaches source but the `display_name` field is empty — both show as the Solidity contract name. Override per address:

```bash
ADDR_LC=$(echo "$ADDR" | tr A-Z a-z)
curl -s -X POST \
  -H "X-Access-Key: $TENDERLY_ACCESS_KEY" \
  -H "Content-Type: application/json" \
  "https://api.tenderly.co/api/v1/account/$TENDERLY_ACCOUNT/project/$TENDERLY_PROJECT/contract/$CHAIN_ID/$ADDR_LC/rename" \
  -d '{"display_name":"MyVault (USDC)"}'
```

### Free-plan limits you'll hit

| Limit | Default | What happens at cap |
|---|---|---|
| **Addresses Monitored** (per project, all chains) | 20 | `HTTP 403 quota_limit_reached` when adding the 21st |
| **Node total** (vnets per project) | 2 | Can't create a new vnet; must delete one first |
| **Vnet max block height** | ~5000 blocks | Existing vnet stops accepting new txs with `You have reached the maximum block height` |
| **TUs per second** | rate-limited | Mid-deploy 403s during `forge script` bursts; use `--slow` or deploy to a real public testnet |

**Skip externals** (Morpho, Pyth, USDC, Permit2 ...) when labeling — they burn the 20-address cap. Reserve project slots for contracts you actually own.

### Useful cleanup / inspection

```bash
# List everything in the project
curl -s -H "X-Access-Key: $TENDERLY_ACCESS_KEY" \
  "https://api.tenderly.co/api/v1/account/$TENDERLY_ACCOUNT/project/$TENDERLY_PROJECT/contracts"

# Filter to just Contracts (excludes EOAs)
curl -s -H "X-Access-Key: $TENDERLY_ACCESS_KEY" \
  "https://api.tenderly.co/api/v1/account/$TENDERLY_ACCOUNT/project/$TENDERLY_PROJECT/contracts?accountType=contract"

# Bulk-delete to free slots
curl -s -X DELETE \
  -H "X-Access-Key: $TENDERLY_ACCESS_KEY" \
  -H "Content-Type: application/json" \
  "https://api.tenderly.co/api/v1/account/$TENDERLY_ACCOUNT/project/$TENDERLY_PROJECT/contracts" \
  -d '{"account_ids":["eth:84532:0x...","eth:84532:0x..."]}'

# Tag (orthogonal to display name; appears in Tags column)
curl -s -X POST \
  -H "X-Access-Key: $TENDERLY_ACCESS_KEY" \
  -H "Content-Type: application/json" \
  "https://api.tenderly.co/api/v1/account/$TENDERLY_ACCOUNT/project/$TENDERLY_PROJECT/tag" \
  -d '{"contract_ids":["eth:84532:0x..."],"tag":"hub-v3"}'
```

### Reusable pipeline scripts

This skill ships two scripts you can adapt:

```bash
# Verify many contracts from one chain — edit the constructor-args section per contract
bash scripts/tenderly-verify-many.sh <deployments-json>

# Verify a single FxSpoke-style contract on a non-hub chain
bash scripts/tenderly-verify-one.sh <deployments-json> <name> <path:Contract> <constructor-sig> <arg> <arg> ...
```

Both scripts:
1. Read `.env.local` for `TENDERLY_*` creds
2. Resolve manifest to an absolute path (so internal `cd` doesn't break re-reads)
3. `cast abi-encode` constructor args
4. `forge verify-contract` against Tenderly's etherscan-compat endpoint
5. POST to `/contract/.../rename` to set the display name

## Step 10 — Cleanup + token rotation

Tell the user explicitly:

> Your Tenderly access token is now in this session's transcript. Rotate it at https://dashboard.tenderly.co/account/authorization. Tenderly tokens are bearer tokens — anyone with the string has full project access.

Delete a vnet when done:

```bash
curl -s -X DELETE \
  -H "X-Access-Key: $TENDERLY_ACCESS_KEY" \
  "https://api.tenderly.co/api/v1/account/$TENDERLY_ACCOUNT/project/$TENDERLY_PROJECT/vnets/$TENDERLY_VNET_ID"
```

## Rules

### Security Rules (non-negotiable)

- **NEVER** target mainnet network IDs. Refuse chainId 1, 10, 137, 8453, 42161, 43114, 130.
- **NEVER** echo the Tenderly access token back to the user, write it to git-tracked files, or log it.
- **NEVER** commit `.env.local` — verify `git check-ignore .env.local` succeeds before any commit.
- **ALWAYS** warn at session end that the token is in the transcript and must be rotated.
- **NEVER** use real-user private keys as `DEPLOYER_PRIVATE_KEY` in a Tenderly vnet — use Anvil's well-known test key or a throwaway.

### Best Practices

- **ALWAYS** use `network_id` and `chain_id` as JSON numbers, not strings (Tenderly rejects strings).
- **ALWAYS** keep source chainId === vnet chainId (cross-chain primitives like CCTP domain mappings depend on it).
- **ALWAYS** pass `--skip-simulation --slow` to `forge script` against a Tenderly vnet — admin-mutated state doesn't replay cleanly otherwise, and `--slow` spreads txs to dodge the TUs/s rate limit.
- **ALWAYS** persist deployments under `deployments/tenderly-*.json` (NOT gitignored) — the canonical address manifest.
- **ALWAYS** run `forge verify-contract` against the Tenderly verifier URL after every deploy. Without it, the Contracts tab stays empty and traces are unreadable. Use **explicit** `--constructor-args` (`cast abi-encode`); Tenderly's verifier rejects `--guess-constructor-args`.
- **NEVER** use `POST /wallet` to register a contract — it lands in the Wallets tab with `account_type=wallet`. Use the verify path.
- **PREFER** deploying to real public testnets when available. Tenderly indexes both, and free-plan vnets hit max-block-height quickly. Vnets are best for state-manipulation tests (forced balances, time travel), not long-lived deployment hosting.
- **PREFER** Public RPC for read-heavy frontend code, Admin RPC for deploys + admin manipulations.
- **SKIP** external dependencies (Morpho, Pyth, USDC, Permit2, etc.) when labeling — they burn the 20-address project cap.
- When using helper scripts that `cd` internally: resolve manifest paths to absolute before any `cd`, or the script's later reads break silently.

## Reference

- Tenderly Virtual TestNets REST API: https://docs.tenderly.co/virtual-testnets/develop/rest-api
- Admin RPC method reference: https://docs.tenderly.co/virtual-testnets/admin-rpc
- Contract verification via Foundry: https://docs.tenderly.co/contract-verification/foundry
- Dashboard: https://dashboard.tenderly.co

## Undocumented endpoints (validated by trial)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/v1/account/{a}/project/{p}/wallet` | POST `{address, network_ids:[...], display_name}` | Add an EOA. **Don't use for contracts.** |
| `/api/v1/account/{a}/project/{p}/contract/{chainId}/{addr}/rename` | POST `{display_name}` | Override Solidity contract name with custom display name. |
| `/api/v1/account/{a}/project/{p}/tag` | POST `{contract_ids:["eth:CHAIN:0x..."], tag}` | Attach a free-form tag (orthogonal to display name). |
| `/api/v1/account/{a}/project/{p}/contracts` | DELETE `{account_ids:["eth:CHAIN:0x..."]}` | Bulk remove entries (frees slots toward the 20-cap). |
| `/api/v1/account/{a}/project/{p}/contracts?accountType=contract` | GET | Filtered list (just Contracts, not Wallets). |
| `{TENDERLY_PUBLIC_RPC}/verify/etherscan` | etherscan-compat | Vnet contract verification target. |
| `/api/v1/account/{a}/project/{p}/etherscan/verify/network/{chainId}` | etherscan-compat | Public-network contract verification target. |
