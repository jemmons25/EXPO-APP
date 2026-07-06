/**
 * Biolume palette — see docs/05-DESIGN-SYSTEM.md
 * Dark-first, biological, premium. Teal = clean/health data, amber = sun/energy/circadian.
 */
export const colors = {
  // Surfaces
  bg: '#0A0E14', // deep space black (navy undertone)
  bgElevated: '#131A24', // card charcoal
  bgElevated2: '#1B2430', // slightly higher elevation
  borderSubtle: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.14)',

  // Accents
  teal: '#2DD4BF', // clean scores, rings, active/selected
  tealDim: 'rgba(45,212,191,0.14)',
  amberStart: '#F5A623', // sun / circadian / streaks (gradient start)
  amberEnd: '#FF6B35', // sun / energy (gradient end)
  amberDim: 'rgba(245,166,35,0.14)',

  // Semantic (flags / bands)
  coral: '#FF5C5C', // red flags / "poor"
  coralDim: 'rgba(255,92,92,0.14)',
  honey: '#FFC554', // yellow flags / "fair"
  honeyDim: 'rgba(255,197,84,0.14)',
  mint: '#4ADE80', // green flags / "good"
  mintDim: 'rgba(74,222,128,0.14)',

  // Text
  textPrimary: '#F2F5F7',
  textSecondary: '#8B98A5',
  textTertiary: '#5C6773',
  textOnAccent: '#04140F',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export type FlagColor = 'green' | 'yellow' | 'red';
export type EvidenceStrength = 'strong' | 'moderate' | 'emerging' | 'contested';

export const flagToColor: Record<FlagColor, string> = {
  green: colors.mint,
  yellow: colors.honey,
  red: colors.coral,
};

export const flagToDim: Record<FlagColor, string> = {
  green: colors.mintDim,
  yellow: colors.honeyDim,
  red: colors.coralDim,
};

/** Score band → color. 80+ excellent (teal), 60–79 good (mint), 40–59 fair (honey), <40 poor (coral). */
export function scoreColor(score: number): string {
  if (score >= 80) return colors.teal;
  if (score >= 60) return colors.mint;
  if (score >= 40) return colors.honey;
  return colors.coral;
}

export function scoreBand(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

export const evidenceColor: Record<EvidenceStrength, string> = {
  strong: colors.teal,
  moderate: colors.mint,
  emerging: colors.honey,
  contested: colors.textSecondary,
};
