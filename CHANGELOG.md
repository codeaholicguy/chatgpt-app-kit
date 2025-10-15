# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-10-15

### Added

#### Core Features
- TypeScript library for ChatGPT app development
- Full type definitions for OpenAI MCP server integration
- Modular entry points (`/core`, `/react`, `/server`)
- Comprehensive React hooks for ChatGPT widgets

#### Types
- `OpenAIMetadata` - Complete metadata type definition
- `WidgetCSP` - Content Security Policy configuration
- `UserLocation` - User location information
- `OpenAIGlobals` - Global state type definitions
- Domain-driven type organization (common, ui, widget, api, globals)

#### Utilities
- `createMeta()` - User-friendly metadata builder
- `createWidgetMeta()` - Shorthand widget metadata creator
- `cleanResponse()` - Text formatting utility
- `extractCodeBlocks()` - Markdown code block extractor

#### React Hooks
- `useOpenAiGlobal()` - Subscribe to window.openai state
- `useWidgetState()` - Persistent widget state management
- `useToolInput()` - Access tool input data
- `useToolOutput()` - Access tool output data
- `useToolResponseMetadata()` - Access response metadata
- `useCallTool()` - Call MCP tools
- `useSendFollowUpMessage()` - Send messages to ChatGPT
- `useOpenExternal()` - Open external links
- `useRequestDisplayMode()` - Request display mode changes

#### Package Structure
- Main bundle (11KB) - Full package with all features
- Core bundle (4KB) - Utilities and types only
- React bundle (7KB) - React hooks only
- Server bundle (4KB) - Alias for core bundle

#### Developer Experience
- Full TypeScript support with strict typing
- Comprehensive test coverage (36 tests)
- ESLint and Prettier configuration
- Rollup bundler with CommonJS and ESM outputs
- Jest testing setup with React support
- SSR-safe implementations

### Technical Details
- **Build**: Rollup with TypeScript plugin
- **Tests**: Jest with jsdom environment
- **Linting**: ESLint with TypeScript parser
- **Formatting**: Prettier
- **Node**: >= 16.0.0
- **React**: >= 16.8.0 (optional peer dependency)

