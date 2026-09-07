import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font } from '@/theme';
import { useTotalUnread } from '@/store/chatStore';

const ICONS: Record<string, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
  index: ['grid-outline', 'grid'],
  bookings: ['calendar-outline', 'calendar'],
  messages: ['chatbubbles-outline', 'chatbubbles'],
  orders: ['receipt-outline', 'receipt'],
  income: ['bar-chart-outline', 'bar-chart'],
  profile: ['person-outline', 'person'],
};

function TabIcon(name: string, focused: boolean, color: ColorValue) {
  const [outline, filled] = ICONS[name];
  return <Ionicons name={focused ? filled : outline} size={23} color={color as string} />;
}

export default function TabsLayout() {
  // Messages tab badge reuses the same red-dot look as the dashboard's notification bell
  // (app/(tailor)/(tabs)/index.tsx `badge`/`badgeText` styles) via the native tabBarBadge prop.
  const unread = useTotalUnread('tailor');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ocean,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontFamily: font.medium, fontSize: 11 },
        tabBarStyle: { borderTopColor: colors.border, height: 60, paddingBottom: 8, paddingTop: 8 },
        tabBarBadgeStyle: { backgroundColor: colors.error, color: colors.white, fontFamily: font.semibold, fontSize: 9 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: ({ focused, color }) => TabIcon('index', focused, color) }} />
      <Tabs.Screen name="bookings" options={{ title: 'Bookings', tabBarIcon: ({ focused, color }) => TabIcon('bookings', focused, color) }} />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ focused, color }) => TabIcon('messages', focused, color),
          tabBarBadge: unread > 0 ? unread : undefined,
        }}
      />
      <Tabs.Screen name="orders" options={{ title: 'Orders', tabBarIcon: ({ focused, color }) => TabIcon('orders', focused, color) }} />
      {/* Income stays a real route (reachable from the Dashboard's "Today's Income" metric card
          and section header) — it's just no longer a bottom-tab button, per the brief. */}
      <Tabs.Screen name="income" options={{ title: 'Income', href: null }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ focused, color }) => TabIcon('profile', focused, color) }} />
    </Tabs>
  );
}
