# 假分诊（fake-triage）反例样本

> 来源：change-mode/red-flags.md
> 目的：把 5 个典型反例用"完整对话形式"沉淀

## 反例 1：只排顺序不给路由

### 场景
用户：今天要做 5 件事：写公众号、写小红书、做 SKILL、回邮件、清理桌面

### ❌ 假分诊
```text
【分诊计划】
1. 写公众号
2. 写小红书
3. 做 SKILL
4. 回邮件
5. 清理桌面
（没说每个用什么 skill 做）
```

### ✅ 真分诊
```text
【分诊计划】
1. [P0] 做 SKILL 中最关键的 1 个（高不确定优先）→ `skill-creator`
2. [P1] 写公众号 → `original-writing`
3. [P1] 写小红书 → `ad-copywriting` + `advanced-xhs-visual-design`
4. [P2] 回邮件 → 直接干（无 skill）
5. [P3] 清理桌面 → 砍掉
```

---

## 反例 2：路由指向自己

### 场景
用户：帮我把公众号 + 小红书 + 视频都做了

### ❌ 假分诊
```text
【分诊计划】
1. 写公众号 → original-writing
2. 改大纲 → requirement-clarifier  ← 错！路由回自己
3. 写完再改 → requirement-clarifier  ← 错！再回
4. 写小红书 → ad-copywriting
5. 检查 → requirement-clarifier  ← 错！无限循环
```

### ✅ 真分诊
```text
【分诊计划】
1. 写公众号 → original-writing（让用户直接给反馈，不路由回 requirement-clarifier）
2. 写小红书 → ad-copywriting
3. 拍视频 → video-transcribe / original-writing
4. 全部发布 → wechat-mp-auto / xiaohongshu-auto
```

---

## 反例 3：忽略不确定性

### 场景
用户：我要做 3 件事：写公众号、写小红书、拍视频

### ❌ 假分诊
```text
【分诊计划】
1. 写公众号（已有 SOP，低不确定）
2. 写小红书（首次做，高不确定）  ← 错！低不确定任务在前
3. 拍视频（已有 SOP，低不确定）
（高不确定任务被排后 → 后面踩坑时已经投入大量时间在低不确定任务上）
```

### ✅ 真分诊（按 fail fast 原则）
```text
【分诊计划】
1. 写 1 篇小红书风格文章（首次做，高不确定）→ 用最小成本试错
2. 根据反馈改 SOP
3. 写公众号（已有 SOP，低不确定）→ 标准化
4. 拍视频（已有 SOP，低不确定）→ 批量化
```

---

## 反例 4：P0 灌水

### 场景
用户：今天要做 5 件事

### ❌ 假分诊
```text
【分诊计划】
1. [P0] 写公众号
2. [P0] 写小红书
3. [P0] 做 SKILL
4. [P0] 投资人 meeting
5. [P0] 清理桌面  ← 错！低影响 + 低紧急
（5 个 P0 = 没有 P0）
```

### ✅ 真分诊
```text
【分诊计划】
1. [P0] 投资人 meeting（高影响 + 高紧急）→ 直接干
2. [P0] 做 SKILL 中最关键的 1 个（高影响 + 高不确定）→ skill-creator
3. [P1] 写公众号（高影响 + 中紧急）→ original-writing
4. [P1] 写小红书（高影响 + 中紧急）→ ad-copywriting
5. [P3] 清理桌面（低影响 + 低紧急）→ 砍掉 / 周末做
```

---

## 反例 5：跳过依赖关系

### 场景
用户：要做 4 件事：写公众号、做封面、写小红书、录制视频

### ❌ 假分诊
```text
【分诊计划】
1. 写公众号
2. 做封面
3. 写小红书
4. 录制视频
（没说哪个依赖哪个 → 用户开干发现全部要重排）
```

### ✅ 真分诊
```text
【分诊计划】
1. 写公众号（P0，强依赖）→ original-writing
2. 写小红书（P0，独立）→ ad-copywriting
   ↳ 可与 #1 并行
3. 录制视频（P1，强依赖 #1）→ video-transcribe
4. 做公众号封面（P1，弱依赖 #1）→ advanced-xhs-visual-design
   ↳ 可与 #3 并行

总时长：3 天（vs 串行 5 天）
```

---

## 识别要点（速查表）

| 反例 | 关键识别词 |
|---|---|
| 反例 1（无路由） | 任务列表无 skill 名 |
| 反例 2（自路由） | 出现 "→ requirement-clarifier" |
| 反例 3（无不确定） | 没标"不确定"维度 |
| 反例 4（P0 灌水） | P0 数 > 2-3 |
| 反例 5（无依赖） | 没说"依赖" / "可并行" |
