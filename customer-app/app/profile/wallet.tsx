import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, type, spacing, radius } from '../../constants/theme';
import { walletTransactions } from '../../mocks/data';
import ScreenHeader from '../../components/ui/ScreenHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useApp } from '../../store/AppState';

const typeMeta = {
  credit: { icon: 'arrow-down-circle-outline', color: colors.success, sign: '+' },
  debit: { icon: 'arrow-up-circle-outline', color: colors.error, sign: '-' },
  refund: { icon: 'refresh-circle-outline', color: colors.secondary, sign: '+' },
  reward: { icon: 'gift-outline', color: colors.gold, sign: '+' },
} as const;

export default function Wallet() {
  const { walletBalance } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [amount, setAmount] = useState('');

  return (
    <View style={styles.wrap}>
      <ScreenHeader title="Wallet" />
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Wallet Balance</Text>
        <Text style={styles.balance}>₹{walletBalance}</Text>
        <Button label="Add Money" variant="outline" style={{ marginTop: spacing.md, backgroundColor: colors.white }} onPress={() => setAddOpen(true)} />
      </View>
      <Text style={styles.sectionTitle}>Transaction History</Text>
      <FlatList
        data={walletTransactions}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ paddingHorizontal: spacing.screenH, paddingBottom: 24, gap: 10 }}
        renderItem={({ item }) => {
          const meta = typeMeta[item.type];
          return (
            <View style={styles.txRow}>
              <Ionicons name={meta.icon as any} size={22} color={meta.color} />
              <View style={{ flex: 1 }}>
                <Text style={styles.txLabel}>{item.label}</Text>
                <Text style={styles.txDate}>{item.date}</Text>
              </View>
              <Text style={[styles.txAmount, { color: meta.color }]}>{meta.sign}₹{item.amount}</Text>
            </View>
          );
        }}
      />

      <Modal visible={addOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Money to Wallet</Text>
            <Input label="Amount" keyboardType="number-pad" placeholder="Enter amount" value={amount} onChangeText={setAmount} style={{ marginTop: spacing.md }} />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button label="Cancel" variant="outline" style={{ flex: 1 }} onPress={() => { setAddOpen(false); setAmount(''); }} />
              <Button label="Add" style={{ flex: 1 }} disabled={!amount} onPress={() => { setAddOpen(false); setAmount(''); }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  balanceCard: { margin: spacing.screenH, backgroundColor: colors.primary, borderRadius: radius.premium, padding: spacing.xl, alignItems: 'center' },
  balanceLabel: { ...type.body, color: 'rgba(255,255,255,0.75)' },
  balance: { ...type.price, fontSize: 32, color: colors.white, marginTop: 4 },
  sectionTitle: { ...type.sectionHeading, color: colors.text, paddingHorizontal: spacing.screenH, marginBottom: spacing.md },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner },
  txLabel: { ...type.body, fontFamily: 'Inter_500Medium', color: colors.text },
  txDate: { ...type.supporting, color: colors.textSecondary, marginTop: 2 },
  txAmount: { ...type.body, fontFamily: 'Inter_700Bold' },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing.screenH },
  modalCard: { width: '100%', backgroundColor: colors.card, borderRadius: radius.card, padding: spacing.xl },
  modalTitle: { ...type.sectionHeading, color: colors.text },
});
