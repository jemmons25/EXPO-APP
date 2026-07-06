export * from './colors';
export * from './typography';

/** 4pt spacing scale. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
} as const;

/** Spring presets for Reanimated (docs/05 §3: damping ~15, stiffness ~150). */
export const spring = {
  default: { damping: 15, stiffness: 150, mass: 1 },
  gentle: { damping: 18, stiffness: 120, mass: 1 },
  snappy: { damping: 20, stiffness: 260, mass: 0.9 },
  bouncy: { damping: 11, stiffness: 170, mass: 1 },
} as const;
