#include <cuda_runtime.h>

template<int THREADS>
__global__ void axpby_kernel(float* out, const float* a, const float* b, float alpha, int size) {
    int tid = blockIdx.x * blockDim.x + threadIdx.x;
    int stride = blockDim.x * gridDim.x;
    for (int i = tid; i < size; i += stride) {
        out[i] = alpha * a[i] + b[i];
    }
}

extern "C" void axpby_launcher(
    float* out,
    const float* a,
    const float* b,
    float alpha,
    int size,
    int config,
    cudaStream_t stream
) {
    if (size <= 0) return;
    switch (config) {
        case 1: {
            int threads = 128;
            int blocks = (size + threads - 1) / threads;
            axpby_kernel<128><<<blocks, threads, 0, stream>>>(out, a, b, alpha, size);
            break;
        }
        case 2: {
            int threads = 512;
            int blocks = (size + threads - 1) / threads;
            axpby_kernel<512><<<blocks, threads, 0, stream>>>(out, a, b, alpha, size);
            break;
        }
        default: {
            int threads = 256;
            int blocks = (size + threads - 1) / threads;
            axpby_kernel<256><<<blocks, threads, 0, stream>>>(out, a, b, alpha, size);
            break;
        }
    }
}
