// Chat-related utilities for ChatGPT integration

/**
 * Formats a message for ChatGPT API
 */
export function formatMessage(
  role: 'user' | 'assistant' | 'system',
  content: string
) {
  return {
    role,
    content: content.trim()
  };
}

/**
 * Creates a conversation thread
 */
export function createConversation(initialMessages: any[] = []) {
  return {
    messages: [...initialMessages],
    addMessage: (message: any) => {
      // TODO: Implement message addition logic
    },
    getMessages: () => {
      return [...this.messages];
    }
  };
}
