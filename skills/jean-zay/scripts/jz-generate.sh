#!/usr/bin/env bash
# =============================================================================
# Jean Zay Slurm Script Generator
# Generate Slurm scripts from templates
#
# Usage:
#   jz-generate.sh --template ray_tune_h100 --job-name my_job --module src.dl.ray.tune_nn
#
# Templates available:
#   ray_tune_h100     - H100 single-node Ray Tune
#   ray_tune_a100     - A100 single-node Ray Tune
#   ray_tune_v100     - V100 single-node Ray Tune
#   ray_multinode_h100 - H100 multi-node Ray cluster
#   generic_train     - Generic training script
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_DIR="${SCRIPT_DIR}/../templates/slurm"

# Defaults
TEMPLATE=""
JOB_NAME="training_job"
ACCOUNT="tuz"
PROJECT_DIR="/lustre/fswork/projects/rech/tuz/umd76av/Projects/quant-ml"
DATA_DIR="data/raw"
LOCAL_DIR="src/dl/results"
NUM_GPUS=4
CPUS_PER_TASK=16
TIME="20:00:00"
NUM_SAMPLES=100
MAX_EPOCHS=500
FINAL_TRAIN_EPOCHS=1000
PYTHON_MODULE=""
EXTRA_ARGS=""
NUM_NODES=2
OUTPUT_FILE=""

usage() {
  cat <<EOF
Jean Zay Slurm Script Generator

Usage:
  jz-generate.sh --template <template> --job-name <name> [options]

Required:
  --template <name>     Template to use (ray_tune_h100, ray_tune_a100, etc.)
  --job-name <name>     Job name

Options:
  --module <path>       Python module to run (e.g., src.dl.ray.tune_nn)
  --account <code>      IDRIS account code (default: tuz)
  --project-dir <path>  Project directory on Jean Zay
  --data-dir <path>     Data directory (relative to project)
  --local-dir <path>    Results directory (relative to project)
  --gpus <n>            Number of GPUs (default: 4)
  --cpus <n>            CPUs per task (default: 16)
  --time <HH:MM:SS>     Wall time (default: 20:00:00)
  --samples <n>         Ray Tune num_samples (default: 100)
  --epochs <n>          Max training epochs (default: 500)
  --final-epochs <n>    Final training epochs (default: 1000)
  --nodes <n>           Number of nodes for multinode (default: 2)
  --extra-args <args>   Extra arguments to pass to Python
  --output <file>       Output file (default: stdout)

Templates:
  ray_tune_h100         H100 single-node Ray Tune (100h max)
  ray_tune_a100         A100 single-node Ray Tune (20h max)
  ray_tune_v100         V100 single-node Ray Tune (20h max)
  ray_multinode_h100    H100 multi-node Ray cluster
  generic_train         Generic training script

Examples:
  jz-generate.sh --template ray_tune_h100 --job-name tune_nn --module src.dl.ray.tune_nn
  jz-generate.sh --template ray_tune_a100 --job-name tune_moe --module src.dl.ray.tune_moe --samples 200
  jz-generate.sh --template ray_multinode_h100 --job-name big_job --nodes 4 --output my_job.slurm
EOF
}

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --template)     TEMPLATE="$2"; shift 2 ;;
    --job-name)     JOB_NAME="$2"; shift 2 ;;
    --module)       PYTHON_MODULE="$2"; shift 2 ;;
    --account)      ACCOUNT="$2"; shift 2 ;;
    --project-dir)  PROJECT_DIR="$2"; shift 2 ;;
    --data-dir)     DATA_DIR="$2"; shift 2 ;;
    --local-dir)    LOCAL_DIR="$2"; shift 2 ;;
    --gpus)         NUM_GPUS="$2"; shift 2 ;;
    --cpus)         CPUS_PER_TASK="$2"; shift 2 ;;
    --time)         TIME="$2"; shift 2 ;;
    --samples)      NUM_SAMPLES="$2"; shift 2 ;;
    --epochs)       MAX_EPOCHS="$2"; shift 2 ;;
    --final-epochs) FINAL_TRAIN_EPOCHS="$2"; shift 2 ;;
    --nodes)        NUM_NODES="$2"; shift 2 ;;
    --extra-args)   EXTRA_ARGS="$2"; shift 2 ;;
    --output)       OUTPUT_FILE="$2"; shift 2 ;;
    -h|--help|help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 1 ;;
  esac
done

# Validate
if [[ -z "$TEMPLATE" ]]; then
  echo "Error: --template is required" >&2
  usage
  exit 1
fi

TEMPLATE_FILE="${TEMPLATE_DIR}/${TEMPLATE}.slurm"
if [[ ! -f "$TEMPLATE_FILE" ]]; then
  echo "Error: Template not found: ${TEMPLATE_FILE}" >&2
  echo "Available templates:"
  ls -1 "${TEMPLATE_DIR}"/*.slurm 2>/dev/null | xargs -I{} basename {} .slurm
  exit 1
fi

# Generate script by replacing placeholders
generate() {
  sed \
    -e "s|{{JOB_NAME}}|${JOB_NAME}|g" \
    -e "s|{{ACCOUNT}}|${ACCOUNT}|g" \
    -e "s|{{PROJECT_DIR}}|${PROJECT_DIR}|g" \
    -e "s|{{DATA_DIR}}|${DATA_DIR}|g" \
    -e "s|{{LOCAL_DIR}}|${LOCAL_DIR}|g" \
    -e "s|{{NUM_GPUS}}|${NUM_GPUS}|g" \
    -e "s|{{CPUS_PER_TASK}}|${CPUS_PER_TASK}|g" \
    -e "s|{{TIME}}|${TIME}|g" \
    -e "s|{{NUM_SAMPLES}}|${NUM_SAMPLES}|g" \
    -e "s|{{MAX_EPOCHS}}|${MAX_EPOCHS}|g" \
    -e "s|{{FINAL_TRAIN_EPOCHS}}|${FINAL_TRAIN_EPOCHS}|g" \
    -e "s|{{PYTHON_MODULE}}|${PYTHON_MODULE}|g" \
    -e "s|{{EXTRA_ARGS}}|${EXTRA_ARGS}|g" \
    -e "s|{{NUM_NODES}}|${NUM_NODES}|g" \
    "${TEMPLATE_FILE}"
}

if [[ -n "$OUTPUT_FILE" ]]; then
  generate > "$OUTPUT_FILE"
  chmod +x "$OUTPUT_FILE"
  echo "Generated: ${OUTPUT_FILE}"
else
  generate
fi
