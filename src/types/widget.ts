import { UserLocation } from './ui';

/**
 * Content Security Policy configuration for widgets
 */
export type WidgetCSP = {
  /** Domains allowed for network connections */
  connect_domains?: string[];
  /** Domains allowed for loading resources (scripts, styles, images, fonts) */
  resource_domains?: string[];
};

/**
 * OpenAI-specific metadata for tool responses and widgets
 * Based on MCP server specification: https://developers.openai.com/apps-sdk/build/mcp-server
 */
export type OpenAIMetadata = {
  /** Links to a resource template URI for component rendering */
  "openai/outputTemplate"?: string;

  /** Tool invocation status strings */
  "openai/toolInvocation/invoking"?: string;
  "openai/toolInvocation/invoked"?: string;

  /** Widget accessibility and rendering controls */
  "openai/widgetAccessible"?: boolean;
  "openai/resultCanProduceWidget"?: boolean;

  /** Component configuration */
  "openai/widgetCSP"?: WidgetCSP;
  "openai/widgetDomain"?: string;
  "openai/widgetDescription"?: string;
  "openai/widgetPrefersBorder"?: boolean;

  /** Localization */
  "openai/locale"?: string;

  /** Client context hints */
  "openai/userAgent"?: string;
  "openai/userLocation"?: UserLocation;

  /** Legacy/compatibility properties */
  "webplus/i18n"?: string;
};

