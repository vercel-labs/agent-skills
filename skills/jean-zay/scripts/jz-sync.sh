#!/usr/bin/env bash
# =============================================================================
# Jean Zay Sync Script
# Bi-directional sync between local machine and Jean Zay supercomputer
#
# Usage:
#   jz-sync.sh push-code        # Sync source code to Jean Zay
#   jz-sync.sh push-data        # Sync data directory to Jean Zay
#   jz-sync.sh pull-results     # Pull results (light - no checkpoints)
#   jz-sync.sh pull-results-full # Pull results including checkpoints
#
# Environment variables:
#   JZ_USER     - Jean Zay username (default: umd76av)
#   JZ_HOST     - Jean Zay host (default: jean-zay.idris.fr)
#   JZ_PROJECT  - Remote project path
#   DRY_RUN=1   - Show what would be transferred without doing it
# =============================================================================

set -euo pipefail

# Configuration (override via environment)
JZ_USER=${JZ_USER:-umd76av}
JZ_HOST=${JZ_HOST:-jean-zay.idris.fr}
JZ_PROJECT=${JZ_PROJECT:-/lustre/fswork/projects/rech/tuz/umd76av/Projects/quant-ml}
SSH_TARGET="${JZ_USER}@${JZ_HOST}"

DRY=${DRY_RUN:-0}

# Rsync options
RSYNC_OPTS=(
  -avhP
  --info=progress2
)

if [[ "$DRY" == "1" ]]; then
  RSYNC_OPTS+=(--dry-run)
  echo "=== DRY RUN MODE ==="
fi

# Common excludes
COMMON_EXCLUDES=(
  --exclude ".git/"
  --exclude ".venv/"
  --exclude "__pycache__/"
  --exclude ".ipynb_checkpoints/"
  --exclude ".jax_cache/"
  --exclude "catboost_info/"
  --exclude "*.pyc"
  --exclude ".DS_Store"
  --exclude "*.swp"
  --exclude ".ruff_cache/"
  --exclude ".mypy_cache/"
  --exclude ".pytest_cache/"
)

# Results excludes (keep things light - skip large files)
RESULT_EXCLUDES=(
  --exclude "*.pth"
  --exclude "*.pt"
  --exclude "*.ckpt"
  --exclude "*.onnx"
  --exclude "*.tfevents*"
  --exclude "**/driver_artifacts/"
  --exclude "**/_train_single_trial_*/"
  --exclude "**/tuner.pkl"
  --exclude "**/artifacts/"
)

# Code excludes (skip data and results when syncing code)
CODE_EXCLUDES=(
  --exclude "data/"
  --exclude "**/results/"
  --exclude "logs/"
  --exclude "*.log"
)

usage() {
  cat <<EOF
Jean Zay Sync Script

Remote: ${SSH_TARGET}:${JZ_PROJECT}

Commands:
  push-code              Sync source code to Jean Zay (excludes data/results)
  push-data              Sync data/ directory to Jean Zay
  push-jobs              Sync jobs/ directory to Jean Zay
  push-package <dir>     Sync a packaged directory to Jean Zay
  pull-results           Pull results from Jean Zay (light - no checkpoints)
  pull-results-full      Pull results including checkpoint files
  pull-data              Pull data/ from Jean Zay
  pull-logs              Pull only log files

Environment:
  JZ_USER      Override username (default: umd76av)
  JZ_HOST      Override host (default: jean-zay.idris.fr)
  JZ_PROJECT   Override remote project path
  DRY_RUN=1    Show what would be transferred

Examples:
  ./jz-sync.sh push-code
  ./jz-sync.sh push-package ~/jz-packages/my_package
  DRY_RUN=1 ./jz-sync.sh push-data
  JZ_PROJECT=/path/to/project ./jz-sync.sh pull-results
EOF
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "Error: '$1' not found" >&2; exit 1; }
}

rsync_push() {
  local src_dir="$1" dst_rel="$2"
  shift 2
  echo ">>> Pushing ${src_dir} to ${SSH_TARGET}:${JZ_PROJECT}/${dst_rel}"
  rsync "${RSYNC_OPTS[@]}" "$@" "${src_dir%/}/" "${SSH_TARGET}:${JZ_PROJECT}/${dst_rel%/}/"
}

rsync_pull() {
  local src_rel="$1" dst_dir="$2"
  shift 2
  echo "<<< Pulling ${SSH_TARGET}:${JZ_PROJECT}/${src_rel} to ${dst_dir}"
  rsync "${RSYNC_OPTS[@]}" "$@" "${SSH_TARGET}:${JZ_PROJECT}/${src_rel%/}/" "${dst_dir%/}/"
}

