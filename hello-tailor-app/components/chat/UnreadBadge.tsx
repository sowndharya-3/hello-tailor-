import { View, Text, StyleSheet } from 'react-native';
import { colors, font } from '@/theme';

// Phase 1/23 — used on bottom-nav Messages tab and on each ConversationCard.
export default function UnreadBadge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
}

// Small dot variant for the bottom-nav tab icon (matches the existing Notifications tab's Dot).
export function UnreadNavDot({ show }: { show: boolean }) {
  if (!show) return null;
  return <View style={styles.navDot} />;
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { color: colors.white, fontFamily: font.semibold, fontSize: 10 },
  navDot: { position: 'absolute', top: -2, right: -6, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error },
});
