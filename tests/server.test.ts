import { createMeta, createWidgetMeta } from '../src/server';

describe('Server-only bundle', () => {
  test('exports createMeta utility', () => {
    expect(typeof createMeta).toBe('function');
  });

  test('exports createWidgetMeta utility', () => {
    expect(typeof createWidgetMeta).toBe('function');
  });

  test('createMeta works without React', () => {
    const meta = createMeta({
      outputTemplate: 'ui://widget/test.html',
      widgetAccessible: true
    });

    expect(meta).toEqual({
      'openai/outputTemplate': 'ui://widget/test.html',
      'openai/widgetAccessible': true
    });
  });

  test('createWidgetMeta works without React', () => {
    const meta = createWidgetMeta('ui://widget/test.html', {
      invoking: 'Loading...',
      invoked: 'Loaded'
    });

    expect(meta).toEqual({
      'openai/outputTemplate': 'ui://widget/test.html',
      'openai/toolInvocation/invoking': 'Loading...',
      'openai/toolInvocation/invoked': 'Loaded',
      'openai/resultCanProduceWidget': true
    });
  });

  test('does not export React hooks', () => {
    // This test ensures the server bundle doesn't include React hooks
    const serverExports = require('../src/server');
    
    expect(serverExports.useOpenAiGlobal).toBeUndefined();
    expect(serverExports.useWidgetState).toBeUndefined();
    expect(serverExports.useCallTool).toBeUndefined();
  });
});

