// Phase 12/13/14/16 — the design-approval card. One component renders every status a
// DesignVersion can be in (pending / approved / changes_requested / revised) rather than a
// separate "approved card" vs "pending card" vs "changes card", since they're the same layout
// with a different status pill + action row — that's also what makes Phase 16 versioning trivial
// to render: map over every DesignVersion for a conversation and this component shows each one
// correctly frozen in whatever state it was left in.
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { colors, font, radius, spacing } from '@/theme';
import type { DesignVersion } from '@/store/chatTypes';

const STATUS_LABEL: Record<DesignVersion['status'], string> = {
  pending: 'Waiting for Approval',
  approved: 'Design Approved',
  changes_requested: 'Changes Requested',
  revised: 'Revised',
};
const STATUS_COLOR: Record<DesignVersion['status'], string> = {
  pending: colors.warning,
  approved: colors.success,
  changes_requested: colors.error,
  revised: colors.secondary,
};

export default function DesignApprovalCard({
  version,
  viewerRole,
  onApprove,
  onRequestChanges,
  onImagePress,
}: {
  version: DesignVersion;
  viewerRole: 'customer' | 'tailor';
  onApprove?: () => void;
  onRequestChanges?: () => void;
  onImagePress: () => void;
}) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const canAct = viewerRole === 'customer' && version.status === 'pending';

  return (
    <View style={styles.card}>
      <Text style={styles.title}>DESIGN PREVIEW — V{version.version}</Text>
      <Pressable onPress={onImagePress}>
        <Image source={{ uri: version.imageUrl }} style={styles.image} resizeMode="cover" />
      </Pressable>

      {version.bookingId ? <Text style={styles.bookingLine}>Booking #{version.bookingId}</Text> : null}
      {version.tailorNote ? <Text style={styles.note}>“{version.tailorNote}”</Text> : null}

      <View style={[styles.statusPill, { backgroundColor: `${STATUS_COLOR[version.status]}1A` }]}>
        <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[version.status] }]} />
        <Text style={[styles.statusText, { color: STATUS_COLOR[version.status] }]}>{STATUS_LABEL[version.status]}</Text>
      </View>

      {canAct ? (
        <View style={styles.actions}>
          <Button label="Approve Design" onPress={() => setConfirmVisible(true)} style={{ marginBottom: spacing.sm }} />
          <Button label="Request Changes" variant="outline" onPress={onRequestChanges} />
        </View>
      ) : null}

      <ConfirmDialog
        visible={confirmVisible}
        title="Approve Design"
        message="Are you sure you want to approve this design?"
        confirmLabel="Approve"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={() => {
          setConfirmVisible(false);
          onApprove?.();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.card, padding: spacing.md, maxWidth: '85%', marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  title: { fontFamily: font.semibold, fontSize: 11, letterSpacing: 0.5, color: colors.gold, marginBottom: 8 },
  image: { width: '100%', height: 220, borderRadius: 12, backgroundColor: colors.disabledBg },
  bookingLine: { fontFamily: font.medium, fontSize: 12, color: colors.secondary, marginTop: 10 },
  note: { fontFamily: font.regular, fontSize: 13, color: colors.text, marginTop: 6, lineHeight: 18 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, marginTop: 12 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontFamily: font.semibold, fontSize: 11.5 },
  actions: { marginTop: spacing.md },
});
