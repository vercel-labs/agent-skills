#!/usr/bin/env python3
"""Simplified compile script: force-compile root and kernels CUDA/C++ sources."""

import shutil
import sys
from pathlib import Path

import torch.utils.cpp_extension as cpp_ext


def find_sources() -> list[str]:
    root = Path('.')
    kernels_dir = Path('kernels')

    root_sources = [str(p) for p in root.glob('*.cu')] + [str(p) for p in root.glob('*.cpp')]
    kernel_sources = []
    if kernels_dir.is_dir():
        kernel_sources = [str(p) for p in kernels_dir.glob('*.cu')] + [str(p) for p in kernels_dir.glob('*.cpp')]

    return sorted(set(root_sources + kernel_sources))


def compile_kernels() -> int:
    build_dir = Path('build/forced_compile')
    output_so = Path('cuda_extension.so')
    sources = find_sources()

    if not sources:
        print('Error: no source files found (*.cu, *.cpp in root or kernels/)')
        return 1

    print(f'Compiling {len(sources)} files: {", ".join(sources)}')

    if build_dir.exists():
        shutil.rmtree(build_dir)
    build_dir.mkdir(parents=True, exist_ok=True)

    if output_so.exists():
        output_so.unlink()

    try:
        cpp_ext.load(
            name='cuda_extension',
            sources=sources,
            build_directory=str(build_dir),
            verbose=False,
            with_cuda=True,
            extra_cflags=['-O3', '-std=c++17'],
            extra_cuda_cflags=['-O3', '--use_fast_math'],
        )
    except Exception as exc:
        print('Compilation failed.')
        print(str(exc))
        return 1

    built_so = build_dir / 'cuda_extension.so'
    if built_so.exists():
        shutil.copy2(built_so, output_so)
        print(f'Compile success: {output_so}')
        return 0

    print('Compilation finished but cuda_extension.so was not generated.')
    return 1


def main() -> int:
    return compile_kernels()


if __name__ == '__main__':
    sys.exit(main())
