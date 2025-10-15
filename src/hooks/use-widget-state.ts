import { useState, useEffect, useCallback, SetStateAction } from 'react';
import { useOpenAiGlobal } from './use-openai-global';

/**
 * Hook for managing widget state that persists across sessions and is exposed to ChatGPT
 * Synchronizes with window.openai.widgetState and provides a setter
 *
 * @param defaultState - Default state value or function that returns default state
 * @returns A tuple of [currentState, setStateFunction]
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [favorites, setFavorites] = useWidgetState<string[]>([]);
 *
 *   const toggleFavorite = (itemId: string) => {
 *     setFavorites(prev =>
 *       prev.includes(itemId)
 *         ? prev.filter(id => id !== itemId)
 *         : [...prev, itemId]
 *     );
 *   };
 *
 *   return <div>{favorites.length} favorites</div>;
 * }
 * ```
 */
export function useWidgetState<T>(
  defaultState: T | (() => T)
): readonly [T, (state: SetStateAction<T>) => void];

export function useWidgetState<T>(
  defaultState?: T | (() => T | null) | null
): readonly [T | null, (state: SetStateAction<T | null>) => void];

export function useWidgetState<T>(
  defaultState?: T | (() => T | null) | null
): readonly [T | null, (state: SetStateAction<T | null>) => void] {
  const widgetStateFromWindow = useOpenAiGlobal<T>('widgetState');

  const [widgetState, _setWidgetState] = useState<T | null>(() => {
    if (widgetStateFromWindow != null) {
      return widgetStateFromWindow;
    }

    return typeof defaultState === 'function'
      ? (defaultState as () => T | null)()
      : defaultState ?? null;
  });

  useEffect(() => {
    if (widgetStateFromWindow != null) {
      _setWidgetState(widgetStateFromWindow);
    }
  }, [widgetStateFromWindow]);

  const setWidgetState = useCallback(
    (state: SetStateAction<T | null>) => {
      _setWidgetState((prevState) => {
        const newState =
          typeof state === 'function'
            ? (state as (prevState: T | null) => T | null)(prevState)
            : state;

        if (newState != null && typeof window !== 'undefined' && window.openai?.setWidgetState) {
          window.openai.setWidgetState(newState);
        }

        return newState;
      });
    },
    []
  );

  return [widgetState, setWidgetState] as const;
}

