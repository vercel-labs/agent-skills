# Example Workflow: Ray Tune on Jean Zay

This example shows a complete workflow for running a Ray Tune hyperparameter optimization job on Jean Zay.

## 1. Generate a Slurm Script

```bash
# Generate H100 script for neural network tuning
~/.claude/skills/jean-zay/scripts/jz-generate.sh \
  --template ray_tune_h100 \
  --job-name tune_nn_experiment \
  --module src.dl.ray.tune_nn \
  --data-dir data/raw/grid_mix/my_dataset \
  --local-dir src/dl/results/my_experiment \
  --samples 300 \
  --epochs 1000 \
  --final-epochs 1500 \
  --time 100:00:00 \
  --output jobs/dl/tune_nn_experiment.slurm
```

## 2. Sync Code to Jean Zay

```bash
# Preview what will be synced
DRY_RUN=1 ~/.claude/skills/jean-zay/scripts/jz-sync.sh push-code

# Actually sync
~/.claude/skills/jean-zay/scripts/jz-sync.sh push-code
~/.claude/skills/jean-zay/scripts/jz-sync.sh push-jobs

# Also sync data if needed
~/.claude/skills/jean-zay/scripts/jz-sync.sh push-data
```

## 3. Submit the Job

```bash
# Submit with sync (recommended - ensures latest code)
~/.claude/skills/jean-zay/scripts/jz-submit.sh --sync jobs/dl/tune_nn_experiment.slurm

# Or submit without syncing
~/.claude/skills/jean-zay/scripts/jz-submit.sh jobs/dl/tune_nn_experiment.slurm

# Override parameters at submission time
~/.claude/skills/jean-zay/scripts/jz-submit.sh jobs/dl/tune_nn_experiment.slurm \
  --export NUM_SAMPLES=500 \
  --export MAX_EPOCHS=2000
```

## 4. Monitor the Job

```bash
# Check all your jobs
~/.claude/skills/jean-zay/scripts/jz-status.sh

# Check a specific job
~/.claude/skills/jean-zay/scripts/jz-status.sh 1234567

# Watch output in real-time
~/.claude/skills/jean-zay/scripts/jz-status.sh watch 1234567

# View last 100 lines of output
~/.claude/skills/jean-zay/scripts/jz-status.sh logs 1234567 100

# View errors
~/.claude/skills/jean-zay/scripts/jz-status.sh err 1234567

# Check partition availability
~/.claude/skills/jean-zay/scripts/jz-status.sh partitions

# Check disk quota
~/.claude/skills/jean-zay/scripts/jz-status.sh quota
```

## 5. Pull Results

```bash
# Pull results (light - excludes checkpoints)
~/.claude/skills/jean-zay/scripts/jz-sync.sh pull-results

# Pull everything including checkpoints (large!)
~/.claude/skills/jean-zay/scripts/jz-sync.sh pull-results-full

# Pull just the log files
~/.claude/skills/jean-zay/scripts/jz-sync.sh pull-logs
```

## Quick Reference

| Action | Command |
|--------|---------|
| Generate H100 script | `jz-generate.sh --template ray_tune_h100 ...` |
| Generate A100 script | `jz-generate.sh --template ray_tune_a100 ...` |
| Generate V100 script | `jz-generate.sh --template ray_tune_v100 ...` |
| Sync code | `jz-sync.sh push-code` |
| Sync data | `jz-sync.sh push-data` |
| Submit job | `jz-submit.sh jobs/dl/script.slurm` |
| Check status | `jz-status.sh` |
| Watch output | `jz-status.sh watch <job_id>` |
| Cancel job | `jz-status.sh cancel <job_id>` |
| Pull results | `jz-sync.sh pull-results` |

## Environment Variables

Set these in your shell or `.bashrc` to customize defaults:

```bash
export JZ_USER="your_username"
export JZ_HOST="jean-zay.idris.fr"
export JZ_PROJECT="/lustre/fswork/projects/rech/your_account/your_user/Projects/your_project"
export JZ_ACCOUNT="your_account"
```
