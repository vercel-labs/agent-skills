#!/bin/bash
#
# Verify many contracts from one deployment manifest at once.
#
# Usage:
#   tenderly-verify-many.sh <deployments-json>
#
# Manifest format (extended):
#   {
#     "chainId": 84532,
#     "contracts": {
#       "MyToken":   "0x...",
#       "MyVault":   "0x..."
#     },
#     "verify": {
#       "MyToken": {
#         "src":     "src/MyToken.sol:MyToken",
#         "ctor":    "constructor(string,string,uint8)",
#         "args":    ["My Token", "MTK", 18],
#         "display": "MyToken (USDC)"
#       },
#       "MyVault": {
#         "src":     "src/MyVault.sol:MyVault",
#         "ctor":    "constructor(address)",
#         "args":    ["0xaaa..."],
#         "display": "MyVault"
#       }
#     }
#   }
#
# If "verify" is missing, the script falls back to no-arg constructors and
# uses the contract name as the display name.
#
set -eo pipefail

usage() {
  echo "usage: $0 <deployments-json>" >&2
  exit 1
}

[ "$#" -lt 1 ] && usage
MANIFEST_ARG="$1"

case "$MANIFEST_ARG" in
  /*) MANIFEST="$MANIFEST_ARG" ;;
  *)  MANIFEST="$(pwd)/$MANIFEST_ARG" ;;
esac
[ ! -f "$MANIFEST" ] && { echo "manifest not found: $MANIFEST" >&2; exit 1; }

REPO_ROOT="$(pwd)"
while [ "$REPO_ROOT" != "/" ] && [ ! -f "$REPO_ROOT/.env.local" ]; do
  REPO_ROOT="$(dirname "$REPO_ROOT")"
done
[ ! -f "$REPO_ROOT/.env.local" ] && { echo "no .env.local found going up from $(pwd)" >&2; exit 1; }

set -a
# shellcheck disable=SC1091
. "$REPO_ROOT/.env.local"
set +a

CHAIN_ID=$(python3 -c "import json; print(json.load(open('$MANIFEST'))['chainId'])")
VURL="https://api.tenderly.co/api/v1/account/$TENDERLY_ACCOUNT/project/$TENDERLY_PROJECT/etherscan/verify/network/$CHAIN_ID"

# Each line: name<TAB>addr<TAB>src<TAB>ctor<TAB>args(json array)<TAB>display
ENTRIES=$(python3 - <<PY
import json
m = json.load(open("$MANIFEST"))
contracts = m.get("contracts", {})
verify = m.get("verify", {})
for name, addr in contracts.items():
  spec = verify.get(name, {})
  src = spec.get("src", "")
  ctor = spec.get("ctor", "")
  args = json.dumps(spec.get("args", []))
  display = spec.get("display", name)
  print(f"{name}\t{addr}\t{src}\t{ctor}\t{args}\t{display}")
PY
)

ok=0; skip=0; fail=0
echo "$ENTRIES" | while IFS=$'\t' read -r NAME ADDR SRC CTOR ARGS_JSON DISPLAY; do
  [ -z "$NAME" ] && continue
  if [ -z "$SRC" ] || [ -z "$CTOR" ]; then
    echo "SKIP  $NAME — no verify spec in manifest" >&2
    skip=$((skip+1))
    continue
  fi

  # Encode args via cast (handles tuples/arrays from JSON via positional values).
  ARGS_ENC=$(python3 -c "
import json, subprocess, sys
args = json.loads('$ARGS_JSON')
cmd = ['cast', 'abi-encode', '$CTOR'] + [str(a) for a in args]
print(subprocess.check_output(cmd).decode().strip())
")

  echo "--- verifying $NAME @ $ADDR ---" >&2
  (cd "$REPO_ROOT" && forge verify-contract "$ADDR" "$SRC" \
     --constructor-args "$ARGS_ENC" \
     --verifier custom \
     --verifier-url "$VURL" \
     --etherscan-api-key "$TENDERLY_ACCESS_KEY" \
     --watch) 2>&1 | tail -4 >&2

  ADDR_LC=$(echo "$ADDR" | tr 'A-Z' 'a-z')
  curl -s -X POST \
    -H "X-Access-Key: $TENDERLY_ACCESS_KEY" \
    -H "Content-Type: application/json" \
    "https://api.tenderly.co/api/v1/account/$TENDERLY_ACCOUNT/project/$TENDERLY_PROJECT/contract/$CHAIN_ID/$ADDR_LC/rename" \
    -d "{\"display_name\":\"$DISPLAY\"}" > /dev/null
  echo "  labeled: $DISPLAY" >&2
  ok=$((ok+1))
done

echo >&2
echo "done. dashboard: https://dashboard.tenderly.co/$TENDERLY_ACCOUNT/$TENDERLY_PROJECT/contracts" >&2
