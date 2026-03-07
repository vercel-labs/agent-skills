# CUDA Kernel Optimization Guide

Detailed checklist and strategies for optimizing CUDA kernels. Referenced from SKILL.md when deeper guidance is needed.

## Table of Contents
1. [Optimization Checklist](#optimization-checklist)
2. [Parameter Tuning](#parameter-tuning)
3. [Common Issues and Solutions](#common-issues-and-solutions)

## Optimization Checklist

### Essential Optimizations (Apply First)
- [ ] **Memory Coalescing**: Consecutive threads access consecutive addresses
- [ ] **Kernel Fusion**: Combine operations to reduce memory traffic
- [ ] **Shared Memory**: Cache frequently accessed data
- [ ] **Grid-Stride Loops**: Handle data larger than grid size
- [ ] **Boundary Checks**: Validate all array accesses (tid < size)

### Performance Optimizations (Apply as Needed)
- [ ] **Vectorized Memory**: Use float2/float4 for higher throughput
- [ ] **Warp Primitives**: __shfl_sync for inter-thread communication
- [ ] **Occupancy Tuning**: Balance block size and resource usage
- [ ] **Bank Conflict Avoidance**: Pad shared memory arrays
- [ ] **Loop Unrolling**: Increase instruction-level parallelism

### Advanced Optimizations (For Final Tuning)
- [ ] **Tensor Cores**: Use WMMA/MMA for eligible GEMM operations
- [ ] **Mixed Precision**: FP16/TF32 where appropriate
- [ ] **Persistent Kernels**: Keep data in registers across iterations
- [ ] **CUDA Graphs**: Reduce launch overhead
- [ ] **Double Buffering**: Overlap computation with memory transfers

### Correctness Checklist (Always Verify)
- [ ] **Thread Bounds**: Check tid < N before array access
- [ ] **Synchronization**: __syncthreads() before shared memory reuse
- [ ] **Data Types**: Ensure correct types and conversions
- [ ] **Memory Safety**: No out-of-bounds access
- [ ] **Numerical Stability**: Handle NaN/Inf, use stable algorithms

## Parameter Tuning

Only when within 1.2x of target and algorithmic options exhausted:

```python
# tune_kernel.py - NO recompilation needed
import time, torch, cuda_extension

configs = [
    (0, "256_threads_16_tile"),
    (1, "128_threads_32_tile"),
    (2, "512_threads_8_tile")
]

# Test input
x = torch.randn(batch_size, features).cuda()

# Benchmark each config
best_config, best_time = 0, float('inf')
for config_id, name in configs:
    # Warmup
    for _ in range(10):
        cuda_extension.my_kernel_forward(x, config=config_id)
    torch.cuda.synchronize()

    # Measure
    start = time.perf_counter()
    for _ in range(100):
        cuda_extension.my_kernel_forward(x, config=config_id)
    torch.cuda.synchronize()
    elapsed = time.perf_counter() - start

    print(f"Config {name}: {elapsed:.4f}s")
    if elapsed < best_time:
        best_time, best_config = elapsed, config_id

print(f"Best: config {best_config} ({best_time:.4f}s)")
# Update model_new.py with best_config
```

## Common Issues and Solutions

### Compilation Errors
| Error | Solution |
|-------|----------|
| undefined symbol | Check extern "C" declarations match |
| no kernel image | Verify TORCH_CUDA_ARCH_LIST matches GPU |
| multiple definition | Ensure functions are in separate translation units |

### Correctness Failures
| Issue | Debug Steps |
|-------|-------------|
| Wrong output values | 1. Check kernel math  2. Verify indexing  3. Test with simple inputs |
| NaN/Inf results | 1. Check division by zero  2. Verify numerical stability  3. Add bounds checking |
| Mismatched shapes | 1. Print tensor shapes  2. Check dimension calculations  3. Verify reduction logic |

### Performance Issues
| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Slower than baseline | No fusion | Combine kernels |
| Low SM efficiency | Poor occupancy | Tune block size |
| Low memory throughput | Uncoalesced access | Restructure memory pattern |
| High kernel count | Missing fusion | Implement compound operations |

## Iteration Strategy

- **Iterations 1-2**: Achieve the minimum 5% improvement over torch.compile
- **Iterations 3-5**: Push for maximum possible speedup (20%+ target)
- Continue until no further improvements or diminishing returns
- Be aggressive with optimizations — don't revert to slow versions when debugging
- Document performance expectations before implementing ("Fusion will eliminate 3 kernels, expect ~20% speedup")
