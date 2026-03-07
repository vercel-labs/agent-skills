#include <torch/types.h>
#include <torch/csrc/utils/pybind.h>
#include <cuda_runtime.h>
#include <c10/cuda/CUDAStream.h>
#include "../binding_registry.h"

extern "C" void axpby_launcher(
    float* out,
    const float* a,
    const float* b,
    float alpha,
    int size,
    int config,
    cudaStream_t stream
);

static torch::Tensor axpby_forward(torch::Tensor a, torch::Tensor b, double alpha, int config = 0) {
    TORCH_CHECK(a.is_cuda(), "a must be CUDA tensor");
    TORCH_CHECK(b.is_cuda(), "b must be CUDA tensor");
    TORCH_CHECK(a.is_contiguous(), "a must be contiguous");
    TORCH_CHECK(b.is_contiguous(), "b must be contiguous");
    TORCH_CHECK(a.dtype() == torch::kFloat32, "a must be float32");
    TORCH_CHECK(b.dtype() == torch::kFloat32, "b must be float32");
    TORCH_CHECK(a.sizes() == b.sizes(), "a and b must have the same shape");

    auto out = torch::empty_like(a);
    cudaStream_t stream = c10::cuda::getCurrentCUDAStream().stream();
    axpby_launcher(
        out.data_ptr<float>(),
        a.data_ptr<float>(),
        b.data_ptr<float>(),
        static_cast<float>(alpha),
        static_cast<int>(a.numel()),
        config,
        stream
    );
    return out;
}

static void register_axpby(pybind11::module& m) {
    m.def("axpby_forward", &axpby_forward, py::arg("a"), py::arg("b"), py::arg("alpha"), py::arg("config") = 0);
}

REGISTER_BINDING(axpby, register_axpby);
