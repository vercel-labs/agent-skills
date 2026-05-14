# tenderly-testnet skill

Set up a Tenderly Virtual TestNet, deploy + verify Solidity contracts on it
(or on any public testnet Tenderly indexes), and get them properly named in
the Tenderly dashboard's **Contracts** tab (not Wallets).

The skill captures lessons not in Tenderly's official docs:

- The `/wallet` REST endpoint mis-classifies contract addresses as wallets.
- The Foundry verifier path is the only one that lands a contract in the
  Contracts tab with verified source.
- Tenderly's verifier rejects `forge --guess-constructor-args` — encode args
  manually with `cast abi-encode`.
- Free-plan caps to watch for: 20 monitored addresses, 2 vnets, max block
  height per vnet, TUs/s rate limit (use `forge --slow`).
- The exact `rename` / `tag` / `delete` REST endpoints for managing the
  project (none of which appear in the published API reference).

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
