import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { colors, radius, sizes, type, spacing } from '@/theme';

export default function Input({
  label,
  optional,
  error,
  success,
  hint,
  ...rest
}: TextInputProps & { label?: string; optional?: boolean; error?: string; success?: string; hint?: string }) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? colors.error : success ? colors.success : focused ? colors.secondary : colors.border;
  return (
    <View style={{ marginBottom: spacing.md }}>
      {label ? (
        <Text style={styles.label}>
          {label} {optional ? <Text style={styles.optional}>(optional)</Text> : <Text style={styles.mandatory}>*</Text>}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.disabledText}
        style={[styles.input, { borderColor }]}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        {...rest}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {!error && success ? <Text style={styles.successText}>{success}</Text> : null}
      {!error && !success && hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.text, marginBottom: 6 },
  optional: { color: colors.textSecondary, fontFamily: 'Inter_400Regular' },
  mandatory: { color: colors.error },
  input: {
    height: sizes.inputHeight,
    borderWidth: 1.5,
    borderRadius: radius.input,
    paddingHorizontal: 16,
    ...type.body,
    color: colors.text,
    backgroundColor: colors.white,
  },
  errorText: { ...type.supporting, color: colors.error, marginTop: 4 },
  successText: { ...type.supporting, color: colors.success, marginTop: 4 },
  hint: { ...type.supporting, color: colors.textSecondary, marginTop: 4 },
});

