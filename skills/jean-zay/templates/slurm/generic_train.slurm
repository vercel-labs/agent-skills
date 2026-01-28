#!/usr/bin/env bash
#SBATCH --job-name={{JOB_NAME}}
#SBATCH --output=logs/%x-%j.out
#SBATCH --error=logs/%x-%j.err

# =========================
# Partition Configuration
# Choose ONE of the following blocks:
# =========================

# --- H100 (gpu_p6) - Recommended for large models ---
#SBATCH --partition=gpu_p6
#SBATCH --constraint=h100
#SBATCH --qos=qos_gpu_h100-t4
#SBATCH --account={{ACCOUNT}}@h100

# --- A100 (gpu_p5) - Good balance of speed and availability ---
# #SBATCH --partition=gpu_p5
# #SBATCH --constraint=a100
# #SBATCH --qos=qos_gpu-t4
# #SBATCH --account={{ACCOUNT}}@a100

# --- V100 (gpu_p1) - Most available, good for debugging ---
# #SBATCH --partition=gpu_p1
# #SBATCH --qos=qos_gpu-t4
# #SBATCH --account={{ACCOUNT}}@v100

# =========================
# Resource Allocation
# =========================
#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1
#SBATCH --gres=gpu:{{NUM_GPUS}}
#SBATCH --cpus-per-task={{CPUS_PER_TASK}}
#SBATCH --time={{TIME}}
#SBATCH --hint=nomultithread

set -euo pipefail

# =========================
# Parameters
# =========================
PROJECT_DIR=${PROJECT_DIR:-{{PROJECT_DIR}}}

# =========================
# Environment
# =========================
module purge

# Load appropriate architecture module (match partition choice above)
module load arch/h100  # or arch/a100 for A100
module load pytorch-gpu/py3/2.4.0

cd "${PROJECT_DIR}"
mkdir -p logs

echo "=== Job started on $(date) ==="
echo "SLURM_JOB_ID: ${SLURM_JOB_ID:-}"
echo "Working directory: $(pwd)"
echo "Python: $(which python)"
echo "GPUs available: $(nvidia-smi -L 2>/dev/null | wc -l)"

# =========================
# Run Training
# =========================
{{TRAINING_COMMAND}}

echo "=== Job finished on $(date) ==="
