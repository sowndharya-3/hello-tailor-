import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { colors, radius, sizes, type } from '@/theme';

type Variant = 'primary' | 'secondary' | 'gold' | 'destructive' | 'outline';

export default function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  style,
  icon,
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && { opacity: 0.85 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.secondary : colors.white} />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.label,
              variant === 'outline' && { color: colors.secondary },
              isDisabled && { color: colors.disabledText },
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: colors.secondary },
  secondary: { backgroundColor: colors.primary },
  gold: { backgroundColor: colors.gold },
  destructive: { backgroundColor: colors.error },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.secondary },
});

const styles = StyleSheet.create({
  base: {
    minHeight: sizes.buttonHeight,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
  },
  disabled: { backgroundColor: colors.disabledBg },
  label: { ...type.button, color: colors.white },
});

