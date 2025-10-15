export type Theme = "light" | "dark";

export type DisplayMode = "pip" | "inline" | "fullscreen";

export type SafeAreaInsets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type SafeArea = {
  insets: SafeAreaInsets;
};

export type DeviceType = "mobile" | "tablet" | "desktop" | "unknown";

export type UserAgent = {
  device: { type: DeviceType };
  capabilities: {
    hover: boolean;
    touch: boolean;
  };
};

/**
 * User location information
 */
export type UserLocation = {
  /** Country code */
  country?: string;
  /** Region/state */
  region?: string;
  /** City */
  city?: string;
  /** Timezone */
  timezone?: string;
  /** Approximate coordinates */
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

