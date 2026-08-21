import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import type { Tailor } from '@/store/types';
import PageHeader from '@/components/admin/PageHeader';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import SegmentedControl from '@/components/ui/SegmentedControl';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import DataTable, { Column, RowAction } from '@/components/admin/DataTable';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import FieldText, { STATUS_TONE } from '@/components/admin/FieldText';

// Shared list screen for Tailors / Home Tailors / Shop Tailors — differ only by `typeFilter`.
export default function TailorListScreen({ typeFilter, title, description }: { typeFilter?: 'Home' | 'Shop'; title: string; description: string }) {
  const tailors = useStore((s) => s.tailors);
  const updateTailorStatus = useStore((s) => s.updateTailorStatus);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [confirmFor, setConfirmFor] = useState<Tailor | null>(null);

  const filtered = useMemo(() => {
    return tailors.filter((t) => {
      if (typeFilter && t.type !== typeFilter) return false;
      if (status !== 'All' && t.status !== status) return false;
      if (search && !`${t.name} ${t.shopName} ${t.city} ${t.phone}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tailors, typeFilter, search, status]);

  const columns: Column<Tailor>[] = [
    { key: 'name', header: 'Tailor', width: 220, sortValue: (t) => t.name, render: (t) => (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Avatar uri={t.image} name={t.name} size={30} />
        <View><FieldText bold>{t.shopName}</FieldText><FieldText muted>{t.name}</FieldText></View>
      </View>
    ) },
    { key: 'type', header: 'Type', width: 80, render: (t) => <Badge label={t.type} tone={t.type === 'Shop' ? 'navy' : 'info'} withIcon={false} /> },
    { key: 'city', header: 'City', width: 110, sortValue: (t) => t.city },
    { key: 'rating', header: 'Rating', width: 80, sortValue: (t) => t.rating, render: (t) => <FieldText>★ {t.rating.toFixed(1)}</FieldText> },
    { key: 'membership', header: 'Membership', width: 110, render: (t) => t.membership === 'None' ? <FieldText muted>None</FieldText> : <Badge label={t.membership} tone="gold" /> },
    { key: 'verification', header: 'Verification', width: 110, render: (t) => <Badge label={t.verification} tone={STATUS_TONE[t.verification]} /> },
    { key: 'status', header: 'Status', width: 100, render: (t) => <Badge label={t.status} tone={STATUS_TONE[t.status]} /> },
  ];

  const actions: RowAction<Tailor>[] = [
    { label: 'View Details', onPress: (t) => router.push(`/(admin)/tailors/${t.id}` as any) },
    { label: 'Block Tailor', hidden: (t) => t.status === 'Blocked', destructive: true, onPress: (t) => setConfirmFor(t) },
    { label: 'Unblock Tailor', hidden: (t) => t.status !== 'Blocked', onPress: (t) => setConfirmFor(t) },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <PageHeader title={title} description={description} />
      <Card style={{ marginBottom: spacing.md }}>
        <View style={styles.filters}>
          <View style={{ flex: 1, minWidth: 220 }}>
            <Input placeholder="Search by name, shop, city, phone" value={search} onChangeText={setSearch} />
          </View>
          <View style={{ minWidth: 320 }}>
            <SegmentedControl options={['All', 'Active', 'Blocked', 'Pending']} value={status} onChange={setStatus} />
          </View>
        </View>
      </Card>
      <Card noPadding style={{ padding: spacing.md }}>
        <DataTable columns={columns} rows={filtered} rowKey={(t) => t.id} actions={actions} onRowPress={(t) => router.push(`/(admin)/tailors/${t.id}` as any)} emptyTitle="No tailors found" />
      </Card>

      <ConfirmDialog
        visible={!!confirmFor}
        title={confirmFor?.status === 'Blocked' ? 'Unblock Tailor' : 'Block Tailor'}
        message={`Are you sure you want to ${confirmFor?.status === 'Blocked' ? 'unblock' : 'block'} ${confirmFor?.shopName}?`}
        confirmLabel={confirmFor?.status === 'Blocked' ? 'Unblock' : 'Block'}
        destructive={confirmFor?.status !== 'Blocked'}
        onCancel={() => setConfirmFor(null)}
        onConfirm={() => { if (confirmFor) updateTailorStatus(confirmFor.id, confirmFor.status === 'Blocked' ? 'Active' : 'Blocked'); setConfirmFor(null); }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, alignItems: 'flex-start' },
});
