import { duration, spring, easing, transition, motiPresets } from './animations';
import { darkTheme } from './colors';
import { spacing, borderRadius, layout, iconSize } from './spacing';
import { textVariants, fontFamilies, fontSize } from './typography';

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './animations';

export const theme = {
  colors: darkTheme,
  text: textVariants,
  fonts: fontFamilies,
  fontSize,
  spacing,
  borderRadius,
  layout,
  iconSize,
  duration,
  spring,
  easing,
  transition,
  motiPresets,
} as const;

export type Theme = typeof theme;
