---
description: |
  初始化中断记录 git 仓库（一次性）。
  交互引导选择仓库路径和 git remote。
  触发词：interrupt-init, 初始化中断仓库。
---

# /interrupt-init — 中断记录仓库初始化

交互引导用户创建中断记录的 git 仓库。只需运行一次。

## 流程

1. **AskUserQuestion**: "中断记录仓库放在哪里？（默认 ~/w/interrupts，直接回车使用默认）"
   - 用户回复路径 → 使用该路径
   - 用户回复空 / 回车 / "默认" → 使用 `~/w/interrupts`

2. **AskUserQuestion**: "Git remote URL？（如 git@github.com:user/interrupts.git，没有可跳过）"
   - 用户回复 URL → 传给脚本
   - 用户回复 "跳过" / 空 → 不设置 remote

3. **执行初始化脚本**:
```bash
bash ~/.claude/skills/interrupt-record/scripts/init-repo.sh "<仓库路径>" "<remote_url>"
```

4. **报告结果**: 简洁输出仓库状态（路径、是否有 remote、目录结构）

## 幂等

已存在的部分自动跳过，只补缺的。可以安全重复运行。
