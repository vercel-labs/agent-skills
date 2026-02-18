---
name: copilotkit
description: Build AI-powered agentic applications with CopilotKit. Use when building React apps with AI copilot features, generative UI, chat interfaces, agent integration (LangGraph/Mastra/Agent Spec), human-in-the-loop workflows, shared state, frontend/backend actions, or MCP Apps. Covers setup, hooks, components, styling, and agent backends.
---

# CopilotKit — Agentic Application Framework

Build AI copilot features into React apps: chat UI, generative UI, frontend/backend tools, shared state, human-in-the-loop, and agent framework integration.

## Quick Start

### 1. Install

```bash
npm install @copilotkit/react-ui @copilotkit/react-core
```

For self-hosted runtime:

```bash
npm install @copilotkit/runtime
```

### 2. Provider Setup (layout.tsx)

```tsx
import "@copilotkit/react-ui/styles.css";
import { CopilotKit } from "@copilotkit/react-core";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Option A: Copilot Cloud */}
        <CopilotKit publicApiKey="<your-key>">
          {children}
        </CopilotKit>

        {/* Option B: Self-hosted */}
        {/* <CopilotKit runtimeUrl="/api/copilotkit">{children}</CopilotKit> */}
      </body>
    </html>
  );
}
```

### 3. Add Chat UI

Pick one of three built-in components:

```tsx
import { CopilotPopup } from "@copilotkit/react-ui";

export function App() {
  return (
    <>
      <YourMainContent />
      <CopilotPopup
        instructions="You are a helpful assistant."
        labels={{ title: "AI Assistant", initial: "How can I help?" }}
      />
    </>
  );
}
```

Alternatives: `CopilotSidebar` (wraps children), `CopilotChat` (inline, any size).

---

## Core Hooks

### useCopilotReadable — Provide context to LLM

```tsx
import { useCopilotReadable } from "@copilotkit/react-core";

const [items, setItems] = useState([...]);
useCopilotReadable({ description: "User's todo items", value: items });
```

Supports hierarchical context via `parentId` (return value of parent call).

### useFrontendTool — Frontend executable tool + optional UI

```tsx
import { useFrontendTool } from "@copilotkit/react-core";

useFrontendTool({
  name: "addTodo",
  description: "Add a new todo item",
  parameters: [
    { name: "text", type: "string", description: "Todo content", required: true },
  ],
  handler: async ({ text }) => {
    setTodos(prev => [...prev, text]);
  },
  render: ({ status, args, result }) => {
    if (status === "inProgress") return <Spinner />;
    return <TodoCard text={args.text} />;
  },
});
```

`render` is optional. When provided, UI appears inline in chat during tool execution.

### useRenderToolCall — Render-only (no handler)

```tsx
import { useRenderToolCall } from "@copilotkit/react-core";

useRenderToolCall({
  name: "get_weather",
  render: ({ status, args }) => {
    if (status !== "complete") return <p>Loading weather...</p>;
    return <WeatherCard location={args.location} />;
  },
});
```

### useDefaultTool — Fallback renderer for all tools

```tsx
import { useDefaultTool } from "@copilotkit/react-core";

useDefaultTool({
  render: ({ name, args, status, result }) => (
    <div>
      <span>{status === "complete" ? "✓" : "⏳"} {name}</span>
      {status === "complete" && result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  ),
});
```

### useCopilotChat — Headless chat API

```tsx
import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";

const { visibleMessages, appendMessage, stopGeneration, isLoading } = useCopilotChat();
appendMessage(new TextMessage({ content: "Hello", role: Role.User }));
```

### useCopilotChatSuggestions — Auto-generate suggestions

```tsx
import { useCopilotChatSuggestions } from "@copilotkit/react-ui";

useCopilotChatSuggestions({
  instructions: "Suggest next actions based on current state.",
  minSuggestions: 1,
  maxSuggestions: 3,
}, [relevantState]);
```

---

## Generative UI — Three Patterns

### Static (AG-UI) — Pre-built components, agent selects + fills data

Use `useFrontendTool` with `render`. Agent chooses which tool/component to show.

### Declarative (A2UI / Open-JSON-UI) — Agent returns structured JSON UI spec

Agent emits JSON describing cards/lists/forms. Frontend renders with its own styling.

### Open-ended (MCP Apps) — Agent returns full HTML/JS in sandboxed iframe

```bash
npm install @ag-ui/mcp-apps-middleware
```

```typescript
import { BuiltInAgent } from "@copilotkit/runtime/v2";
import { MCPAppsMiddleware } from "@ag-ui/mcp-apps-middleware";

const agent = new BuiltInAgent({
  model: "openai/gpt-4o",
  prompt: "You are a helpful assistant.",
}).use(
  new MCPAppsMiddleware({
    mcpServers: [{ type: "http", url: "http://localhost:3108/mcp", serverId: "my-server" }],
  }),
);
```

---

## Shared State (with LangGraph)

