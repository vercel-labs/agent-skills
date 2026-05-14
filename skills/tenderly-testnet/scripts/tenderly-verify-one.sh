#!/bin/bash
#
# Verify a single contract against Tenderly's etherscan-compat verifier and
# rename it in the project dashboard.
#
# Usage:
#   tenderly-verify-one.sh <deployments-json> <name> <src-path:Contract> \
#     <constructor-sig> [arg ...]
#
# Example:
#   ./tenderly-verify-one.sh deployments/base-sepolia.json \
#     MyToken src/MyToken.sol:MyToken \
#     "constructor(string,string,uint8)" "My Token" MTK 18
#
# The deployments JSON must contain at minimum:
#   { "chainId": <int>, "contracts": { "<name>": "<address>" } }
#
# Environment (loaded from .env.local at repo root):
#   TENDERLY_ACCESS_KEY, TENDERLY_ACCOUNT, TENDERLY_PROJECT
#
set -eo pipefail

usage() {
  echo "usage: $0 <deployments-json> <name> <src-path:Contract> <constructor-sig> [arg ...]" >&2
  exit 1
}

[ "$#" -lt 4 ] && usage
MANIFEST_ARG="$1"; NAME="$2"; SRC="$3"; CTOR_SIG="$4"
shift 4
CTOR_ARGS_RAW=("$@")

# Resolve manifest to an absolute path before any cd.
case "$MANIFEST_ARG" in
  /*) MANIFEST="$MANIFEST_ARG" ;;
  *)  MANIFEST="$(pwd)/$MANIFEST_ARG" ;;
esac
[ ! -f "$MANIFEST" ] && { echo "manifest not found: $MANIFEST" >&2; exit 1; }

# Find repo root (the dir containing .env.local).
REPO_ROOT="$(pwd)"
while [ "$REPO_ROOT" != "/" ] && [ ! -f "$REPO_ROOT/.env.local" ]; do
  REPO_ROOT="$(dirname "$REPO_ROOT")"
done
[ ! -f "$REPO_ROOT/.env.local" ] && { echo "no .env.local found going up from $(pwd)" >&2; exit 1; }

set -a
# shellcheck disable=SC1091
. "$REPO_ROOT/.env.local"
set +a

for v in TENDERLY_ACCESS_KEY TENDERLY_ACCOUNT TENDERLY_PROJECT; do
  eval "val=\${$v:-}"
  [ -z "$val" ] && { echo "missing $v in .env.local" >&2; exit 1; }
done

CHAIN_ID=$(python3 -c "import json; print(json.load(open('$MANIFEST'))['chainId'])")
ADDR=$(python3 -c "import json; print(json.load(open('$MANIFEST'))['contracts']['$NAME'])")

# Encode constructor args.
if [ "${#CTOR_ARGS_RAW[@]}" -gt 0 ]; then
  ARGS=$(cast abi-encode "$CTOR_SIG" "${CTOR_ARGS_RAW[@]}")
else
  ARGS="0x"
fi

VURL="https://api.tenderly.co/api/v1/account/$TENDERLY_ACCOUNT/project/$TENDERLY_PROJECT/etherscan/verify/network/$CHAIN_ID"

echo "verifying $NAME @ $ADDR on chain $CHAIN_ID" >&2

(cd "$REPO_ROOT" && forge verify-contract "$ADDR" "$SRC" \
  --constructor-args "$ARGS" \
  --verifier custom \
  --verifier-url "$VURL" \
  --etherscan-api-key "$TENDERLY_ACCESS_KEY" \
  --watch) 2>&1 | tail -6 >&2

# Set display name. Use the manifest-provided display_name if present at
# contracts.<name>_display, else default to the contract NAME.
DISPLAY=$(python3 -c "
import json
m = json.load(open('$MANIFEST'))
print(m.get('display_names', {}).get('$NAME', '$NAME'))
")
ADDR_LC=$(echo "$ADDR" | tr 'A-Z' 'a-z')

curl -s -X POST \
  -H "X-Access-Key: $TENDERLY_ACCESS_KEY" \
  -H "Content-Type: application/json" \
  "https://api.tenderly.co/api/v1/account/$TENDERLY_ACCOUNT/project/$TENDERLY_PROJECT/contract/$CHAIN_ID/$ADDR_LC/rename" \
  -d "{\"display_name\":\"$DISPLAY\"}" > /dev/null

echo "labeled: $DISPLAY" >&2
echo "dashboard: https://dashboard.tenderly.co/$TENDERLY_ACCOUNT/$TENDERLY_PROJECT/contracts" >&2
