# tenderly-testnet skill

Set up a Tenderly Virtual TestNet, deploy + verify Solidity contracts on it
(or on any public testnet Tenderly indexes), and get them properly named in
the Tenderly dashboard's **Contracts** tab (not Wallets). Then use the
Simulate API to drive a full integration-test matrix against the live chain
without ever burning real-state gas.

The skill captures lessons not in Tenderly's official docs:

- The `/wallet` REST endpoint mis-classifies contract addresses as wallets.
- The Foundry verifier path is the only one that lands a contract in the
  Contracts tab with verified source.
- Tenderly's verifier rejects `forge --guess-constructor-args` — encode args
  manually with `cast abi-encode`.
- Free-plan caps to plan around: monitored addresses, vnet count, vnet max
  block height, TUs/s rate limit (use `forge --slow`).
- The exact `rename` / `tag` / `delete` / `simulate` / `simulate-bundle`
  REST endpoints for managing the project + driving live-state sims (none
  of which appear in the published API reference).
- The legacy Fork API was deprecated mid-2025 (`410 Gone`); the migration
  path is a primed vnet + admin RPC.
- Storage-slot derivation patterns for `ERC-20._balances`, `ERC-20._allowed`,
  and `Permit2.allowance` (triple-nested mapping at slot 1, packed allowance
  in one 32-byte slot).
- `setCode` override pattern for mocking `IMessageTransmitterV2`,
  Chainlink callbacks, or any external dependency.
- `forge inspect <Contract> storage-layout` is the only authoritative
  source for mapping slots — OZ v5's transient-storage `ReentrancyGuard`
  changes layout in non-obvious ways.

## Example use case

**Hub & Spoke Cross-Chain Confidential on Morpho [h&sCCCm]** — a forex
engine that bridges USDC across 9 CCTP V2 chains into a Morpho-Blue hub.
The patterns in `SKILL.md` were extracted from running 117+ sim coverage
on that protocol live on Base Sepolia, including end-to-end CCTP V2
reverse-leg sims (setCode-mocked MessageTransmitter), full Universal
Router V4_SWAP path through a Uniswap v4 hook, and oracle-fresh borrow/
liquidate flows. Two adversarial findings caught + patched before mainnet.

The same patterns generalize to any cross-chain protocol using CCTP V2,
Uniswap v4 hooks, ERC-4626 vaults, or Pyth pull oracles.

## Installation

### Claude Code

```bash
cp -r tenderly-testnet ~/.claude/skills/
```

Then invoke with one of the trigger phrases listed in `SKILL.md` — "set up
tenderly", "deploy to tenderly", "name my contracts in tenderly", etc.

### claude.ai

Add `SKILL.md` to your project knowledge, or paste its contents into a
conversation.

If your skill needs network access, add the required domains at
[claude.ai/settings/capabilities](https://claude.ai/settings/capabilities):

- `api.tenderly.co`
- `dashboard.tenderly.co`
- `*.rpc.tenderly.co`
- `sepolia.base.org`, `sepolia.unichain.org`, etc. (any testnets you target)

## Helper scripts

Two reference scripts under `scripts/`:

- `tenderly-verify-one.sh` — verify + name a single contract from a
  deployments-JSON entry.
- `tenderly-verify-many.sh` — verify + name every contract in a
  deployments-JSON file when the file has a `verify` block describing
  source + constructor signature per contract.

## Prerequisites

- [Foundry](https://book.getfoundry.sh/) (forge + cast on PATH)
- `python3` (used by helper scripts to parse JSON)
- `jq` (used in skill snippets to parse Tenderly API responses)
- A Tenderly account, project, and access token

## License

MIT
