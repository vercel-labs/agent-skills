---
name: cuda-agent
description: Optimize PyTorch models by creating high-performance CUDA C++ extensions that outperform torch.compile. Use this skill whenever the user mentions CUDA kernels, GPU optimization, accelerating PyTorch models, writing custom CUDA code, kernel fusion, making a model faster with CUDA, or benchmarking against torch.compile — even if they don't explicitly say "CUDA agent". Also trigger when users ask about shared memory tiling, warp primitives, memory coalescing, or any custom GPU kernel work.
---

# CUDA Agent - PyTorch to Optimized CUDA Kernels

Accelerate PyTorch models by implementing custom CUDA C++ extensions. Based on the CUDA-Agent methodology from BytedTsinghua-SIA, which achieves state-of-the-art results on KernelBench.

## How It Works

1. **Setup workspace** from template with GPU auto-detection
2. **Analyze** the PyTorch model to identify optimization targets
3. **Implement** CUDA kernels in the `kernels/` directory
4. **Compile** the extension using PyTorch's cpp_extension
5. **Verify** correctness against the original model (atol=1e-2, rtol=1e-2)
6. **Profile** performance vs torch baseline and torch.compile
7. **Iterate** with optimizations until performance target is met (minimum 5% faster than torch.compile)

## Usage

### Step 1: Setup Workspace

```bash
bash /mnt/skills/user/cuda-agent/scripts/setup-workspace.sh /path/to/workspace
```

This copies the template (binding infrastructure, utils, example kernels) and auto-detects GPU architecture.

### Step 2: Place Your Model

Replace `model.py` in the workspace with the PyTorch model to optimize. It must define:
- `class Model(nn.Module)` - the model to optimize
- `get_inputs()` - returns sample inputs
- `get_init_inputs()` - returns constructor arguments

### Step 3: Implement CUDA Kernels

Create `.cu` and `_binding.cpp` file pairs in `kernels/`, then create `model_new.py` using the custom ops. See "Kernel Implementation Workflow" below for the full pattern. Then compile:

```bash
bash /mnt/skills/user/cuda-agent/scripts/compile.sh /path/to/workspace
```

### Step 4: Verify and Profile

```bash
bash /mnt/skills/user/cuda-agent/scripts/verify.sh /path/to/workspace
bash /mnt/skills/user/cuda-agent/scripts/profile.sh /path/to/workspace [--iters N]
```

**Arguments:**
- `workspace_dir` - Path to the workspace directory (defaults to `.`)
- `--iters N` - Number of profiling iterations (defaults to 10, profile.sh only)

**Examples:**

```bash
# Full workflow: setup, compile, verify, profile
bash /mnt/skills/user/cuda-agent/scripts/setup-workspace.sh ./my-optimization
# ... edit model.py, create kernels, write model_new.py ...
bash /mnt/skills/user/cuda-agent/scripts/compile.sh ./my-optimization
bash /mnt/skills/user/cuda-agent/scripts/verify.sh ./my-optimization
bash /mnt/skills/user/cuda-agent/scripts/profile.sh ./my-optimization --iters 50

# Quick iteration: recompile and re-verify after kernel changes
bash /mnt/skills/user/cuda-agent/scripts/compile.sh ./my-optimization
bash /mnt/skills/user/cuda-agent/scripts/verify.sh ./my-optimization
```

## Kernel Implementation Workflow

### Critical Restrictions

**STRICTLY FORBIDDEN:**
- NO `torch::*` or `torch::nn::functional::*` in `.cu` or kernel `.cpp` files
- NO torch operations in `model_new.py` (only tensor creation and custom ops)
- NO third-party libraries except cuBLAS (GEMM only) and cuDNN (Conv only)
- NO modifications to `utils/`, `binding.cpp`, or `binding_registry.h`

**ALLOWED ONLY:**
- Raw CUDA kernels in `kernels/*.cu`
- cuBLAS for GEMM, cuDNN for Conv/ConvTranspose
- `torch::empty_like` for allocation in bindings
- `torch.tensor` creation and custom extension ops in Python

### Workspace Structure

```
workspace/
  binding_registry.h    # DO NOT modify - registration system
  binding.cpp           # DO NOT modify - main module binding
  kernels/              # YOUR WORK: implement all kernels here
    my_kernel.cu        # CUDA kernel implementation
    my_kernel_binding.cpp  # PyTorch binding
  utils/                # DO NOT modify - compilation, verification, profiling
  model.py              # DO NOT modify - original PyTorch model
  model_new.py          # YOUR WORK: optimized model using custom ops
```

