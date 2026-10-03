export type SeasonId = "spring" | "summer" | "autumn" | "winter";
export type HolidayId =
  | "halloween"
  | "christmas"
  | "new-year"
  | "earth-day"
  | "st-patricks"
  | "thanksgiving"
  | "pi-day"
  | "programmers-day"
  | "cherry-blossom"
  | "summer-solstice"
  | "winter-solstice"
  | "black-history-month"
  | "cinco-de-mayo"
  | "juneteenth"
  | "lunar-new-year"
  | "diwali"
  | "linux-anniversary";
export type SeasonalEventId = SeasonId | HolidayId;

export interface DateBoundary {
  /** 1-indexed month (1 = Jan, 12 = Dec) */
  month: number;
  /** 1-indexed day of the month */
  day: number;
}

export interface ColorTokens {
  primary: string;
  primaryForeground: string;
  opposing: string;
  opposingForeground: string;
  border: string;
  ring: string;
  input: string;
}

export type ParticleMotionStyle =
  | "default"
  | "autumn-drift"
  | "snowfall"
  | "spring-float"
  | "summer-shimmer"
  | "embers"
  | "sparkles"
  | "fireworks"
  | "confetti"
  | "terminal";

export type TargetShape =
  | "cube"
  | "pumpkin"
  | "tree"
  | "snowflake"
  | "leaf"
  | "flower"
  | "sun"
  | "star"
  | "globe"
  | "clover"
  | "acorn"
  | "pi"
  | "chip"
  | "sakura"
  | "crest"
  | "africa"
  | "sombrero"
  | "freedom-star"
  | "lantern"
  | "diya"
  | "penguin"
  | "fireworks"
  | "turkey"
  | "sparkler";

export interface SeasonalParticleConfig {
  motion: ParticleMotionStyle;
  /** Target 3D shape formed as the user scrolls ('cube' by default, or holiday-specific) */
  targetShape?: TargetShape;
  /** Palette of hex colors used for particle field in light and dark modes */
  colors: {
    light: string[];
    dark: string[];
  };
  /** Base particle size */
  size: number;
  /** Base opacity */
  opacity: number;
  /** Speed multiplier for ambient drift */
  speed: number;
  /** Horizontal sway amplitude for wind/falling effects */
  sway?: number;
}

export interface SeasonalEventConfig {
  id: SeasonalEventId;
  name: string;
  type: "season" | "holiday";
  /** Priority when multiple events overlap; higher number wins (holidays typically 10, seasons 1) */
  priority: number;
  start: DateBoundary;
  end: DateBoundary;
  colors: {
    light: ColorTokens;
    dark: ColorTokens;
  };
  particles: SeasonalParticleConfig;
}

export interface SeasonalContextValue {
  enabled: boolean;
  toggleEnabled: () => void;
  activeEvent: SeasonalEventConfig | null;
  /** True when a developer override query param is active (e.g. ?season=winter) */
  isOverridden: boolean;
  /** True when foreground UI is hidden to view only the 3D particle background */
  backgroundOnly: boolean;
  setBackgroundOnly: (val: boolean) => void;
  toggleBackgroundOnly: () => void;
}
