#!/bin/bash
set -e

# Run performance profiling on CUDA extension vs baselines
# Usage: bash /mnt/skills/user/cuda-agent/scripts/profile.sh [workspace_dir] [--iters N]

trap 'echo "Profiling interrupted." >&2' EXIT

# First arg is workspace if it doesn't start with --
if [[ "${1:-}" != --* ]] && [[ -n "${1:-}" ]]; then
    WORKSPACE="$1"
    shift
else
    WORKSPACE="."
fi

cd "${WORKSPACE}"

echo "Running performance profiling in: $(pwd)" >&2

if [ ! -f "cuda_extension.so" ]; then
    echo "ERROR: cuda_extension.so not found. Run compile.sh first." >&2
    exit 1
fi

trap - EXIT
python3 -m utils.profiling "$@" 2>&1
