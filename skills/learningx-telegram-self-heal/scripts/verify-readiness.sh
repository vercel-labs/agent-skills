#!/bin/bash
set -euo pipefail

API_CHECK="false"
for arg in "$@"; do
  case "$arg" in
    --api-check) API_CHECK="true" ;;
    *)
      echo "Unknown arg: $arg" >&2
      printf '{"ok":false,"error":"unknown-arg","arg":"%s"}\n' "$arg"
      exit 2
      ;;
  esac
done

run_step() {
  local name="$1"
  shift
  echo "[step] $name" >&2
  "$@" >/tmp/learningx-self-heal-${name}.log 2>&1 || {
    echo "[fail] $name" >&2
    printf '{"ok":false,"error":"step-failed","step":"%s"}\n' "$name"
    cat /tmp/learningx-self-heal-${name}.log >&2 || true
    exit 1
  }
}

run_step "go-test" go test ./...
run_step "admin-typecheck" bun run admin:typecheck
run_step "admin-build" bun run admin:build

if [[ "$API_CHECK" == "true" ]]; then
  if [[ -z "${ADMIN_URL:-}" || -z "${ADMIN_BACKEND_BOT_TOKEN:-}" ]]; then
    echo "ADMIN_URL and ADMIN_BACKEND_BOT_TOKEN are required with --api-check" >&2
    printf '{"ok":false,"error":"missing-env","required":["ADMIN_URL","ADMIN_BACKEND_BOT_TOKEN"]}\n'
    exit 1
  fi

  payload='{"chatId":"health-check","message":"ping","lang":"en"}'
  status_no_token="$(curl -sS -o /tmp/learningx-self-heal-no-token.json -w '%{http_code}' -X POST "$ADMIN_URL/api/codex/chat" -H 'Content-Type: application/json' --data "$payload")"
  status_with_token="$(curl -sS -o /tmp/learningx-self-heal-with-token.json -w '%{http_code}' -X POST "$ADMIN_URL/api/codex/chat" -H 'Content-Type: application/json' -H "X-Admin-Bot-Token: $ADMIN_BACKEND_BOT_TOKEN" --data "$payload")"

  if [[ "$status_no_token" != "401" || "$status_with_token" != "200" ]]; then
    echo "API check failed: without-token=$status_no_token with-token=$status_with_token" >&2
    printf '{"ok":false,"error":"api-check-failed","statusNoToken":%s,"statusWithToken":%s}\n' "$status_no_token" "$status_with_token"
    exit 1
  fi

  if ! rg -q '"ok"\s*:\s*true' /tmp/learningx-self-heal-with-token.json; then
    echo "API check failed: response missing ok:true" >&2
    printf '{"ok":false,"error":"api-response-invalid"}\n'
    exit 1
  fi
fi

printf '{"ok":true,"steps":["go-test","admin-typecheck","admin-build"],"apiCheck":%s}\n' "$API_CHECK"
