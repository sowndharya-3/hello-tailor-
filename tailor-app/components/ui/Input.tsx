import { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, font, spacing } from '@/theme';

interface Props extends TextInputProps {
  label?: string;
  optional?: boolean;
  error?: string;
  success?: boolean;
  hint?: string;
}

export function Input({ label, optional, error, success, hint, style, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.error : success ? colors.success : focused ? colors.ocean : colors.border;

  return (
    <View style={{ marginBottom: spacing.lg }}>
      {label && (
        <Text style={styles.label}>
          {label}{' '}
          {optional ? <Text style={styles.optional}>(optional)</Text> : <Text style={styles.mandatory}>*</Text>}
        </Text>
      )}
      <View style={[styles.inputWrap, { borderColor }]}>
        <TextInput
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, style]}
          onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
          {...rest}
        />
        {success && <Ionicons name="checkmark-circle" size={20} color={colors.success} />}
        {error && <Ionicons name="alert-circle" size={20} color={colors.error} />}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: font.medium, fontSize: 14, color: colors.textPrimary, marginBottom: 6 },
  optional: { fontFamily: font.regular, color: colors.textSecondary },
  mandatory: { color: colors.error },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderWidth: 1.5,
    borderRadius: radii.input,
    paddingHorizontal: 14,
    backgroundColor: colors.white,
  },
  input: { flex: 1, fontFamily: font.regular, fontSize: 15, color: colors.textPrimary, paddingVertical: 10 },
  errorText: { fontFamily: font.regular, fontSize: 12, color: colors.error, marginTop: 4 },
  hintText: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 4 },
});
