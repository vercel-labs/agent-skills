#!/usr/bin/env bash
# =============================================================================
# Jean Zay Project Packager
# Package any local repo into a ready-to-sync directory for Jean Zay
#
# Usage:
#   jz-package.sh --source /path/to/repo --output /path/to/package --template ray_tune_h100 ...
#
# This script:
#   1. Creates a clean package directory
#   2. Copies essential files from the source repo
#   3. Generates the Slurm script
#   4. Creates a manifest of what was packaged
#   5. Ready to sync with: jz-sync.sh push-package <package-dir>
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Defaults
SOURCE_DIR=""
OUTPUT_DIR=""
PACKAGE_NAME="jz_package_$(date +%Y%m%d_%H%M%S)"
TEMPLATE=""
JOB_NAME=""
PYTHON_MODULE=""
INCLUDE_DATA=0
DATA_DIR=""
EXTRA_INCLUDES=()
EXTRA_EXCLUDES=()

# Pass-through args for jz-generate.sh
GENERATE_ARGS=()

usage() {
  cat <<EOF
Jean Zay Project Packager

Creates a self-contained directory ready to sync and run on Jean Zay.

Usage:
  jz-package.sh --source <repo> --output <dir> --template <template> [options]

Required:
  --source <path>       Path to source repository
  --output <path>       Output directory for the package
  --template <name>     Slurm template (ray_tune_h100, ray_tune_a100, etc.)
  --job-name <name>     Job name for Slurm script
  --module <path>       Python module to run (e.g., src.dl.ray.tune_nn)

Package Options:
  --name <name>         Package name (default: jz_package_<timestamp>)
  --include-data        Include data/ directory in package
  --data-dir <path>     Specific data subdirectory to include
  --include <pattern>   Additional files/dirs to include (can be repeated)
  --exclude <pattern>   Additional patterns to exclude (can be repeated)

Slurm Options (passed to jz-generate.sh):
  --account <code>      IDRIS account code
  --gpus <n>            Number of GPUs
  --time <HH:MM:SS>     Wall time
  --samples <n>         Ray Tune num_samples
  --epochs <n>          Max training epochs
  --final-epochs <n>    Final training epochs
  --nodes <n>           Number of nodes (multinode only)
  --extra-args <args>   Extra Python arguments

Examples:
  # Package a repo for H100 Ray Tune
  jz-package.sh \\
    --source ~/projects/my-ml-repo \\
    --output ~/jz-packages \\
    --template ray_tune_h100 \\
    --job-name tune_experiment \\
    --module src.training.tune

  # Include specific data
  jz-package.sh \\
    --source ~/projects/my-ml-repo \\
    --output ~/jz-packages \\
    --template ray_tune_h100 \\
    --job-name tune_experiment \\
    --module src.training.tune \\
    --include-data \\
    --data-dir data/processed/my_dataset

After packaging, sync with:
  ~/.claude/skills/jean-zay/scripts/jz-sync.sh push-package <package-dir>
EOF
}

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --source)       SOURCE_DIR="$2"; shift 2 ;;
    --output)       OUTPUT_DIR="$2"; shift 2 ;;
    --name)         PACKAGE_NAME="$2"; shift 2 ;;
    --template)     TEMPLATE="$2"; GENERATE_ARGS+=(--template "$2"); shift 2 ;;
    --job-name)     JOB_NAME="$2"; GENERATE_ARGS+=(--job-name "$2"); shift 2 ;;
    --module)       PYTHON_MODULE="$2"; GENERATE_ARGS+=(--module "$2"); shift 2 ;;
    --include-data) INCLUDE_DATA=1; shift ;;
    --data-dir)     DATA_DIR="$2"; INCLUDE_DATA=1; shift 2 ;;
    --include)      EXTRA_INCLUDES+=("$2"); shift 2 ;;
    --exclude)      EXTRA_EXCLUDES+=("$2"); shift 2 ;;
    # Pass-through to jz-generate.sh
    --account)      GENERATE_ARGS+=(--account "$2"); shift 2 ;;
    --project-dir)  GENERATE_ARGS+=(--project-dir "$2"); shift 2 ;;
    --local-dir)    GENERATE_ARGS+=(--local-dir "$2"); shift 2 ;;
    --gpus)         GENERATE_ARGS+=(--gpus "$2"); shift 2 ;;
    --cpus)         GENERATE_ARGS+=(--cpus "$2"); shift 2 ;;
    --time)         GENERATE_ARGS+=(--time "$2"); shift 2 ;;
    --samples)      GENERATE_ARGS+=(--samples "$2"); shift 2 ;;
    --epochs)       GENERATE_ARGS+=(--epochs "$2"); shift 2 ;;
    --final-epochs) GENERATE_ARGS+=(--final-epochs "$2"); shift 2 ;;
    --nodes)        GENERATE_ARGS+=(--nodes "$2"); shift 2 ;;
    --extra-args)   GENERATE_ARGS+=(--extra-args "$2"); shift 2 ;;
    -h|--help|help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 1 ;;
  esac
