import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { ScreenHeader } from '@/components/ui/Misc';
import { Button } from '@/components/ui/Button';
import { WorkingHoursEditor } from '@/components/WorkingHoursEditor';
import { useStore } from '@/store/useStore';
import type { DayHours } from '@/store/useStore';
import { colors, spacing } from '@/theme';

export default function EditHours() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const [hours, setHours] = useState<DayHours[]>(profile.hours);

  const onSave = () => {
    updateProfile({ hours });
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Working Hours" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <WorkingHoursEditor hours={hours} onChange={setHours} />
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Save Changes" onPress={onSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: 20 },
  footer: { padding: spacing.xl, backgroundColor: colors.background },
});
