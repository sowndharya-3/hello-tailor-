import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { colors, type, spacing } from '../../constants/theme';
import { orders } from '../../mocks/data';
import SegmentedControl from '../../components/ui/SegmentedControl';
import OrderCard from '../../components/OrderCard';
import EmptyState from '../../components/ui/EmptyState';

const TABS = ['All', 'Active', 'Completed', 'Cancelled'];

export default function BookingsTab() {
  const [tab, setTab] = useState('All');
  const list = tab === 'All' ? orders : orders.filter((o) => o.status === tab);

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>My Bookings</Text>
      <View style={{ paddingHorizontal: spacing.screenH, marginBottom: spacing.md }}>
        <SegmentedControl options={TABS} value={tab} onChange={setTab} />
      </View>
      <FlatList
        data={list}
        keyExtractor={(o) => o.id}
        contentContainerStyle={{ paddingHorizontal: spacing.screenH, paddingBottom: 24 }}
        renderItem={({ item }) => <OrderCard order={item} />}
        ListEmptyComponent={
          <EmptyState icon="calendar-outline" title="No Bookings Yet" message="You haven't placed any bookings in this category yet." />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.bg },
  title: { ...type.pageTitle, color: colors.text, paddingHorizontal: spacing.screenH, paddingTop: 12, paddingBottom: spacing.md },
});
