---
name: change-mode
description: |
  任务分诊模式（change）——对明确的任务进行复杂度判断、优先级排序和路由建议。
  触发词：这些任务怎么排序、先做哪个、有哪些实现路径、帮我分诊。
  路由自：requirement-clarifier（当用户有多个任务需要排序或选择时）。
  不要用于：模糊需求（用 growme-mode）、审查已有方案（用 improve-mode）、单个明确小问题（用 AskUserQuestion）。
---

# change 模式 · 任务分诊

> **一句话钩子**：**任务堆不是清单，是决策树——不排优先级就动手 = 越努力越乱。**

把任务堆变成有顺序、有路由、有依赖关系的执行计划。本模式**只分诊不执行**——输出执行计划后路由到具体执行 skill。

---

## 核心定位

三个动作：
1. **按复杂度分桶**：小（≤ 2 步）/ 中（3-5 步）/ 大（6+ 步）
2. **三维评分**：影响度 / 紧急度 / 不确定性（各 高/中/低）
3. **排序 + 路由**：P0/P1/P2/P3 四象限 + 30+ skill 路由对照表

---

## 工作流

### 步骤 1：按复杂度分桶

收到任务列表后，先按复杂度分桶：

| 复杂度 | 特征 | 处理方式 |
|---|---|---|
| **小** | ≤ 2 步，1-2 小时内能完成 | 直接给方案，无需拆解 |
| **中** | 3-5 步，需要简短计划 | 给计划 + 关键决策点 |
| **大** | 6+ 步，需要分阶段 | 给阶段方案 + 里程碑 |

详见 `references/complexity-rubric.md`。

**判断陷阱**：
- ❌ "小"任务扎堆（10 个小任务 = 实际上是个中任务）
- ❌ "大"任务强拆成小任务（任务颗粒度 = 2-5 天的工作量）

### 步骤 2：三维评分

对每项任务标注三个维度：

#### 影响度（Impact）
- **高**：直接影响核心目标 / 不做会失败
- **中**：做了有提升，不做不至于崩
- **低**：锦上添花

#### 紧急度（Urgency）
- **高**：deadline 在 1 周内 / 不做会卡住其他任务
- **中**：deadline 在 1 月内
- **低**：deadline 在 3 月外 / 没有明确 deadline

#### 不确定性（Uncertainty）
- **高**：从未做过 / 不知道怎么做 / 风险未知
- **中**：做过类似的，需要小试
- **低**：做过多次，闭眼能上

### 步骤 3：四象限优先级矩阵

```
         高紧急                低紧急
高影响 │  P0 立刻做         │  P1 计划做          │
       │  （启动 + 推到完成） │  （排进月度计划）   │
       ├──────────────────┼──────────────────┤
低影响 │  P2 委托/快速做    │  P3 砍掉/排队      │
       │  （能外包就外包）  │  （如果时间多就做）│
       └──────────────────┴──────────────────┘
```

**P0 立刻做** | 启动成本低、影响大、不做会卡住后续
**P1 计划做** | 影响大但不紧急 → 排进长期计划
**P2 委托做** | 紧急但低影响 → 能外包就外包
**P3 砍掉/排队** | 紧急度低 + 影响低 → 砍掉 / 排到"如果有空"

详见 `references/priority-matrix.md`。

### 步骤 4：路由到具体 skill（核心！）

每项任务必须**指向一个具体 skill**（详见 `references/routing-table.md`）。

**合法例外**（不视为违反"每项任务路由到 skill"原则）：
- 任务类型不在 30+ skill 路由表内（如 meeting、吃饭、出门）→ 标 `直接干` + 附"为什么不需要 skill"一句话（如"meeting 靠人不是 skill"）
- 任务跨多个 skill → 标主+辅（如 `yizhou-thinking` + `deep-research`）
- 任务没有合适 skill → 标 `待开发` 或 `用通用 Agent`

#### 内容创作类
| 任务 | 路由到 |
|---|---|
| 公众号/小红书长文原创 | `original-writing` |
| 商单/广告文案 | `ad-copywriting` |
| 视频脚本 | `original-writing` + 平台适配 |
| 小红书图文卡片 | `advanced-xhs-visual-design` |
| 改写/翻译/去 AI 味 | `content-rewrite` / `humanizer` / `ai-polish` |

#### 设计与开发类
| 任务 | 路由到 |
|---|---|
| 前端代码 | `frontend-design` |
| UI/UX 设计 | `ui-ux-pro-max` |
| 设计系统建立 | ⚠️ 原 `design-consultation` 已于 2026-06-14 归档;建议 `design-md-brand-kit` + `frontend-design` 组合 |
| 写代码 / 调试 | `coding-agent` |
| 代码审查 | `code-review` |
| 网站部署 | `land-and-deploy` |

