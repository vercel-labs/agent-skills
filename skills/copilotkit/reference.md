# CopilotKit — Complete API Reference

## Packages

| Package | Purpose |
|---------|---------|
| `@copilotkit/react-core` | Provider, hooks (useFrontendTool, useCopilotReadable, useCopilotChat, useCoAgent, etc.) |
| `@copilotkit/react-ui` | Chat components (CopilotChat, CopilotSidebar, CopilotPopup), styles, suggestions |
| `@copilotkit/runtime` | Self-hosted backend runtime (CopilotRuntime, adapters, endpoints) |
| `@copilotkit/runtime/v2` | v2 BuiltInAgent class |
| `@copilotkit/runtime-client-gql` | Client types (TextMessage, Role, MessageRole) |
| `@ag-ui/mcp-apps-middleware` | MCP Apps middleware for BuiltInAgent |
| `copilotkit` (Python) | CopilotKitState, LangGraph integration |

---

## Hooks — Full Parameter Reference

### useFrontendTool

```typescript
useFrontendTool({
  name: string;                    // Tool name (unique identifier)
  description: string;             // Natural language description for LLM
  parameters: Parameter[];         // Input parameter definitions
  handler: (args: T) => any;       // Execution function (runs in browser)
  render?: (props: RenderProps) => ReactElement;  // Optional inline UI
  disabled?: boolean;              // Disable tool availability
});
```

**Parameter type:**
```typescript
type Parameter = {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "string[]" | "number[]" | "boolean[]" | "object[]";
  description: string;
  required?: boolean;    // default: true
  enum?: string[];       // for string type only
  attributes?: Parameter[];  // for object/object[] nested fields
};
```

**RenderProps:**
```typescript
type RenderProps = {
  status: "inProgress" | "executing" | "complete";
  args: T;       // Streamed args (may be partial during inProgress)
  result?: any;  // Only available when status === "complete"
};
```

### useCopilotReadable

```typescript
const contextId: string = useCopilotReadable({
  description: string;            // What this data represents
  value: any;                     // Data (objects auto-serialized to JSON)
  parentId?: string;              // Parent context ID for hierarchy
  categories?: string[];          // Visibility categories
  available?: "enabled" | "disabled";
  convert?: (description: string, value: any) => string;  // Custom serializer
});
```

Returns a unique context ID (use as `parentId` for child contexts).

### useCopilotAction (v1, still supported)

```typescript
useCopilotAction({
  name: string;
  handler: (args: T) => Promise<any>;
  description?: string;
  available?: "enabled" | "disabled" | "remote";  // "remote" = only for remote agents
  followUp?: boolean;             // default: true — feed result back to LLM
  parameters?: Parameter[];
  render?: string | ((props: ActionRenderProps) => ReactElement);
  renderAndWaitForResponse?: (props: ActionRenderPropsWait) => ReactElement;
  dependencies?: any[];
});
```

**ActionRenderPropsWait** adds:
```typescript
{ respond: (result: any) => void }  // Must call to unblock; only available during "executing"
```

### useRenderToolCall

```typescript
useRenderToolCall({
  name: string;        // Must match a backend tool name
  description?: string;
  parameters?: Parameter[];
  render: (props: { status: string; args: T }) => ReactElement;
});
```

### useDefaultTool

```typescript
useDefaultTool({
  render: (props: { name: string; args: any; status: string; result?: any }) => ReactElement;
});
```

### useCopilotChat

```typescript
const {
  visibleMessages,    // Message[]
  appendMessage,      // (msg: TextMessage, opts?) => Promise
  setMessages,        // (msgs: Message[]) => void
  deleteMessage,      // (id: string) => void
  reloadMessages,     // (messageId: string) => Promise
  stopGeneration,     // () => void
  reset,              // () => void — clear all messages
  isLoading,          // boolean
  runChatCompletion,  // () => Promise
  mcpServers,         // MCPServerConfig[]
  setMcpServers,      // (servers: MCPServerConfig[]) => void
} = useCopilotChat({
  id?: string;                    // Shared state across components with same ID
  headers?: Record<string, string>;
  initialMessages?: Message[];
  makeSystemMessage?: SystemMessageFunction;
  disableSystemMessage?: boolean;
  suggestions?: "auto" | "manual" | SuggestionItem[];
  onInProgress?: (isLoading: boolean) => void;
  onSubmitMessage?: (content: string) => Promise | void;
  onStopGeneration?: OnStopGeneration;
  onReloadMessages?: OnReloadMessages;
});
```

### useCoAgent (LangGraph shared state)

