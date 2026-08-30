# LiteRT Skill for Claude Code

A Claude Code skill for **Google LiteRT** — the universal framework for on-device AI (successor to TensorFlow Lite).

## Installation

```bash
npx skills add farmhutsoftwareteam/litert-skill
```

Or manually clone to your skills directory:

```bash
git clone https://github.com/farmhutsoftwareteam/litert-skill ~/.claude/skills/litert
```

## What This Skill Provides

This skill gives Claude Code expertise in deploying ML and GenAI models on edge devices using LiteRT.

### Coverage

| Topic | Description |
|-------|-------------|
| **GPU Acceleration** | OpenCL, OpenGL, Metal, WebGPU setup with zero-copy buffers |
| **NPU Acceleration** | Qualcomm & MediaTek support, AOT/JIT compilation |
| **LiteRT-LM** | Deploy LLMs (Gemma, Phi, Qwen) on device |
| **Model Conversion** | PyTorch, TensorFlow, JAX → .tflite |
| **Migration** | TensorFlow Lite → LiteRT migration guide |

### Supported Platforms

| Platform | CPU | GPU | NPU |
|----------|-----|-----|-----|
| Android | ✅ | ✅ | ✅ |
| iOS | ✅ | ✅ | Soon |
| macOS | ✅ | ✅ | Soon |
| Windows | ✅ | ✅ | Soon |
| Linux | ✅ | ✅ | — |
| Web | ✅ | ✅ | Soon |

## When This Skill Triggers

- Working with `.tflite` models
- On-device ML/AI inference
- Mobile ML deployment (Android/iOS)
- GPU/NPU hardware acceleration
- Running models like Gemma on device
- Migrating from TensorFlow Lite

## Skill Structure

```
litert-skill/
├── SKILL.md                    # Main skill file
└── references/
    ├── gpu-acceleration.md     # GPU setup & optimization
    ├── npu-acceleration.md     # NPU setup & vendor support
    ├── litert-lm.md            # LLM deployment
    ├── model-conversion.md     # Model conversion guides
    └── migration.md            # TFLite migration
```

## Resources

- [LiteRT Documentation](https://ai.google.dev/edge/litert)
- [LiteRT GitHub](https://github.com/google-ai-edge/LiteRT)
- [LiteRT-LM GitHub](https://github.com/google-ai-edge/LiteRT-LM)

## License

MIT
