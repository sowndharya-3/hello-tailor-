import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { colors, font, radius, spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import type { Complaint } from '@/store/types';
import PageHeader from '@/components/admin/PageHeader';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import BottomSheet from '@/components/ui/BottomSheet';
import DataTable, { Column, RowAction } from '@/components/admin/DataTable';
import FieldText, { STATUS_TONE } from '@/components/admin/FieldText';

const TONE = { Low: 'neutral', Medium: 'info', High: 'warning', Urgent: 'error' } as const;

export default function Complaints() {
  const complaints = useStore((s) => s.complaints);
  const updateComplaint = useStore((s) => s.updateComplaint);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [response, setResponse] = useState('');

  const open = (c: Complaint) => { setSelected(c); setResponse(c.adminResponse); };

  const columns: Column<Complaint>[] = [
    { key: 'id', header: 'Ticket', width: 90 },
    { key: 'customerName', header: 'Customer', width: 150, sortValue: (c) => c.customerName },
    { key: 'category', header: 'Category', width: 150 },
    { key: 'priority', header: 'Priority', width: 90, render: (c) => <Badge label={c.priority} tone={TONE[c.priority]} withIcon={false} /> },
    { key: 'submittedDate', header: 'Submitted', width: 100, sortValue: (c) => c.submittedDate, render: (c) => <FieldText>{new Date(c.submittedDate).toLocaleDateString('en-IN')}</FieldText> },
    { key: 'status', header: 'Status', width: 110, render: (c) => <Badge label={c.status} tone={STATUS_TONE[c.status]} /> },
  ];

  const actions: RowAction<Complaint>[] = [{ label: 'Open & Respond', onPress: open }];

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <PageHeader title="Complaint Management" description={`${complaints.filter((c) => c.status === 'Open').length} open of ${complaints.length} complaints`} />
      <Card noPadding style={{ padding: spacing.md }}>
        <DataTable columns={columns} rows={complaints} rowKey={(c) => c.id} actions={actions} onRowPress={open} emptyTitle="No complaints" />
      </Card>

      <BottomSheet visible={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.id} · ${selected.category}` : ''}>
        {selected && (
          <View>
            <Text style={styles.label}>Customer</Text>
            <Text style={styles.value}>{selected.customerName} · Order {selected.bookingId}</Text>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{selected.description}</Text>
            <Text style={styles.label}>Admin Response</Text>
            <TextInput style={styles.textarea} multiline value={response} onChangeText={setResponse} placeholder="Write a response to the customer..." />
            <View style={styles.row}>
              <Badge label={selected.priority} tone={TONE[selected.priority]} withIcon={false} />
              <Badge label={selected.status} tone={STATUS_TONE[selected.status]} />
            </View>
            <View style={styles.actionsRow}>
              <Button label="Save Response" variant="outline" style={{ flex: 1 }} onPress={() => updateComplaint(selected.id, { adminResponse: response, status: selected.status === 'Open' ? 'In Progress' : selected.status })} />
              <Button label="Mark Resolved" style={{ flex: 1 }} onPress={() => { updateComplaint(selected.id, { adminResponse: response, status: 'Resolved' }); setSelected(null); }} />
            </View>
          </View>
        )}
      </BottomSheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: font.semibold, fontSize: 11, color: colors.textSecondary, textTransform: 'uppercase', marginTop: spacing.md, marginBottom: 4 },
  value: { fontFamily: font.regular, fontSize: 14, color: colors.text, lineHeight: 20 },
  textarea: { minHeight: 90, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.input, padding: 12, fontFamily: font.regular, fontSize: 13, color: colors.text, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 8, marginTop: spacing.md },
  actionsRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
});
