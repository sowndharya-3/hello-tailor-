import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing } from '@/theme';

export default function Pending() {
  useEffect(() => {
    const t = setTimeout(() => router.replace('/registration/success'), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="time-outline" size={44} color={colors.gold} />
      </View>
      <Text style={styles.title}>Verification Pending</Text>
      <Text style={styles.subtitle}>
        We're reviewing your details. This usually takes under 24 hours.{'\n'}You'll be notified once your profile is verified.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl },
  iconWrap: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.goldLightBg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  title: { fontFamily: font.semibold, fontSize: 22, color: colors.textPrimary },
  subtitle: { fontFamily: font.regular, fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 10, lineHeight: 20 },
});
