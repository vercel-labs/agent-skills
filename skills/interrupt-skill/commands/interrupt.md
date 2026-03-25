---
description: |
  记录中断到全局仓库（自动整理模式）。
  用户随意写一段话，AI 自动提取结构化字段并存放。
  触发词：interrupt, 中断记录, 记录中断。
  用法：/interrupt <随意描述当前任务状态>
---

# /interrupt — 中断记录（自动整理）

用户参数: $ARGUMENTS

## 前置检查

检查 `~/w/interrupts/` 是否存在且是 git 仓库。如果不是，提示用户先运行 `/interrupt-init`，然后停止。

## 流程

1. **读取用户输入**: `$ARGUMENTS` 中的文本（用户随便写的，不要求格式）

2. **AI 自动提取并整理为以下结构**:

```markdown
## {任务名}

停在：{当前卡在哪一步}

已确认：
- {confirmed_1}
- {confirmed_2}

未确认：
- {unresolved_1}

下一步：
1. {next_step_1}
2. {next_step_2}

激活词：{关键词1}；{关键词2}
```

提取规则：
- **任务名**: 从描述中提取核心任务，简洁概括
- **停在**: 当前进度/卡点
- **已确认**: 已验证的结论（没有则省略此段）
- **未确认**: 存疑的问题（没有则省略此段）
- **下一步**: 接下来要做什么（没有则省略此段）
- **激活词**: 能触发记忆的关键词，从描述中提取

最小记录 = 任务名 + 停在 + 激活词（其余可省略）

3. **生成 slug**: 从任务名取关键词，kebab-case，纯 ASCII（中文用拼音或英文概括），最长 30 字符

4. **生成文件名**: 用 `date +%Y-%m-%d-%H%M%S` 获取时间戳，拼成 `YYYY-MM-DD-HHMMSS-{slug}.md`

5. **写入文件**: 用 Write 工具写到 `~/w/interrupts/active/{文件名}`

6. **Git 同步**:
```bash
cd ~/w/interrupts && git pull --rebase 2>/dev/null; git add active/ && git commit -m "interrupt: {任务名简述}" && git push 2>/dev/null || true
```

7. **输出确认**: 简洁报告文件路径和记录摘要
