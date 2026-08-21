// Ported from tailor-app/app/order/[id]/measurements.tsx unchanged in structure.
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Card from '@/components/ui/Card';
import { useStore } from '@/store/useStore';
import { colors, font, spacing } from '@/theme';

export default function Measurements() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useStore((s) => s.bookings.find((b) => b.id === id));

  if (!order) return null;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Measurements" subtitle={order.customerName} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {order.measurements.map((m) => (
          <Card key={m.garment} style={{ marginBottom: spacing.md }}>
            <Text style={styles.garment}>{m.garment}</Text>
            <View style={styles.divider} />
            {m.fields.map((f) => (
              <View key={f.label} style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>{f.label}</Text>
                <Text style={styles.fieldValue}>{f.value}</Text>
              </View>
            ))}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: 40 },
  garment: { fontFamily: font.semibold, fontSize: 16, color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  fieldLabel: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary },
  fieldValue: { fontFamily: font.semibold, fontSize: 13, color: colors.textPrimary },
});
