import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader, StepProgress } from '@/components/ui/Misc';
import { Button } from '@/components/ui/Button';
import { WorkingHoursEditor } from '@/components/WorkingHoursEditor';
import { useStore, DEFAULT_HOURS } from '@/store/useStore';
import type { DayHours } from '@/store/useStore';
import { colors, spacing } from '@/theme';

export default function HoursStep() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const isShop = profile.tailorType === 'shop';
  const [hours, setHours] = useState<DayHours[]>(DEFAULT_HOURS);

  const onNext = () => {
    updateProfile({ hours });
    router.push('/registration/photos');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Working Hours" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <StepProgress step={isShop ? 6 : 5} total={isShop ? 7 : 6} label="Working Hours" />
        <WorkingHoursEditor hours={hours} onChange={setHours} />
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Continue" onPress={onNext} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 20 },
  footer: { padding: spacing.xl, backgroundColor: colors.background },
});