### Backend state definition (Python)

```python
from copilotkit import CopilotKitState

class AgentState(CopilotKitState):
    language: str = "english"
```

### Frontend read/write — useCoAgent

```tsx
import { useCoAgent } from "@copilotkit/react-core";

const { state, setState } = useCoAgent<{ language: string }>({
  name: "sample_agent",
  initialState: { language: "english" },
});
```

### Render state in chat — useCoAgentStateRender

```tsx
import { useCoAgentStateRender } from "@copilotkit/react-core";

useCoAgentStateRender({
  name: "sample_agent",
  render: ({ state }) => state.language ? <div>Lang: {state.language}</div> : null,
});
```

---

## Human-in-the-Loop (with LangGraph)

### Backend — interrupt()

```python
from langgraph.types import interrupt

def chat_node(state, config):
    name = state.get("agent_name") or interrupt("What should I call you?")
    # ... continue with name
```

### Frontend — useLangGraphInterrupt

```tsx
import { useLangGraphInterrupt } from "@copilotkit/react-core";

useLangGraphInterrupt({
  render: ({ event, resolve }) => (
    <div>
      <p>{event.value}</p>
      <input type="text" name="response" />
      <button onClick={() => resolve(document.querySelector('input').value)}>Submit</button>
    </div>
  ),
});
```

Supports `enabled` for conditional routing and `handler` for programmatic pre-processing.

---

## Backend Actions (Self-hosted Runtime)

### API Route (Next.js App Router)

```typescript
import { CopilotRuntime, ExperimentalEmptyAdapter, copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";

const runtime = new CopilotRuntime({
  actions: ({ properties, url }) => [
    {
      name: "fetchUser",
      description: "Fetch user by ID from database",
      parameters: [{ name: "userId", type: "string", description: "User ID", required: true }],
      handler: async ({ userId }) => {
        return await db.users.findById(userId);
      },
    },
  ],
});

const serviceAdapter = new ExperimentalEmptyAdapter();

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime, serviceAdapter, endpoint: "/api/copilotkit",
  });
  return handleRequest(req);
};
```

`actions` is a factory function receiving `{ properties, url }` — dynamically expose different actions per page.

---

## Styling & Customization

### CSS Variables (simplest)

```tsx
<div style={{
  "--copilot-kit-primary-color": "#6366f1",
  "--copilot-kit-background-color": "#0f172a",
  "--copilot-kit-secondary-color": "#1e293b",
  "--copilot-kit-secondary-contrast-color": "#f8fafc",
} as CopilotKitCSSProperties}>
  <CopilotSidebar />
</div>
```

### CSS Classes

Key classes: `.copilotKitMessages`, `.copilotKitInput`, `.copilotKitUserMessage`, `.copilotKitAssistantMessage`, `.copilotKitHeader`, `.copilotKitButton`, `.copilotKitWindow`.

### Custom Labels & Icons

```tsx
<CopilotChat
  labels={{ title: "My AI", initial: "Ask anything", placeholder: "Type here..." }}
  icons={{ openIcon: <MyIcon />, sendIcon: <SendIcon /> }}
/>
```

Available icons: `openIcon`, `closeIcon`, `headerCloseIcon`, `sendIcon`, `activityIcon`, `spinnerIcon`, `stopIcon`, `regenerateIcon`, `pushToTalkIcon`.

---

## CopilotKit Provider — Key Props

| Prop | Type | Description |
|------|------|-------------|
| `publicApiKey` | `string` | Copilot Cloud API key |
| `runtimeUrl` | `string` | Self-hosted runtime endpoint |
| `agent` | `string` | Agent name to use |
| `threadId` | `string` | Conversation thread ID |
| `headers` | `Record<string, string>` | Custom request headers |
| `properties` | `Record<string, any>` | Custom props (auth, metadata) |
| `credentials` | `RequestCredentials` | CORS cookie policy, e.g. `"include"` |
| `showDevConsole` | `boolean` | Show dev console |

---

## Decision Guide

| Need | Solution |
|------|----------|
| Add chat to existing app | `CopilotPopup` or `CopilotSidebar` |
| Fully custom chat UI | `useCopilotChat` (headless) |
| LLM reads app state | `useCopilotReadable` |
| LLM modifies app state | `useFrontendTool` with handler |
| Custom UI in chat messages | `useFrontendTool` or `useRenderToolCall` with render |
| Agent framework (LangGraph/Mastra) | `useCoAgent` + `useCoAgentStateRender` |
| User approval flows | `useLangGraphInterrupt` |
| Server-side data/API calls | Backend actions via `CopilotRuntime` |
| External MCP tool UIs | `MCPAppsMiddleware` |

## Additional Resources

- For complete API reference and advanced patterns, see [reference.md](reference.md)
- Official docs: https://docs.copilotkit.ai
- GitHub: https://github.com/CopilotKit/CopilotKit
- Generative UI playground: https://github.com/CopilotKit/generative-ui-playground
