# ChatGPT App Kit

A comprehensive TypeScript library for building ChatGPT-integrated applications with React and Node.js. Provides type-safe utilities, React hooks, and helpers for working with OpenAI's MCP (Model Context Protocol) servers and ChatGPT widgets.

[![npm version](https://img.shields.io/npm/v/chatgpt-app-kit.svg)](https://www.npmjs.com/package/chatgpt-app-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

## Features

✨ **Type-Safe** - Full TypeScript support with comprehensive type definitions  
🎯 **Modular** - Import only what you need with multiple entry points  
⚛️ **React Ready** - Purpose-built hooks for ChatGPT widget development  
🔧 **Server-Friendly** - Core utilities work in Node.js without React  
📦 **Tree-Shakeable** - Optimized for modern bundlers  
🧪 **Well-Tested** - Comprehensive test coverage

## Installation

```bash
# For React applications
npm install chatgpt-app-kit react react-dom

# For server-only (MCP servers, Node.js backends)
npm install chatgpt-app-kit
```

> **Note:** React and React-DOM are **optional peer dependencies**. The library works in server environments without React.

## Quick Start

### React Widget

```tsx
import { useOpenAiGlobal, useWidgetState, useSendFollowUpMessage } from 'chatgpt-app-kit';

function MyWidget() {
  const theme = useOpenAiGlobal('theme');
  const [count, setCount] = useWidgetState({ value: 0 });
  const sendMessage = useSendFollowUpMessage();

  const increment = () => {
    const newCount = count.value + 1;
    setCount({ value: newCount });
    sendMessage(`Clicked ${newCount} times!`);
  };

  return (
    <div className={theme === 'dark' ? 'dark' : 'light'}>
      <h1>Count: {count?.value ?? 0}</h1>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

### MCP Server

```typescript
import { createWidgetMeta } from 'chatgpt-app-kit/server';

// Define a tool that returns a widget
const tool = {
  name: 'show_chart',
  handler: async (params) => {
    return {
      content: [
        {
          type: 'resource',
          resource: {
            uri: 'ui://widget/chart.html',
            text: JSON.stringify(params),
            mimeType: 'application/json'
          }
        }
      ],
      _meta: createWidgetMeta('ui://widget/chart.html', {
        invoking: 'Generating chart...',
        invoked: 'Chart ready',
        accessible: true,
        description: 'Interactive data visualization'
      })
    };
  }
};
```

## Package Structure

The library provides **4 entry points** for different use cases:

| Entry Point | Size | Contents | React Required |
|------------|------|----------|----------------|
| `chatgpt-app-kit` | 11KB | Everything (utilities + hooks) | Optional |
| `chatgpt-app-kit/core` | 4KB | Utilities + Types only | ❌ No |
| `chatgpt-app-kit/react` | 7KB | React Hooks only | ✅ Yes |
| `chatgpt-app-kit/server` | 4KB | Server utilities (alias for `/core`) | ❌ No |

### When to Use Each Entry Point

```typescript
// Full package - React apps with all features
import { createMeta, useOpenAiGlobal } from 'chatgpt-app-kit';

// Core only - MCP servers, Node.js backends
import { createMeta, createWidgetMeta } from 'chatgpt-app-kit/core';

// Server alias - Explicit server-side usage
import { createMeta } from 'chatgpt-app-kit/server';

// React hooks only - Optimized component imports
import { useOpenAiGlobal, useWidgetState } from 'chatgpt-app-kit/react';
import { OpenAIMetadata } from 'chatgpt-app-kit/core';
```

## API Reference

### React Hooks

#### `useOpenAiGlobal<T>(key: string): T | null`

Subscribe to `window.openai` global state changes.

```tsx
function MyComponent() {
  const theme = useOpenAiGlobal<string>('theme');
  const locale = useOpenAiGlobal<string>('locale');
  const userAgent = useOpenAiGlobal('userAgent');

  return <div className={theme}>Current locale: {locale}</div>;
}
```

**Available keys:**
- `theme` - Current theme ('light' | 'dark')
- `locale` - User locale (e.g., 'en-US')
- `userAgent` - Device and capability info
- `displayMode` - Current display mode ('inline' | 'pip' | 'fullscreen')
- `safeArea` - Safe area insets for layout
- `maxHeight` - Maximum available height
- `toolInput` - Current tool input data
- `toolOutput` - Current tool output data
- `toolResponseMetadata` - Tool response metadata
- `widgetState` - Persistent widget state

#### `useWidgetState<T>(defaultState?: T): [T | null, (state: T) => Promise<void>]`

Manage persistent widget state that syncs with ChatGPT.

```tsx
function TodoWidget() {
  const [todos, setTodos] = useWidgetState<string[]>([]);

  const addTodo = (text: string) => {
    setTodos([...todos, text]);
  };

  return (
    <ul>
      {todos?.map((todo, i) => <li key={i}>{todo}</li>)}
    </ul>
  );
}
```

#### `useToolInput<T>(): T | null`

Access the current tool input data.

```tsx
function DataDisplay() {
  const input = useToolInput<{ query: string }>();
  return <div>Query: {input?.query}</div>;
}
```

#### `useToolOutput<T>(): T | null`

Access the current tool output data.

```tsx
function ResultsDisplay() {
  const output = useToolOutput<{ results: any[] }>();
  return <div>{output?.results.length} results</div>;
}
```

#### `useToolResponseMetadata<T>(): T | null`

Access the tool response metadata.

```tsx
function StatusDisplay() {
  const metadata = useToolResponseMetadata<{ status: string }>();
  return <div>Status: {metadata?.status}</div>;
}
```

#### `useCallTool(): (name: string, args: Record<string, unknown>) => Promise<CallToolResponse>`

Call MCP tools from your component.

```tsx
function RefreshButton() {
  const callTool = useCallTool();

  const refresh = async () => {
    const result = await callTool('refresh_data', { force: true });
    console.log(result);
  };

  return <button onClick={refresh}>Refresh</button>;
}
```

#### `useSendFollowUpMessage(): (prompt: string) => Promise<void>`

Send follow-up messages to the ChatGPT conversation.

```tsx
function ShareButton({ data }: { data: any }) {
  const sendMessage = useSendFollowUpMessage();

  const share = () => {
    sendMessage(`Here's the data: ${JSON.stringify(data)}`);
  };

  return <button onClick={share}>Share</button>;
}
```

#### `useOpenExternal(): (payload: { href: string }) => void`

Open external links via the ChatGPT host.

```tsx
function ExternalLink({ url }: { url: string }) {
  const openExternal = useOpenExternal();

  return (
    <button onClick={() => openExternal({ href: url })}>
      Open in browser
    </button>
  );
}
```

#### `useRequestDisplayMode(): (args: { mode: DisplayMode }) => Promise<{ mode: DisplayMode }>`

Request display mode changes (inline, pip, fullscreen).

```tsx
function ExpandButton() {
  const requestDisplayMode = useRequestDisplayMode();

  const goFullscreen = async () => {
    const result = await requestDisplayMode({ mode: 'fullscreen' });
    console.log('Granted mode:', result.mode);
  };

  return <button onClick={goFullscreen}>Expand</button>;
}
```

### Utilities

#### `createMeta(input: MetaInput): OpenAIMetadata`

Create OpenAI metadata objects with a user-friendly API.

```typescript
const metadata = createMeta({
  outputTemplate: 'ui://widget/dashboard.html',
  toolInvocation: {
    invoking: 'Loading dashboard...',
    invoked: 'Dashboard ready'
  },
  widgetAccessible: true,
  resultCanProduceWidget: true,
  widgetCSP: {
    connect_domains: ['https://api.example.com'],
    resource_domains: ['https://cdn.example.com']
  },
  locale: 'en-US'
});
```

**MetaInput properties:**
- `outputTemplate` - Widget template URI
- `toolInvocation` - Loading/completion status messages
- `widgetAccessible` - Widget accessibility flag
- `resultCanProduceWidget` - Enable widget rendering
- `widgetCSP` - Content Security Policy
- `widgetDomain` - Widget subdomain
- `widgetDescription` - Description for the model
- `widgetPrefersBorder` - Border preference
- `locale` - Locale string
- `userAgent` - User agent string
- `userLocation` - User location data
- `i18n` - Legacy locale property

#### `createWidgetMeta(templateUri: string, options?): OpenAIMetadata`

Shorthand for creating widget metadata.

```typescript
const metadata = createWidgetMeta('ui://widget/chart.html', {
  invoking: 'Generating chart...',
  invoked: 'Chart ready',
  accessible: true,
  description: 'Interactive data visualization',
  prefersBorder: false
});
```

#### `cleanResponse(text: string): string`

Clean and normalize ChatGPT response text.

```typescript
const cleaned = cleanResponse('  Hello\n\n\nWorld  ');
// Returns: "Hello\n\nWorld"
```

#### `extractCodeBlocks(text: string): Array<{ language: string; code: string }>`

Extract code blocks from markdown text.

```typescript
const blocks = extractCodeBlocks('```javascript\nconsole.log("hi");\n```');
// Returns: [{ language: 'javascript', code: 'console.log("hi");' }]
```

### TypeScript Types

```typescript
import type {
  // Metadata
  OpenAIMetadata,
  WidgetCSP,
  UserLocation,
  
  // UI
  Theme,
  DisplayMode,
  UserAgent,
  SafeArea,
  
  // API
  CallTool,
  CallToolResponse,
  RequestDisplayMode,
  
  // Global
  OpenAIGlobals,
  
  // Common
  UnknownObject
} from 'chatgpt-app-kit';
```

## Examples

### Complete Widget Example

```tsx
import {
  useOpenAiGlobal,
  useWidgetState,
  useToolInput,
  useSendFollowUpMessage,
  useRequestDisplayMode
} from 'chatgpt-app-kit';

interface TodoItem {
  id: string;
  text: string;
  done: boolean;
}

interface TodoState {
  items: TodoItem[];
}

function TodoWidget() {
  const theme = useOpenAiGlobal<string>('theme');
  const input = useToolInput<{ initialTodos?: string[] }>();
  const [state, setState] = useWidgetState<TodoState>({
    items: input?.initialTodos?.map((text, i) => ({
      id: String(i),
      text,
      done: false
    })) ?? []
  });
  
  const sendMessage = useSendFollowUpMessage();
  const requestDisplayMode = useRequestDisplayMode();

  const addTodo = (text: string) => {
    const newItem = {
      id: String(Date.now()),
      text,
      done: false
    };
    setState({
      items: [...(state?.items ?? []), newItem]
    });
  };

  const toggleTodo = (id: string) => {
    setState({
      items: state?.items.map(item =>
        item.id === id ? { ...item, done: !item.done } : item
      ) ?? []
    });
  };

  const shareProgress = () => {
    const done = state?.items.filter(i => i.done).length ?? 0;
    const total = state?.items.length ?? 0;
    sendMessage(`Progress: ${done}/${total} todos completed`);
  };

  return (
    <div className={`todo-widget ${theme}`}>
      <h1>Todo List</h1>
      <ul>
        {state?.items.map(item => (
          <li key={item.id}>
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggleTodo(item.id)}
            />
            <span className={item.done ? 'done' : ''}>{item.text}</span>
          </li>
        ))}
      </ul>
      <button onClick={shareProgress}>Share Progress</button>
      <button onClick={() => requestDisplayMode({ mode: 'fullscreen' })}>
        Expand
      </button>
    </div>
  );
}
```

### MCP Server Tool Example

```typescript
import { createWidgetMeta, type OpenAIMetadata } from 'chatgpt-app-kit/server';

interface ChartData {
  labels: string[];
  values: number[];
}

export const chartTool = {
  name: 'create_chart',
  description: 'Create an interactive chart visualization',
  inputSchema: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          labels: { type: 'array', items: { type: 'string' } },
          values: { type: 'array', items: { type: 'number' } }
        },
        required: ['labels', 'values']
      },
      type: {
        type: 'string',
        enum: ['bar', 'line', 'pie']
      }
    },
    required: ['data', 'type']
  },
  
  async handler(params: { data: ChartData; type: string }) {
    const metadata: OpenAIMetadata = createWidgetMeta(
      'ui://widget/chart.html',
      {
        invoking: 'Generating chart...',
        invoked: 'Chart visualization ready',
        accessible: true,
        description: `${params.type} chart with ${params.data.labels.length} data points`
      }
    );

    return {
      content: [
        {
          type: 'resource',
          resource: {
            uri: 'ui://widget/chart.html',
            text: JSON.stringify(params),
            mimeType: 'application/json'
          }
        }
      ],
      _meta: metadata
    };
  }
};
```

## Best Practices

### 1. Use the Right Entry Point

```typescript
// ✅ Good - Server-side
import { createMeta } from 'chatgpt-app-kit/server';

