// Responsive admin shell: permanent sidebar+topbar on wide web, hamburger-drawer on narrow/native.
import React, { useState } from 'react';
import { View, Modal, Pressable, useWindowDimensions, StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/theme';
import Sidebar from '@/components/admin/Sidebar';
import Topbar from '@/components/admin/Topbar';

const WIDE_BREAKPOINT = 900;

export default function AdminLayout() {
  const { width } = useWindowDimensions();
  const isWide = width >= WIDE_BREAKPOINT;
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <View style={styles.root}>
      {isWide && <Sidebar />}

      <View style={{ flex: 1 }}>
        <Topbar onMenuPress={isWide ? undefined : () => setDrawerOpen(true)} showSearch={Platform.OS === 'web'} />
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </View>

      {!isWide && (
        <Modal visible={drawerOpen} transparent animationType="fade" onRequestClose={() => setDrawerOpen(false)}>
          <Pressable style={styles.overlay} onPress={() => setDrawerOpen(false)} />
          <View style={styles.drawer}>
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: colors.bg },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  drawer: { position: 'absolute', left: 0, top: 0, bottom: 0 },
});
