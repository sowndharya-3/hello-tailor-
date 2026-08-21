import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Logo } from '@/components/Logo';
import { colors, font } from '@/theme';

export default function Splash() {
  useEffect(() => {
    const t = setTimeout(() => router.replace('/(auth)/login'), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoWrap}>
        <Logo height={140} />
      </View>
      <Text style={styles.brand}>Hello Tailor</Text>
      <Text style={styles.tagline}>Tailor Partner App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.navy, alignItems: 'center', justifyContent: 'center' },
  logoWrap: { marginBottom: 28, backgroundColor: colors.white, borderRadius: 100, padding: 12 },
  brand: { fontFamily: font.bold, fontSize: 26, color: colors.white },
  tagline: { fontFamily: font.regular, fontSize: 14, color: '#C9D8E3', marginTop: 6 },
});
