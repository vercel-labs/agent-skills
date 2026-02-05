# Canonical Agent Prompt Template

Use this template as the foundation for generating prompts for agentic systems.

## Template Structure

```markdown
## SYSTEM / ROLE
You are a [specific role] with authority over [explicit scope].
You must not exceed the following boundaries:
- [Limits on authority, scope, or actions]

## TASK
Your objective is:
[Single clear goal in one sentence]

## CONTEXT
<context>
[Relevant background, constraints, or environment]
</context>

## INSTRUCTIONS
Follow these steps:
1. [First step]
2. [Second step]
3. [Third step]

Constraints:
- [Specific limits or requirements]
- [Format requirements]

Output format:
- [Expected output structure]

## DECISION FRAMEWORK
When choosing between options:
- Prefer [criteria A] over [criteria B]
- If uncertain, [fallback strategy]
- Avoid [undesired outcomes]

## TOOL USAGE (if applicable)
Available tools:
- [Tool name]: [Usage rules and constraints]
- [Tool name]: [Usage rules and constraints]

Tool constraints:
- [Permissions and limitations]

## STOP CONDITION
Stop when:
- [Success criteria met]
- [Maximum iterations reached]
- [Specific condition occurs]
```

## Section Guidelines

### SYSTEM / ROLE
- Define specific expertise (not just "expert")
- Set clear scope boundaries
- Explicitly state what the agent must NOT do

### TASK
- Single, clear objective
- One sentence preferred
- Avoid compound or multi-part goals

### CONTEXT
- Background information relevant to the task
- Environmental constraints
- Prerequisites or assumptions

### INSTRUCTIONS
- Numbered steps for sequential workflows
- Constraints section for requirements
- Output format specification

### DECISION FRAMEWORK
- Guidance for autonomous decision-making
- Preferences when multiple options exist
- Fallback strategies for uncertainty

### TOOL USAGE (if applicable)
- List all available tools
- Usage rules for each tool
- Permissions and limitations

### STOP CONDITION
- Success criteria
- Iteration limits
- Termination conditions

## Template Variations

### For Tool-Using Agents (ReAct)
Include the TOOL USAGE section with:
- Tool list with descriptions
- Usage patterns (e.g., "Use search() when information is missing")
- Constraints (e.g., "Maximum 3 tool calls per cycle")

### For Planning Agents
Emphasize:
- Decision framework with prioritization criteria
- Multiple solution consideration (Tree of Thoughts)
- Evaluation metrics for comparing options

### For Conversational Agents
Simplify:
- Remove numbered instructions
- Emphasize tone and style
- Include conversation flow guidelines

### For Simple Task Agents
Minimal structure:
- ROLE
- TASK
- Output format only
