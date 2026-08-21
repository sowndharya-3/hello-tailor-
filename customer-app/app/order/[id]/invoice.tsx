import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { colors, type, spacing, radius } from '../../../constants/theme';
import { orders, tailors } from '../../../mocks/data';
import ScreenHeader from '../../../components/ui/ScreenHeader';

const GSTIN = '33ABCDE1234F1Z5';

export default function Invoice() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = orders.find((o) => o.id === id) ?? orders[0];
  const tailor = tailors.find((t) => t.id === order.tailorId);
  const cgst = +(order.tax / 2).toFixed(2);
  const sgst = +(order.tax / 2).toFixed(2);
  const notify = (action: string) => Alert.alert(action, 'This is a UI-only mock — no file is generated in this preview.');

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title="Invoice"
        subtitle={order.id}
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
            <Text style={styles.invoiceNo}>Invoice #INV-{order.id.slice(-8)}</Text>
          </View>
          <Text style={styles.date}>Date: {order.placedOn}</Text>

          <View style={styles.divider} />
          <Text style={styles.section}>Billed To</Text>
          <Text style={styles.value}>Sowndharya Rajan</Text>
          <Text style={styles.subvalue}>seoclaude011@gmail.com</Text>

          <Text style={[styles.section, { marginTop: spacing.md }]}>Service Provider</Text>
          <Text style={styles.value}>{tailor?.shopName}</Text>
          <Text style={styles.subvalue}>GSTIN: {GSTIN}</Text>

          <View style={styles.divider} />
          <View style={styles.lineRow}>
            <Text style={styles.lineLeft}>{order.category}</Text>
            <Text style={styles.lineRight}>₹{order.amount}</Text>
          </View>
          <Text style={styles.orderIdText}>Order ID: {order.id}</Text>

          <View style={styles.divider} />
          <Row label="Subtotal" value={`₹${order.amount}`} />
          <Row label="Discount" value={order.discount ? `-₹${order.discount}` : '₹0'} />
          <Row label="CGST (2.5%)" value={`₹${cgst}`} />
          <Row label="SGST (2.5%)" value={`₹${sgst}`} />
          <Row label="Total GST" value={`₹${order.tax}`} />
          <Row label="Delivery Fee" value={`₹${order.deliveryFee}`} />
          <View style={styles.divider} />
          <Row label="Final Value" value={`₹${order.amount - order.discount + order.tax + order.deliveryFee}`} bold />
          <Row label="Advance Paid" value={`₹${order.advancePaid}`} />
          <Row label="Balance" value={`₹${order.balanceDue}`} />
          <Row label="Amount Paid" value={`₹${order.amount - order.balanceDue}`} />
          <View style={styles.divider} />
          <Row label="Payment Method" value={order.paymentMethod} />
          <Row label="Transaction ID" value={`TXN${order.id.slice(-10)}`} />
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
