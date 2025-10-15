// Text formatting utilities for ChatGPT responses

/**
 * Cleans and formats ChatGPT response text
 */
export function cleanResponse(text: string): string {
  return text
    .trim()
    .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Extracts code blocks from ChatGPT response
 */
export function extractCodeBlocks(text: string): Array<{ language: string; code: string }> {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks: Array<{ language: string; code: string }> = [];
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim()
    });
  }

  return blocks;
}

/**
 * Formats a markdown response for display
 */
export function formatMarkdown(text: string): string {
  // Basic markdown formatting - could be enhanced with a proper markdown parser
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>');
}
