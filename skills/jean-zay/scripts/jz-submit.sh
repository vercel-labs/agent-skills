#!/usr/bin/env bash
# =============================================================================
# Jean Zay Job Submission Script
# Submit Slurm jobs to Jean Zay remotely
#
# Usage:
#   jz-submit.sh <slurm_script>                    # Submit a job
#   jz-submit.sh <slurm_script> --export VAR=val   # Submit with env vars
#
# Environment variables:
#   JZ_USER     - Jean Zay username (default: umd76av)
#   JZ_HOST     - Jean Zay host (default: jean-zay.idris.fr)
#   JZ_PROJECT  - Remote project path
# =============================================================================

set -euo pipefail

# Configuration
JZ_USER=${JZ_USER:-umd76av}
JZ_HOST=${JZ_HOST:-jean-zay.idris.fr}
JZ_PROJECT=${JZ_PROJECT:-/lustre/fswork/projects/rech/tuz/umd76av/Projects/quant-ml}
SSH_TARGET="${JZ_USER}@${JZ_HOST}"

usage() {
  cat <<EOF
Jean Zay Job Submission Script

Usage:
  jz-submit.sh <slurm_script>                    Submit a job
  jz-submit.sh <slurm_script> --export VAR=val   Submit with environment variables
  jz-submit.sh --sync <slurm_script>             Sync code first, then submit

Options:
  --sync       Sync source code before submitting
  --export     Pass environment variables to sbatch (can be repeated)
  --dry-run    Show the command that would be run without executing

Examples:
  jz-submit.sh jobs/dl/tune_nn_h100.slurm
  jz-submit.sh jobs/dl/tune_moe_h100.slurm --export NUM_SAMPLES=500
  jz-submit.sh --sync jobs/dl/tune_nn_h100.slurm
  jz-submit.sh jobs/dl/tune_nn_h100.slurm --export DATA_DIR=data/raw/my_data --export MAX_EPOCHS=2000

Remote: ${SSH_TARGET}:${JZ_PROJECT}
EOF
}

# Parse arguments
SLURM_SCRIPT=""
SBATCH_ARGS=()
DO_SYNC=0
DRY_RUN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --sync)
      DO_SYNC=1
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --export)
      SBATCH_ARGS+=(--export "ALL,$2")
      shift 2
      ;;
    --export=*)
      SBATCH_ARGS+=(--export "ALL,${1#--export=}")
      shift
      ;;
    -h|--help|help)
      usage
      exit 0
      ;;
    -*)
      SBATCH_ARGS+=("$1")
      shift
      ;;
    *)
      if [[ -z "$SLURM_SCRIPT" ]]; then
        SLURM_SCRIPT="$1"
      else
        SBATCH_ARGS+=("$1")
      fi
      shift
      ;;
  esac
done

if [[ -z "$SLURM_SCRIPT" ]]; then
  echo "Error: No Slurm script specified" >&2
  usage
  exit 1
fi

# Sync if requested
if [[ "$DO_SYNC" == "1" ]]; then
  echo "=== Syncing code to Jean Zay ==="
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  "${SCRIPT_DIR}/jz-sync.sh" push-code
  "${SCRIPT_DIR}/jz-sync.sh" push-jobs
  echo ""
fi

# Build sbatch command
SBATCH_CMD="cd ${JZ_PROJECT} && sbatch"
if [[ ${#SBATCH_ARGS[@]} -gt 0 ]]; then
  SBATCH_CMD+=" ${SBATCH_ARGS[*]}"
fi
SBATCH_CMD+=" ${SLURM_SCRIPT}"

echo "=== Submitting job to Jean Zay ==="
echo "Script: ${SLURM_SCRIPT}"
echo "Command: ${SBATCH_CMD}"
echo ""

if [[ "$DRY_RUN" == "1" ]]; then
  echo "[DRY RUN] Would execute:"
  echo "  ssh ${SSH_TARGET} \"${SBATCH_CMD}\""
  exit 0
fi

# Submit the job
OUTPUT=$(ssh "${SSH_TARGET}" "${SBATCH_CMD}" 2>&1)
echo "$OUTPUT"

# Extract job ID if successful
if [[ "$OUTPUT" =~ Submitted\ batch\ job\ ([0-9]+) ]]; then
  JOB_ID="${BASH_REMATCH[1]}"
  echo ""
  echo "=== Job submitted successfully ==="
  echo "Job ID: ${JOB_ID}"
  echo ""
  echo "Monitor with:"
  echo "  ~/.claude/skills/jean-zay/scripts/jz-status.sh"
  echo "  ~/.claude/skills/jean-zay/scripts/jz-status.sh watch ${JOB_ID}"
fi
