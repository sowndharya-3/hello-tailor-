import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import type { AdminCategory } from '@/store/types';
import PageHeader from '@/components/admin/PageHeader';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import BottomSheet from '@/components/ui/BottomSheet';
import DataTable, { Column, RowAction } from '@/components/admin/DataTable';
import FieldText from '@/components/admin/FieldText';

const BLANK: AdminCategory = { id: '', name: '', subcategories: [], imageSeed: 'cat', status: 'Active', order: 0 };

export default function Categories() {
  const categories = useStore((s) => s.adminCategories);
  const addCategory = useStore((s) => s.addCategory);
  const updateCategory = useStore((s) => s.updateCategory);
  const toggleCategoryStatus = useStore((s) => s.toggleCategoryStatus);

  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<AdminCategory>(BLANK);

  const openCreate = () => { setDraft({ ...BLANK, id: `cat${Date.now()}`, order: categories.length + 1 }); setCreating(true); };
  const openEdit = (c: AdminCategory) => { setDraft({ ...c, subcategories: c.subcategories }); setEditing(c); };
  const save = () => {
    if (creating) addCategory(draft);
    else if (editing) updateCategory(editing.id, draft);
    setCreating(false); setEditing(null);
  };
  const move = (c: AdminCategory, dir: -1 | 1) => {
    const swap = categories.find((x) => x.order === c.order + dir);
    updateCategory(c.id, { order: c.order + dir });
    if (swap) updateCategory(swap.id, { order: swap.order - dir });
  };

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  const columns: Column<AdminCategory>[] = [
    { key: 'name', header: 'Category', width: 220, sortValue: (c) => c.name, render: (c) => (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Image source={{ uri: `https://picsum.photos/seed/${c.imageSeed}/60` }} style={styles.thumb} />
        <FieldText bold>{c.name}</FieldText>
      </View>
    ) },
    { key: 'subcategories', header: 'Subcategories', width: 200, render: (c) => <FieldText muted>{c.subcategories.length ? c.subcategories.join(', ') : '—'}</FieldText> },
    { key: 'order', header: 'Order', width: 120, sortValue: (c) => c.order, render: (c) => (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <FieldText>{c.order}</FieldText>
        <Pressable onPress={() => move(c, -1)} hitSlop={6}><Ionicons name="chevron-up-outline" size={16} color={colors.textSecondary} /></Pressable>
        <Pressable onPress={() => move(c, 1)} hitSlop={6}><Ionicons name="chevron-down-outline" size={16} color={colors.textSecondary} /></Pressable>
      </View>
    ) },
    { key: 'status', header: 'Status', width: 100, render: (c) => <Badge label={c.status} tone={c.status === 'Active' ? 'success' : 'neutral'} /> },
  ];

  const actions: RowAction<AdminCategory>[] = [
    { label: 'Edit', onPress: openEdit },
    { label: 'Deactivate', hidden: (c) => c.status !== 'Active', onPress: (c) => toggleCategoryStatus(c.id) },
    { label: 'Activate', hidden: (c) => c.status === 'Active', onPress: (c) => toggleCategoryStatus(c.id) },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <PageHeader title="Category Management" description={`${categories.length} categories`} right={<Button label="Add Category" onPress={openCreate} style={{ minWidth: 140 }} />} />
      <Card noPadding style={{ padding: spacing.md }}>
        <DataTable columns={columns} rows={sorted} rowKey={(c) => c.id} actions={actions} emptyTitle="No categories yet" />
      </Card>

      <BottomSheet visible={creating || !!editing} onClose={() => { setCreating(false); setEditing(null); }} title={creating ? 'Add Category' : 'Edit Category'}>
        <Input label="Name" value={draft.name} onChangeText={(v) => setDraft((d) => ({ ...d, name: v }))} />
        <Input label="Subcategories (comma separated)" optional value={draft.subcategories.join(', ')} onChangeText={(v) => setDraft((d) => ({ ...d, subcategories: v.split(',').map((s) => s.trim()).filter(Boolean) }))} />
        <Button label="Save Category" onPress={save} />
      </BottomSheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  thumb: { width: 30, height: 30, borderRadius: 8 },
});
