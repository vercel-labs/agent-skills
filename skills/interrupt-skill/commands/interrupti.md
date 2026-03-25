---
description: |
  记录中断到全局仓库（交互引导模式）。
  用 AskUserQuestion 逐步引导填写每个字段。
  触发词：interrupti, 交互中断记录。
  用法：/interrupti
---

# /interrupti — 中断记录（交互引导）

## 前置检查

检查 `~/w/interrupts/` 是否存在且是 git 仓库。如果不是，提示用户先运行 `/interrupt-init`，然后停止。

## 流程

逐步用 AskUserQuestion 引导用户填写。每步都可以输入"跳过"或留空。

1. **AskUserQuestion**: "你刚才在做什么任务？（简要描述）"
   → 必填，这是任务名

2. **AskUserQuestion**: "停在了哪一步？（当前卡在哪里）"
   → 必填，这是当前进度

3. **AskUserQuestion**: "有什么已经确认的结论？（没有可跳过）"
   → 可选

4. **AskUserQuestion**: "有什么未确认/存疑的问题？（没有可跳过）"
   → 可选

5. **AskUserQuestion**: "下一步打算做什么？（没有可跳过）"
   → 可选

6. **AskUserQuestion**: "用什么关键词能让你下次想起这个任务？"
   → 必填，这是激活词

## 整理

将用户回答整理为格式化 MD：

```markdown
## {任务名}

停在：{停在哪}

已确认：
- {confirmed}

未确认：
- {unresolved}

下一步：
1. {next_step}

激活词：{关键词}
```

省略用户跳过的段落。最小记录 = 任务名 + 停在 + 激活词。

## 存放

1. **生成 slug**: 从任务名取关键词，kebab-case，纯 ASCII，最长 30 字符
2. **生成文件名**: `YYYY-MM-DD-HHMMSS-{slug}.md`
3. **写入**: `~/w/interrupts/active/{文件名}`
4. **Git 同步**:
```bash
cd ~/w/interrupts && git pull --rebase 2>/dev/null; git add active/ && git commit -m "interrupt: {任务名简述}" && git push 2>/dev/null || true
```
5. **输出确认**: 简洁报告文件路径和记录摘要
