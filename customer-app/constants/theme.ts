// Hello Tailor design system tokens — reuse everywhere, do not hardcode colors/spacing elsewhere.
export const colors = {
  primary: '#173B57', // Deep Navy
  secondary: '#0C7EBC', // Ocean Blue
  gold: '#D9A441', // Tailor Gold
  bg: '#F8FAFC',
  card: '#FFFFFF',
  text: '#1F2937',
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
  overlay: 'rgba(23,59,87,0.55)',
};

export const font = {
  family: 'Inter_400Regular',
  familyMedium: 'Inter_500Medium',
  familySemibold: 'Inter_600SemiBold',
  familyBold: 'Inter_700Bold',
};

export const type = {
  pageTitle: { fontFamily: font.familySemibold, fontSize: 26 },
  sectionHeading: { fontFamily: font.familySemibold, fontSize: 19 },
  cardTitle: { fontFamily: font.familySemibold, fontSize: 17 },
  body: { fontFamily: font.family, fontSize: 15 },
  supporting: { fontFamily: font.family, fontSize: 13 },
  button: { fontFamily: font.familySemibold, fontSize: 16 },
  price: { fontFamily: font.familyBold, fontSize: 24 },
};

export const radius = {
  card: 16,
  button: 13,
  search: 14,
  input: 12,
  sheet: 24,
  premium: 19,
  pill: 999,
};

export const spacing = {
  screenH: 18,
  cardInner: 16,
  section: 24,
  related: 10,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const sizes = {
  buttonHeight: 52,
  inputHeight: 52,
  tapTarget: 46,
};

export const shadow = {
  card: {
    shadowColor: '#173B57',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
};
