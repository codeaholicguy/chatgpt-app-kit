# ChatGPT App Kit

A utility library for building ChatGPT-integrated applications in React and Node.js.

## Installation

```bash
npm install chatgpt-app-kit
```

## Usage

### Node.js

```javascript
const { formatMessage, cleanResponse, isValidApiKey } = require('chatgpt-app-kit');

// Format a message for ChatGPT API
const message = formatMessage('user', 'Hello, how are you?');

// Clean and format response
const cleanText = cleanResponse(rawResponse);

// Validate API key
const isValid = isValidApiKey('your-api-key-here');
```

### React

```jsx
import { formatMessage, cleanResponse } from 'chatgpt-app-kit';

function ChatComponent() {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (content) => {
    const message = formatMessage('user', content);
    // Send to ChatGPT API...

    const response = await fetchChatGPT(message);
    const cleanResponse = cleanResponse(response.content);

    setMessages([...messages, message, { role: 'assistant', content: cleanResponse }]);
  };

  return (
    // Your chat UI here
  );
}
```

## API Reference

### Chat Utilities

- `formatMessage(role, content)` - Formats a message for ChatGPT API
- `createConversation(messages)` - Creates a conversation thread

### Formatting Utilities

- `cleanResponse(text)` - Cleans and normalizes ChatGPT response text
- `extractCodeBlocks(text)` - Extracts code blocks from markdown text
- `formatMarkdown(text)` - Basic markdown formatting

### Validation Utilities

- `isValidApiKey(apiKey)` - Validates OpenAI API key format
- `validateMessageContent(content)` - Validates message content
- `validateMessages(messages)` - Validates conversation messages array

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the library
npm run build

# Run linting
npm run lint

# Format code
npm run format
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
