#!/usr/bin/env python3
"""Performance profiling for CUDA extension model."""

import argparse
import torch

from model import Model, get_inputs, get_init_inputs
from model_new import ModelNew


def transform_tensors(tensors, fn):
    if isinstance(tensors, torch.Tensor):
        return fn(tensors)
    if isinstance(tensors, (list, tuple)):
        return [transform_tensors(x, fn) for x in tensors]
    if isinstance(tensors, dict):
        return {k: transform_tensors(v, fn) for k, v in tensors.items()}
    return tensors


def get_prof_ctx():
    return torch.profiler.profile(
        activities=[torch.profiler.ProfilerActivity.CUDA],
        record_shapes=False,
        with_stack=False,
    )


def parse_args():
    parser = argparse.ArgumentParser(
        description="Profile cuda_extension vs torch baseline and torch.compile."
    )
    parser.add_argument("--iters", type=int, default=10, help="Benchmark iterations")
    parser.add_argument(
        "--single-run",
        type=str,
        help="Run once for targets: torch_baseline,torch_compile,cuda_extension",
    )
    return parser.parse_args()


def initialize_models():
    init_inputs = get_init_inputs()
    if not isinstance(init_inputs, (list, tuple)):
        init_inputs = [init_inputs]

    torch_model = Model(*init_inputs).eval().cuda()
    cuda_model = ModelNew(*init_inputs).eval().cuda()
    cuda_model.load_state_dict(torch_model.state_dict())

    torch_inputs = get_inputs()
    if not isinstance(torch_inputs, (list, tuple)):
        torch_inputs = [torch_inputs]
    torch_inputs = transform_tensors(torch_inputs, lambda x: x.cuda())
    cuda_inputs = transform_tensors(torch_inputs, lambda x: x.clone())
    return torch_model, cuda_model, torch_inputs, cuda_inputs


def benchmark_model(model, inputs, warmup_iters, run_iters):
    with torch.no_grad():
        for _ in range(warmup_iters):
            _ = model(*inputs)

        with get_prof_ctx() as ctx:
            torch.cuda.synchronize()
            for _ in range(run_iters):
                _ = model(*inputs)
            torch.cuda.synchronize()

    return (
        sum(e.device_time for e in ctx.events() if e.device_type.name == "CUDA")
        / run_iters
    )


def print_results(torch_time, compile_time, cuda_time):
    msg = (
        f"Torch Baseline: {torch_time:.3f}us, "
        f"Torch Compile: {compile_time:.3f}us, "
        f"CUDA Extension: {cuda_time:.3f}us"
    )
    print(msg)


def run_single(targets, torch_model, cuda_model, torch_inputs, cuda_inputs):
    torch_compile_model = None
    with torch.no_grad():
        if "torch_baseline" in targets:
            _ = torch_model(*torch_inputs)
        if "torch_compile" in targets:
            if torch_compile_model is None:
                torch_compile_model = torch.compile(torch_model)
            _ = torch_compile_model(*torch_inputs)
        if "cuda_extension" in targets:
            _ = cuda_model(*cuda_inputs)
    print("[DONE] single-run completed")


def main():
    args = parse_args()
    torch_model, cuda_model, torch_inputs, cuda_inputs = initialize_models()

    if args.single_run:
        targets = [x.strip() for x in args.single_run.split(",") if x.strip()]
        run_single(targets, torch_model, cuda_model, torch_inputs, cuda_inputs)
        return

    torch_compile_model = torch.compile(torch_model)
    warmup_iters = 5
    run_iters = args.iters

    cuda_time = benchmark_model(cuda_model, cuda_inputs, warmup_iters, run_iters)
    torch_time = benchmark_model(torch_model, torch_inputs, warmup_iters, run_iters)
    compile_time = benchmark_model(
        torch_compile_model, torch_inputs, warmup_iters, run_iters
    )
    print_results(torch_time, compile_time, cuda_time)


if __name__ == "__main__":
    main()
