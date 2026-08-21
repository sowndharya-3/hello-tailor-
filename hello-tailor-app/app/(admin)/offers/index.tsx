import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, font, spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import type { Coupon } from '@/store/types';
import PageHeader from '@/components/admin/PageHeader';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import BottomSheet from '@/components/ui/BottomSheet';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import DataTable, { Column, RowAction } from '@/components/admin/DataTable';
import FieldText from '@/components/admin/FieldText';

const BLANK: Coupon = { id: '', code: '', title: '', discountType: 'Flat', discountValue: 0, minBooking: 0, maxDiscount: 0, validTo: '', eligibility: 'All Users', status: 'Active', usageCount: 0 };

export default function Offers() {
  const coupons = useStore((s) => s.coupons);
  const addCoupon = useStore((s) => s.addCoupon);
  const updateCoupon = useStore((s) => s.updateCoupon);
  const toggleCouponStatus = useStore((s) => s.toggleCouponStatus);
  const deleteCoupon = useStore((s) => s.deleteCoupon);

  const [editing, setEditing] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState<Coupon | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Coupon>(BLANK);

  const openCreate = () => { setDraft({ ...BLANK, id: `o${Date.now()}` }); setCreating(true); };
  const openEdit = (c: Coupon) => { setDraft(c); setEditing(c); };
  const save = () => {
    if (creating) addCoupon(draft);
    else if (editing) updateCoupon(editing.id, draft);
    setCreating(false); setEditing(null);
  };

  const columns: Column<Coupon>[] = [
    { key: 'code', header: 'Code', width: 130, render: (c) => <FieldText bold>{c.code}</FieldText> },
    { key: 'title', header: 'Title', width: 220 },
    { key: 'discountValue', header: 'Discount', width: 100, render: (c) => <FieldText>{c.discountType === 'Percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</FieldText> },
    { key: 'minBooking', header: 'Min Booking', width: 100, render: (c) => <FieldText>₹{c.minBooking}</FieldText> },
    { key: 'validTo', header: 'Valid Till', width: 110 },
    { key: 'eligibility', header: 'Eligibility', width: 130 },
    { key: 'usageCount', header: 'Used', width: 70, sortValue: (c) => c.usageCount },
    { key: 'status', header: 'Status', width: 100, render: (c) => <Badge label={c.status} tone={c.status === 'Active' ? 'success' : 'neutral'} /> },
  ];

  const actions: RowAction<Coupon>[] = [
    { label: 'Edit', onPress: openEdit },
    { label: 'Activate', hidden: (c) => c.status === 'Active', onPress: (c) => toggleCouponStatus(c.id) },
    { label: 'Deactivate', hidden: (c) => c.status !== 'Active', onPress: (c) => toggleCouponStatus(c.id) },
    { label: 'Delete', destructive: true, onPress: setDeleting },
  ];

  const sheetOpen = creating || !!editing;

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <PageHeader title="Offers & Coupons" description={`${coupons.length} coupons configured`} right={<Button label="Create Coupon" onPress={openCreate} style={{ minWidth: 150 }} />} />

      <Card noPadding style={{ padding: spacing.md }}>
        <DataTable columns={columns} rows={coupons} rowKey={(c) => c.id} actions={actions} emptyTitle="No coupons yet" />
      </Card>

      <BottomSheet visible={sheetOpen} onClose={() => { setCreating(false); setEditing(null); }} title={creating ? 'Create Coupon' : 'Edit Coupon'}>
        <Input label="Coupon Code" value={draft.code} onChangeText={(v) => setDraft((d) => ({ ...d, code: v.toUpperCase() }))} />
        <Input label="Title" value={draft.title} onChangeText={(v) => setDraft((d) => ({ ...d, title: v }))} />
        <Input label="Discount Value" keyboardType="numeric" value={String(draft.discountValue)} onChangeText={(v) => setDraft((d) => ({ ...d, discountValue: Number(v) || 0 }))} />
        <Input label="Min Booking (₹)" keyboardType="numeric" value={String(draft.minBooking)} onChangeText={(v) => setDraft((d) => ({ ...d, minBooking: Number(v) || 0 }))} />
        <Input label="Valid Till" placeholder="31 Dec 2026" value={draft.validTo} onChangeText={(v) => setDraft((d) => ({ ...d, validTo: v }))} />
        <Button label="Save Coupon" onPress={save} />
      </BottomSheet>

      <ConfirmDialog
        visible={!!deleting}
        title="Delete Coupon"
        message={`Delete coupon "${deleting?.code}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onCancel={() => setDeleting(null)}
        onConfirm={() => { if (deleting) deleteCoupon(deleting.id); setDeleting(null); }}
      />
    </ScrollView>
  );
}
