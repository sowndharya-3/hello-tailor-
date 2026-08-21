import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, font } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'gold' | 'destructive' | 'disabled';

interface Props {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({ label, onPress, variant = 'primary', icon, loading, disabled, style, fullWidth = true }: Props) {
  const isDisabled = disabled || variant === 'disabled' || loading;
  const bg: Record<ButtonVariant, string> = {
    primary: colors.ocean,
    secondary: colors.white,
    gold: colors.gold,
    destructive: colors.error,
    disabled: colors.disabledBg,
  };
  const textColor: Record<ButtonVariant, string> = {
    primary: colors.white,
    secondary: colors.ocean,
    gold: colors.white,
    destructive: colors.white,
    disabled: colors.disabledText,
  };
  const border = variant === 'secondary' ? { borderWidth: 1.5, borderColor: colors.ocean } : {};

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg[isDisabled ? 'disabled' : variant], opacity: pressed && !isDisabled ? 0.85 : 1 },
        border,
        fullWidth && { alignSelf: 'stretch' },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor[variant]} />
      ) : (
        <View style={styles.row}>
          {icon && <Ionicons name={icon} size={18} color={textColor[isDisabled ? 'disabled' : variant]} style={{ marginRight: 8 }} />}
          <Text style={[styles.label, { color: textColor[isDisabled ? 'disabled' : variant] }]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: radii.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  label: { fontFamily: font.semibold, fontSize: 16 },
});
