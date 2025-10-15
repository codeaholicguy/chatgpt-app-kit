import { DisplayMode } from './ui';

export type CallToolResponse = {
  result: string;
};

export type CallTool = (
  name: string,
  args: Record<string, unknown>
) => Promise<CallToolResponse>;

export type RequestDisplayMode = (args: { mode: DisplayMode }) => Promise<{
  /**
   * The granted display mode. The host may reject the request.
   * For mobile, PiP is always coerced to fullscreen.
   */
  mode: DisplayMode;
}>;

export type SendFollowUpMessage = (args: { prompt: string }) => Promise<void>;

export type OpenExternal = (payload: { href: string }) => void;

