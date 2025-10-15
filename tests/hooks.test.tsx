/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, act } from '@testing-library/react';
import { useOpenAiGlobal } from '../src/hooks/use-openai-global';
import { useToolInput, useToolOutput, useToolResponseMetadata } from '../src/hooks/use-tool-data';
import { useWidgetState } from '../src/hooks/use-widget-state';
import { useCallTool } from '../src/hooks/use-call-tool';
import { useOpenExternal } from '../src/hooks/use-open-external';
import { useRequestDisplayMode } from '../src/hooks/use-request-display-mode';
import { useSendFollowUpMessage } from '../src/hooks/use-send-follow-up-message';
import { SET_GLOBALS_EVENT_TYPE } from '../src/types';

// Mock window.openai API methods
const mockSendFollowUpMessage = jest.fn().mockResolvedValue(undefined);
const mockCallTool = jest.fn().mockResolvedValue({ result: 'success' });
const mockOpenExternal = jest.fn();
const mockRequestDisplayMode = jest.fn().mockResolvedValue({ mode: 'fullscreen' });
const mockSetWidgetState = jest.fn().mockResolvedValue(undefined);

// Mock window.openai
const mockOpenAI = {
  theme: 'dark',
  userAgent: { device: { type: 'desktop' } },
  locale: 'en-US',
  toolInput: { query: 'test query' },
  toolOutput: { results: ['result1', 'result2'] },
  toolResponseMetadata: { status: 'completed' },
  widgetState: { favorites: ['item1'] },
  sendFollowUpMessage: mockSendFollowUpMessage,
  callTool: mockCallTool,
  openExternal: mockOpenExternal,
  requestDisplayMode: mockRequestDisplayMode,
  setWidgetState: mockSetWidgetState
};

describe('useOpenAiGlobal', () => {
  beforeEach(() => {
    // Setup global window.openai
    Object.defineProperty(window, 'openai', {
      value: { ...mockOpenAI },
      writable: true
    });
  });

  afterEach(() => {
    // Cleanup - only delete if it exists
    if ((window as any).openai) {
      delete (window as any).openai;
    }
  });
  test('returns null for non-existent keys', () => {
    function TestComponent() {
      const value = useOpenAiGlobal('nonexistent');
      return <div>{String(value || 'null')}</div>;
    }

    const { container } = render(<TestComponent />);
    expect(container.textContent).toBe('null');
  });

  test('returns the value from window.openai for a given key', () => {
    function TestComponent() {
      const theme = useOpenAiGlobal('theme');
      const userAgent = useOpenAiGlobal('userAgent');
      return (
        <div>
          theme:{String(theme)},userAgent:{JSON.stringify(userAgent)}
        </div>
      );
    }

    const { container } = render(<TestComponent />);
    expect(container.textContent).toBe('theme:dark,userAgent:{"device":{"type":"desktop"}}');
  });

  test('returns null for non-existent keys', () => {
    function TestComponent() {
      const value = useOpenAiGlobal('nonexistent');
      return <div>{String(value || 'null')}</div>;
    }

    const { container } = render(<TestComponent />);
    expect(container.textContent).toBe('null');
  });

  test('updates when SET_GLOBALS_EVENT_TYPE is dispatched', () => {
    let renderedValue = '';

    function TestComponent() {
      const theme = useOpenAiGlobal<string>('theme');
      renderedValue = theme || 'null';
      return <div>{renderedValue}</div>;
    }

    const { container, rerender } = render(<TestComponent />);
    expect(container.textContent).toBe('dark');

    // Update window.openai
    window.openai.theme = 'light';

    // Dispatch event
    act(() => {
      window.dispatchEvent(
        new CustomEvent(SET_GLOBALS_EVENT_TYPE, {
          detail: { globals: { theme: 'light' } }
        })
      );
    });

    expect(container.textContent).toBe('light');
  });

  test('does not update when dispatched event does not contain the key', () => {
    function TestComponent() {
      const theme = useOpenAiGlobal('theme');
      return <div>{String(theme)}</div>;
    }

    const { container } = render(<TestComponent />);
    expect(container.textContent).toBe('dark');

    // Dispatch event with different key
    act(() => {
      window.dispatchEvent(
        new CustomEvent(SET_GLOBALS_EVENT_TYPE, {
          detail: { globals: { otherKey: 'value' } }
        })
      );
    });

    // Should still be the same
    expect(container.textContent).toBe('dark');
  });

  test('cleans up event listeners on unmount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    function TestComponent() {
      const value = useOpenAiGlobal('theme');
      return <div>{String(value)}</div>;
    }

    const { unmount } = render(<TestComponent />);

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      SET_GLOBALS_EVENT_TYPE,
      expect.any(Function),
      { passive: true }
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      SET_GLOBALS_EVENT_TYPE,
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});

