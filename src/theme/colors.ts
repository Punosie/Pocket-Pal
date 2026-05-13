export const palette = {
  primary: {
    50: '#F0EDFF',
    100: '#E0D9FF',
    200: '#C2B3FF',
    300: '#A38DFF',
    400: '#8566FF',
    500: '#6C5CE7',
    600: '#5A4BD1',
    700: '#4838B5',
    800: '#362899',
    900: '#241A7D',
    950: '#120D61',
  },
  accent: {
    50: '#FFF5F0',
    100: '#FFE8D9',
    200: '#FFD0B3',
    300: '#FFB88C',
    400: '#FFA066',
    500: '#FF7F50',
    600: '#E8633A',
    700: '#CC4825',
    800: '#B03013',
    900: '#931B05',
  },
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    900: '#064E3B',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    900: '#78350F',
  },
  danger: {
    50: '#FFF1F2',
    100: '#FFE4E6',
    400: '#FB7185',
    500: '#F43F5E',
    600: '#E11D48',
    900: '#881337',
  },
  dark: {
    50: '#F8F8FC',
    100: '#EEEEF6',
    200: '#D4D4E8',
    300: '#ADADCC',
    400: '#7B7BA8',
    500: '#5A5A84',
    600: '#3D3D63',
    700: '#252542',
    800: '#16162E',
    900: '#0D0D1F',
    950: '#0A0A0F',
  },
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

export const darkTheme = {
  // Backgrounds
  background: {
    primary: palette.dark[950],
    secondary: palette.dark[900],
    tertiary: palette.dark[800],
    elevated: 'rgba(255, 255, 255, 0.04)',
    glass: 'rgba(255, 255, 255, 0.06)',
    glassStrong: 'rgba(255, 255, 255, 0.12)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },

  // Text
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
    tertiary: 'rgba(255, 255, 255, 0.4)',
    disabled: 'rgba(255, 255, 255, 0.2)',
    inverse: palette.dark[950],
    brand: palette.primary[400],
    success: palette.success[400],
    warning: palette.warning[400],
    danger: palette.danger[400],
  },

  // Borders
  border: {
    subtle: 'rgba(255, 255, 255, 0.06)',
    default: 'rgba(255, 255, 255, 0.10)',
    strong: 'rgba(255, 255, 255, 0.18)',
    brand: palette.primary[500],
  },

  // Brand
  brand: {
    primary: palette.primary[500],
    primaryLight: palette.primary[400],
    primaryDark: palette.primary[600],
    accent: palette.accent[500],
    accentLight: palette.accent[400],
  },

  // Status
  status: {
    success: palette.success[500],
    successBg: 'rgba(16, 185, 129, 0.12)',
    warning: palette.warning[500],
    warningBg: 'rgba(245, 158, 11, 0.12)',
    danger: palette.danger[500],
    dangerBg: 'rgba(244, 63, 94, 0.12)',
    info: palette.primary[400],
    infoBg: 'rgba(108, 92, 231, 0.12)',
  },

  // Gradients (as arrays for LinearGradient)
  gradient: {
    primary: [palette.primary[600], palette.primary[400]],
    accent: [palette.accent[600], palette.accent[400]],
    dark: [palette.dark[900], palette.dark[950]],
    success: [palette.success[600], palette.success[400]],
    danger: [palette.danger[600], palette.danger[400]],
    card: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)'],
    mesh: [palette.primary[950], palette.dark[950], palette.dark[900]],
  },

  // Category colors
  category: {
    food_dining: '#FF6B6B',
    shopping: '#4ECDC4',
    transport: '#45B7D1',
    entertainment: '#96CEB4',
    bills_utilities: '#FFEAA7',
    health_medical: '#DDA0DD',
    education: '#98D8C8',
    travel: '#F7DC6F',
    grocery: '#82E0AA',
    fuel: '#F0A500',
    housing_rent: '#BB8FCE',
    investments: '#52BE80',
    insurance: '#5DADE2',
    personal_care: '#F1948A',
    gifts_donations: '#F8C471',
    salary: '#58D68D',
    freelance: '#76D7C4',
    business: '#85C1E9',
    refund: '#73C6B6',
    cashback: '#A9DFBF',
    transfer_in: '#7DCEA0',
    transfer_out: '#F1948A',
    subscriptions: '#A569BD',
    other: '#AAB7B8',
  },
} as const;

export type DarkTheme = typeof darkTheme;
export type ThemeColors = typeof darkTheme;

export const categoryColors: Record<string, string> = darkTheme.category;
