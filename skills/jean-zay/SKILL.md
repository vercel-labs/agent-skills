---
name: jean-zay
description: Run projects on Jean Zay supercomputer. Use when the user wants to sync code, generate Slurm scripts, submit training jobs, monitor job status, or pull results from Jean Zay. Supports Ray Tune hyperparameter optimization on V100, A100, and H100 GPUs.
argument-hint: [sync|submit|status|pull|generate]
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

# Jean Zay Supercomputer Skill

This skill helps you run machine learning projects on Jean Zay (IDRIS), the French national supercomputer. It supports the full workflow from syncing code to pulling results.

## Quick Commands

| Command | Description |
|---------|-------------|
| `/jean-zay package` | Package any repo for Jean Zay |
| `/jean-zay sync` | Sync code/data to Jean Zay |
| `/jean-zay submit <script>` | Submit a Slurm job |
| `/jean-zay status` | Check job status |
| `/jean-zay pull` | Pull results from Jean Zay |
| `/jean-zay generate` | Generate a new Slurm script |

## Configuration

Before using, ensure these environment variables are set (or use defaults):

```bash
export JZ_USER="umd76av"                    # Your Jean Zay username
export JZ_HOST="jean-zay.idris.fr"          # Jean Zay host
export JZ_PROJECT="/lustre/fswork/projects/rech/tuz/umd76av/Projects/quant-ml"
export JZ_ACCOUNT="tuz"                      # Your IDRIS account code
```

## Workflow Overview

### Option A: Package Any Repository

Use the packager to create a self-contained directory from any local repo:

```bash
# Package a repo with all necessary files and Slurm script
~/.claude/skills/jean-zay/scripts/jz-package.sh \
  --source /path/to/your/repo \
  --output ~/jz-packages \
  --template ray_tune_h100 \
  --job-name my_experiment \
  --module src.training.tune \
  --samples 300 \
  --epochs 1000

# Optional: include specific data
~/.claude/skills/jean-zay/scripts/jz-package.sh \
  --source /path/to/repo \
  --output ~/jz-packages \
  --template ray_tune_h100 \
  --job-name experiment \
  --module src.train \
  --include-data \
  --data-dir data/processed/my_dataset
```

This creates a package directory with:
- Clean copy of source code (excludes .git, venv, caches)
- Generated Slurm script in `jobs/dl/`
- Quickstart script for easy sync/submit
- Manifest file documenting the package

Then sync and submit:
```bash
# Sync the package
~/.claude/skills/jean-zay/scripts/jz-sync.sh push-package ~/jz-packages/my_package

# Submit the job
~/.claude/skills/jean-zay/scripts/jz-submit.sh jobs/dl/my_experiment.slurm

# Or use the quickstart script inside the package
cd ~/jz-packages/my_package && ./jz-quickstart.sh sync-submit
```

### Option B: Work from Project Directory

If you're already in your project directory, sync directly:

### 1. Sync Code to Jean Zay

```bash
# Sync entire project (excluding data and results)
~/.claude/skills/jean-zay/scripts/jz-sync.sh push-code

# Sync data directory
~/.claude/skills/jean-zay/scripts/jz-sync.sh push-data

# Dry run (show what would be transferred)
DRY_RUN=1 ~/.claude/skills/jean-zay/scripts/jz-sync.sh push-code
```

### 2. Generate Slurm Script

Use the templates in `~/.claude/skills/jean-zay/templates/slurm/` as a starting point. Available templates:

- `ray_tune_h100.slurm` - H100 single-node Ray Tune (100h max)
- `ray_tune_a100.slurm` - A100 single-node Ray Tune (20h max)
- `ray_tune_v100.slurm` - V100 single-node Ray Tune (20h max)
- `ray_multinode_h100.slurm` - H100 multi-node Ray cluster
- `generic_train.slurm` - Generic Python training script

When generating a script, customize these parameters:
- `--job-name`: Descriptive name for your job
- `--time`: Wall time limit (HH:MM:SS)
- `--gres=gpu:N`: Number of GPUs (1-8 depending on partition)
- Python module path and arguments

### 3. Submit Job

```bash
# SSH to Jean Zay and submit
ssh ${JZ_USER}@${JZ_HOST} "cd ${JZ_PROJECT} && sbatch jobs/dl/your_script.slurm"

# Or use the helper script
~/.claude/skills/jean-zay/scripts/jz-submit.sh jobs/dl/your_script.slurm
```

### 4. Monitor Jobs

```bash
# Check all your jobs
~/.claude/skills/jean-zay/scripts/jz-status.sh

# Watch a specific job's output
~/.claude/skills/jean-zay/scripts/jz-status.sh watch <job_id>

# Cancel a job
~/.claude/skills/jean-zay/scripts/jz-status.sh cancel <job_id>
```

### 5. Pull Results

```bash
# Pull results (excludes large checkpoint files)
~/.claude/skills/jean-zay/scripts/jz-sync.sh pull-results

# Pull everything including checkpoints
~/.claude/skills/jean-zay/scripts/jz-sync.sh pull-results-full
```

## GPU Partition Reference

| Partition | GPU | Max GPUs/Node | Max Time | QoS | Account Format |
|-----------|-----|---------------|----------|-----|----------------|
| gpu_p1 | V100 32GB | 4 | 20h (dev) / 100h | qos_gpu-t4 | `account@v100` |
| gpu_p5 | A100 80GB | 8 | 20h (dev) / 100h | qos_gpu-t4 | `account@a100` |
| gpu_p6 | H100 80GB | 4 | 100h | qos_gpu_h100-t4 | `account@h100` |

## Ray Tune Setup

The skill includes optimized Ray configuration for Jean Zay:

1. **Socket path fix**: Uses short paths to avoid AF_UNIX limit
2. **Temp directory**: Uses `$WORK/tmp/ray` to avoid `/tmp` quota issues
3. **Dashboard disabled**: Prevents port conflicts
4. **Multi-node support**: Automatic Ray cluster setup across nodes

## Files in This Skill

- `templates/slurm/` - Slurm script templates for each partition
- `scripts/jz-package.sh` - Package any repo for Jean Zay deployment
- `scripts/jz-sync.sh` - Sync code/data/results to/from Jean Zay
- `scripts/jz-submit.sh` - Submit jobs remotely
- `scripts/jz-status.sh` - Monitor job status
- `scripts/jz-generate.sh` - Generate Slurm scripts from templates
- `reference.md` - Detailed Jean Zay documentation
- `examples/workflow.md` - Complete workflow example

## Troubleshooting

### Job won't start
- Check quota: `ssh ${JZ_USER}@${JZ_HOST} "idrquota -w"`
- Check partition availability: `ssh ${JZ_USER}@${JZ_HOST} "sinfo -p gpu_p6"`

### Ray socket errors
- Ensure `RAY_TMPDIR` is set to `$WORK/tmp/ray/${SLURM_JOB_ID}`
- Use short socket names (< 108 chars total path)

### Out of disk space
- Request inode increase: email assist@idris.fr
- Clean old results: `find $WORK -name "*.ckpt" -mtime +7 -delete`
