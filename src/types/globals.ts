import { UnknownObject } from './common';
import { Theme, UserAgent, DisplayMode, SafeArea } from './ui';
import { CallTool, RequestDisplayMode, SendFollowUpMessage, OpenExternal } from './api';

export type OpenAIGlobals<
  ToolInput = UnknownObject,
  ToolOutput = UnknownObject,
  ToolResponseMetadata = UnknownObject,
  WidgetState = UnknownObject
> = {
  theme: Theme;
  userAgent: UserAgent;
  locale: string;
  maxHeight: number;
  displayMode: DisplayMode;
  safeArea: SafeArea;
  toolInput: ToolInput;
  toolOutput: ToolOutput | null;
  toolResponseMetadata: ToolResponseMetadata | null;
  widgetState: WidgetState | null;
  setWidgetState: (state: WidgetState) => Promise<void>;
};

export type API = {
  callTool: CallTool;
  sendFollowUpMessage: SendFollowUpMessage;
  openExternal: OpenExternal;
  requestDisplayMode: RequestDisplayMode;
};

export const SET_GLOBALS_EVENT_TYPE = "openai:set_globals";

export class SetGlobalsEvent extends CustomEvent<{
  globals: Partial<OpenAIGlobals>;
}> {
  readonly type = SET_GLOBALS_EVENT_TYPE;
}

declare global {
  interface Window {
    openai: API & OpenAIGlobals;
    innerBaseUrl: string;
  }

  interface WindowEventMap {
    [SET_GLOBALS_EVENT_TYPE]: SetGlobalsEvent;
  }
}

