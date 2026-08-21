import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { colors, font, radii, spacing } from '@/theme';

const OTP_LEN = 6;
const CORRECT_OTP = '123456'; // ponytail: mock-only fixed OTP, no real SMS backend

export default function Otp() {
  const phone = useStore((s) => s.authPhone);
  const [digits, setDigits] = useState<string[]>(Array(OTP_LEN).fill(''));
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setInterval(() => setTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timer]);

  const onChangeDigit = (val: string, idx: number) => {
    const clean = val.replace(/[^0-9]/g, '');
    const next = [...digits];
    next[idx] = clean.slice(-1);
    setDigits(next);
    setError('');
    if (clean && idx < OTP_LEN - 1) inputs.current[idx + 1]?.focus();
  };

  const verify = () => {
    const code = digits.join('');
    if (code.length < OTP_LEN) { setError('Enter the complete 6-digit OTP'); return; }
    if (code !== CORRECT_OTP) { setError('Incorrect OTP. Please try again (hint: 123456)'); return; }
    router.push('/(auth)/tailor-type');
  };

  return (
    <View style={styles.container}>
      <Logo height={64} />
      <Text style={styles.title}>Verify Your Number</Text>
      <Text style={styles.subtitle}>Enter the 6-digit code sent to +91 {phone || '98765 43210'}</Text>

      <View style={styles.otpRow}>
        {digits.map((d, i) => (
          <TextInput
            key={i}
            ref={(r) => { inputs.current[i] = r; }}
            value={d}
            onChangeText={(v) => onChangeDigit(v, i)}
            keyboardType="number-pad"
            maxLength={1}
            style={[styles.otpBox, error && styles.otpBoxError]}
          />
        ))}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.resendRow}>
        {timer > 0 ? (
          <Text style={styles.resendText}>Resend OTP in 00:{String(timer).padStart(2, '0')}</Text>
        ) : (
          <Pressable onPress={() => setTimer(30)}>
            <Text style={styles.resendLink}>Resend OTP</Text>
          </Pressable>
        )}
      </View>

      <Button label="Verify & Continue" onPress={verify} style={{ marginTop: spacing.xl }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: 100 },
  title: { fontFamily: font.semibold, fontSize: 22, color: colors.textPrimary, marginTop: 20 },
  subtitle: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, marginTop: 8, textAlign: 'center' },
  otpRow: { flexDirection: 'row', marginTop: spacing.xxl, gap: 8 },
  otpBox: {
    width: 44, height: 52, borderWidth: 1.5, borderColor: colors.border, borderRadius: radii.input,
    textAlign: 'center', fontFamily: font.semibold, fontSize: 20, color: colors.textPrimary, backgroundColor: colors.white,
  },
  otpBoxError: { borderColor: colors.error },
  errorText: { fontFamily: font.regular, fontSize: 12, color: colors.error, marginTop: 10 },
  resendRow: { marginTop: spacing.lg },
  resendText: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary },
  resendLink: { fontFamily: font.semibold, fontSize: 13, color: colors.ocean },
});
