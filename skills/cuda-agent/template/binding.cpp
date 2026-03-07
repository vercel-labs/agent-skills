#include <pybind11/pybind11.h>
#include "binding_registry.h"

// Fixed binding.cpp - models should NOT modify this file
// All kernel registrations happen automatically via REGISTER_BINDING in .cu files

PYBIND11_MODULE(cuda_extension, m) {
    // Apply all registered bindings from kernels/*.cu files
    BindingRegistry::getInstance().applyBindings(m);
}
