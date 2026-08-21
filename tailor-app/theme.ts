// Hello Tailor — Tailor App design tokens

export const colors = {
  navy: '#173B57',
  ocean: '#0C7EBC',
  gold: '#D9A441',
  background: '#F8FAFC',
  card: '#FFFFFF',
  textPrimary: '#1F2937',
  textSecondary: '#667085',
  success: '#22A06B',
  error: '#D92D20',
  border: '#E4E7EC',
  disabledBg: '#EAECF0',
  disabledText: '#98A2B3',
  warning: '#F79009',
  infoBg: '#EFF8FF',
  goldLightBg: '#FFF8E7',
  white: '#FFFFFF',
  black: '#000000',
};

export const font = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const type = {
  pageTitle: { fontFamily: font.semibold, fontSize: 26, color: colors.textPrimary },
  sectionHeading: { fontFamily: font.semibold, fontSize: 19, color: colors.textPrimary },
  cardTitle: { fontFamily: font.semibold, fontSize: 17, color: colors.textPrimary },
  body: { fontFamily: font.regular, fontSize: 15, color: colors.textPrimary },
  supporting: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary },
  button: { fontFamily: font.semibold, fontSize: 16, color: colors.white },
  amount: { fontFamily: font.bold, fontSize: 24, color: colors.textPrimary },
};

export const radii = {
  card: 16,
  button: 13,
  search: 14,
  input: 12,
  sheet: 24,
  premium: 19,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const shadow = {
  card: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};
