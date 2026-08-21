import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import type { Advertisement } from '@/store/types';
import PageHeader from '@/components/admin/PageHeader';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import BottomSheet from '@/components/ui/BottomSheet';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import DataTable, { Column, RowAction } from '@/components/admin/DataTable';
import FieldText, { STATUS_TONE } from '@/components/admin/FieldText';

const BLANK: Advertisement = { id: '', title: '', type: 'Banner', placement: '', imageSeed: 'ad', startDate: '', endDate: '', status: 'Scheduled' };

export default function Advertisements() {
  const ads = useStore((s) => s.advertisements);
  const addAd = useStore((s) => s.addAd);
  const updateAd = useStore((s) => s.updateAd);
  const toggleAdStatus = useStore((s) => s.toggleAdStatus);
  const deleteAd = useStore((s) => s.deleteAd);

  const [editing, setEditing] = useState<Advertisement | null>(null);
  const [deleting, setDeleting] = useState<Advertisement | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Advertisement>(BLANK);

  const openCreate = () => { setDraft({ ...BLANK, id: `ad${Date.now()}` }); setCreating(true); };
  const openEdit = (a: Advertisement) => { setDraft(a); setEditing(a); };
  const save = () => {
    if (creating) addAd(draft);
    else if (editing) updateAd(editing.id, draft);
    setCreating(false); setEditing(null);
  };

  const columns: Column<Advertisement>[] = [
    { key: 'title', header: 'Title', width: 220 },
    { key: 'type', header: 'Type', width: 110 },
    { key: 'placement', header: 'Placement', width: 170 },
    { key: 'startDate', header: 'Start', width: 100, render: (a) => <FieldText>{new Date(a.startDate).toLocaleDateString('en-IN')}</FieldText> },
    { key: 'endDate', header: 'End', width: 100, render: (a) => <FieldText>{new Date(a.endDate).toLocaleDateString('en-IN')}</FieldText> },
    { key: 'status', header: 'Status', width: 100, render: (a) => <Badge label={a.status} tone={STATUS_TONE[a.status]} /> },
  ];

  const actions: RowAction<Advertisement>[] = [
    { label: 'Edit', onPress: openEdit },
    { label: 'Activate', hidden: (a) => a.status === 'Active', onPress: (a) => toggleAdStatus(a.id) },
    { label: 'Pause', hidden: (a) => a.status !== 'Active', onPress: (a) => toggleAdStatus(a.id) },
    { label: 'Delete', destructive: true, onPress: setDeleting },
  ];

  const sheetOpen = creating || !!editing;

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <PageHeader title="Advertisement Management" description={`${ads.length} advertisements configured`} right={<Button label="Create Ad" onPress={openCreate} style={{ minWidth: 130 }} />} />

      <Card noPadding style={{ padding: spacing.md }}>
        <DataTable columns={columns} rows={ads} rowKey={(a) => a.id} actions={actions} emptyTitle="No advertisements yet" />
      </Card>

      <BottomSheet visible={sheetOpen} onClose={() => { setCreating(false); setEditing(null); }} title={creating ? 'Create Advertisement' : 'Edit Advertisement'}>
        <Input label="Title" value={draft.title} onChangeText={(v) => setDraft((d) => ({ ...d, title: v }))} />
        <Input label="Placement" value={draft.placement} onChangeText={(v) => setDraft((d) => ({ ...d, placement: v }))} />
        <Input label="Start Date" placeholder="YYYY-MM-DD" value={draft.startDate} onChangeText={(v) => setDraft((d) => ({ ...d, startDate: v }))} />
        <Input label="End Date" placeholder="YYYY-MM-DD" value={draft.endDate} onChangeText={(v) => setDraft((d) => ({ ...d, endDate: v }))} />
        <Button label="Save Advertisement" onPress={save} />
      </BottomSheet>

      <ConfirmDialog
        visible={!!deleting}
        title="Delete Advertisement"
        message={`Delete "${deleting?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onCancel={() => setDeleting(null)}
        onConfirm={() => { if (deleting) deleteAd(deleting.id); setDeleting(null); }}
      />
    </ScrollView>
  );
}
