import { useState } from 'react';
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { colors, type, spacing, radius, sizes } from '@/theme';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const COUNTRY_CODE = '+91';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const error = mobile.length > 0 && mobile.length !== 10 ? 'Enter a valid 10-digit mobile number' : undefined;

  return (
    <KeyboardAvoidingView style={styles.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ alignItems: 'center', marginTop: 48, marginBottom: spacing.section }}>
        <Image source={require('../../assets/images/hello-tailor-logo.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to Hello Tailor</Text>
        <Text style={styles.subtitle}>Enter your mobile number to continue</Text>

        <View style={{ marginTop: spacing.lg }}>
          <Text style={styles.label}>Mobile Number <Text style={{ color: colors.error }}>*</Text></Text>
          <View style={styles.row}>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{COUNTRY_CODE}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Input
                placeholder="98765 43210"
                keyboardType="number-pad"
                maxLength={10}
                value={mobile}
                onChangeText={setMobile}
                error={error}
              />
            </View>
          </View>
        </View>

        <Button
          label="Send OTP"
          disabled={mobile.length !== 10}
          onPress={() => router.push({ pathname: '/(auth)/otp', params: { mobile } })}
          style={{ marginTop: spacing.sm }}
        />

        <Text style={styles.terms}>
          By continuing, you agree to Hello Tailor's Terms of Service and Privacy Policy.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  logo: { width: 150, height: 150 },
  card: { paddingHorizontal: spacing.screenH, flex: 1 },
  title: { ...type.pageTitle, fontSize: 24, color: colors.text },
  subtitle: { ...type.body, color: colors.textSecondary, marginTop: 4 },
  label: { ...type.supporting, fontFamily: 'Inter_500Medium', color: colors.text, marginBottom: 6 },
  row: { flexDirection: 'row', gap: 10 },
  codeBox: {
    height: sizes.inputHeight,
    paddingHorizontal: 14,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: colors.border,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  codeText: { ...type.body, color: colors.text },
  terms: { ...type.supporting, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.lg },
});
