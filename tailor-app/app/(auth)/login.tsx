import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Logo } from '@/components/Logo';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { colors, font, spacing } from '@/theme';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const setAuthPhone = useStore((s) => s.setAuthPhone);

  const onContinue = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Enter a valid 10-digit Indian mobile number');
      return;
    }
    setError('');
    setAuthPhone(phone);
    router.push('/(auth)/otp');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.logoWrap}>
        <Logo height={88} />
      </View>
      <Text style={styles.title}>Welcome, Tailor Partner</Text>
      <Text style={styles.subtitle}>Manage bookings, orders and your shop — all in one place.</Text>

      <View style={{ marginTop: spacing.xxl, width: '100%' }}>
        <Input
          label="Mobile Number"
          placeholder="98765 43210"
          keyboardType="number-pad"
          maxLength={10}
          value={phone}
          onChangeText={(v) => setPhone(v.replace(/[^0-9]/g, ''))}
          error={error}
          hint="We'll send a 6-digit OTP to verify this number"
        />
        <Button label="Send OTP" onPress={onContinue} />
      </View>

      <Text style={styles.terms}>
        By continuing, you agree to Hello Tailor's{' '}
        <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: 80 },
  logoWrap: { marginBottom: spacing.xl },
  title: { fontFamily: font.semibold, fontSize: 24, color: colors.textPrimary, textAlign: 'center' },
  subtitle: { fontFamily: font.regular, fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8, paddingHorizontal: 12 },
  terms: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, textAlign: 'center', marginTop: 'auto', marginBottom: 24, lineHeight: 18 },
  link: { color: colors.ocean, fontFamily: font.medium },
});
