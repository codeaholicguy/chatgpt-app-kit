// Validation utilities for ChatGPT API inputs

/**
 * Validates a ChatGPT API key format
 */
export function isValidApiKey(apiKey: string): boolean {
  // OpenAI API keys start with 'sk-' and are followed by characters
  const apiKeyRegex = /^sk-[a-zA-Z0-9]{48,}$/;
  return apiKeyRegex.test(apiKey);
}

/**
 * Validates message content for ChatGPT API
 */
export function validateMessageContent(content: string): { valid: boolean; error?: string } {
  if (!content || typeof content !== 'string') {
    return { valid: false, error: 'Content must be a non-empty string' };
  }

  if (content.length > 32768) { // ChatGPT's token limit approximation
    return { valid: false, error: 'Content exceeds maximum length' };
  }

  return { valid: true };
}

/**
 * Validates conversation messages array
 */
export function validateMessages(messages: any[]): { valid: boolean; error?: string } {
  if (!Array.isArray(messages)) {
    return { valid: false, error: 'Messages must be an array' };
  }

  if (messages.length === 0) {
    return { valid: false, error: 'Messages array cannot be empty' };
  }

  for (const message of messages) {
    if (!message.role || !message.content) {
      return { valid: false, error: 'Each message must have role and content' };
    }

    if (!['user', 'assistant', 'system'].includes(message.role)) {
      return { valid: false, error: 'Invalid message role' };
    }
  }

  return { valid: true };
}
