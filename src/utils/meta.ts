import { OpenAIMetadata, WidgetCSP, UserLocation } from '../types';

export type MetaInput = {
  outputTemplate?: string;
  toolInvocation?: {
    invoking?: string;
    invoked?: string;
  };
  widgetAccessible?: boolean;
  resultCanProduceWidget?: boolean;
  widgetCSP?: WidgetCSP;
  widgetDomain?: string;
  widgetDescription?: string;
  widgetPrefersBorder?: boolean;
  locale?: string;
  userAgent?: string;
  userLocation?: UserLocation;
  i18n?: string;
};

/**
 * Creates an OpenAIMetadata object from a user-friendly input structure
 *
 * @param input - User-friendly metadata configuration
 * @returns OpenAIMetadata object with proper namespaced keys
 *
 * @example
 * ```typescript
 * const meta = createMeta({
 *   outputTemplate: "ui://widget/kanban-board.html",
 *   toolInvocation: {
 *     invoking: "Loading tasks...",
 *     invoked: "Tasks loaded"
 *   },
 *   widgetAccessible: true,
 *   resultCanProduceWidget: true,
 *   widgetCSP: {
 *     connect_domains: ["https://api.example.com"],
 *     resource_domains: ["https://cdn.example.com"]
 *   }
 * });
 * ```
 */
export function createMeta(input: MetaInput): OpenAIMetadata {
  const meta: OpenAIMetadata = {};

  if (input.outputTemplate !== undefined) {
    meta["openai/outputTemplate"] = input.outputTemplate;
  }

  if (input.toolInvocation?.invoking !== undefined) {
    meta["openai/toolInvocation/invoking"] = input.toolInvocation.invoking;
  }
  if (input.toolInvocation?.invoked !== undefined) {
    meta["openai/toolInvocation/invoked"] = input.toolInvocation.invoked;
  }

  if (input.widgetAccessible !== undefined) {
    meta["openai/widgetAccessible"] = input.widgetAccessible;
  }
  if (input.resultCanProduceWidget !== undefined) {
    meta["openai/resultCanProduceWidget"] = input.resultCanProduceWidget;
  }

  if (input.widgetCSP !== undefined) {
    meta["openai/widgetCSP"] = input.widgetCSP;
  }
  if (input.widgetDomain !== undefined) {
    meta["openai/widgetDomain"] = input.widgetDomain;
  }
  if (input.widgetDescription !== undefined) {
    meta["openai/widgetDescription"] = input.widgetDescription;
  }
  if (input.widgetPrefersBorder !== undefined) {
    meta["openai/widgetPrefersBorder"] = input.widgetPrefersBorder;
  }

  if (input.locale !== undefined) {
    meta["openai/locale"] = input.locale;
  }

  if (input.userAgent !== undefined) {
    meta["openai/userAgent"] = input.userAgent;
  }
  if (input.userLocation !== undefined) {
    meta["openai/userLocation"] = input.userLocation;
  }

  if (input.i18n !== undefined) {
    meta["webplus/i18n"] = input.i18n;
  }

  return meta;
}

/**
 * Creates a minimal meta object for basic widget configuration
 *
 * @param templateUri - The template URI for the widget
 * @param options - Additional configuration options
 * @returns OpenAIMetadata object
 *
 * @example
 * ```typescript
 * const meta = createWidgetMeta("ui://widget/chart.html", {
 *   invoking: "Generating chart...",
 *   invoked: "Chart ready",
 *   accessible: true
 * });
 * ```
 */
export function createWidgetMeta(
  templateUri: string,
  options: {
    invoking?: string;
    invoked?: string;
    accessible?: boolean;
    description?: string;
    prefersBorder?: boolean;
  } = {}
): OpenAIMetadata {
  return createMeta({
    outputTemplate: templateUri,
    toolInvocation: {
      invoking: options.invoking,
      invoked: options.invoked,
    },
    widgetAccessible: options.accessible,
    resultCanProduceWidget: true,
    widgetDescription: options.description,
    widgetPrefersBorder: options.prefersBorder,
  });
}
