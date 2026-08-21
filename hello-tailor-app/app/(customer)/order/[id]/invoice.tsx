// Ported from customer-app/app/order/[id]/invoice.tsx, using Booking.amount/tax/discount/
// deliveryFee/advanceAmount instead of Order fields. balanceDue is computed (no stored field):
// amount + tax + deliveryFee - discount - advanceAmount.
import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import { useStore } from '@/store/useStore';
import { ME_CUSTOMER } from '@/store/useStore';
import ScreenHeader from '@/components/ui/ScreenHeader';
import ErrorState from '@/components/ui/ErrorState';

const GSTIN = '33ABCDE1234F1Z5';

export default function Invoice() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = useStore((s) => s.bookings.find((b) => b.id === id));
  const tailor = useStore((s) => s.tailors.find((t) => t.id === booking?.tailorId));

  if (!booking) {
    return (
      <View style={styles.wrap}>
        <ScreenHeader title="Invoice" />
        <ErrorState icon="alert-circle-outline" title="Order Not Found" message="We couldn't find this order." />
      </View>
    );
  }

  const cgst = +(booking.tax / 2).toFixed(2);
  const sgst = +(booking.tax / 2).toFixed(2);
  const finalValue = booking.amount - booking.discount + booking.tax + booking.deliveryFee;
  const balanceDue = booking.amount + booking.tax + booking.deliveryFee - booking.discount - booking.advanceAmount;
  const amountPaid = booking.amount - balanceDue;
  const notify = (action: string) => Alert.alert(action, 'This is a UI-only mock — no file is generated in this preview.');

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title="Invoice"
        subtitle={booking.id}
        right={
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Pressable onPress={() => notify('Download Invoice')}><Ionicons name="download-outline" size={22} color={colors.text} /></Pressable>
            <Pressable onPress={() => notify('Share Invoice')}><Ionicons name="share-social-outline" size={22} color={colors.text} /></Pressable>
          </View>
        }
      />
      <ScrollView contentContainerStyle={{ padding: spacing.screenH, paddingBottom: 32 }}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.brand}>Hello Tailor</Text>
            <Text style={styles.invoiceNo}>Invoice #INV-{booking.id.slice(-8)}</Text>
          </View>
          <Text style={styles.date}>Date: {new Date(booking.bookingDate).toLocaleDateString('en-IN')}</Text>

          <View style={styles.divider} />
          <Text style={styles.section}>Billed To</Text>
          <Text style={styles.value}>{booking.customerName || ME_CUSTOMER.name}</Text>
          <Text style={styles.subvalue}>{ME_CUSTOMER.phone}</Text>

          <Text style={[styles.section, { marginTop: spacing.md }]}>Service Provider</Text>
          <Text style={styles.value}>{tailor?.shopName ?? booking.tailorName}</Text>
          <Text style={styles.subvalue}>GSTIN: {GSTIN}</Text>

          <View style={styles.divider} />
          <View style={styles.lineRow}>
            <Text style={styles.lineLeft}>{booking.category}</Text>
            <Text style={styles.lineRight}>₹{booking.amount}</Text>
          </View>
          <Text style={styles.orderIdText}>Order ID: {booking.id}</Text>

          <View style={styles.divider} />
          <Row label="Subtotal" value={`₹${booking.amount}`} />
          <Row label="Discount" value={booking.discount ? `-₹${booking.discount}` : '₹0'} />
          <Row label="CGST (2.5%)" value={`₹${cgst}`} />
          <Row label="SGST (2.5%)" value={`₹${sgst}`} />
          <Row label="Total GST" value={`₹${booking.tax}`} />
          <Row label="Delivery Fee" value={`₹${booking.deliveryFee}`} />
          <View style={styles.divider} />
          <Row label="Final Value" value={`₹${finalValue}`} bold />
          <Row label="Advance Paid" value={`₹${booking.advanceAmount}`} />
          <Row label="Balance" value={`₹${balanceDue}`} />
          <Row label="Amount Paid" value={`₹${amountPaid}`} />
          <View style={styles.divider} />
          <Row label="Payment Method" value={booking.paymentMethod} />
          <Row label="Transaction ID" value={`TXN${booking.id.slice(-10)}`} />
        </View>
      </ScrollView>
    </View>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, bold && styles.rowLabelBold]}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.rowLabelBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  card: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { ...type.sectionHeading, color: colors.primary },
  invoiceNo: { ...type.supporting, color: colors.textSecondary },
  date: { ...type.supporting, color: colors.textSecondary, marginTop: 4 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  section: { ...type.supporting, fontFamily: 'Inter_600SemiBold', color: colors.textSecondary, textTransform: 'uppercase' },
  value: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text, marginTop: 2 },
  subvalue: { ...type.supporting, color: colors.textSecondary },
  lineRow: { flexDirection: 'row', justifyContent: 'space-between' },
  lineLeft: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text },
  lineRight: { ...type.body, color: colors.text },
  orderIdText: { ...type.supporting, color: colors.textSecondary, marginTop: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  rowLabel: { ...type.supporting, color: colors.textSecondary },
  rowValue: { ...type.supporting, color: colors.text },
  rowLabelBold: { fontFamily: 'Inter_700Bold', color: colors.text, fontSize: 14 },
});