#### 业务与战略类
| 任务 | 路由到 |
|---|---|
| 商业判断 / 战略决策 | `yizhou-thinking` / `insight` |
| 财务分析 | `finance-assistant` |
| 投资研究 | `us-stock-analysis` |
| 需求澄清（模糊任务） | `requirement-clarifier`（注意：不路由回自己） |
| AI 替代风险评估 | `AI-jobs-China` |

#### 调研与学习类
| 任务 | 路由到 |
|---|---|
| 深度调研 | `deep-research` |
| 笔记整理 / 学习 | `notes-research` / `knowledge-palace` |
| 看书 / 视频转录 | `video-transcribe` / `original-writing` |

#### 数据与媒体类
| 任务 | 路由到 |
|---|---|
| 数据分析 / 可视化 | `finance-assistant` / `us-stock-analysis` |
| 抓网页 / 抓数据 | `content-scraper` / `browser-automation` |
| 视频号分析 | `video-account-analysis` |
| 视频处理 | `video-transcribe` / `openmontage` |

#### 技能治理类（元 skill）
| 任务 | 路由到 |
|---|---|
| 写新 Skill | `skill-creator` |
| 审查 / 精修 Skill | `skill-vetter` / `luban` |
| 工作流编排 | `workflow-builder` / `autoplan` |

#### 工具与浏览器
| 任务 | 路由到 |
|---|---|
| 调用外部 API | `api-gateway` |
| 浏览器自动化 | `browser-automation` |
| 网页内容提取 | `defuddle` / `content-scraper` |
| 性能基准测试 | `benchmark` |

#### Obsidian / 知识管理
| 任务 | 路由到 |
|---|---|
| Obsidian 操作 | `obsidian-cli` / `obsidian-markdown` |
| 笔记整理 | `capture` / `quick-note` |
| 想法捕捉 | `idea` |

### 步骤 5：依赖与并行

详见 `references/parallel-dependency.md`：
- 强依赖：B 必须在 A 完成后才能开始
- 弱依赖：B 最好在 A 完成后做，但可并行
- 无依赖：完全独立

---

## 输出"分诊计划"模板

```text
【分诊结果】

📋 任务列表（共 X 项）：
| # | 任务 | 复杂度 | 影响 | 紧急 | 不确定 | 优先级 | 路由到 |
|---|------|--------|------|------|--------|--------|--------|
| 1 | XX | 中 | 高 | 高 | 中 | P0 | `original-writing` |
| 2 | YY | 大 | 高 | 中 | 高 | P1 | `skill-creator` |
| ... |

📊 优先级矩阵（按执行顺序）：
1. [P0] 立刻做：[任务 1] → 路由到 `XX`
2. [P1] 计划做：[任务 2] → 路由到 `XX`
3. [P2] 委托做：[任务 3] → 路由到 `XX`
4. [P3] 砍掉：[任务 X]

🔗 依赖关系：
- 任务 1 → 任务 2（强依赖）
- 任务 3、4 可并行

⏱ 时间预估：
- 任务 1：X 天
- 任务 2：Y 周
- 总计：Z 周

⚠️ 风险点：
- 任务 1 涉及外部 API 不可用 → 备选方案 XX
- 任务 2 首次做不确定 → 先用最小成本试错
```

---

## Gotchas

### ❌ 假分诊（详见 `examples/fake-triage.md`）

1. **只排顺序不给路由**："先做 A，再做 B"——没说每个用什么 skill
2. **路由指向自己**："做完 A 后用 requirement-clarifier 再澄清"——分诊完又分诊，无限循环
3. **忽略不确定性**：把高不确定任务和低不确定任务同样安排 = 后面必崩
4. **P0 灌水**：把"清理桌面"也拉进 P0 = 真 P0 反而被淹没
5. **跳过依赖关系**：没说任务 2 必须在任务 1 完成后 = 用户开干发现卡住

### ✅ 完成度判断

输出前问：
> "用户拿这份分诊计划能直接开干吗？"

- 能 → 完成
- 不能 → 哪一步还缺？回去补
- 拿不准 → 标注"需用户确认 XX 后再开干"

---

## 何时读取 references

- **复杂度判断尺** → `references/complexity-rubric.md`
- **四象限矩阵 + 杠杆率** → `references/priority-matrix.md`
- **30+ skill 路由对照表**（完整版）→ `references/routing-table.md`
- **依赖与并行判定** → `references/parallel-dependency.md`

---

## 字数

- SKILL.md 本体：≤ 250 行（当前 ~200 行，达标）
- references/ 拆 4 个文件，按需加载
