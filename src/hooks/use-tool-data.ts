import { useOpenAiGlobal } from './use-openai-global';

/**
 * Hook to access the current tool input from the global OpenAI state
 * @returns The current tool input object
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const toolInput = useToolInput();
 *   return <div>Query: {toolInput?.query}</div>;
 * }
 * ```
 */
export function useToolInput<T = unknown>(): T | null {
  return useOpenAiGlobal<T>('toolInput');
}

/**
 * Hook to access the current tool output from the global OpenAI state
 * @returns The current tool output object or null
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const toolOutput = useToolOutput();
 *   return <div>Results: {JSON.stringify(toolOutput)}</div>;
 * }
 * ```
 */
export function useToolOutput<T = unknown>(): T | null {
  return useOpenAiGlobal<T>('toolOutput');
}

/**
 * Hook to access the current tool response metadata from the global OpenAI state
 * @returns The current tool response metadata object or null
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const metadata = useToolResponseMetadata();
 *   return <div>Status: {metadata?.status}</div>;
 * }
 * ```
 */
export function useToolResponseMetadata<T = unknown>(): T | null {
  return useOpenAiGlobal<T>('toolResponseMetadata');
}