describe('useSendFollowUpMessage', () => {
  beforeEach(() => {
    // Setup global window.openai for sendFollowUpMessage tests
    Object.defineProperty(window, 'openai', {
      value: { ...mockOpenAI },
      writable: true
    });
  });

  afterEach(() => {
    // Cleanup
    if ((window as any).openai) {
      delete (window as any).openai;
    }
    mockSendFollowUpMessage.mockClear();
  });

  test('returns a function that calls window.openai.sendFollowUpMessage', async () => {
    function TestComponent() {
      const sendFollowUpMessage = useSendFollowUpMessage();
      React.useEffect(() => {
        sendFollowUpMessage('Hello, world!');
      }, [sendFollowUpMessage]);
      return <div>Test</div>;
    }

    render(<TestComponent />);

    expect(mockSendFollowUpMessage).toHaveBeenCalledWith({ prompt: 'Hello, world!' });
    expect(mockSendFollowUpMessage).toHaveBeenCalledTimes(1);
  });

  test('returns a resolved promise when window.openai.sendFollowUpMessage is not available', async () => {
    // Temporarily remove sendFollowUpMessage
    const originalSendFollowUpMessage = (window as any).openai.sendFollowUpMessage;
    delete (window as any).openai.sendFollowUpMessage;

    function TestComponent() {
      const sendFollowUpMessage = useSendFollowUpMessage();
      React.useEffect(() => {
        sendFollowUpMessage('Hello, world!').then(() => {
          // Should resolve without calling anything
        });
      }, [sendFollowUpMessage]);
      return <div>Test</div>;
    }

    render(<TestComponent />);

    // Restore
    (window as any).openai.sendFollowUpMessage = originalSendFollowUpMessage;
  });

  test('memoizes the sendFollowUpMessage function across renders', () => {
    let sendFollowUpMessageRef: any = null;

    function TestComponent() {
      const sendFollowUpMessage = useSendFollowUpMessage();
      React.useEffect(() => {
        if (!sendFollowUpMessageRef) {
          sendFollowUpMessageRef = sendFollowUpMessage;
        }
      }, [sendFollowUpMessage]);
      return <div>Test</div>;
    }

    const { rerender } = render(<TestComponent />);
    const firstRef = sendFollowUpMessageRef;

    // Force a re-render
    rerender(<TestComponent />);

    expect(sendFollowUpMessageRef).toBe(firstRef);
  });
});

describe('useToolInput, useToolOutput, useToolResponseMetadata', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'openai', {
      value: { ...mockOpenAI },
      writable: true
    });
  });

  afterEach(() => {
    if ((window as any).openai) {
      delete (window as any).openai;
    }
  });

  test('useToolInput returns toolInput from global state', () => {
    function TestComponent() {
      const toolInput = useToolInput();
      return <div>{JSON.stringify(toolInput)}</div>;
    }

    const { container } = render(<TestComponent />);
    expect(container.textContent).toBe(JSON.stringify(mockOpenAI.toolInput));
  });

  test('useToolOutput returns toolOutput from global state', () => {
    function TestComponent() {
      const toolOutput = useToolOutput();
      return <div>{JSON.stringify(toolOutput)}</div>;
    }

    const { container } = render(<TestComponent />);
    expect(container.textContent).toBe(JSON.stringify(mockOpenAI.toolOutput));
  });

  test('useToolResponseMetadata returns toolResponseMetadata from global state', () => {
    function TestComponent() {
      const metadata = useToolResponseMetadata();
      return <div>{JSON.stringify(metadata)}</div>;
    }

    const { container } = render(<TestComponent />);
    expect(container.textContent).toBe(JSON.stringify(mockOpenAI.toolResponseMetadata));
  });
});

