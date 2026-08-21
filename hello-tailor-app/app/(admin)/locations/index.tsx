import React from 'react';
import { ScrollView, Switch } from 'react-native';
import { colors, spacing } from '@/theme';
import { useStore } from '@/store/useStore';
import type { LocationEntry } from '@/store/types';
import PageHeader from '@/components/admin/PageHeader';
import Card from '@/components/ui/Card';
import DataTable, { Column } from '@/components/admin/DataTable';
import FieldText from '@/components/admin/FieldText';

export default function Locations() {
  const locations = useStore((s) => s.locations);
  const toggleLocationServiceable = useStore((s) => s.toggleLocationServiceable);

  const columns: Column<LocationEntry>[] = [
    { key: 'state', header: 'State', width: 160, sortValue: (l) => l.state },
    { key: 'city', header: 'City', width: 140, sortValue: (l) => l.city },
    { key: 'tailorCount', header: 'Tailors', width: 90, sortValue: (l) => l.tailorCount, render: (l) => <FieldText>{l.tailorCount}</FieldText> },
    { key: 'serviceable', header: 'Serviceable', width: 110, render: (l) => (
      <Switch value={l.serviceable} onValueChange={() => toggleLocationServiceable(l.id)} trackColor={{ false: colors.disabledBg, true: colors.ocean }} />
    ) },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
      <PageHeader title="Location Management" description={`${locations.length} serviceable regions configured`} />
      <Card noPadding style={{ padding: spacing.md }}>
        <DataTable columns={columns} rows={locations} rowKey={(l) => l.id} emptyTitle="No locations configured" />
      </Card>
    </ScrollView>
  );
}
