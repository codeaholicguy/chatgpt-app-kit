import { useSyncExternalStore } from "react";
import { SET_GLOBALS_EVENT_TYPE } from "../types";

/**
 * React hook for subscribing to OpenAI global state changes
 *
 * @param key - The key to subscribe to in the global openai object
 * @returns The current value of window.openai[key], or null if not available
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const theme = useOpenAiGlobal('theme');
 *   const userAgent = useOpenAiGlobal('userAgent');
 *
 *   return (
 *     <div className={theme === 'dark' ? 'dark-theme' : 'light-theme'}>
 *       Current theme: {theme}
 *       User agent: {userAgent?.device?.type}
 *     </div>
 *   );
 * }
 * ```
 */
export function useOpenAiGlobal<T = unknown>(key: string): T | null {
  return useSyncExternalStore(
    (onChange: () => void) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const handleSetGlobal = (event: CustomEvent) => {
        const value = event.detail.globals[key];
        if (value === undefined) {
          return;
        }

        onChange();
      };

      window.addEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal, {
        passive: true,
      });

      return () => {
        window.removeEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal);
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => ((window.openai as any)?.[key] as T) ?? null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => ((window.openai as any)?.[key] as T) ?? null
  );
}
