import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { colors, type, spacing } from '../constants/theme';
import { useApp } from '../store/AppState';

export default function Splash() {
  const { loggedIn } = useApp();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace(loggedIn ? '/(tabs)' : '/(auth)/login');
    }, 1400);
    return () => clearTimeout(t);
  }, [loggedIn]);

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
