# Jean Zay Reference Documentation

This document contains detailed reference information for running jobs on Jean Zay.

## GPU Partitions

### V100 (gpu_p1)
- **GPU**: NVIDIA V100 32GB
- **GPUs per node**: 4
- **CPUs per node**: 40
- **Memory**: 192 GB
- **Max time**: 20h (dev qos) / 100h (t4 qos)
- **Module**: `module load pytorch-gpu/py3/2.4.0`

```bash
#SBATCH --partition=gpu_p1
#SBATCH --qos=qos_gpu-t4
#SBATCH --account=tuz@v100
```

### A100 (gpu_p5)
- **GPU**: NVIDIA A100 80GB
- **GPUs per node**: 8
- **CPUs per node**: 64
- **Memory**: 512 GB
- **Max time**: 20h (dev qos) / 100h (t4 qos)
- **Module**: `module load arch/a100 && module load pytorch-gpu/py3/2.4.0`

```bash
#SBATCH --partition=gpu_p5
#SBATCH --constraint=a100
#SBATCH --qos=qos_gpu-t4
#SBATCH --account=tuz@a100
```

### H100 (gpu_p6)
- **GPU**: NVIDIA H100 80GB
- **GPUs per node**: 4
- **CPUs per node**: 48
- **Memory**: 384 GB
- **Max time**: 100h
- **Module**: `module load arch/h100 && module load pytorch-gpu/py3/2.4.0`

```bash
#SBATCH --partition=gpu_p6
#SBATCH --constraint=h100
#SBATCH --qos=qos_gpu_h100-t4
#SBATCH --account=tuz@h100
```

## QoS (Quality of Service)

| QoS | Max Time | Max GPUs | Notes |
|-----|----------|----------|-------|
| qos_gpu-dev | 2h | 4 | Development/debugging |
| qos_gpu-t3 | 20h | 512 | Standard jobs |
| qos_gpu-t4 | 100h | 64 | Long jobs |
| qos_gpu_h100-dev | 2h | 4 | H100 development |
| qos_gpu_h100-t4 | 100h | 16 | H100 long jobs |

## File Systems

### $HOME
- **Path**: `/linkhome/rech/<account>/<user>`
- **Quota**: 3 GB
- **Purpose**: Configuration files, small scripts
- **NOT** backed up

### $WORK
- **Path**: `/lustre/fswork/projects/rech/<account>/<user>`
- **Quota**: 5 TB (expandable)
- **Purpose**: Code, data, results
- **NOT** backed up
- **Performance**: High throughput

### $SCRATCH
- **Path**: `/lustre/fsn1/projects/rech/<account>/<user>`
- **Quota**: None
- **Purpose**: Temporary files during jobs
- **Purged**: Files older than 30 days deleted

### $STORE
- **Path**: `/lustre/fsstore/projects/rech/<account>/<user>`
- **Quota**: 100 TB
- **Purpose**: Long-term storage
- **Backed up**: Yes

## Useful Commands

### Check quota
```bash
idrquota -w    # $WORK quota
idrquota -s    # $STORE quota
```

### Check partition status
```bash
sinfo -p gpu_p6 -o "%P %.6a %.10l %.16F %.10G"
```

### Check your jobs
```bash
squeue -u $USER
sacct -u $USER --starttime=now-7days
```

### Submit a job
```bash
sbatch script.slurm
sbatch --export=ALL,VAR=value script.slurm
```

### Cancel a job
```bash
scancel <job_id>
scancel -u $USER  # Cancel all your jobs
```

### SSH to a running job's node
```bash
ssh <node-name>  # Only works for your allocated nodes
```

## Python Environment

### Using IDRIS modules (Recommended)
```bash
module purge
module load arch/h100  # or arch/a100 for A100
module load pytorch-gpu/py3/2.4.0
```

### Using conda (Alternative)
```bash
# Install miniconda to $WORK
wget https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh -b -p $WORK/miniconda3

# Initialize
$WORK/miniconda3/bin/conda init bash
source ~/.bashrc
```

## Ray Tune on Jean Zay

### Critical Configuration

1. **Socket paths**: Use short paths to avoid AF_UNIX 108-char limit
```bash
export RAY_TMPDIR="/tmp/ray_${SLURM_JOB_ID}"
export RAY_PLASMA_STORE_SOCKET_NAME="$RAY_TMPDIR/p"
export RAY_RAYLET_SOCKET_NAME="$RAY_TMPDIR/r"
```

2. **Disable dashboard**: Prevents port conflicts
```bash
export RAY_DASHBOARD_DISABLE=1
```

3. **Temp directory**: Use local `/tmp` for single-node, `$WORK/tmp` for multi-node

### Multi-Node Ray Cluster

```bash
# Start head node
ray start --head --node-ip-address=${HEAD_IP} --port=6379 --temp-dir=${RAY_TMPDIR}

# Start workers on other nodes
for node in $(scontrol show hostnames $SLURM_NODELIST | tail -n +2); do
  srun --nodes=1 --ntasks=1 -w ${node} bash -c "ray start --address=${HEAD_IP}:6379 --block" &
done
```

## Common Issues

### "AF_UNIX path too long"
Ray socket paths exceed 108 characters. Solution:
```bash
export RAY_TMPDIR="/tmp/ray_${SLURM_JOB_ID}"
export RAY_PLASMA_STORE_SOCKET_NAME="$RAY_TMPDIR/p"
```

### "No space left on device"
Check quota: `idrquota -w`
Request increase: email assist@idris.fr

### "Module not found"
Load appropriate architecture module first:
```bash
module load arch/h100  # Before loading pytorch
```

### Job stuck in queue
Check partition availability:
```bash
sinfo -p gpu_p6 -o "%P %.6a %.10l %.16F"
```

Consider using a different partition or lower GPU count.

## Contact

- **Support**: assist@idris.fr
- **Documentation**: https://jean-zay-doc.readthedocs.io/
- **Status page**: https://www.idris.fr/jean-zay/
