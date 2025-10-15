import { cleanResponse, extractCodeBlocks } from '../src/utils/formatting';
import { createMeta, createWidgetMeta } from '../src/utils/meta';

describe('ChatGPT App Kit', () => {
  describe('Formatting utilities', () => {
    test('cleanResponse trims and normalizes whitespace', () => {
      const dirty = '  Hello\n\n\nWorld  ';
      const clean = cleanResponse(dirty);
      expect(clean).toBe('Hello\n\nWorld');
    });

    test('extractCodeBlocks finds code in markdown', () => {
      const text = 'Here is some code:\n```javascript\nconsole.log("hello");\n```';
      const blocks = extractCodeBlocks(text);
      expect(blocks).toHaveLength(1);
      expect(blocks[0].language).toBe('javascript');
      expect(blocks[0].code).toBe('console.log("hello");');
    });
  });

  describe('Meta utilities', () => {
    test('createMeta transforms user-friendly input to OpenAIMetadata', () => {
      const input = {
        outputTemplate: 'ui://widget/kanban-board.html',
        toolInvocation: {
          invoking: 'Loading...',
          invoked: 'Loaded'
        },
        widgetAccessible: true,
        resultCanProduceWidget: true,
        locale: 'en-US',
        i18n: 'en-US'
      };

      const result = createMeta(input);

      expect(result).toEqual({
        'openai/outputTemplate': 'ui://widget/kanban-board.html',
        'openai/toolInvocation/invoking': 'Loading...',
        'openai/toolInvocation/invoked': 'Loaded',
        'openai/widgetAccessible': true,
        'openai/resultCanProduceWidget': true,
        'openai/locale': 'en-US',
        'webplus/i18n': 'en-US'
      });
    });

    test('createMeta handles complex types like WidgetCSP and UserLocation', () => {
      const input = {
        widgetCSP: {
          connect_domains: ['https://api.example.com'],
          resource_domains: ['https://cdn.example.com']
        },
        userLocation: {
          country: 'US',
          city: 'San Francisco',
          coordinates: {
            latitude: 37.7749,
            longitude: -122.4194
          }
        },
        widgetDomain: 'https://example.com',
        widgetDescription: 'Interactive Kanban board',
        widgetPrefersBorder: true
      };

      const result = createMeta(input);

      expect(result).toEqual({
        'openai/widgetCSP': {
          connect_domains: ['https://api.example.com'],
          resource_domains: ['https://cdn.example.com']
        },
        'openai/userLocation': {
          country: 'US',
          city: 'San Francisco',
          coordinates: {
            latitude: 37.7749,
            longitude: -122.4194
          }
        },
        'openai/widgetDomain': 'https://example.com',
        'openai/widgetDescription': 'Interactive Kanban board',
        'openai/widgetPrefersBorder': true
      });
    });

    test('createMeta returns empty object for empty input', () => {
      const result = createMeta({});
      expect(result).toEqual({});
    });

    test('createWidgetMeta creates minimal widget configuration', () => {
      const result = createWidgetMeta('ui://widget/chart.html', {
        invoking: 'Generating chart...',
        invoked: 'Chart ready',
        accessible: true,
        description: 'Data visualization chart',
        prefersBorder: false
      });

      expect(result).toEqual({
        'openai/outputTemplate': 'ui://widget/chart.html',
        'openai/toolInvocation/invoking': 'Generating chart...',
        'openai/toolInvocation/invoked': 'Chart ready',
        'openai/widgetAccessible': true,
        'openai/resultCanProduceWidget': true,
        'openai/widgetDescription': 'Data visualization chart',
        'openai/widgetPrefersBorder': false
      });
    });

    test('createWidgetMeta works with minimal options', () => {
      const result = createWidgetMeta('ui://widget/simple.html');

      expect(result).toEqual({
        'openai/outputTemplate': 'ui://widget/simple.html',
        'openai/resultCanProduceWidget': true
      });
    });
  });
});