done

# Validate required args
if [[ -z "$SOURCE_DIR" ]]; then
  echo "Error: --source is required" >&2
  usage
  exit 1
fi

if [[ -z "$OUTPUT_DIR" ]]; then
  echo "Error: --output is required" >&2
  usage
  exit 1
fi

if [[ -z "$TEMPLATE" ]]; then
  echo "Error: --template is required" >&2
  usage
  exit 1
fi

if [[ -z "$JOB_NAME" ]]; then
  echo "Error: --job-name is required" >&2
  usage
  exit 1
fi

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Error: Source directory does not exist: $SOURCE_DIR" >&2
  exit 1
fi

# Resolve paths
SOURCE_DIR="$(cd "$SOURCE_DIR" && pwd)"
mkdir -p "$OUTPUT_DIR"
OUTPUT_DIR="$(cd "$OUTPUT_DIR" && pwd)"
PACKAGE_DIR="${OUTPUT_DIR}/${PACKAGE_NAME}"

echo "=== Jean Zay Project Packager ==="
echo "Source:  ${SOURCE_DIR}"
echo "Package: ${PACKAGE_DIR}"
echo "Template: ${TEMPLATE}"
echo "Job: ${JOB_NAME}"
echo ""

# Create package directory
if [[ -d "$PACKAGE_DIR" ]]; then
  echo "Warning: Package directory already exists, removing..."
  rm -rf "$PACKAGE_DIR"
fi
mkdir -p "$PACKAGE_DIR"

# Build rsync exclude list
RSYNC_EXCLUDES=(
  --exclude ".git/"
  --exclude ".venv/"
  --exclude "venv/"
  --exclude "__pycache__/"
  --exclude "*.pyc"
  --exclude ".ipynb_checkpoints/"
  --exclude ".jax_cache/"
  --exclude ".ruff_cache/"
  --exclude ".mypy_cache/"
  --exclude ".pytest_cache/"
  --exclude "catboost_info/"
  --exclude "*.swp"
  --exclude ".DS_Store"
  --exclude "*.egg-info/"
  --exclude "dist/"
  --exclude "build/"
  --exclude "*.log"
  --exclude "wandb/"
  --exclude "mlruns/"
  --exclude "lightning_logs/"
)

# Exclude data and results by default (unless --include-data)
if [[ "$INCLUDE_DATA" != "1" ]]; then
  RSYNC_EXCLUDES+=(--exclude "data/")
fi
RSYNC_EXCLUDES+=(--exclude "**/results/")

# Add user-specified excludes
for pattern in "${EXTRA_EXCLUDES[@]}"; do
  RSYNC_EXCLUDES+=(--exclude "$pattern")
done

echo ">>> Copying source files..."
rsync -av --info=progress2 "${RSYNC_EXCLUDES[@]}" "${SOURCE_DIR}/" "${PACKAGE_DIR}/"

# Copy specific data directory if specified
if [[ -n "$DATA_DIR" && -d "${SOURCE_DIR}/${DATA_DIR}" ]]; then
  echo ">>> Copying data directory: ${DATA_DIR}"
  mkdir -p "${PACKAGE_DIR}/$(dirname "$DATA_DIR")"
  rsync -av --info=progress2 "${SOURCE_DIR}/${DATA_DIR}/" "${PACKAGE_DIR}/${DATA_DIR}/"
fi

# Copy extra includes
for pattern in "${EXTRA_INCLUDES[@]}"; do
  if [[ -e "${SOURCE_DIR}/${pattern}" ]]; then
    echo ">>> Including: ${pattern}"
    mkdir -p "${PACKAGE_DIR}/$(dirname "$pattern")"
    cp -r "${SOURCE_DIR}/${pattern}" "${PACKAGE_DIR}/${pattern}"
  fi
