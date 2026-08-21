import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import { complaints } from '../../../mocks/data';
import ScreenHeader from '../../../components/ui/ScreenHeader';
import Badge from '../../../components/ui/Badge';

export default function ComplaintDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const complaint = complaints.find((c) => c.id === id) ?? complaints[0];

  return (
    <View style={styles.wrap}>
      <ScreenHeader title={`Ticket #${complaint.id}`} />
      <ScrollView contentContainerStyle={{ padding: spacing.screenH }}>
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.category}>{complaint.category}</Text>
            <Badge label={complaint.status} tone={complaint.status === 'Resolved' ? 'success' : 'warning'} />
          </View>
          <Text style={styles.meta}>Order: {complaint.orderId} • Raised {complaint.date}</Text>
          <Text style={styles.desc}>{complaint.description}</Text>
        </View>

        <Text style={styles.sectionTitle}>Admin Response</Text>
        <View style={styles.responseCard}>
          <Ionicons name="chatbox-ellipses-outline" size={18} color={colors.secondary} />
          <Text style={styles.responseText}>{complaint.adminResponse || 'No response yet. Our team typically responds within 48 hours.'}</Text>
        </View>

        {complaint.resolution ? (
          <>
            <Text style={styles.sectionTitle}>Resolution</Text>
            <View style={styles.resolutionCard}>
              <Ionicons name="checkmark-circle-outline" size={18} color={colors.success} />
              <Text style={styles.resolutionText}>{complaint.resolution}</Text>
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  card: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner, marginBottom: spacing.section },
  category: { ...type.cardTitle, fontSize: 16, color: colors.text },
  meta: { ...type.supporting, color: colors.textSecondary, marginTop: 4 },
  desc: { ...type.body, color: colors.textSecondary, marginTop: 10 },
  sectionTitle: { ...type.sectionHeading, fontSize: 16, color: colors.text, marginBottom: 8 },
  responseCard: { flexDirection: 'row', gap: 8, backgroundColor: colors.infoBg, borderRadius: radius.card, padding: spacing.cardInner, marginBottom: spacing.section },
  responseText: { flex: 1, ...type.body, color: colors.secondary },
  resolutionCard: { flexDirection: 'row', gap: 8, backgroundColor: '#E7F7EF', borderRadius: radius.card, padding: spacing.cardInner },
  resolutionText: { flex: 1, ...type.body, color: colors.success },
});
