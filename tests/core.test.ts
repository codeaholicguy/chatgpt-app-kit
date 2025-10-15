import { createMeta, createWidgetMeta, cleanResponse, extractCodeBlocks } from '../src/core';

describe('Core entry point', () => {
  test('exports all utilities', () => {
    expect(typeof createMeta).toBe('function');
    expect(typeof createWidgetMeta).toBe('function');
    expect(typeof cleanResponse).toBe('function');
    expect(typeof extractCodeBlocks).toBe('function');
  });

  test('does not export React hooks', () => {
    const coreExports = require('../src/core');
    
    expect(coreExports.useOpenAiGlobal).toBeUndefined();
    expect(coreExports.useWidgetState).toBeUndefined();
    expect(coreExports.useCallTool).toBeUndefined();
  });

  test('createMeta works', () => {
    const meta = createMeta({
      outputTemplate: 'ui://widget/test.html',
      widgetAccessible: true
    });

    expect(meta['openai/outputTemplate']).toBe('ui://widget/test.html');
    expect(meta['openai/widgetAccessible']).toBe(true);
  });
});

