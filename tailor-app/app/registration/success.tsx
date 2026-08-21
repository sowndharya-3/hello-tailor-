import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { colors, font, spacing } from '@/theme';

export default function Success() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons name="checkmark-circle" size={64} color={colors.success} />
      </View>
      <Text style={styles.title}>Registration Submitted!</Text>
      <Text style={styles.subtitle}>
        Welcome to Hello Tailor. Your profile is under review — you can explore your dashboard while you wait.
      </Text>
      <Button
        label="Go to Dashboard"
        onPress={() => router.replace('/(tabs)')}
        style={{ marginTop: spacing.xxl }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xxl },
  iconWrap: { marginBottom: spacing.xl },
  title: { fontFamily: font.semibold, fontSize: 24, color: colors.textPrimary, textAlign: 'center' },
  subtitle: { fontFamily: font.regular, fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 10, lineHeight: 20 },
});
