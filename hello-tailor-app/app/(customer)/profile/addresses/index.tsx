import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, type, spacing, radius } from '@/theme';
import ScreenHeader from '@/components/ui/ScreenHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { useStore } from '@/store/useStore';

export default function Addresses() {
  const addresses = useStore((s) => s.addresses);
  const setDefaultAddress = useStore((s) => s.setDefaultAddress);
  const removeAddress = useStore((s) => s.removeAddress);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <View style={styles.wrap}>
      <ScreenHeader
        title="My Addresses"
        right={
          <Pressable onPress={() => router.push('/profile/addresses/add')}>
            <Ionicons name="add-circle-outline" size={26} color={colors.secondary} />
          </Pressable>
        }
      />
      <FlatList
        data={addresses}
        keyExtractor={(a) => a.id}
        contentContainerStyle={{ padding: spacing.screenH, gap: spacing.md }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name={item.label === 'Home' ? 'home-outline' : item.label === 'Work' ? 'briefcase-outline' : 'location-outline'} size={18} color={colors.secondary} />
                <Text style={styles.label}>{item.label}</Text>
                {item.isDefault ? <Badge label="Default" tone="success" /> : null}
              </View>
              <Pressable onPress={() => setDeleteId(item.id)}>
                <Ionicons name="trash-outline" size={18} color={colors.error} />
              </Pressable>
            </View>
            <Text style={styles.addr}>{item.address}</Text>
            <Text style={styles.addr}>{item.landmark}</Text>
            <Text style={styles.addr}>{item.city}, {item.state} - {item.pincode}</Text>
            {!item.isDefault ? (
              <Pressable onPress={() => setDefaultAddress(item.id)}>
                <Text style={styles.setDefault}>Set as Default</Text>
              </Pressable>
            ) : null}
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="location-outline" title="No Addresses Saved" message="Add an address to speed up pickup and delivery." ctaLabel="Add Address" onPress={() => router.push('/profile/addresses/add')} />}
      />

      <Modal visible={!!deleteId} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete Address?</Text>
            <Text style={styles.modalBody}>This address will be permanently removed from your account.</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: spacing.lg }}>
              <Button label="Cancel" variant="outline" style={{ flex: 1 }} onPress={() => setDeleteId(null)} />
              <Button label="Delete" variant="destructive" style={{ flex: 1 }} onPress={() => { if (deleteId) removeAddress(deleteId); setDeleteId(null); }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  card: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, padding: spacing.cardInner },
  label: { ...type.cardTitle, fontSize: 15, color: colors.text },
  addr: { ...type.body, color: colors.textSecondary, marginTop: 4 },
  setDefault: { ...type.supporting, fontFamily: 'Inter_600SemiBold', color: colors.secondary, marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing.screenH },
  modalCard: { width: '100%', backgroundColor: colors.card, borderRadius: radius.card, padding: spacing.xl },
  modalTitle: { ...type.sectionHeading, color: colors.text },
  modalBody: { ...type.body, color: colors.textSecondary, marginTop: 6 },
});
