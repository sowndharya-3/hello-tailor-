// Splash — plays a short, professional logo entrance (fade + scale, a very subtle settle motion,
// no bounce/spring theatrics) then decides where to go next: first-ever launch -> onboarding;
// onboarding already completed -> the existing loggedIn/role branching this screen always had.
// The animation runs once via a single mount effect; the navigation decision runs in its own
// effect gated on the async AsyncStorage read finishing, so neither can loop or double-fire.
import { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, Easing } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { colors, type, spacing } from '@/theme';
import { useStore } from '@/store/useStore';

export const ONBOARDING_COMPLETE_KEY = 'ht_onboarding_complete';

export default function Splash() {
  const loggedIn = useStore((s) => s.loggedIn);
  const role = useStore((s) => s.role);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);
  const bgOpacity = useSharedValue(0);

  const [ready, setReady] = useState(false); // AsyncStorage read has resolved
  const [onboardingDone, setOnboardingDone] = useState(false);

  // Animation: background fades in, then logo fades/scales into place, then a very small settle.
  // Runs exactly once — shared values are refs, not React state, so this can't re-trigger itself.
  useEffect(() => {
    bgOpacity.value = withTiming(1, { duration: 250, easing: Easing.out(Easing.quad) });
    opacity.value = withTiming(1, { duration: 550, easing: Easing.out(Easing.cubic) });
    scale.value = withSequence(
      withTiming(1.03, { duration: 550, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 220, easing: Easing.inOut(Easing.quad) }),
    );
  }, [bgOpacity, opacity, scale]);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY)
      .then((value) => {
        if (!active) return;
        setOnboardingDone(value === 'true');
        setReady(true);
      })
      .catch(() => {
        if (!active) return;
        setOnboardingDone(false);
        setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      if (!onboardingDone) {
        router.replace('/onboarding' as any);
      } else if (!loggedIn) {
        router.replace('/(auth)/login');
      } else if (!role) {
        router.replace('/role-select');
      } else {
        router.replace(`/(${role})` as any);
      }
    }, 1400);
    return () => clearTimeout(t);
  }, [ready, onboardingDone, loggedIn, role]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  const bgStyle = useAnimatedStyle(() => ({ opacity: bgOpacity.value }));

  return (
    <Animated.View style={[styles.wrap, bgStyle]}>
      <View style={{ flex: 1 }} />
      <Animated.View style={logoStyle}>
        <Image source={require('../assets/images/hello-tailor-logo.png')} style={styles.logo} resizeMode="contain" />
      </Animated.View>
      <Animated.Text style={[styles.tagline, logoStyle]}>Perfect Fit. Trusted Tailors.</Animated.Text>
      <View style={{ flex: 1 }} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg, alignItems: 'center' },
  logo: { width: 220, height: 220, marginBottom: spacing.lg },
  tagline: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.textSecondary, letterSpacing: 0.3 },
});