describe('useWidgetState', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'openai', {
      value: { ...mockOpenAI },
      writable: true
    });
    mockSetWidgetState.mockClear();
  });

  afterEach(() => {
    if ((window as any).openai) {
      delete (window as any).openai;
    }
  });

  test('returns initial widget state from global state', () => {
    function TestComponent() {
      const [state] = useWidgetState();
      return <div>{JSON.stringify(state)}</div>;
    }

    const { container } = render(<TestComponent />);
    expect(container.textContent).toBe(JSON.stringify(mockOpenAI.widgetState));
  });

  test('returns default state when global state is null', () => {
    const originalState = (window as any).openai.widgetState;
    (window as any).openai.widgetState = null;

    function TestComponent() {
      const [state] = useWidgetState({ default: 'value' });
      return <div>{JSON.stringify(state)}</div>;
    }

    const { container } = render(<TestComponent />);
    expect(container.textContent).toBe(JSON.stringify({ default: 'value' }));

    (window as any).openai.widgetState = originalState;
  });

  test('setWidgetState calls window.openai.setWidgetState', async () => {
    function TestComponent() {
      const [, setState] = useWidgetState();

      React.useEffect(() => {
        setState({ newState: 'value' });
      }, [setState]);

      return <div>Test</div>;
    }

    render(<TestComponent />);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(mockSetWidgetState).toHaveBeenCalledWith({ newState: 'value' });
  });
});

describe('useCallTool', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'openai', {
      value: { ...mockOpenAI },
      writable: true
    });
    mockCallTool.mockClear();
  });

  afterEach(() => {
    if ((window as any).openai) {
      delete (window as any).openai;
    }
  });

  test('returns function that calls window.openai.callTool', async () => {
    function TestComponent() {
      const callTool = useCallTool();

      React.useEffect(() => {
        callTool('testTool', { param: 'value' });
      }, [callTool]);

      return <div>Test</div>;
    }

    render(<TestComponent />);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(mockCallTool).toHaveBeenCalledWith('testTool', { param: 'value' });
  });
});

describe('useOpenExternal', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'openai', {
      value: { ...mockOpenAI },
      writable: true
    });
    mockOpenExternal.mockClear();
  });

  afterEach(() => {
    if ((window as any).openai) {
      delete (window as any).openai;
    }
  });

  test('returns function that calls window.openai.openExternal', () => {
    function TestComponent() {
      const openExternal = useOpenExternal();

      React.useEffect(() => {
        openExternal({ href: 'https://example.com' });
      }, [openExternal]);

      return <div>Test</div>;
    }

    render(<TestComponent />);

    expect(mockOpenExternal).toHaveBeenCalledWith({ href: 'https://example.com' });
  });

  test('handles missing window.openai gracefully', () => {
    delete (window as any).openai;

    function TestComponent() {
      const openExternal = useOpenExternal();

      React.useEffect(() => {
        openExternal({ href: 'https://example.com' });
      }, [openExternal]);

      return <div>Test</div>;
    }

    expect(() => render(<TestComponent />)).not.toThrow();
  });
});

describe('useRequestDisplayMode', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'openai', {
      value: { ...mockOpenAI },
      writable: true
    });
    mockRequestDisplayMode.mockClear();
  });

  afterEach(() => {
    if ((window as any).openai) {
      delete (window as any).openai;
    }
  });

  test('returns function that calls window.openai.requestDisplayMode', async () => {
    function TestComponent() {
      const requestDisplayMode = useRequestDisplayMode();

      React.useEffect(() => {
        requestDisplayMode({ mode: 'fullscreen' });
      }, [requestDisplayMode]);

      return <div>Test</div>;
    }

    render(<TestComponent />);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(mockRequestDisplayMode).toHaveBeenCalledWith({ mode: 'fullscreen' });
  });
});
