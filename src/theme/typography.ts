import type { TextStyle } from 'react-native';

export const fontFamilies = {
  // Inter — primary body/UI font
  thin: 'Inter-Thin',
  light: 'Inter-Light',
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semibold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  extrabold: 'Inter-ExtraBold',
  black: 'Inter-Black',

  // Outfit — display/heading font
  displayThin: 'Outfit-Thin',
  displayLight: 'Outfit-Light',
  displayRegular: 'Outfit-Regular',
  displayMedium: 'Outfit-Medium',
  displaySemibold: 'Outfit-SemiBold',
  displayBold: 'Outfit-Bold',
  displayExtrabold: 'Outfit-ExtraBold',
  displayBlack: 'Outfit-Black',

  // JetBrains Mono — amounts/numbers
  mono: 'JetBrainsMono-Regular',
  monoMedium: 'JetBrainsMono-Medium',
  monoBold: 'JetBrainsMono-Bold',
} as const;

export const fontSize = {
  '2xs': 10,
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
} as const;

export const lineHeight = {
  '2xs': 14,
  xs: 16,
  sm: 20,
  base: 24,
  lg: 28,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 40,
  '5xl': 52,
  '6xl': 64,
} as const;

export const letterSpacing = {
  tighter: -1,
  tight: -0.5,
  normal: 0,
  wide: 0.3,
  wider: 0.6,
  widest: 1.2,
} as const;

export const textVariants = {
  // Display sizes (Outfit)
  displayXl: {
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSize['5xl'],
    lineHeight: lineHeight['5xl'],
    letterSpacing: letterSpacing.tighter,
  } as TextStyle,
  displayLg: {
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSize['4xl'],
    lineHeight: lineHeight['4xl'],
    letterSpacing: letterSpacing.tighter,
  } as TextStyle,
  displayMd: {
    fontFamily: fontFamilies.displaySemibold,
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight['3xl'],
    letterSpacing: letterSpacing.tight,
  } as TextStyle,
  displaySm: {
    fontFamily: fontFamilies.displaySemibold,
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight['2xl'],
    letterSpacing: letterSpacing.tight,
  } as TextStyle,

  // Headings (Inter)
  h1: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight['2xl'],
    letterSpacing: letterSpacing.tight,
  } as TextStyle,
  h2: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    letterSpacing: letterSpacing.tight,
  } as TextStyle,
  h3: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,
  h4: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Body (Inter)
  bodyLg: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,
  bodyMd: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,
  bodySm: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,
  bodyXs: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,

  // Labels (Inter Medium)
  labelLg: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,
  labelMd: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,
  labelSm: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    letterSpacing: letterSpacing.wide,
  } as TextStyle,
  labelXs: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSize['2xs'],
    lineHeight: lineHeight['2xs'],
    letterSpacing: letterSpacing.wider,
  } as TextStyle,

  // Numeric / Amount (JetBrains Mono)
  amountXl: {
    fontFamily: fontFamilies.monoBold,
    fontSize: fontSize['4xl'],
    lineHeight: lineHeight['4xl'],
    letterSpacing: letterSpacing.tight,
  } as TextStyle,
  amountLg: {
    fontFamily: fontFamilies.monoMedium,
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight['2xl'],
    letterSpacing: letterSpacing.tight,
  } as TextStyle,
  amountMd: {
    fontFamily: fontFamilies.monoMedium,
    fontSize: fontSize.xl,
    lineHeight: lineHeight.xl,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,
  amountSm: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,
  amountXs: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    letterSpacing: letterSpacing.normal,
  } as TextStyle,

  // Caps / Badge
  caps: {
    fontFamily: fontFamilies.bold,
    fontSize: fontSize['2xs'],
    lineHeight: lineHeight['2xs'],
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  } as TextStyle,
  capsMd: {
    fontFamily: fontFamilies.semibold,
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  } as TextStyle,
} as const;

export type TextVariant = keyof typeof textVariants;
