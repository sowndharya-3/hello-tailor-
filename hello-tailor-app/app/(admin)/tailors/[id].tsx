import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, font, spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import { ReasonSheet } from '@/components/tailor/ReasonSheet';
import { STATUS_TONE } from '@/components/admin/FieldText';
import { inr } from '@/components/admin/analyticsData';

const VERIFICATION_REJECT_REASONS = ['Documents unclear/incomplete', 'Shop address could not be verified', 'Duplicate registration', 'Other'];

export default function TailorDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tailor = useStore((s) => s.tailors.find((t) => t.id === id));
  const bookings = useStore(useShallow((s) => s.bookings.filter((b) => b.tailorId === id)));
  const updateTailorStatus = useStore((s) => s.updateTailorStatus);
  const updateTailorVerification = useStore((s) => s.updateTailorVerification);
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  if (!tailor) return <EmptyState icon="cut-outline" title="Tailor not found" message="This tailor record does not exist." />;

  const blocked = tailor.status === 'Blocked';
  const completedOrders = bookings.filter((b) => b.status === 'Delivered').length;

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <ScreenHeader title={tailor.shopName} subtitle={tailor.id} />

      <Card style={styles.profileCard}>
        <Avatar uri={tailor.image} name={tailor.name} size={64} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{tailor.shopName}</Text>
          <Text style={styles.sub}>{tailor.name} · {tailor.phone} · {tailor.email}</Text>
          <Text style={styles.sub}>{tailor.locality}, {tailor.city}, {tailor.state}</Text>
          <StarRating rating={tailor.rating} reviewCount={tailor.reviewCount} />
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            <Badge label={tailor.type} tone={tailor.type === 'Shop' ? 'navy' : 'info'} withIcon={false} />
            <Badge label={tailor.status} tone={STATUS_TONE[tailor.status]} />
            <Badge label={tailor.verification} tone={STATUS_TONE[tailor.verification]} />
            {tailor.membership !== 'None' && <Badge label={`${tailor.membership} Member`} tone="gold" />}
          </View>
        </View>
      </Card>

      <View style={styles.actionsRow}>
        {tailor.verification === 'Pending' && (
          <>
            <Button label="Approve / Verify" onPress={() => updateTailorVerification(tailor.id, 'Verified')} style={{ flex: 1 }} />
            <Button label="Reject" variant="destructive" onPress={() => setRejectOpen(true)} style={{ flex: 1 }} />
          </>
        )}
        <Button label={blocked ? 'Unblock' : 'Block'} variant={blocked ? 'primary' : 'destructive'} onPress={() => setConfirmBlock(true)} style={{ flex: 1 }} />
      </View>

      <View style={styles.statsRow}>
        <Stat label="Total Orders" value={bookings.length.toString()} />
        <Stat label="Completed" value={completedOrders.toString()} />
        <Stat label="Income" value={inr(tailor.income)} />
        <Stat label="Commission Paid" value={inr(tailor.commissionPaid)} />
      </View>

      <Text style={styles.sectionTitle}>Services</Text>
      <Card noPadding style={{ padding: spacing.md, marginBottom: spacing.md }}>
        {tailor.services.map((s) => (
          <View key={s.id} style={styles.listRow}>
            <Text style={styles.rowTitle}>{s.name}</Text>
            <Text style={styles.rowAmount}>{inr(s.price)} {s.unit}</Text>
          </View>
        ))}
      </Card>

      <Text style={styles.sectionTitle}>Recent Orders</Text>
      <Card noPadding style={{ padding: spacing.md, marginBottom: spacing.xl }}>
        {bookings.length === 0 ? (
          <Text style={styles.empty}>No orders yet.</Text>
        ) : bookings.slice(0, 15).map((b) => (
          <View key={b.id} style={styles.listRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{b.id} · {b.customerName}</Text>
              <Text style={styles.rowSub}>{b.category} · {new Date(b.bookingDate).toLocaleDateString('en-IN')}</Text>
            </View>
            <Text style={styles.rowAmount}>{inr(b.amount)}</Text>
            <Badge label={b.status} tone={b.status === 'Delivered' ? 'success' : b.status === 'Cancelled' || b.status === 'Rejected' ? 'error' : 'info'} />
          </View>
        ))}
      </Card>

      <ConfirmDialog
        visible={confirmBlock}
        title={blocked ? 'Unblock Tailor' : 'Block Tailor'}
        message={`Are you sure you want to ${blocked ? 'unblock' : 'block'} ${tailor.shopName}?`}
        confirmLabel={blocked ? 'Unblock' : 'Block'}
        destructive={!blocked}
        onCancel={() => setConfirmBlock(false)}
        onConfirm={() => { updateTailorStatus(tailor.id, blocked ? 'Active' : 'Blocked'); setConfirmBlock(false); }}
      />

      <ReasonSheet
        visible={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={() => { updateTailorVerification(tailor.id, 'Rejected'); setRejectOpen(false); }}
        title="Reject Verification"
        reasons={VERIFICATION_REJECT_REASONS}
        confirmLabel="Reject Tailor"
        confirmMessage="This tailor's verification will be marked as rejected."
      />
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card style={{ flex: 1, minWidth: 130 }}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  profileCard: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, marginBottom: spacing.md, flexWrap: 'wrap' },
  name: { fontFamily: font.bold, fontSize: 18, color: colors.text },
  sub: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg, flexWrap: 'wrap' },
  statsRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg, flexWrap: 'wrap' },
  statValue: { fontFamily: font.bold, fontSize: 18, color: colors.navy },
  statLabel: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.navy, marginBottom: spacing.sm, marginTop: spacing.sm },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.border },
  rowTitle: { fontFamily: font.medium, fontSize: 13, color: colors.text },
  rowSub: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  rowAmount: { fontFamily: font.semibold, fontSize: 13, color: colors.navy, marginRight: 8 },
  empty: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, paddingVertical: 12 },
});