// ❌ Avoid - Pulls in React hooks unnecessarily
import { createMeta } from 'chatgpt-app-kit';
```

### 2. Type Your Widget State

```typescript
// ✅ Good - Typed state
interface MyState {
  count: number;
  items: string[];
}
const [state, setState] = useWidgetState<MyState>({ count: 0, items: [] });

// ❌ Avoid - Untyped state
const [state, setState] = useWidgetState({ count: 0, items: [] });
```

### 3. Handle SSR Gracefully

All hooks are SSR-safe and return `null` when `window` is undefined:

```typescript
function MyComponent() {
  const theme = useOpenAiGlobal('theme');
  
  // Always check for null in SSR environments
  if (!theme) {
    return <div>Loading...</div>;
  }
  
  return <div className={theme}>Content</div>;
}
```

### 4. Use Metadata for Better UX

```typescript
// ✅ Good - Provide loading states
const metadata = createWidgetMeta('ui://widget/app.html', {
  invoking: 'Fetching data...',
  invoked: 'Data loaded successfully'
});

// ❌ Avoid - No user feedback
const metadata = createWidgetMeta('ui://widget/app.html');
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build the library
npm run build

# Run linting
npm run lint

# Format code
npm run format

# Type check
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © 2025

## Related

- [OpenAI Apps SDK Documentation](https://developers.openai.com/apps-sdk)
- [MCP Server Specification](https://developers.openai.com/apps-sdk/build/mcp-server)
- [ChatGPT Widget Development](https://developers.openai.com/apps-sdk/build/widget)
