#!/usr/bin/env bash
# =============================================================================
# Jean Zay Job Status Script
# Monitor and manage Slurm jobs on Jean Zay
#
# Usage:
#   jz-status.sh                    # Show all your jobs
#   jz-status.sh <job_id>           # Show details for a specific job
#   jz-status.sh watch <job_id>     # Watch job output in real-time
#   jz-status.sh cancel <job_id>    # Cancel a job
#   jz-status.sh partitions         # Show partition availability
#   jz-status.sh quota              # Show disk quota
#
# Environment variables:
#   JZ_USER     - Jean Zay username (default: umd76av)
#   JZ_HOST     - Jean Zay host (default: jean-zay.idris.fr)
#   JZ_PROJECT  - Remote project path
# =============================================================================

set -euo pipefail

# Configuration
JZ_USER=${JZ_USER:-umd76av}
JZ_HOST=${JZ_HOST:-jean-zay.idris.fr}
JZ_PROJECT=${JZ_PROJECT:-/lustre/fswork/projects/rech/tuz/umd76av/Projects/quant-ml}
SSH_TARGET="${JZ_USER}@${JZ_HOST}"

usage() {
  cat <<EOF
Jean Zay Job Status Script

Usage:
  jz-status.sh                        Show all your running/pending jobs
  jz-status.sh <job_id>               Show details for a specific job
  jz-status.sh watch <job_id>         Watch job output in real-time
  jz-status.sh logs <job_id>          Show last 50 lines of job output
  jz-status.sh err <job_id>           Show last 50 lines of job errors
  jz-status.sh cancel <job_id>        Cancel a job
  jz-status.sh partitions             Show GPU partition availability
  jz-status.sh quota                  Show disk quota
  jz-status.sh recent                 Show recently completed jobs

Remote: ${SSH_TARGET}
EOF
}

# Execute command on Jean Zay
jz_exec() {
  ssh "${SSH_TARGET}" "$@"
}

# Show all user's jobs
cmd_list() {
  echo "=== Your jobs on Jean Zay ==="
  jz_exec "squeue -u \$USER -o '%.10i %.20j %.8T %.10M %.6D %.4C %.8m %R' --sort=-S"
}

# Show specific job details
cmd_job_detail() {
  local job_id="$1"
  echo "=== Job ${job_id} details ==="
  jz_exec "scontrol show job ${job_id}" || echo "Job not found or completed"
}

# Watch job output
cmd_watch() {
  local job_id="$1"
  echo "=== Watching output for job ${job_id} ==="
  echo "(Press Ctrl+C to stop)"
  echo ""

  # Find the log file
  local log_pattern="${JZ_PROJECT}/logs/*-${job_id}.out ${JZ_PROJECT}/jobs/dl/logs/*-${job_id}.out"
  jz_exec "tail -f ${log_pattern} 2>/dev/null" || echo "Log file not found. Job may not have started yet."
}

# Show job logs
cmd_logs() {
  local job_id="$1"
  local lines="${2:-50}"
  echo "=== Last ${lines} lines of output for job ${job_id} ==="
  local log_pattern="${JZ_PROJECT}/logs/*-${job_id}.out ${JZ_PROJECT}/jobs/dl/logs/*-${job_id}.out"
  jz_exec "tail -n ${lines} ${log_pattern} 2>/dev/null" || echo "Log file not found."
}

# Show job errors
cmd_err() {
  local job_id="$1"
  local lines="${2:-50}"
  echo "=== Last ${lines} lines of errors for job ${job_id} ==="
  local log_pattern="${JZ_PROJECT}/logs/*-${job_id}.err ${JZ_PROJECT}/jobs/dl/logs/*-${job_id}.err"
  jz_exec "tail -n ${lines} ${log_pattern} 2>/dev/null" || echo "Error log not found."
}

# Cancel a job
cmd_cancel() {
  local job_id="$1"
  echo "=== Cancelling job ${job_id} ==="
  jz_exec "scancel ${job_id}"
  echo "Job ${job_id} cancelled"
}

# Show partition availability
cmd_partitions() {
  echo "=== GPU Partition Availability ==="
  jz_exec "sinfo -p gpu_p1,gpu_p5,gpu_p6 -o '%P %.6a %.10l %.16F %.10G' | head -20"
  echo ""
  echo "Legend: PARTITION, AVAIL, TIMELIMIT, NODES(A/I/O/T), GRES"
  echo "  A=Allocated, I=Idle, O=Other, T=Total"
}

# Show disk quota
cmd_quota() {
  echo "=== Disk Quota ==="
  jz_exec "idrquota -w"
}

# Show recently completed jobs
cmd_recent() {
  echo "=== Recently completed jobs ==="
  jz_exec "sacct -u \$USER --starttime=now-7days --format=JobID,JobName%20,State,Elapsed,MaxRSS,ExitCode -n | head -30"
}

main() {
  local cmd=${1:-}

  case "$cmd" in
    "")
      cmd_list
      ;;
    watch)
      [[ -z "${2:-}" ]] && { echo "Error: job_id required"; exit 1; }
      cmd_watch "$2"
      ;;
    logs)
      [[ -z "${2:-}" ]] && { echo "Error: job_id required"; exit 1; }
      cmd_logs "$2" "${3:-50}"
      ;;
    err)
      [[ -z "${2:-}" ]] && { echo "Error: job_id required"; exit 1; }
      cmd_err "$2" "${3:-50}"
      ;;
    cancel)
      [[ -z "${2:-}" ]] && { echo "Error: job_id required"; exit 1; }
      cmd_cancel "$2"
      ;;
    partitions)
      cmd_partitions
      ;;
    quota)
      cmd_quota
      ;;
    recent)
      cmd_recent
      ;;
    -h|--help|help)
      usage
      ;;
    *)
      # Assume it's a job ID
      if [[ "$cmd" =~ ^[0-9]+$ ]]; then
        cmd_job_detail "$cmd"
      else
        echo "Unknown command: $cmd" >&2
        usage
        exit 1
      fi
      ;;
  esac
}

main "$@"
