# Anti-Pattern Warnings

Common mistakes to avoid when designing prompts for agentic systems.

## Critical Anti-Patterns

### Do not use ReAct without tools
ReAct is designed for tool-using agents. Using ReAct reasoning patterns when no tools are available adds unnecessary complexity and may confuse the agent.

**Avoid**: "Thought: I should search... Action: search()" when no search tool exists

### Do not request chain-of-thought for trivial tasks
For simple tasks that don't require reasoning, requesting explicit thinking adds cost and latency without benefit.

**Avoid**: "Think step-by-step about how to add these numbers" for basic arithmetic

### Do not mix conflicting constraints
Agents cannot satisfy contradictory requirements. Conflicting constraints lead to unpredictable behavior.

**Avoid**: "Be concise but provide extensive detail" or "Be creative but follow the template exactly"

### Do not use vague roles
Roles without specific expertise or scope boundaries provide little benefit.

**Avoid**: "You are an expert" (expert in what? What are the boundaries?)

**Prefer**: "You are a senior Python developer specializing in API authentication"

### Do not use few-shot with inconsistent examples
Inconsistent examples teach the wrong patterns and degrade output quality.

**Avoid**: Examples with different formats, styles, or approaches

### Avoid monolithic, unstructured prompts
Long prompts without clear sections are difficult for agents to parse and follow.

**Prefer**: Structured sections (ROLE, TASK, CONTEXT, INSTRUCTIONS, etc.)

### Avoid Tree of Thoughts for single-solution problems
Tree of Thoughts is designed for exploring alternatives. For deterministic problems with one correct answer, it adds unnecessary complexity.

**Use CoT instead** for: Mathematical calculations, factual queries, deterministic transformations

### Avoid omitting stop conditions
Agents that don't know when to stop may continue indefinitely or produce excessive output.

**Always include**: Success criteria, output limits, or stop conditions

### Avoid missing error handling
Agents that encounter errors without guidance may fail unpredictably.

**Always include**: Fallback behaviors, error messages, or retry logic

### Avoid unclear tool permissions
Agents need explicit guidance on what tools they can use and any constraints.

**Always include**: Available tools list, usage rules, and permissions