```typescript
const { state, setState } = useCoAgent<StateType>({
  name: string;           // Agent name (must match backend)
  initialState?: StateType;
});
```

`state` is reactive — auto-updates when agent state changes.

### useCoAgentStateRender

```typescript
useCoAgentStateRender({
  name: string;           // Agent name
  render: (props: { state: StateType }) => ReactElement | null;
});
```

### useLangGraphInterrupt

```typescript
useLangGraphInterrupt({
  enabled?: (context: { eventValue: any }) => boolean;  // Conditional routing
  handler?: async (context: { result: any; event: any; resolve: Function }) => any;  // Pre-processing
  render: (props: { event: any; resolve: (value: any) => void; result?: any }) => ReactElement;
});
```

### useCopilotChatSuggestions

```typescript
useCopilotChatSuggestions({
  instructions: string;       // Prompt for suggestion generation
  minSuggestions?: number;
  maxSuggestions?: number;
}, dependencies?: any[]);     // Re-generate when deps change
```

---

## Components — Full Props

### CopilotKit Provider

```tsx
<CopilotKit
  publicApiKey?: string
  runtimeUrl?: string
  publicLicenseKey?: string
  agent?: string
  threadId?: string
  headers?: Record<string, string>
  properties?: Record<string, any>
  credentials?: RequestCredentials
  showDevConsole?: boolean
  enableInspector?: boolean
  guardrails_c?: { validTopics?: string[]; invalidTopics?: string[] }
  authConfig_c?: { SignInComponent: React.ComponentType }
  transcribeAudioUrl?: string
  textToSpeechUrl?: string
  onError?: CopilotErrorHandler
>
  {children}
</CopilotKit>
```

### CopilotPopup / CopilotSidebar / CopilotChat

Shared props:

```tsx
instructions?: string       // System prompt for the AI
labels?: {
  initial?: string          // First message shown
  title?: string            // Header title
  placeholder?: string      // Input placeholder
  stopGenerating?: string   // Stop button text
  regenerateResponse?: string
}
icons?: {
  openIcon?: ReactNode
  closeIcon?: ReactNode
  headerCloseIcon?: ReactNode
  sendIcon?: ReactNode
  activityIcon?: ReactNode
  spinnerIcon?: ReactNode
  stopIcon?: ReactNode
  regenerateIcon?: ReactNode
  pushToTalkIcon?: ReactNode
}
```

CopilotSidebar additional:
```tsx
defaultOpen?: boolean       // Start expanded
children: ReactNode         // Main app content (wrapped)
```

CopilotPopup additional:
```tsx
defaultOpen?: boolean
// Rendered at same level as main content (not wrapping)
```

---

## Self-Hosted Runtime Setup

### Next.js App Router

```typescript
// app/api/copilotkit/route.ts
import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";

const runtime = new CopilotRuntime({
  actions: ({ properties, url }) => [
    {
      name: "myAction",
      description: "Does something useful",
      parameters: [
        { name: "input", type: "string", description: "The input", required: true },
      ],
      handler: async ({ input }) => {
        return { result: `Processed: ${input}` };
      },
    },
  ],
});

const serviceAdapter = new ExperimentalEmptyAdapter();

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });
  return handleRequest(req);
};
```

### With BuiltInAgent (v2)

```typescript
import { BuiltInAgent } from "@copilotkit/runtime/v2";

const agent = new BuiltInAgent({
  model: "openai/gpt-4o",
  prompt: "You are a helpful assistant.",
});

const runtime = new CopilotRuntime({
  agents: { default: agent },
});
```

### With MCP Apps

```typescript
import { MCPAppsMiddleware } from "@ag-ui/mcp-apps-middleware";

const agent = new BuiltInAgent({
  model: "openai/gpt-4o",
  prompt: "You are a helpful assistant.",
}).use(
  new MCPAppsMiddleware({
    mcpServers: [
      { type: "http", url: "http://localhost:3108/mcp", serverId: "my-server" },
      // SSE transport:
      // { type: "sse", url: "https://mcp.example.com/sse", headers: { "Authorization": "Bearer token" }, serverId: "my-sse-server" },
    ],
  }),
);
```

> Always provide `serverId` in production. Without it, CopilotKit hashes the URL — if URL changes, history breaks.

---

## Agent Framework Integration

### LangGraph (Python)

