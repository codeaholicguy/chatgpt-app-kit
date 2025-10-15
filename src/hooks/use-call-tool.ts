import { useCallback } from 'react';
import { CallToolResponse } from '../types';

/**
 * Hook to access the callTool API for triggering MCP tool calls
 * @returns A function to call MCP tools
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const callTool = useCallTool();
 *
 *   const refreshData = async () => {
 *     try {
 *       const response = await callTool('refresh_data', { param: 'value' });
 *       console.log('Tool response:', response.result);
 *     } catch (error) {
 *       console.error('Failed to call tool:', error);
 *     }
 *   };
 *
 *   return <button onClick={refreshData}>Refresh</button>;
 * }
 * ```
 */
export function useCallTool() {
  return useCallback(
    (name: string, args: Record<string, unknown>): Promise<CallToolResponse> => {
      if (typeof window !== 'undefined' && window.openai?.callTool) {
        return window.openai.callTool(name, args);
      }
      return Promise.reject(new Error('OpenAI callTool API not available'));
    },
    []
  );
}

