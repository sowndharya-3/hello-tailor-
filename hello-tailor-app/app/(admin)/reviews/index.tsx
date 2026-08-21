import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import type { Review } from '@/store/types';
import PageHeader from '@/components/admin/PageHeader';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import SegmentedControl from '@/components/ui/SegmentedControl';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import DataTable, { Column, RowAction } from '@/components/admin/DataTable';
import FieldText, { STATUS_TONE } from '@/components/admin/FieldText';

export default function Reviews() {
  const reviews = useStore((s) => s.reviews);
  const tailors = useStore((s) => s.tailors);
  const toggleReviewStatus = useStore((s) => s.toggleReviewStatus);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');

  const tailorName = (id: string) => tailors.find((t) => t.id === id)?.shopName ?? id;

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      if (status !== 'All' && r.status !== status) return false;
      if (search && !`${r.customerName} ${r.text}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [reviews, search, status]);

  const columns: Column<Review>[] = [
    { key: 'customerName', header: 'Customer', width: 150, sortValue: (r) => r.customerName },
    { key: 'tailorId', header: 'Tailor', width: 170, render: (r) => <FieldText>{tailorName(r.tailorId)}</FieldText> },
    { key: 'rating', header: 'Rating', width: 130, sortValue: (r) => r.rating, render: (r) => <StarRating rating={r.rating} size={12} /> },
    { key: 'text', header: 'Review', width: 280, render: (r) => <FieldText>{r.text}</FieldText> },
    { key: 'date', header: 'Date', width: 100, sortValue: (r) => r.date, render: (r) => <FieldText>{new Date(r.date).toLocaleDateString('en-IN')}</FieldText> },
    { key: 'status', header: 'Status', width: 90, render: (r) => <Badge label={r.status} tone={STATUS_TONE[r.status]} /> },
  ];

  const actions: RowAction<Review>[] = [
    { label: 'Hide Review', hidden: (r) => r.status === 'Hidden', destructive: true, onPress: (r) => toggleReviewStatus(r.id) },
    { label: 'Unhide Review', hidden: (r) => r.status !== 'Hidden', onPress: (r) => toggleReviewStatus(r.id) },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <PageHeader title="Review Management" description={`${reviews.length} customer reviews`} />
      <Card style={{ marginBottom: spacing.md }}>
        <View style={styles.filters}>
          <View style={{ flex: 1, minWidth: 220 }}>
            <Input placeholder="Search by customer or review text" value={search} onChangeText={setSearch} />
          </View>
          <View style={{ minWidth: 260 }}>
            <SegmentedControl options={['All', 'Visible', 'Hidden']} value={status} onChange={setStatus} />
          </View>
        </View>
      </Card>
      <Card noPadding style={{ padding: spacing.md }}>
        <DataTable columns={columns} rows={filtered} rowKey={(r) => r.id} actions={actions} emptyTitle="No reviews found" />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, alignItems: 'flex-start' },
});
