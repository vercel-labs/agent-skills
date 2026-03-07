#!/bin/bash
set -e

# Run correctness verification on CUDA extension
# Usage: bash /mnt/skills/user/cuda-agent/scripts/verify.sh [workspace_dir]

trap 'echo "Verification interrupted." >&2' EXIT

WORKSPACE="${1:-.}"
cd "${WORKSPACE}"

echo "Running correctness verification in: $(pwd)" >&2

if [ ! -f "cuda_extension.so" ]; then
    echo "ERROR: cuda_extension.so not found. Run compile.sh first." >&2
    exit 1
fi

trap - EXIT
python3 -m utils.verification 2>&1