```python
# agent.py
from copilotkit import CopilotKitState
from langgraph.graph import StateGraph
from langchain_openai import ChatOpenAI

class AgentState(CopilotKitState):
    custom_field: str = ""

def chat_node(state: AgentState, config):
    # Access frontend tools via state
    tools = state.get("copilotkit", {}).get("actions", [])
    model = ChatOpenAI(model="gpt-4o").bind_tools(tools)
    response = model.invoke(state["messages"], config)
    return { **state, "messages": response }

graph = StateGraph(AgentState)
graph.add_node("chat", chat_node)
# ... add edges, compile
```

### LangGraph (TypeScript)

```typescript
async function chatNode(state: AgentState, config: RunnableConfig) {
  const tools = state.copilotkit?.actions;
  const model = new ChatOpenAI({ model: "gpt-4o" }).bindTools(tools);
  const response = await model.invoke(state.messages, config);
  return { ...state, messages: response };
}
```

### Agent Spec (Python backend + CopilotKit frontend)

```python
from pyagentspec.agent import Agent
from pyagentspec.llms import OpenAiCompatibleConfig
from pyagentspec.tools import ClientTool
from pyagentspec.property import StringProperty
from pyagentspec.serialization import AgentSpecSerializer

llm = OpenAiCompatibleConfig(name="llm", model_id="gpt-4o-mini", url="https://api.openai.com/v1")

# ClientTool name/description/inputs MUST match frontend useFrontendTool
tool = ClientTool(
    name="sayHello",
    description="Say hello to the user.",
    inputs=[StringProperty(title="name", description="User name")],
)

agent = Agent(
    name="my_agent", llm_config=llm,
    system_prompt="A helpful assistant.",
    tools=[tool], human_in_the_loop=True,
)

# FastAPI server
from fastapi import APIRouter, FastAPI
from ag_ui_agentspec.agent import AgentSpecAgent
from ag_ui_agentspec.endpoint import add_agentspec_fastapi_endpoint

router = APIRouter()
add_agentspec_fastapi_endpoint(
    app=router,
    agentspec_agent=AgentSpecAgent(AgentSpecSerializer().to_json(agent), runtime="langgraph"),
    path="/langgraph/my_agent",
)
app = FastAPI()
app.include_router(router)
```

---

## CSS Variables Reference

| Variable | Purpose |
|----------|---------|
| `--copilot-kit-primary-color` | Buttons, interactive elements |
| `--copilot-kit-contrast-color` | Text on primary color |
| `--copilot-kit-background-color` | Main background |
| `--copilot-kit-secondary-color` | Cards, panels, hover surfaces |
| `--copilot-kit-secondary-contrast-color` | Primary text color |
| `--copilot-kit-separator-color` | Borders, dividers |
| `--copilot-kit-muted-color` | Disabled/inactive elements |

## CSS Classes Reference

| Class | Target |
|-------|--------|
| `.copilotKitMessages` | Message scroll container |
| `.copilotKitInput` | Input area container |
| `.copilotKitUserMessage` | User message bubble |
| `.copilotKitAssistantMessage` | AI response bubble |
| `.copilotKitHeader` | Top header bar |
| `.copilotKitButton` | Toggle button (popup/sidebar) |
| `.copilotKitWindow` | Root chat window |
| `.copilotKitChat` | Base chat layout |
| `.copilotKitSidebar` | Sidebar mode wrapper |
| `.copilotKitPopup` | Popup mode wrapper |
| `.copilotKitMarkdown` | Markdown rendered content |
| `.copilotKitCodeBlock` | Code block styling |

---

## CLI Commands

```bash
# Initialize CopilotKit in existing Next.js project
npx copilotkit@latest init

# Create new project from template
npx copilotkit@latest create -f <framework>
# Frameworks: langgraph-py, langgraph-js, mastra, mcp-apps
```

---

## v1 → v2 Migration

| v1 (still supported) | v2 (recommended) |
|----------------------|-------------------|
| `useCopilotAction` | `useFrontendTool` |
| `useCopilotReadable` | `useAgentContext` |
| `useCopilotChat` | `useAgent` |

---

## Architecture Overview

```
Frontend (React)                    Backend
┌──────────────────────┐     ┌────────────────────────┐
│ <CopilotKit>         │     │ CopilotRuntime         │
│  ├─ CopilotChat/     │     │  ├─ BuiltInAgent       │
│  │  Sidebar/Popup    │     │  │  └─ MCPApps MW       │
│  ├─ useFrontendTool  │◄───►│  ├─ Backend Actions    │
│  ├─ useCopilotRead.  │AG-UI│  └─ Service Adapter    │
│  ├─ useCoAgent       │     │                        │
│  └─ useLangGraphInt. │     │ Agent (LangGraph/      │
│                      │     │  Mastra/AgentSpec/...)  │
└──────────────────────┘     └────────────────────────┘
```
