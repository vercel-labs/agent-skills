<sub>🌐 <b>中文</b> · <a href="README.en.md">English</a> (待补)</sub>

<div align="center">

# requirement-clarifier · 三模式分诊台

> *「先别动手——动手之前先回答"用户到底要什么、有多复杂、从哪里切入"三个问题。」*

[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-requirement--clarifier-blueviolet)](SKILL.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Methods: Luban](https://img.shields.io/badge/Methods-Luban-green)](../打磨报告/01-打磨报告.md)

**把"用户到底要什么、有多复杂、从哪里切入"三个问题先答完，再动手。**

[看效果](#效果示例) · [安装](#快速开始) · [触发方式](#触发方式) · [它和同类有什么不同](#它和同类有什么不同) · [安全边界](#安全边界)

</div>

---

## 它解决什么问题

事情是这样的——

你接到一句话需求："我想做一个 AI 教学的 skill。"

**你的第一反应是什么？**

90% 的人会直接开干。然后用 **3 小时返工**来补**3 分钟应该问清楚的问题**。

或者另一种情况：你手上有 8 个 skill 要精修，没人告诉你先做哪个——你按文件名顺序做，做完发现第 8 个才是 P0，前 7 个时间全白费。

或者你写了一份需求规格，发给同事，他问"你到底想要什么？"——你发现自己也答不清。

**本 skill 不替你写代码、不替你写文章、不替你做决策**——它只做一件事：**做"分诊台"**。把模糊的、堆叠的、说不清的需求，**先转成可执行方案**，再路由到具体的执行 skill。

它由**三个子模式**组成，按你问题的类型自动路由：

- **`growme-mode`**：把模糊想法变成需求规格
- **`change-mode`**：把任务堆变成带路由的执行计划
- **`improve-mode`**：把现成方案变成可改进清单

> 这是个**套件**，不是单 SKILL.md——三个子模式各自有独立 SKILL.md + references，可独立使用。

---

## 效果示例

### 示例 1：growme 模式（需求澄清）

**输入**：
> 用户：我想做一个 AI 教学的 skill

**输出**（节选）：
```text
【需求规格】

🎯 目标：3 个月内做出 1 个帮 35-45 岁中年转型者的 AI 教学 skill 案例

👥 受众：35-45 岁中年转型者，被 AI 替代风险吓到，希望快速出作品

⛓ 约束：时间 3 个月内；预算 1 万以内；零技术基础

📥 输入材料：仅有话题，无草稿

✅ 验收：DAU 100 + 至少 1 个付费转化

🚫 边界（v1 不做）：不建付费训练营 / 不做多平台分发

⚠️ 风险：受众定义不清 → 兜底：用 1 个真实用户访谈锁定

📌 关键假设：目标用户愿意为"案例作品"付费

【下一步路由】
- 任务堆不明确 → 加载 `change-mode` 排执行顺序
- 任务已明确 → 路由到 `skill-creator`
```

### 示例 2：change 模式（任务分诊）

**输入**：
> 用户：今天要做 5 件事：写公众号、写小红书、做 SKILL、跟一个投资人 meeting、清理桌面

**输出**（节选）：
```text
| # | 任务 | 复杂度 | 影响 | 紧急 | 不确定 | 优先级 | 路由到 |
|---|------|--------|------|------|--------|--------|--------|
| 1 | 投资人 meeting | 小 | 高 | 高 | 中 | P0 | 直接干 |
| 2 | 做 SKILL 中最关键的 1 个 | 大 | 中 | 低 | 高 | P0 | `skill-creator`（高不确定→ 优先）|
| 3 | 写公众号 | 中 | 高 | 中 | 低 | P1 | `original-writing` |
| 4 | 写小红书 | 中 | 高 | 中 | 中 | P1 | `ad-copywriting` |
| 5 | 清理桌面 | 小 | 低 | 低 | 低 | P3 | 砍掉 / 周末做 |

总时长：3 天（vs 串行 5 天）
```

### 示例 3：improve 模式（结构优化）

**输入**：
> 用户：帮我看看这个 SKILL.md 写得对不对？

**输出**（节选）：
```text
【改进清单】按杠杆率排序

🔴 P0（必须改）：
1. frontmatter 缺负触发说明
   → 在 description 段尾加"不要用于"清单
   → 成本：15 分钟 | 验收：description 含"不要用于"段落

2. 工作流第 3 节颗粒度太粗
   → 拆 3 个步骤为 6 个，每步给具体动作
   → 成本：30 分钟

🟡 P1（应该改）：
1. 缺 Gotchas 段落 → 加 5 条反例
2. 缺 test-prompts.json → 新建 6 个活体样本

你要我直接动手改，还是你自己改？
```

更多反例样本见 [`examples/`](examples/)。

---

## 快速开始

```bash
# 一行安装（待公开发布）
npx skills add yingzhengzhang06-sys/requirement-clarifier
```

装完对 Agent 说：

```text
帮我用 requirement-clarifier 看看"我想做一个 21 天 AI 写作训练营"该怎么开始
```

Claude Code plugin marketplace 双通道：

```json
{
  "plugin": "requirement-clarifier",
  "source": "yingzhengzhang06-sys/requirement-clarifier"
}
```

---

## 触发方式

**强触发**（直接调用）：
- "帮我想想 / 这个怎么做 / 我有个想法" → growme-mode
- "这些任务怎么排序 / 先做哪个 / 有哪些实现路径 / 帮我分诊" → change-mode
- "怎么优化 / 还有什么问题 / 帮我看看这个方案 / 审查一下" → improve-mode

**弱触发**：
- 收到一句话需求 + 没有验收标准
- 任务一摞 + 没说依赖关系
- 已有方案 + 用户表达"感觉哪里不对"

**不触发**：
- 信息已完全清楚 → **直接开干**
- 单个明确小问题 → 用 `AskUserQuestion`
- 已经是具体领域问题 → 路由到对应领域 skill

---

## 它和同类有什么不同

| 维度 | 同类做法（mattpocock / obra / addyosmani） | 本 skill |
|---|---|---|
| 模式 | 单一澄清（grill-me / brainstorming） | **三模式统一**（growme + change + improve） |
| 路由 | 直接给方案 / 写代码 | **路由到具体执行 skill**（30+ skill 路由表） |
| 语言 | 英文为主 | **中文场景原生**，跨 runtime 中性 |
| 形态 | 单 SKILL.md | **套件**：3 个独立子 skill + 路由器 |
| 输出 | 自由文本 | **结构化输出模板**（需求规格 / 分诊表 / 改进清单） |
| 验证 | 缺失 | **6 个 test-prompts.json 活体样本** + 5 条自检 |

**关键差异化**：本 skill 公开**30+ skill 路由对照表**——任何用户装本 skill 等于装了一份"全 skill 路由地图"。

---

## 安全边界

**不会做的事**：
- ❌ 不代替执行——本 skill 是"分诊台"不是"手术室"
- ❌ 不为了用而用——信息已清楚直接开干
- ❌ 不预设领域——前端/后端/内容/商业都适配
- ❌ 不路由回自己——分诊完必须指向其他 skill

**会停手问用户的情况**：
- 信息缺口 > 5 个时分批追问
- 任务依赖关系不清时让用户确认
- 改进清单超过 7 个时让用户选杠杆率最高的

---

## 文件结构

```
requirement-clarifier/             ← 套件根目录
├── SKILL.md                       ← 路由器主入口
├── growme-mode/                   ← 子模式 1：需求澄清
│   ├── SKILL.md
│   └── references/
│       ├── seven-dimensions.md    ← 7 大追问维度
│       ├── ask-question-toolkit.md ← AskUserQuestion 工具
│       └── red-flags.md           ← 假澄清反例
├── change-mode/                   ← 子模式 2：任务分诊
│   ├── SKILL.md
│   └── references/
│       ├── complexity-rubric.md   ← 复杂度判断
│       ├── priority-matrix.md     ← P0/P1/P2/P3 矩阵
│       ├── routing-table.md       ← 30+ skill 路由对照
│       ├── parallel-dependency.md ← 依赖与并行
│       └── red-flags.md           ← 假分诊反例
├── improve-mode/                  ← 子模式 3：结构优化
│   ├── SKILL.md
│   └── references/
│       ├── seven-leverage-points.md ← 7 类改进点
│       ├── smart-criteria.md      ← SMART 原则
│       └── red-flags.md           ← 假改进反例
├── examples/                      ← 反例样本
│   ├── fake-clarification.md
│   ├── fake-triage.md
│   └── fake-improve.md
├── test-prompts.json              ← 6 个活体测试样本
├── README.md                      ← 本文件
├── LICENSE                        ← MIT
└── .claude-plugin/
    └── marketplace.json           ← plugin 双通道
```

---

## 验证与测试

跑下面 6 个活体测试：

```bash
# TC-01: growme 模糊需求 → 应追问 ≤ 5 个问题，不直接给方案
# TC-02: change 多任务 → 应按 P0/P1/P2/P3 排序，每项路由到具体 skill
# TC-03: improve 审查 → 应按杠杆率 ≤ 7 个改进，SMART 动作
# TC-04: 串行模式 → growme → change 串行
# TC-05: 不触发边界 → 信息清楚时不调用
# TC-06: 完整分诊样本 → 验证输出格式
# TC-07: 套件路由 → 路由器应路由到子 skill
# TC-08: 三模式反例 → 至少各识别 1 个假模式
```

详见 `test-prompts.json`。

---

## 致谢

- **方法论来源**：[鲁班工坊](https://github.com/yingzhengzhang06-sys)（luban）的八步打磨流程
- **核心借鉴**：
  - [mattpocock/skills — grill-me](https://github.com/mattpocock/skills) — 极简 frontmatter + 附推荐答案
  - [addyosmani/agent-skills — interview-me](https://github.com/addyosmani/agent-skills) — "用用户原话复述"终止条件
  - [obra/superpowers — brainstorming](https://github.com/obra/superpowers) — Anti-Pattern 段落金句
  - [garrytan/gstack — office-hours](https://github.com/garrytan/gstack) — 自动/人工决策分流

---

## License

[MIT](LICENSE)

---

<div align="center">

*工坊规矩：先验料，再动手；先访行，再谈差异；先量尺，再决定保留。*

</div>