### Creating a Kernel Pair

**kernels/my_kernel.cu** - Pure CUDA implementation:
```cuda
#include <cuda_runtime.h>

template<int BLOCK_SIZE>
__global__ void my_kernel_impl(float* output, const float* input, int size) {
    int tid = blockIdx.x * blockDim.x + threadIdx.x;
    int stride = blockDim.x * gridDim.x;
    for (int i = tid; i < size; i += stride) {
        output[i] = /* computation */;
    }
}

extern "C" void my_kernel_launcher(
    float* output, const float* input, int size, int config, cudaStream_t stream
) {
    int blocks = (size + 255) / 256;
    my_kernel_impl<256><<<blocks, 256, 0, stream>>>(output, input, size);
}
```

**kernels/my_kernel_binding.cpp** - PyTorch binding:
```cpp
#include <torch/types.h>
#include <torch/csrc/utils/pybind.h>
#include <cuda_runtime.h>
#include <c10/cuda/CUDAStream.h>
#include "../binding_registry.h"

extern "C" void my_kernel_launcher(
    float* output, const float* input, int size, int config, cudaStream_t stream
);

torch::Tensor my_kernel_forward(torch::Tensor input, int config = 0) {
    TORCH_CHECK(input.is_cuda(), "Input must be a CUDA tensor");
    TORCH_CHECK(input.is_contiguous(), "Input must be contiguous");
    auto output = torch::empty_like(input);
    cudaStream_t stream = c10::cuda::getCurrentCUDAStream().stream();
    my_kernel_launcher(output.data_ptr<float>(), input.data_ptr<float>(),
                       input.numel(), config, stream);
    return output;
}

void register_my_kernel(pybind11::module& m) {
    m.def("my_kernel_forward", &my_kernel_forward, py::arg("input"), py::arg("config") = 0);
}

REGISTER_BINDING(my_kernel, register_my_kernel);
```

**model_new.py** - Optimized model:
```python
import torch
import torch.nn as nn
import cuda_extension

class ModelNew(nn.Module):
    def __init__(self, ...):  # MUST match Model signature
        super().__init__()
        # Same parameters as original
    def forward(self, x):
        return cuda_extension.my_kernel_forward(x, config=0)
```

### Optimization Priority

1. **Algorithmic (>50% impact)**: Kernel fusion, shared memory tiling, memory coalescing
2. **Hardware utilization (20-50%)**: Vectorized loads (float2/float4), warp primitives, occupancy tuning
3. **Fine-tuning (<20%)**: Mixed precision (FP16/TF32), prefetching, double buffering

For the full optimization checklist (vectorized memory, warp primitives, tensor cores, correctness checks, and common issues), read `references/optimization-guide.md`.

### Iteration Requirements

- **Correctness MUST pass** - iterate until verification succeeds
- **Minimum**: 5% faster than torch.compile
- **Goal**: Best possible performance - keep optimizing after meeting minimum
- **Clean up**: Remove intermediate attempts before completion

## Output

```
# Verification
[PASS] check 1/5
[PASS] check 2/5
...
[PASS] verify success

# Profiling
Torch Baseline: 45.230us, Torch Compile: 38.100us, CUDA Extension: 31.500us
```

## Present Results to User

```
## CUDA Kernel Optimization Results

**Model**: [model description]
**GPU**: [detected GPU] (Compute Capability [X.Y])

### Performance
| Method | Time | Speedup |
|--------|------|---------|
| Torch Baseline | XX.XXXus | 1.00x |
| Torch Compile | XX.XXXus | X.XXx |
| CUDA Extension | XX.XXXus | X.XXx |

### Optimizations Applied
- [List of optimization techniques used]

### Correctness: PASSED (5/5 checks)
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| `undefined symbol` | Check `extern "C"` declarations match between `.cu` and `_binding.cpp` |
| `no kernel image` | Set `TORCH_CUDA_ARCH_LIST` to match your GPU (auto-detected in `.cuda_arch`) |
| `cuda_extension.so not found` | Run `compile.sh` before `verify.sh` or `profile.sh` |
| Wrong output values | Check kernel indexing, boundary conditions (`tid < size`) |
| NaN/Inf results | Check division by zero, numerical stability |
| Slower than baseline | Fuse kernels to reduce memory traffic |
| `torch.nn.functional not allowed` | Remove torch ops from `model_new.py`, use only custom extension ops |
