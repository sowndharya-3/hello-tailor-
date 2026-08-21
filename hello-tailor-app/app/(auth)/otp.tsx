import { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TextInput, StyleSheet, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import Button from '@/components/ui/Button';
import { useStore } from '@/store/useStore';

const CORRECT_OTP = '123456'; // ponytail: mock backend, any code except this errors once for realism

export default function Otp() {
  const { mobile } = useLocalSearchParams<{ mobile: string }>();
  const login = useStore((s) => s.login);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [status, setStatus] = useState<'idle' | 'verifying' | 'error'>('idle');
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const setDigit = (i: number, v: string) => {
    const clean = v.replace(/[^0-9]/g, '').slice(-1);
    const next = [...digits];
    next[i] = clean;
    setDigits(next);
    setStatus('idle');
    if (clean && i < 5) inputs.current[i + 1]?.focus();
  };

  const code = digits.join('');

  const verify = () => {
    setStatus('verifying');
    setTimeout(() => {
      if (code === CORRECT_OTP) {
        login(mobile ?? '');
        router.replace('/role-select');
      } else {
        setStatus('error');
      }
    }, 900);
  };

  return (
    <View style={styles.wrap}>
      <Image source={require('../../assets/images/hello-tailor-logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Verify your number</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to +91 {mobile} · <Text style={{ fontFamily: 'Inter_500Medium' }}>use 123456</Text>
      </Text>

      <View style={styles.otpRow}>
        {digits.map((d, i) => (
          <TextInput
            key={i}
            ref={(r) => {
              inputs.current[i] = r;
            }}
            value={d}
            onChangeText={(v) => setDigit(i, v)}
            keyboardType="number-pad"
            maxLength={1}
            style={[styles.otpBox, status === 'error' && { borderColor: colors.error }]}
          />
        ))}
      </View>
      {status === 'error' ? <Text style={styles.errorText}>Incorrect OTP. Please try again.</Text> : null}

      <Button
        label="Verify & Continue"
        loading={status === 'verifying'}
        disabled={code.length !== 6}
        onPress={verify}
        style={{ marginTop: spacing.lg }}
      />

      <View style={styles.resendRow}>
        {timer > 0 ? (
          <Text style={styles.resendText}>Resend OTP in 00:{timer.toString().padStart(2, '0')}</Text>
        ) : (
          <Pressable onPress={() => setTimer(30)}>
            <Text style={styles.resendLink}>Resend OTP</Text>
          </Pressable>
        )}
        <Pressable onPress={() => router.back()}>
          <Text style={styles.resendLink}>Change Number</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.screenH, alignItems: 'center', paddingTop: 60 },
  logo: { width: 110, height: 110, marginBottom: spacing.lg },
  title: { ...type.pageTitle, fontSize: 22, color: colors.text },
  subtitle: { ...type.body, color: colors.textSecondary, textAlign: 'center', marginTop: 6, marginBottom: spacing.section },
  otpRow: { flexDirection: 'row', gap: 8 },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: radius.input,
    borderWidth: 1.5,
    borderColor: colors.border,
    textAlign: 'center',
    ...type.cardTitle,
    color: colors.text,
    backgroundColor: colors.white,
  },
  errorText: { ...type.supporting, color: colors.error, marginTop: 10 },
  resendRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: spacing.xl },
  resendText: { ...type.supporting, color: colors.textSecondary },
  resendLink: { ...type.supporting, fontFamily: 'Inter_600SemiBold', color: colors.secondary },
});
