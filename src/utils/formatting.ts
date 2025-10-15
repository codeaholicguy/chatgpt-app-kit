/**
 * Cleans and formats ChatGPT response text
 */
export function cleanResponse(text: string): string {
  return text
    .trim()
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[^\S\n]+/g, ' ');
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
