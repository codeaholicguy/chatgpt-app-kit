import { useCallback } from 'react';

/**
 * Hook to access the openExternal API for opening external links
 * @returns A function to open external URLs
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const openExternal = useOpenExternal();
 *
 *   const openWebsite = () => {
 *     openExternal({ href: 'https://example.com' });
 *   };
 *
 *   return <button onClick={openWebsite}>Open Website</button>;
 * }
 * ```
 */
export function useOpenExternal() {
  return useCallback((payload: { href: string }) => {
    if (typeof window !== 'undefined' && window.openai?.openExternal) {
      window.openai.openExternal(payload);
    }
  }, []);
}

