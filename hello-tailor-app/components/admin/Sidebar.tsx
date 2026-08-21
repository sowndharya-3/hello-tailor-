import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { colors, font, radius, spacing } from '@/theme';
import { navGroups } from './navConfig';

// public (visible) pathname for a group-relative href like '/(admin)/customers'
function publicPath(href: string) {
  const stripped = href.replace('/(admin)', '');
  return stripped === '' ? '/' : stripped;
}

export default function Sidebar({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <View style={[styles.wrap, collapsed && styles.wrapCollapsed]}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/hello-tailor-logo.png')} style={styles.logo} resizeMode="contain" />
        {!collapsed && (
          <View>
            <Text style={styles.brand}>Hello Tailor</Text>
            <Text style={styles.brandSub}>Admin Console</Text>
          </View>
        )}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: spacing.md }}>
        {navGroups.map((group) => (
          <View key={group.title} style={{ marginBottom: spacing.md }}>
            {!collapsed && <Text style={styles.groupTitle}>{group.title}</Text>}
            {group.items.map((item) => {
              const active = pathname === publicPath(item.href);
              return (
                <Pressable
                  key={item.href}
                  onPress={() => { router.push(item.href as any); onNavigate?.(); }}
                  style={[styles.item, active && styles.itemActive]}
                >
                  <Ionicons name={item.icon} size={18} color={active ? colors.white : 'rgba(255,255,255,0.7)'} />
                  {!collapsed && (
                    <Text style={[styles.itemText, active && styles.itemTextActive]} numberOfLines={1}>
                      {item.label}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 256, backgroundColor: colors.navy, height: '100%' },
  wrapCollapsed: { width: 76 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 18, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  logo: { width: 36, height: 36 },
  brand: { color: colors.white, fontFamily: font.bold, fontSize: 14 },
  brandSub: { color: 'rgba(255,255,255,0.6)', fontFamily: font.regular, fontSize: 11 },
  groupTitle: { color: 'rgba(255,255,255,0.4)', fontFamily: font.bold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5, paddingHorizontal: 20, paddingBottom: 6, marginTop: 8 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, marginHorizontal: 10, paddingVertical: 11, borderRadius: radius.button },
  itemActive: { backgroundColor: colors.ocean },
  itemText: { color: 'rgba(255,255,255,0.75)', fontFamily: font.medium, fontSize: 13.5 },
  itemTextActive: { color: colors.white, fontFamily: font.semibold },
});