done

# Create jobs directory structure
mkdir -p "${PACKAGE_DIR}/jobs/dl"
mkdir -p "${PACKAGE_DIR}/logs"

# Generate Slurm script
echo ""
echo ">>> Generating Slurm script..."
SLURM_FILE="${PACKAGE_DIR}/jobs/dl/${JOB_NAME}.slurm"
"${SCRIPT_DIR}/jz-generate.sh" "${GENERATE_ARGS[@]}" --output "$SLURM_FILE"

# Create package manifest
MANIFEST_FILE="${PACKAGE_DIR}/JZ_PACKAGE_MANIFEST.txt"
cat > "$MANIFEST_FILE" <<EOF
Jean Zay Package Manifest
=========================
Created: $(date)
Source: ${SOURCE_DIR}
Package: ${PACKAGE_DIR}

Slurm Script: jobs/dl/${JOB_NAME}.slurm
Template: ${TEMPLATE}
Job Name: ${JOB_NAME}
Python Module: ${PYTHON_MODULE:-"(not specified)"}

Files included:
$(cd "$PACKAGE_DIR" && find . -type f | sort | head -100)
$(cd "$PACKAGE_DIR" && find . -type f | wc -l | xargs echo "Total files:")

To sync this package to Jean Zay:
  ~/.claude/skills/jean-zay/scripts/jz-sync.sh push-package ${PACKAGE_DIR}

Or manually:
  rsync -avhP ${PACKAGE_DIR}/ \${JZ_USER}@jean-zay.idris.fr:\${JZ_PROJECT}/

To submit the job:
  ssh \${JZ_USER}@jean-zay.idris.fr "cd \${JZ_PROJECT} && sbatch jobs/dl/${JOB_NAME}.slurm"
EOF

# Create a quick-start script
QUICKSTART="${PACKAGE_DIR}/jz-quickstart.sh"
cat > "$QUICKSTART" <<EOF
#!/usr/bin/env bash
# Quick start script for this package
# Run from the package directory

SCRIPT_DIR="\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="\${HOME}/.claude/skills/jean-zay/scripts"

echo "=== Jean Zay Quick Start ==="
echo "Package: \${SCRIPT_DIR}"
echo ""

case "\${1:-}" in
  sync)
    echo "Syncing package to Jean Zay..."
    cd "\${SCRIPT_DIR}" && "\${SKILL_DIR}/jz-sync.sh" push-code
    ;;
  submit)
    echo "Submitting job..."
    "\${SKILL_DIR}/jz-submit.sh" jobs/dl/${JOB_NAME}.slurm
    ;;
  sync-submit)
    echo "Syncing and submitting..."
    cd "\${SCRIPT_DIR}" && "\${SKILL_DIR}/jz-sync.sh" push-code
    "\${SKILL_DIR}/jz-submit.sh" jobs/dl/${JOB_NAME}.slurm
    ;;
  status)
    "\${SKILL_DIR}/jz-status.sh"
    ;;
  *)
    echo "Usage: ./jz-quickstart.sh [sync|submit|sync-submit|status]"
    echo ""
    echo "Commands:"
    echo "  sync        Sync this package to Jean Zay"
    echo "  submit      Submit the job"
    echo "  sync-submit Sync and then submit"
    echo "  status      Check job status"
    ;;
esac
EOF
chmod +x "$QUICKSTART"

echo ""
echo "=== Package created successfully ==="
echo ""
echo "Package location: ${PACKAGE_DIR}"
echo "Slurm script: ${SLURM_FILE}"
echo "Manifest: ${MANIFEST_FILE}"
echo ""
echo "Next steps:"
echo "  1. Review the generated Slurm script:"
echo "     cat ${SLURM_FILE}"
echo ""
echo "  2. Sync to Jean Zay:"
echo "     cd ${PACKAGE_DIR} && ~/.claude/skills/jean-zay/scripts/jz-sync.sh push-code"
echo ""
echo "  3. Submit the job:"
echo "     ~/.claude/skills/jean-zay/scripts/jz-submit.sh jobs/dl/${JOB_NAME}.slurm"
echo ""
echo "Or use the quickstart script:"
echo "  cd ${PACKAGE_DIR} && ./jz-quickstart.sh sync-submit"
