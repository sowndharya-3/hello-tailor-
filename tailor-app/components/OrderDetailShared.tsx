import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { StatusPill } from '@/components/ui/Misc';
import type { Order } from '@/data/mockData';
import { colors, font, spacing } from '@/theme';

export function CustomerInfoCard({ order }: { order: Order }) {
  return (
    <Card>
      <View style={styles.row}>
        <Image source={{ uri: order.customerAvatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{order.customerName}</Text>
          <Text style={styles.sub}>{order.category}</Text>
        </View>
        <Text style={styles.orderId}>{order.id}</Text>
      </View>
      <View style={styles.divider} />
      <InfoLine icon="calendar-outline" label={`Booked ${new Date(order.bookingDate).toLocaleDateString('en-IN')}`} />
      <InfoLine icon="cube-outline" label={`Deliver by ${new Date(order.deliveryDate).toLocaleDateString('en-IN')}`} />
      <InfoLine icon="location-outline" label={order.location} />
      <InfoLine icon={order.pickupType === 'Home Pickup' ? 'home-outline' : 'storefront-outline'} label={order.pickupType} />
    </Card>
  );
}

function InfoLine({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.infoLine}>
      <Ionicons name={icon} size={15} color={colors.textSecondary} />
      <Text style={styles.infoText}>{label}</Text>
    </View>
  );
}

export function CustomerNotesCard({ notes }: { notes?: string }) {
  if (!notes) return null;
  return (
    <Card style={{ backgroundColor: colors.goldLightBg, borderColor: '#F0DDAE' }}>
      <View style={styles.row}>
        <Ionicons name="chatbox-ellipses-outline" size={18} color="#9C7523" />
        <Text style={styles.notesTitle}>Customer Notes</Text>
      </View>
      <Text style={styles.notesText}>{notes}</Text>
    </Card>
  );
}

export function FinancialSummaryCard({ order }: { order: Order }) {
  const balance = order.amount - order.advanceAmount;
  return (
    <Card>
      <Text style={styles.sectionTitle}>Financial Summary</Text>
      <View style={styles.finRow}>
        <Text style={styles.finLabel}>Total Amount</Text>
        <Text style={styles.finTotal}>₹{order.amount.toLocaleString('en-IN')}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.finRow}>
        <View>
          <Text style={styles.finLabel}>Advance Amount</Text>
          <Text style={styles.finValue}>₹{order.advanceAmount.toLocaleString('en-IN')}</Text>
        </View>
        <StatusPill label={order.advancePaid} tone={order.advancePaid === 'Paid' ? 'success' : 'warning'} />
      </View>
      <View style={styles.finRow}>
        <View>
          <Text style={styles.finLabel}>Balance Amount</Text>
          <Text style={styles.finValue}>₹{balance.toLocaleString('en-IN')}</Text>
        </View>
        <StatusPill label={order.balancePaid} tone={order.balancePaid === 'Paid' ? 'success' : 'warning'} />
      </View>
    </Card>
  );
}

export function MeasurementsPreviewCard({ order, onOpen }: { order: Order; onOpen: () => void }) {
  return (
    <Pressable onPress={onOpen}>
      <Card>
        <View style={styles.row}>
          <Ionicons name="body-outline" size={18} color={colors.ocean} />
          <Text style={[styles.sectionTitle, { marginLeft: 8, marginBottom: 0, flex: 1 }]}>Customer Measurements</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </View>
        <Text style={styles.sub}>{order.measurements.length} garment{order.measurements.length > 1 ? 's' : ''} · tap to view details</Text>
      </Card>
    </Pressable>
  );
}

export function DesignPhotosPreviewCard({ order, onOpen }: { order: Order; onOpen: () => void }) {
  return (
    <Pressable onPress={onOpen}>
      <Card>
        <View style={styles.row}>
          <Ionicons name="images-outline" size={18} color={colors.ocean} />
          <Text style={[styles.sectionTitle, { marginLeft: 8, marginBottom: 0, flex: 1 }]}>Design Reference Photos</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </View>
        <View style={{ flexDirection: 'row', marginTop: spacing.sm }}>
          {order.designPhotos.slice(0, 3).map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.thumb} />
          ))}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: spacing.md },
  name: { fontFamily: font.semibold, fontSize: 16, color: colors.textPrimary },
  sub: { fontFamily: font.regular, fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  orderId: { fontFamily: font.medium, fontSize: 11, color: colors.textSecondary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  infoLine: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  infoText: { fontFamily: font.regular, fontSize: 13, color: colors.textPrimary, marginLeft: 8, flex: 1 },
  notesTitle: { fontFamily: font.semibold, fontSize: 14, color: '#9C7523', marginLeft: 8 },
  notesText: { fontFamily: font.regular, fontSize: 13, color: colors.textPrimary, marginTop: spacing.sm, lineHeight: 19 },
  sectionTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.textPrimary, marginBottom: spacing.md },
  finRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  finLabel: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary },
  finTotal: { fontFamily: font.bold, fontSize: 22, color: colors.textPrimary },
  finValue: { fontFamily: font.semibold, fontSize: 15, color: colors.textPrimary, marginTop: 2 },
  thumb: { width: 56, height: 56, borderRadius: 10, marginRight: 8 },
});
