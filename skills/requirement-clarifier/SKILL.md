---
name: requirement-clarifier
description: |
  Three-mode triage station for ambiguous requests — turns vague intent into a requirement spec, a task pile into a routed execution plan, and an existing plan into an improvement checklist. Use when the user says "help me think this through", "I have an idea", "how do I prioritize these", "which one first", "how to optimize", "review my plan", or when context contains uncertainty (one-line request with no acceptance criteria, task pile with no stated dependencies, plan where something feels off). Triggers on skill design, content planning, business judgment, course design, unclear requirements documents, piled-up tasks with no obvious starting point, and scheme validation.
  Do NOT use when: information is fully clear (just start), single small question (use AskUserQuestion), or already a specific domain question (route to that domain's skill).
license: MIT
metadata:
  author: yingzhengzhang06-sys
  version: "3.0.0"
---

# 需求澄清与任务分诊（Grow / Change / Improve）

> **一句话钩子**：**先别动手——动手之前先回答"用户到底要什么、有多复杂、从哪里切入"三个问题。**

它是"分诊台"——不预设领域、不替你执行。把模糊想法变成结构化需求，把任务堆变成带路由的执行顺序，把现成方案变成可改进清单。**然后明确指出下一个该用的 skill**，自己不接活。

本 skill 是**路由器**，按用户问题分派到三个子 skill：

- `growme-mode` —— 需求澄清（"帮我想想"）
- `change-mode` —— 任务分诊（"先做哪个"）
- `improve-mode` —— 结构优化（"怎么改"）

---

## 核心定位

任何"不太确定从哪下手"的请求，都先走本 skill 一次。三个动作：

1. **澄清（growme）**：把模糊想法变成可执行需求
2. **分诊（change）**：把任务堆变成执行顺序
3. **改进（improve）**：把现成方案变成可优化清单

回答用户的三个本质问题：
- 你到底要什么？（growme 输出"需求规格"）
- 该从哪开始？（change 输出"执行顺序"）
- 现在这样对吗？（improve 输出"改进点"）

---

## 路由分派规则

收到用户输入后，先判断属于哪种模式（**可多选、可串行**）：

| 用户特征 | 模式 | 例子 | 路由到 |
|---|---|---|---|
| 表达了结果但路径不清晰 | **growme** | "我想做一个 AI 教学 skill" | `growme-mode` |
| 有多个任务需要排序或选择 | **change** | "我手上有 8 个 skill 要精修" | `change-mode` |
| 已有方案但不确认是否最优 | **improve** | "你看这个 SKILL.md 写得对不对" | `improve-mode` |

**判定原则**：
- 多数请求先做 growme（澄清），再决定要不要串 change / improve
- 串行顺序：**growme → change → improve**（先搞清楚要什么，再排序，再审查方案）
- 明确告知用户当前判断的模式，让用户确认或纠正
- 不需要分诊时直接说"不需要"，不要为了用 skill 而用
- 单次对话内可能涉及多个模式——按需串行调用

**不要路由回自己**：分诊完必须指向其他执行 skill，不允许"做完 A 后再用 requirement-clarifier 澄清"。

---

## 触发场景

**强触发**（直接调用）：
- "帮我想想 / 这个怎么做 / 我有个想法" → growme-mode
- "这些任务怎么排序 / 先做哪个 / 有哪些实现路径 / 帮我分诊" → change-mode
- "怎么优化 / 还有什么问题 / 帮我看看这个方案 / 审查一下" → improve-mode

**弱触发**（上下文里有"不确定"语义时调用）：
- 收到一句话需求 + 没有验收标准
- 任务一摞 + 没说依赖关系
- 已有方案 + 用户表达"感觉哪里不对"
- 团队多人对同一目标描述不一致

**不触发**（明确边界）：
- 信息已完全清楚 → **直接开干**，不要为了用 skill 而用
- 单个明确小问题（"X 怎么用"）→ 用 `AskUserQuestion` 直接问
- 已经是具体领域问题（"前端按钮怎么写"）→ 路由到 `frontend-design` / `ui-ux-pro-max` 等领域 skill
- 纯写作/纯翻译/纯生成 → 路由到 `original-writing` / `humanizer` / `content-rewrite`

---

## 输出格式（路由器视角）

```text
模式判断：growme / change / improve（可组合）

【growme】 → 加载 growme-mode（执行需求澄清）
【change】  → 加载 change-mode（执行任务分诊）
【improve】 → 加载 improve-mode（执行结构优化）

下一步建议：[具体路由到 XX skill / 直接执行 / 进一步澄清]
```

---

## 文件结构（本套件）

```
requirement-clarifier/             ← 路由器（你在这里）
├── SKILL.md                       ← 本文件：路由 + 触发 + 边界
├── growme-mode/                   ← 子 skill 1：需求澄清
│   ├── SKILL.md
│   └── references/
│       ├── seven-dimensions.md    ← 7 大追问维度
│       ├── ask-question-toolkit.md ← AskUserQuestion 使用技巧
│       └── red-flags.md           ← 常见假澄清反例
├── change-mode/                   ← 子 skill 2：任务分诊
│   ├── SKILL.md
│   └── references/
│       ├── complexity-rubric.md   ← 复杂度判断尺
│       ├── priority-matrix.md     ← P0/P1/P2/P3 矩阵
│       ├── routing-table.md       ← 30+ skill 路由对照表
│       └── parallel-dependency.md ← 依赖与并行
├── improve-mode/                  ← 子 skill 3：结构优化
│   ├── SKILL.md
│   └── references/
│       ├── seven-leverage-points.md ← 7 类改进点
│       ├── smart-criteria.md      ← SMART 原则
│       └── red-flags.md           ← 假改进反例
├── examples/                      ← 真实案例
│   ├── fake-clarification.md      ← 假澄清反例样本
│   ├── fake-triage.md             ← 假分诊反例样本
│   └── fake-improve.md            ← 假改进反例样本
├── test-prompts.json              ← 6 个活体测试样本 + 自检问题
├── README.md                      ← 套件门面（house-style 模板）
├── LICENSE                        ← MIT
└── .claude-plugin/
    └── marketplace.json           ← plugin 双通道
```

> **打磨报告**已移到 `精修skills/13-元skill与治理/打磨报告/requirement-clarifier-打磨报告.md`（集中存档，便于看所有 skill 打磨情况）。

---

## Gotchas（路由器层）

### ❌ 不要做的事

1. **不要"代替执行"**——本 skill 是"分诊台"不是"手术室"。澄清和分诊完成后**明确指向下一个执行 skill**
2. **不要"为了用而用"**——如果用户输入已足够清晰，直接确认即可
3. **不要"领域预设"**——不预设前端、后端、内容、商业等任何领域
4. **不要"路由回自己"**——分诊完不指向 requirement-clarifier，形成"分诊→执行→验证"闭环
5. **不要"跳过 growme 直接 change"**——任务堆的前提是"已经清楚要什么"，否则先澄清
6. **不要"一次问超过 5 个"**——多于 5 个 = 你没在抓重点
7. **不要"改进点超过 7 个"**——多于 7 个 = 你没在排序，在罗列

### ✅ 判断完成度的标准

输出前问自己：
> **"用户拿这份输出能直接开干吗？"**

- 能 → 完成
- 不能 → 哪一步还缺？回去补
- 拿不准 → 标注"需用户确认 XX 后再开干"

---

## 何时读取子 skill

- **growme 相关请求** → 加载 `growme-mode/SKILL.md` + `references/seven-dimensions.md`
- **change 相关请求** → 加载 `change-mode/SKILL.md` + `references/priority-matrix.md` + `references/routing-table.md`
- **improve 相关请求** → 加载 `improve-mode/SKILL.md` + `references/seven-leverage-points.md`
- **完成度自检** → 读取本文件 Gotchas 节

---

## 字数与结构

- SKILL.md 本体（路由器）：≤ 200 行（当前 ~150 行，达标）
- 子 skill SKILL.md：≤ 250 行
- 子 skill references/：按需加载，不灌进主上下文
- 总骨架文件数：≤ 20
