import { useCallback } from 'react';
import { DisplayMode } from '../types';

/**
 * Hook to access the requestDisplayMode API for changing component display modes
 * @returns A function to request display mode changes
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const requestDisplayMode = useRequestDisplayMode();
 *
 *   const goFullscreen = async () => {
 *     try {
 *       const result = await requestDisplayMode({ mode: 'fullscreen' });
 *       console.log('Granted mode:', result.mode);
 *     } catch (error) {
 *       console.error('Failed to change display mode:', error);
 *     }
 *   };
 *
 *   return <button onClick={goFullscreen}>Go Fullscreen</button>;
 * }
 * ```
 */
export function useRequestDisplayMode() {
  return useCallback(
    (args: { mode: DisplayMode }) => {
      if (typeof window !== 'undefined' && window.openai?.requestDisplayMode) {
        return window.openai.requestDisplayMode(args);
      }
      return Promise.reject(new Error('OpenAI requestDisplayMode API not available'));
    },
    []
  );
}

