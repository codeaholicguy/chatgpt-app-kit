import { formatMessage, createConversation } from '../src/utils/chat';
import { cleanResponse, extractCodeBlocks } from '../src/utils/formatting';
import { isValidApiKey, validateMessageContent } from '../src/utils/validation';

describe('ChatGPT App Kit', () => {
  describe('Chat utilities', () => {
    test('formatMessage creates proper message structure', () => {
      const message = formatMessage('user', 'Hello, world!');
      expect(message).toEqual({
        role: 'user',
        content: 'Hello, world!'
      });
    });

    test('createConversation initializes with messages', () => {
      const conversation = createConversation([]);
      expect(conversation.messages).toEqual([]);
    });
  });

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

  describe('Validation utilities', () => {
    test('isValidApiKey validates OpenAI key format', () => {
      expect(isValidApiKey('sk-1234567890abcdef')).toBe(false); // too short
      expect(isValidApiKey('sk-abcdefghijklmnopqrstuvwx')).toBe(true); // valid format
    });

    test('validateMessageContent checks content validity', () => {
      const valid = validateMessageContent('Hello world');
      const invalid = validateMessageContent('');

      expect(valid.valid).toBe(true);
      expect(invalid.valid).toBe(false);
      expect(invalid.error).toBe('Content must be a non-empty string');
    });
  });
});
