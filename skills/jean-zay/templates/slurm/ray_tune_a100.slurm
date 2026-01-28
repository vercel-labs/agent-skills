#!/usr/bin/env bash
#SBATCH --job-name={{JOB_NAME}}
#SBATCH --output=logs/%x-%j.out
#SBATCH --error=logs/%x-%j.err

# =========================
# A100 Partition (gpu_p5)
# =========================
#SBATCH --partition=gpu_p5
#SBATCH --constraint=a100
#SBATCH --qos=qos_gpu-t4
#SBATCH --account={{ACCOUNT}}@a100

#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --gres=gpu:{{NUM_GPUS}}
#SBATCH --cpus-per-task={{CPUS_PER_TASK}}
#SBATCH --time={{TIME}}
#SBATCH --hint=nomultithread

set -euo pipefail

# =========================
# Parameters (override with --export)
# =========================
PROJECT_DIR=${PROJECT_DIR:-{{PROJECT_DIR}}}
DATA_DIR=${DATA_DIR:-{{DATA_DIR}}}
LOCAL_DIR=${LOCAL_DIR:-{{LOCAL_DIR}}}

NUM_SAMPLES=${NUM_SAMPLES:-{{NUM_SAMPLES}}}
MAX_EPOCHS=${MAX_EPOCHS:-{{MAX_EPOCHS}}}
FINAL_TRAIN_EPOCHS=${FINAL_TRAIN_EPOCHS:-{{FINAL_TRAIN_EPOCHS}}}

# =========================
# Environment
# =========================
module purge
module load arch/a100
module load pytorch-gpu/py3/2.4.0

cd "${PROJECT_DIR}"
mkdir -p logs

echo "=== Job started on $(date) ==="
echo "SLURM_JOB_ID   = ${SLURM_JOB_ID:-}"
echo "Working directory: $(pwd)"
echo "Python: $(which python)"

# =========================
# Ray Configuration (Jean Zay safe)
# =========================
export RAY_TMPDIR="${WORK}/tmp/ray/${SLURM_JOB_ID}"
export TMPDIR="$RAY_TMPDIR"
mkdir -p "$RAY_TMPDIR"

# Short socket paths to avoid AF_UNIX 108-char limit
export RAY_PLASMA_STORE_SOCKET_NAME="$RAY_TMPDIR/p"
export RAY_RAYLET_SOCKET_NAME="$RAY_TMPDIR/r"

export RAY_DASHBOARD_DISABLE=1
export RAY_USAGE_STATS_ENABLED=0

# =========================
# Run Training
# =========================
python -m {{PYTHON_MODULE}} \
  --data-dir "${DATA_DIR}" \
  --num-samples "${NUM_SAMPLES}" \
  --max-epochs "${MAX_EPOCHS}" \
  --gpus-per-trial 1 \
  --cpus-per-trial 4 \
  --local-dir "${LOCAL_DIR}" \
  --final-train-epochs "${FINAL_TRAIN_EPOCHS}" \
  {{EXTRA_ARGS}}

echo "=== Job finished on $(date) ==="
