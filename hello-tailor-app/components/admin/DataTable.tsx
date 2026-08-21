// Generic admin data table — ported logic (sort/paginate) from admin-panel's
// components/ui/DataTable.tsx, rebuilt with RN Views instead of an HTML <table>.
import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font, radius, spacing } from '@/theme';
import BottomSheet from '@/components/ui/BottomSheet';
import EmptyState from '@/components/ui/EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  width?: number;
  render?: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
}

export interface RowAction<T> {
  label: string;
  onPress: (row: T) => void;
  hidden?: (row: T) => boolean;
  destructive?: boolean;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  actions?: RowAction<T>[];
  onRowPress?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
}

export default function DataTable<T>({
  columns, rows, rowKey, actions, onRowPress,
  emptyTitle = 'No records found', emptyDescription = '', pageSize = 10,
}: Props<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [menuRow, setMenuRow] = useState<T | null>(null);

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => c.key === sortKey);
    if (!col?.sortValue) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageRows = sorted.slice((page - 1) * pageSize, page * pageSize);

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  }

  if (rows.length === 0) {
    return <EmptyState icon="file-tray-outline" title={emptyTitle} message={emptyDescription} />;
  }

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View>
          <View style={styles.headerRow}>
            {columns.map((c) => (
              <Pressable
                key={c.key}
                disabled={!c.sortValue}
                onPress={() => c.sortValue && toggleSort(c.key)}
                style={[styles.cell, { width: c.width ?? 140 }]}
              >
                <Text style={styles.headerText} numberOfLines={1}>
                  {c.header}
                  {c.sortValue && sortKey === c.key ? (sortDir === 'asc' ? '  ▲' : '  ▼') : ''}
                </Text>
              </Pressable>
            ))}
            {actions && actions.length > 0 && <View style={[styles.cell, { width: 56 }]} />}
          </View>

          {pageRows.map((row) => {
            const key = rowKey(row);
            return (
              <Pressable
                key={key}
                onPress={onRowPress ? () => onRowPress(row) : undefined}
                style={({ pressed }) => [styles.dataRow, pressed && onRowPress && { backgroundColor: colors.bg }]}
              >
                {columns.map((c) => (
                  <View key={c.key} style={[styles.cell, { width: c.width ?? 140 }]}>
                    {c.render ? c.render(row) : (
                      <Text style={styles.cellText} numberOfLines={2}>{String((row as any)[c.key] ?? '')}</Text>
                    )}
                  </View>
                ))}
                {actions && actions.length > 0 && (
                  <View style={[styles.cell, { width: 56, alignItems: 'flex-end' }]}>
                    <Pressable onPress={() => setMenuRow(row)} hitSlop={8} style={styles.moreBtn}>
                      <Ionicons name="ellipsis-vertical" size={16} color={colors.textSecondary} />
                    </Pressable>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {totalPages > 1 && (
        <View style={styles.pager}>
          <Text style={styles.pagerText}>
            {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Pressable disabled={page === 1} onPress={() => setPage((p) => p - 1)} style={[styles.pagerBtn, page === 1 && styles.pagerBtnDisabled]}>
              <Ionicons name="chevron-back" size={16} color={page === 1 ? colors.disabledText : colors.text} />
            </Pressable>
            <Text style={styles.pagerText}>{page} / {totalPages}</Text>
            <Pressable disabled={page === totalPages} onPress={() => setPage((p) => p + 1)} style={[styles.pagerBtn, page === totalPages && styles.pagerBtnDisabled]}>
              <Ionicons name="chevron-forward" size={16} color={page === totalPages ? colors.disabledText : colors.text} />
            </Pressable>
          </View>
        </View>
      )}

      {actions && actions.length > 0 && (
        <BottomSheet visible={!!menuRow} onClose={() => setMenuRow(null)} title="Actions">
          {menuRow && actions.filter((a) => !a.hidden?.(menuRow)).map((a) => (
            <Pressable
              key={a.label}
              onPress={() => { a.onPress(menuRow); setMenuRow(null); }}
              style={styles.actionRow}
            >
              <Text style={[styles.actionText, a.destructive && { color: colors.error }]}>{a.label}</Text>
            </Pressable>
          ))}
        </BottomSheet>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.border, paddingBottom: spacing.sm },
  dataRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.border, paddingVertical: spacing.sm, alignItems: 'center' },
  cell: { paddingHorizontal: 8, justifyContent: 'center' },
  headerText: { fontFamily: font.semibold, fontSize: 11, color: colors.textSecondary, textTransform: 'uppercase' },
  cellText: { fontFamily: font.regular, fontSize: 13, color: colors.text },
  moreBtn: { padding: 6, borderRadius: radius.pill },
  pager: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.md },
  pagerText: { fontFamily: font.medium, fontSize: 12, color: colors.textSecondary },
  pagerBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.button, padding: 6 },
  pagerBtnDisabled: { opacity: 0.4 },
  actionRow: { paddingVertical: 14, borderBottomWidth: 1, borderColor: colors.border },
  actionText: { fontFamily: font.medium, fontSize: 15, color: colors.text },
});
