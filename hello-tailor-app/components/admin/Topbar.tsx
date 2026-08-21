import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, font, radius, spacing } from '@/theme';
import { useStore } from '@/store/useStore';

export default function Topbar({ onMenuPress, showSearch = true }: { onMenuPress?: () => void; showSearch?: boolean }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const complaints = useStore((s) => s.complaints);
  const logout = useStore((s) => s.logout);
  const openComplaints = complaints.filter((c) => c.status === 'Open').slice(0, 5);

  return (
    <View style={styles.wrap}>
      {onMenuPress && (
        <Pressable onPress={onMenuPress} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="menu-outline" size={22} color={colors.text} />
        </Pressable>
      )}
      {showSearch ? (
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={16} color={colors.textSecondary} />
          <TextInput placeholder="Search customers, tailors, orders..." placeholderTextColor={colors.disabledText} style={styles.searchInput} />
        </View>
      ) : (
        <View style={{ flex: 1 }} />
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View>
          <Pressable onPress={() => { setNotifOpen((o) => !o); setMenuOpen(false); }} style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={18} color={colors.textSecondary} />
            {openComplaints.length > 0 && (
              <View style={styles.badge}><Text style={styles.badgeText}>{openComplaints.length}</Text></View>
            )}
          </Pressable>
          {notifOpen && (
            <View style={styles.dropdown}>
              <Text style={styles.dropdownTitle}>Open Complaints</Text>
              {openComplaints.length === 0 && <Text style={styles.dropdownEmpty}>No open complaints</Text>}
              {openComplaints.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => { router.push('/(admin)/complaints' as any); setNotifOpen(false); }}
                  style={styles.dropdownRow}
                >
                  <Text style={styles.dropdownRowTitle}>{c.category}</Text>
                  <Text style={styles.dropdownRowSub}>{c.customerName} · {c.id}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <View>
          <Pressable onPress={() => { setMenuOpen((o) => !o); setNotifOpen(false); }} style={styles.adminBtn}>
            <Image source={{ uri: 'https://picsum.photos/seed/adminavatar/64' }} style={styles.avatar} />
            <Text style={styles.adminName}>Admin</Text>
            <Ionicons name="chevron-down-outline" size={14} color={colors.textSecondary} />
          </Pressable>
          {menuOpen && (
            <View style={[styles.dropdown, { width: 180 }]}>
              <Pressable onPress={() => { router.push('/(admin)/settings' as any); setMenuOpen(false); }} style={styles.menuRow}>
                <Ionicons name="person-circle-outline" size={16} color={colors.text} />
                <Text style={styles.menuRowText}>Settings</Text>
              </Pressable>
              <Pressable onPress={() => { setMenuOpen(false); logout(); router.replace('/(auth)/login'); }} style={styles.menuRow}>
                <Ionicons name="log-out-outline" size={16} color={colors.error} />
                <Text style={[styles.menuRowText, { color: colors.error }]}>Logout</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderColor: colors.border, backgroundColor: colors.card, paddingHorizontal: spacing.lg, paddingVertical: 12 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  searchWrap: { flex: 1, maxWidth: 420, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, borderRadius: radius.search, paddingHorizontal: 14, height: 42 },
  searchInput: { flex: 1, fontFamily: font.regular, fontSize: 13, color: colors.text },
  badge: { position: 'absolute', top: -2, right: -2, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: colors.error, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  badgeText: { color: colors.white, fontFamily: font.bold, fontSize: 9 },
  adminBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 5 },
  avatar: { width: 28, height: 28, borderRadius: 14 },
  adminName: { fontFamily: font.semibold, fontSize: 13, color: colors.text },
  dropdown: { position: 'absolute', top: 48, right: 0, width: 260, backgroundColor: colors.white, borderRadius: radius.card, borderWidth: 1, borderColor: colors.border, paddingVertical: 6, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, elevation: 6, zIndex: 50 },
  dropdownTitle: { fontFamily: font.bold, fontSize: 10, textTransform: 'uppercase', color: colors.textSecondary, paddingHorizontal: 14, paddingVertical: 6 },
  dropdownEmpty: { fontFamily: font.regular, fontSize: 13, color: colors.textSecondary, paddingHorizontal: 14, paddingVertical: 10 },
  dropdownRow: { paddingHorizontal: 14, paddingVertical: 8 },
  dropdownRowTitle: { fontFamily: font.medium, fontSize: 13, color: colors.text },
  dropdownRowSub: { fontFamily: font.regular, fontSize: 11, color: colors.textSecondary },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10 },
  menuRowText: { fontFamily: font.medium, fontSize: 13, color: colors.text },
});
