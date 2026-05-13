import { Easing } from 'react-native';

export const duration = {
  instant: 100,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
  slowest: 700,
} as const;

export const spring = {
  // Snappy UI interactions
  snappy: {
    damping: 20,
    stiffness: 400,
    mass: 0.8,
  },
  // Standard spring
  default: {
    damping: 24,
    stiffness: 300,
    mass: 1,
  },
  // Soft bouncy
  bouncy: {
    damping: 15,
    stiffness: 200,
    mass: 1,
  },
  // Gentle smooth
  gentle: {
    damping: 30,
    stiffness: 180,
    mass: 1.2,
  },
  // Zero bounce (like CSS ease-out)
  noBounce: {
    damping: 40,
    stiffness: 300,
    mass: 1,
  },
} as const;

export const easing = {
  // Standard easing
  easeIn: Easing.in(Easing.cubic),
  easeOut: Easing.out(Easing.cubic),
  easeInOut: Easing.inOut(Easing.cubic),
  // iOS-like spring easing
  ios: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  // Smooth deceleration
  decelerate: Easing.bezier(0.0, 0.0, 0.2, 1.0),
  // Smooth acceleration
  accelerate: Easing.bezier(0.4, 0.0, 1.0, 1.0),
  // Sharp
  sharp: Easing.bezier(0.4, 0.0, 0.6, 1.0),
} as const;

export const transition = {
  timing: (d: keyof typeof duration = 'normal') => ({
    type: 'timing' as const,
    duration: duration[d],
    easing: easing.ios,
  }),
  spring: (config: keyof typeof spring = 'default') => ({
    type: 'spring' as const,
    ...spring[config],
  }),
} as const;

// Moti animation presets
export const motiPresets = {
  fadeIn: {
    from: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { type: 'timing', duration: duration.normal },
  },
  fadeInUp: {
    from: { opacity: 0, translateY: 20 },
    animate: { opacity: 1, translateY: 0 },
    transition: { type: 'spring', ...spring.default },
  },
  fadeInDown: {
    from: { opacity: 0, translateY: -20 },
    animate: { opacity: 1, translateY: 0 },
    transition: { type: 'spring', ...spring.default },
  },
  scaleIn: {
    from: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: 'spring', ...spring.snappy },
  },
  slideInRight: {
    from: { opacity: 0, translateX: 40 },
    animate: { opacity: 1, translateX: 0 },
    transition: { type: 'spring', ...spring.default },
  },
  popIn: {
    from: { opacity: 0, scale: 0.7 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: 'spring', ...spring.bouncy },
  },
} as const;

// Page transition configs for Expo Router
export const pageTransitions = {
  slideFromRight: {
    animation: 'slide_from_right',
    animationDuration: duration.slow,
  },
  slideFromBottom: {
    animation: 'slide_from_bottom',
    animationDuration: duration.slow,
  },
  fade: {
    animation: 'fade',
    animationDuration: duration.normal,
  },
} as const;
