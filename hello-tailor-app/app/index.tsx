import { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { colors, type, spacing } from '@/theme';
import { useStore } from '@/store/useStore';

export default function Splash() {
  const loggedIn = useStore((s) => s.loggedIn);
  const role = useStore((s) => s.role);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!loggedIn) router.replace('/(auth)/login');
      else if (!role) router.replace('/role-select');
      else router.replace(`/(${role})` as any);
    }, 1400);
    return () => clearTimeout(t);
  }, [loggedIn, role]);

  return (
    <View style={styles.wrap}>
      <View style={{ flex: 1 }} />
      <Image
        source={require('../assets/images/hello-tailor-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.tagline}>Perfect Fit. Trusted Tailors.</Text>
      <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 56 }}>
        <ActivityIndicator color={colors.secondary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, alignItems: 'center' },
  logo: { width: 220, height: 220, marginBottom: spacing.lg },
  tagline: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.textSecondary, letterSpacing: 0.3 },
});
