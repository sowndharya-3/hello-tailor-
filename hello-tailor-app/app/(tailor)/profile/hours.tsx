// Ported from tailor-app/app/profile/hours.tsx — myHours/setHours already live at the store's
// top level (not nested under the tailor profile record).
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Button from '@/components/ui/Button';
import { WorkingHoursEditor } from '@/components/tailor/WorkingHoursEditor';
import { useStore } from '@/store/useStore';
import type { DayHours } from '@/store/useStore';
import { colors, spacing } from '@/theme';

export default function EditHours() {
  const myHours = useStore((s) => s.myHours);
  const setHours = useStore((s) => s.setHours);
  const [hours, setLocalHours] = useState<DayHours[]>(myHours);

  const onSave = () => {
    setHours(hours);
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Working Hours" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <WorkingHoursEditor hours={hours} onChange={setLocalHours} />
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
