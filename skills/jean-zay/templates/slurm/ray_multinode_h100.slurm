#!/usr/bin/env bash
#
# Multi-node Ray Tune launcher for Jean-Zay (H100)
#
# This job starts a Ray cluster inside a single SLURM allocation:
#   - 1 Ray head on the first node
#   - Ray workers on the remaining nodes
#
# Usage
# -----
# Submit:
#   sbatch jobs/dl/ray_multinode_h100.slurm
#
# Override parameters:
#   sbatch --export=ALL,DATA_DIR=...,NUM_SAMPLES=300 jobs/dl/ray_multinode_h100.slurm

#SBATCH --job-name={{JOB_NAME}}
#SBATCH --output=logs/%x-%j.out
#SBATCH --error=logs/%x-%j.err

# =========================
# H100 Multi-Node
# =========================
#SBATCH --partition=gpu_p6
#SBATCH --constraint=h100
#SBATCH --qos=qos_gpu_h100-t4
#SBATCH --account={{ACCOUNT}}@h100

#SBATCH --nodes={{NUM_NODES}}
#SBATCH --ntasks={{NUM_NODES}}
#SBATCH --ntasks-per-node=1
#SBATCH --gres=gpu:4
#SBATCH --cpus-per-task=16
#SBATCH --time={{TIME}}
#SBATCH --hint=nomultithread

set -euo pipefail

echo "=== Job started on $(date) ==="
echo "SLURM_JOB_ID   = ${SLURM_JOB_ID:-}"
echo "SLURM_NODELIST = ${SLURM_NODELIST:-}"

# =========================
# Parameters (override via --export)
# =========================
PROJECT_DIR=${PROJECT_DIR:-{{PROJECT_DIR}}}
DATA_DIR=${DATA_DIR:-{{DATA_DIR}}}
LOCAL_DIR=${LOCAL_DIR:-{{LOCAL_DIR}}}

NUM_SAMPLES=${NUM_SAMPLES:-{{NUM_SAMPLES}}}
MAX_EPOCHS=${MAX_EPOCHS:-{{MAX_EPOCHS}}}
FINAL_TRAIN_EPOCHS=${FINAL_TRAIN_EPOCHS:-{{FINAL_TRAIN_EPOCHS}}}

RAY_PORT=${RAY_PORT:-6379}

# =========================
# Environment
# =========================
module purge
module load arch/h100
module load pytorch-gpu/py3/2.4.0

cd "${PROJECT_DIR}"
mkdir -p logs

echo "Working directory: $(pwd)"
echo "Python executable: $(which python)"
python --version
python -c "import ray; print('Ray version:', ray.__version__)"

# =========================
# Ray Configuration (Jean Zay safe)
# =========================
export RAY_TMPDIR="${WORK}/tmp/ray/${SLURM_JOB_ID}"
export TMPDIR="${RAY_TMPDIR}"
mkdir -p "${RAY_TMPDIR}"

# Short UNIX socket paths (avoid AF_UNIX path limit)
export RAY_PLASMA_STORE_SOCKET_NAME="${RAY_TMPDIR}/plasma"
export RAY_RAYLET_SOCKET_NAME="${RAY_TMPDIR}/raylet"

export RAY_DASHBOARD_DISABLE=1
export RAY_USAGE_STATS_ENABLED=0
export RAY_MINIMAL=1
export RAY_EXPERIMENTAL_NOSETUID=1
export RAY_DISABLE_DOCKER_CPU_WARNING=1

# =========================
# Ray Cluster Setup
# =========================
ray_cli() {
  if command -v ray >/dev/null 2>&1; then
    ray "$@"
  else
    python -m ray "$@"
  fi
}

get_head_node() {
  scontrol show hostnames "${SLURM_NODELIST}" | head -n 1
}

get_worker_nodes() {
  scontrol show hostnames "${SLURM_NODELIST}" | tail -n +2
}

HEAD_NODE="$(get_head_node)"
HEAD_IP="$(getent hosts "${HEAD_NODE}" | awk '{print $1}' | head -n 1)"
if [[ -z "${HEAD_IP}" ]]; then
  echo "Failed to resolve head node IP for ${HEAD_NODE}" >&2
  exit 1
fi

echo "Ray head node: ${HEAD_NODE} (${HEAD_IP}:${RAY_PORT})"

# Start Ray head
echo "=== Starting Ray head ==="
ray_cli stop --force || true
ray_cli start --head --node-ip-address="${HEAD_IP}" --port="${RAY_PORT}" --temp-dir="${RAY_TMPDIR}"

# Start Ray workers on other nodes
echo "=== Starting Ray workers ==="
for node in $(get_worker_nodes); do
  echo "Starting worker on ${node}..."
  srun --nodes=1 --ntasks=1 -w "${node}" --export=ALL bash -lc \
    "set -euo pipefail; ray stop --force || true; ray start --address='${HEAD_IP}:${RAY_PORT}' --temp-dir='${RAY_TMPDIR}' --block" &
done

sleep 10
export RAY_ADDRESS="${HEAD_IP}:${RAY_PORT}"
echo "Ray address: ${RAY_ADDRESS}"

# =========================
# Run Training
# =========================
echo "=== Launching Ray Tune ==="
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
