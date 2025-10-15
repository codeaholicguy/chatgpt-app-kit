/**
 * @jest-environment jsdom
 */
import { useOpenAiGlobal, useWidgetState, useCallTool } from '../src/react';

describe('React entry point', () => {
  test('exports React hooks', () => {
    expect(typeof useOpenAiGlobal).toBe('function');
    expect(typeof useWidgetState).toBe('function');
    expect(typeof useCallTool).toBe('function');
  });

  test('does not export utilities directly', () => {
    const reactExports = require('../src/react');
    
    expect(reactExports.createMeta).toBeUndefined();
    expect(reactExports.createWidgetMeta).toBeUndefined();
    expect(reactExports.cleanResponse).toBeUndefined();
  });
});

