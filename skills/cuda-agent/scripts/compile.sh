#!/bin/bash
set -e

# Compile CUDA kernels in a workspace
# Usage: bash /mnt/skills/user/cuda-agent/scripts/compile.sh [workspace_dir]

trap 'echo "Compilation interrupted." >&2' EXIT

WORKSPACE="${1:-.}"
cd "${WORKSPACE}"

echo "Compiling CUDA kernels in: $(pwd)" >&2

# Auto-detect CUDA architecture from .cuda_arch if available
if [ -z "${TORCH_CUDA_ARCH_LIST}" ] && [ -f ".cuda_arch" ]; then
    export TORCH_CUDA_ARCH_LIST="$(cat .cuda_arch)"
    echo "Using CUDA arch from .cuda_arch: ${TORCH_CUDA_ARCH_LIST}" >&2
fi

# Run compilation
bash utils/compile.sh 2>&1

trap - EXIT
if [ -f "cuda_extension.so" ]; then
    echo '{"status": "success", "output": "cuda_extension.so"}'
else
    echo '{"status": "failure"}' >&2
    exit 1
fi
