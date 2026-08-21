import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { colors, font, radius, spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import PageHeader from '@/components/admin/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import SegmentedControl from '@/components/ui/SegmentedControl';
import DataTable, { Column } from '@/components/admin/DataTable';
import { STATUS_TONE } from '@/components/admin/FieldText';
import type { AdminNotification } from '@/store/types';

const TARGETS = ['All Customers', 'All Tailors', 'Premium Members'] as const;

export default function Notifications() {
  const sent = useStore((s) => s.adminNotifications);
  const sendNotification = useStore((s) => s.sendNotification);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<string>(TARGETS[0]);

  const send = () => {
    if (!title.trim() || !message.trim()) return;
    const recipients = target === 'All Customers' ? 12400 : target === 'All Tailors' ? 980 : 3100;
    sendNotification({ id: `NTF-${Date.now()}`, title, message, target: target as AdminNotification['target'], sentDate: new Date().toISOString(), status: 'Sent', recipients });
    setTitle(''); setMessage('');
  };

  const columns: Column<AdminNotification>[] = [
    { key: 'title', header: 'Title', width: 200 },
    { key: 'message', header: 'Message', width: 260 },
    { key: 'target', header: 'Target', width: 140 },
    { key: 'sentDate', header: 'Sent', width: 110, render: (n) => <Text>{new Date(n.sentDate).toLocaleDateString('en-IN')}</Text> },
    { key: 'recipients', header: 'Recipients', width: 90, sortValue: (n) => n.recipients },
    { key: 'status', header: 'Status', width: 90, render: (n) => <Badge label={n.status} tone={STATUS_TONE[n.status]} /> },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <PageHeader title="Notification Management" description="Compose and broadcast notifications to platform users" />

      <Card style={{ marginBottom: spacing.lg }}>
        <Text style={styles.cardTitle}>Compose Notification</Text>
        <Input label="Title" value={title} onChangeText={setTitle} />
        <Text style={styles.label}>Message</Text>
        <TextInput style={styles.textarea} multiline value={message} onChangeText={setMessage} placeholder="Write your notification message..." />
        <Text style={styles.label}>Target Audience</Text>
        <SegmentedControl options={[...TARGETS]} value={target} onChange={setTarget} />
        <Button label="Send Notification" onPress={send} style={{ marginTop: spacing.md }} />
      </Card>

      <Text style={styles.cardTitle}>Sent History</Text>
      <Card noPadding style={{ padding: spacing.md }}>
        <DataTable columns={columns} rows={sent} rowKey={(n) => n.id} emptyTitle="No notifications sent yet" />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardTitle: { fontFamily: font.semibold, fontSize: 15, color: colors.navy, marginBottom: spacing.sm },
  label: { fontFamily: font.medium, fontSize: 13, color: colors.text, marginBottom: 6 },
  textarea: { minHeight: 90, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.input, padding: 12, fontFamily: font.regular, fontSize: 13, color: colors.text, textAlignVertical: 'top', marginBottom: spacing.md },
});