cmd_push_code() {
  require_cmd rsync
  echo "=== Syncing source code to Jean Zay ==="
  rsync "${RSYNC_OPTS[@]}" \
    "${COMMON_EXCLUDES[@]}" \
    "${CODE_EXCLUDES[@]}" \
    ./ "${SSH_TARGET}:${JZ_PROJECT}/"
}

cmd_push_data() {
  require_cmd rsync
  echo "=== Syncing data/ to Jean Zay ==="
  rsync_push "data" "data" "${COMMON_EXCLUDES[@]}"
}

cmd_push_jobs() {
  require_cmd rsync
  echo "=== Syncing jobs/ to Jean Zay ==="
  rsync_push "jobs" "jobs" "${COMMON_EXCLUDES[@]}"
}

cmd_push_package() {
  local package_dir="$1"
  require_cmd rsync

  if [[ -z "$package_dir" ]]; then
    echo "Error: Package directory required" >&2
    echo "Usage: jz-sync.sh push-package <package-dir>" >&2
    exit 1
  fi

  if [[ ! -d "$package_dir" ]]; then
    echo "Error: Package directory does not exist: $package_dir" >&2
    exit 1
  fi

  # Resolve to absolute path
  package_dir="$(cd "$package_dir" && pwd)"

  echo "=== Syncing package to Jean Zay ==="
  echo "Package: ${package_dir}"
  echo "Remote:  ${SSH_TARGET}:${JZ_PROJECT}/"

  rsync "${RSYNC_OPTS[@]}" \
    "${COMMON_EXCLUDES[@]}" \
    --exclude "JZ_PACKAGE_MANIFEST.txt" \
    --exclude "jz-quickstart.sh" \
    "${package_dir}/" "${SSH_TARGET}:${JZ_PROJECT}/"

  echo ""
  echo "Package synced successfully!"
  echo ""
  echo "To submit the job, run:"
  if [[ -f "${package_dir}/JZ_PACKAGE_MANIFEST.txt" ]]; then
    # Extract job name from manifest
    local job_script=$(grep "Slurm Script:" "${package_dir}/JZ_PACKAGE_MANIFEST.txt" | awk '{print $3}')
    echo "  ~/.claude/skills/jean-zay/scripts/jz-submit.sh ${job_script}"
  fi
}

cmd_pull_results() {
  require_cmd rsync
  echo "=== Pulling results from Jean Zay (light) ==="

  # DL results
  if ssh "${SSH_TARGET}" "test -d ${JZ_PROJECT}/src/dl/results"; then
    mkdir -p src/dl/results
    rsync_pull "src/dl/results" "src/dl/results" "${COMMON_EXCLUDES[@]}" "${RESULT_EXCLUDES[@]}"
  fi

  # ML results
  if ssh "${SSH_TARGET}" "test -d ${JZ_PROJECT}/src/ml/results"; then
    mkdir -p src/ml/results
    rsync_pull "src/ml/results" "src/ml/results" "${COMMON_EXCLUDES[@]}" "${RESULT_EXCLUDES[@]}"
  fi
}

cmd_pull_results_full() {
  require_cmd rsync
  echo "=== Pulling results from Jean Zay (full with checkpoints) ==="

  if ssh "${SSH_TARGET}" "test -d ${JZ_PROJECT}/src/dl/results"; then
    mkdir -p src/dl/results
    rsync_pull "src/dl/results" "src/dl/results" "${COMMON_EXCLUDES[@]}"
  fi

  if ssh "${SSH_TARGET}" "test -d ${JZ_PROJECT}/src/ml/results"; then
    mkdir -p src/ml/results
    rsync_pull "src/ml/results" "src/ml/results" "${COMMON_EXCLUDES[@]}"
  fi
}

cmd_pull_data() {
  require_cmd rsync
  echo "=== Pulling data/ from Jean Zay ==="
  mkdir -p data
  rsync_pull "data" "data" "${COMMON_EXCLUDES[@]}"
}

cmd_pull_logs() {
  require_cmd rsync
  echo "=== Pulling logs from Jean Zay ==="
  mkdir -p logs jobs/dl/logs
  rsync_pull "logs" "logs" "${COMMON_EXCLUDES[@]}" || true
  rsync_pull "jobs/dl/logs" "jobs/dl/logs" "${COMMON_EXCLUDES[@]}" || true
}

main() {
  local cmd=${1:-}
  case "$cmd" in
    push-code)         cmd_push_code ;;
    push-data)         cmd_push_data ;;
    push-jobs)         cmd_push_jobs ;;
    push-package)      cmd_push_package "${2:-}" ;;
    pull-results)      cmd_pull_results ;;
    pull-results-full) cmd_pull_results_full ;;
    pull-data)         cmd_pull_data ;;
    pull-logs)         cmd_pull_logs ;;
    ""|help|-h|--help) usage ;;
    *) echo "Unknown command: $cmd" >&2; usage; exit 1 ;;
  esac
}

main "$@"
