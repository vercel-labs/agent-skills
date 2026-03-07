#!/bin/bash
set -e

# Setup a CUDA kernel optimization workspace from the template
# Usage: bash /mnt/skills/user/cuda-agent/scripts/setup-workspace.sh [workspace_dir]

trap 'echo "Setup interrupted." >&2' EXIT

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE_DIR="${SKILL_DIR}/template"
WORKSPACE="${1:-.}"

echo "Setting up CUDA agent workspace at: ${WORKSPACE}" >&2

# Create workspace directory
mkdir -p "${WORKSPACE}"

# Copy template files (don't overwrite existing model.py)
cp -n "${TEMPLATE_DIR}/binding.cpp" "${WORKSPACE}/" 2>/dev/null || true
cp -n "${TEMPLATE_DIR}/binding_registry.h" "${WORKSPACE}/" 2>/dev/null || true

# Always refresh utils (infrastructure, not user code)
mkdir -p "${WORKSPACE}/utils"
cp "${TEMPLATE_DIR}/utils/"*.py "${WORKSPACE}/utils/"
cp "${TEMPLATE_DIR}/utils/"*.sh "${WORKSPACE}/utils/"
chmod +x "${WORKSPACE}/utils/compile.sh"

# Create kernels directory if it doesn't exist
mkdir -p "${WORKSPACE}/kernels"

# Copy example kernel only if kernels/ is empty
if [ -z "$(ls -A "${WORKSPACE}/kernels/" 2>/dev/null)" ]; then
    cp "${TEMPLATE_DIR}/kernels/"* "${WORKSPACE}/kernels/" 2>/dev/null || true
    echo "Copied example axpby kernel to kernels/" >&2
fi

# Copy example model files only if they don't exist
if [ ! -f "${WORKSPACE}/model.py" ]; then
    cp "${TEMPLATE_DIR}/model.py" "${WORKSPACE}/"
    cp "${TEMPLATE_DIR}/model_new.py" "${WORKSPACE}/"
    echo "Copied example model files" >&2
fi

# Detect GPU architecture
echo "Detecting GPU architecture..." >&2
if command -v nvidia-smi &>/dev/null; then
    GPU_NAME=$(nvidia-smi --query-gpu=name --format=csv,noheader 2>/dev/null | head -1)
    CUDA_VERSION=$(nvidia-smi --query-gpu=driver_version --format=csv,noheader 2>/dev/null | head -1)
    echo "GPU: ${GPU_NAME}" >&2
    echo "Driver: ${CUDA_VERSION}" >&2

    # Detect compute capability
    COMPUTE_CAP=$(python3 -c "import torch; print(f'{torch.cuda.get_device_capability()[0]}.{torch.cuda.get_device_capability()[1]}')" 2>/dev/null || echo "")
    if [ -n "${COMPUTE_CAP}" ]; then
        echo "Compute Capability: ${COMPUTE_CAP}" >&2
        echo "${COMPUTE_CAP}" > "${WORKSPACE}/.cuda_arch"
        echo "Saved arch to .cuda_arch" >&2
    else
        echo "Could not detect compute capability. Set TORCH_CUDA_ARCH_LIST manually." >&2
    fi
else
    echo "WARNING: nvidia-smi not found. GPU detection skipped." >&2
fi

echo "Workspace ready at: ${WORKSPACE}" >&2
trap - EXIT
echo '{"status": "success", "workspace": "'"${WORKSPACE}"'", "gpu": "'"${GPU_NAME:-unknown}"'", "compute_capability": "'"${COMPUTE_CAP:-unknown}"'"}'
