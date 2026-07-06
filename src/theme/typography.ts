/**
 * Typography — Space Grotesk (headers, numerals), Inter (body).
 * Font family keys map to loaded fonts in app/_layout.tsx.
 */
import { TextStyle } from 'react-native';

export const fonts = {
  display: 'SpaceGrotesk_700Bold',
  heading: 'SpaceGrotesk_600SemiBold',
  headingMedium: 'SpaceGrotesk_500Medium',
  numeral: 'SpaceGrotesk_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
} as const;

export const type: Record<string, TextStyle> = {
  display: { fontFamily: fonts.display, fontSize: 40, lineHeight: 46, letterSpacing: -0.5 },
  h1: { fontFamily: fonts.heading, fontSize: 30, lineHeight: 36, letterSpacing: -0.3 },
  h2: { fontFamily: fonts.heading, fontSize: 24, lineHeight: 30, letterSpacing: -0.2 },
  h3: { fontFamily: fonts.headingMedium, fontSize: 20, lineHeight: 26 },
  bodyLg: { fontFamily: fonts.body, fontSize: 17, lineHeight: 26 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 23 },
  bodyMedium: { fontFamily: fonts.bodyMedium, fontSize: 15, lineHeight: 23 },
  bodySemibold: { fontFamily: fonts.bodySemibold, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fonts.bodyMedium, fontSize: 13, lineHeight: 18 },
  overline: {
    fontFamily: fonts.bodySemibold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
};
