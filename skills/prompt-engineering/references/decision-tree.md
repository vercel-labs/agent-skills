# Prompt Technique Selection Decision Tree

Use this decision tree to systematically select the appropriate prompting technique for an agentic system.

## Decision Tree

### Step 1: Does the agent use tools autonomously?
- **Yes → ReAct** (Reasoning + Acting loop couples thought and action)
- **No → Step 2**

### Step 2: Is the task multi-step or reasoning-heavy?
- **Yes → Step 3**
- **No → Step 5**

### Step 3: Are there multiple viable solution paths?
- **Yes → Tree of Thoughts** (Explores alternatives for planning/strategy)
- **No → Step 4**

### Step 4: Is correctness more important than speed?
- **Yes → Self-Consistency** (Multiple reasoning paths for verification)
- **No → Chain of Thought** (Single-path reasoning)

**Alternative for factual accuracy**: Use **Chain-of-Verification (CoVe)** when reducing hallucinations is more important than reasoning consistency

### Step 5: Is a consistent behavior, format, or tone required?
- **Yes → Few-Shot** (Examples establish patterns)
- **No → Step 6**

### Step 6: Is the task simple and well-defined?
- **Yes → Zero-Shot** (Minimal overhead for clear tasks)
- **No → Step 7**

### Step 7: Is a specific domain expertise required?
- **Yes → Role Prompting** (Narrows reasoning space with expertise)
- **No → Instruction Tuning** (Structured, numbered instructions)

## Quick Reference Table

| Agent Characteristic | Recommended Technique |
|---------------------|----------------------|
| Uses tools autonomously | ReAct |
| Planning/strategy with alternatives | Tree of Thoughts |
| High-stakes correctness | Self-Consistency |
| Factual accuracy, hallucination reduction | Chain-of-Verification (CoVe) |
| Single-path complex reasoning | Chain of Thought |
| Requires consistent format/tone | Few-Shot |
| Simple, well-defined task | Zero-Shot |
| Domain-specific expertise | Role Prompting |
| Procedural workflow | Instruction Tuning |
