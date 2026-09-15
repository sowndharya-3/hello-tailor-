// Onboarding — 3 slides in one screen (an internal paged ScrollView) rather than 3 separate
// routes: it avoids router-level back-button/stack complexity for what's really one linear flow,
// and completion (AsyncStorage flag) only needs to be written from one place. Shown once per
// install; Splash checks the flag and skips straight past this on every later launch.
import { useRef, useState } from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';
import { colors, font, radius, spacing } from '@/theme';
import { ONBOARDING_COMPLETE_KEY } from '../index';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HOW_IT_WORKS = [
  { icon: 'search-outline' as const, label: 'Find Your Tailor' },
  { icon: 'cut-outline' as const, label: 'Choose Stitching Service' },
  { icon: 'body-outline' as const, label: 'Share Measurements & Design' },
  { icon: 'calendar-outline' as const, label: 'Book Your Order' },
  { icon: 'navigate-outline' as const, label: 'Track Your Order' },
  { icon: 'checkmark-done-outline' as const, label: 'Get It Delivered / Collect' },
];

const BENEFITS = [
  { icon: 'location-outline' as const, label: 'Find nearby tailors' },
  { icon: 'body-outline' as const, label: 'Save measurements' },
  { icon: 'color-palette-outline' as const, label: 'Share designs' },
  { icon: 'chatbubbles-outline' as const, label: 'Chat with your tailor' },
  { icon: 'navigate-outline' as const, label: 'Track orders' },
  { icon: 'shield-checkmark-outline' as const, label: 'Secure payments' },
];

async function finishOnboarding(destination: '/(auth)/login') {
  try {
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
  } finally {
    router.replace(destination);
  }
}

export default function Onboarding() {
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);

  const goTo = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    setPage(index);
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setPage(index);
  };

  return (
    <View style={styles.wrap}>
      {page < 2 ? (
        <Pressable style={styles.skip} onPress={() => finishOnboarding('/(auth)/login')} hitSlop={10}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      ) : null}

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        style={{ flex: 1 }}
      >
        <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
          <View style={styles.heroIconWrap}>
            <Ionicons name="shirt" size={64} color={colors.secondary} />
          </View>
          <Text style={styles.headline}>Your Tailor, Just a Tap Away</Text>
          <Text style={styles.description}>
            Discover trusted tailors, book stitching services and manage your tailoring needs
            effortlessly.
          </Text>
        </View>

        <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
          <Text style={styles.headline}>How It Works</Text>
          <View style={styles.stepsList}>
            {HOW_IT_WORKS.map((step, i) => (
              <View key={step.label} style={styles.stepRow}>
                <View style={styles.stepIconWrap}>
                  <Ionicons name={step.icon} size={20} color={colors.secondary} />
                </View>
                <Text style={styles.stepNumber}>{i + 1}</Text>
                <Text style={styles.stepLabel}>{step.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
          <Text style={styles.headline}>Everything You Need, In One Place</Text>
          <View style={styles.benefitsGrid}>
            {BENEFITS.map((b) => (
              <View key={b.label} style={styles.benefitItem}>
                <View style={styles.benefitIconWrap}>
                  <Ionicons name={b.icon} size={20} color={colors.gold} />
                </View>
                <Text style={styles.benefitLabel}>{b.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.dot, page === i && styles.dotActive]} />
          ))}
        </View>

        {page < 2 ? (
          <Button label="Next" onPress={() => goTo(page + 1)} />
        ) : (
          <Button label="Get Started" onPress={() => finishOnboarding('/(auth)/login')} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  skip: { position: 'absolute', top: 54, right: spacing.lg, zIndex: 10, padding: 6 },
  skipText: { fontFamily: font.medium, fontSize: 14, color: colors.textSecondary },
  slide: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: 96, alignItems: 'center' },
  heroIconWrap: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: colors.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  headline: { fontFamily: font.semibold, fontSize: 24, color: colors.text, textAlign: 'center', marginBottom: spacing.md },
  description: { fontFamily: font.regular, fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, paddingHorizontal: spacing.md },
  stepsList: { width: '100%', marginTop: spacing.lg, gap: spacing.md },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.card, borderRadius: radius.card, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  stepIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.infoBg, alignItems: 'center', justifyContent: 'center' },
  stepNumber: { fontFamily: font.bold, fontSize: 13, color: colors.disabledText, width: 18 },
  stepLabel: { flex: 1, fontFamily: font.medium, fontSize: 14.5, color: colors.text },
  benefitsGrid: { width: '100%', marginTop: spacing.lg, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  benefitItem: { width: '47%', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.card, paddingVertical: spacing.lg, paddingHorizontal: spacing.sm, borderWidth: 1, borderColor: colors.border, gap: 8 },
  benefitIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.goldLightBg, alignItems: 'center', justifyContent: 'center' },
  benefitLabel: { fontFamily: font.medium, fontSize: 13, color: colors.text, textAlign: 'center' },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: 40, paddingTop: spacing.md, gap: spacing.lg },
  dots: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.disabledBg },
  dotActive: { backgroundColor: colors.secondary, width: 22 },
});
