import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, font } from '@/theme';

const ICONS: Record<string, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
  index: ['grid-outline', 'grid'],
  bookings: ['calendar-outline', 'calendar'],
  orders: ['receipt-outline', 'receipt'],
  income: ['bar-chart-outline', 'bar-chart'],
  profile: ['person-outline', 'person'],
};

function TabIcon(name: string, focused: boolean, color: ColorValue) {
  const [outline, filled] = ICONS[name];
  return <Ionicons name={focused ? filled : outline} size={23} color={color as string} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ocean,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontFamily: font.medium, fontSize: 11 },
        tabBarStyle: { borderTopColor: colors.border, height: 60, paddingBottom: 8, paddingTop: 8 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: ({ focused, color }) => TabIcon('index', focused, color) }} />
      <Tabs.Screen name="bookings" options={{ title: 'Bookings', tabBarIcon: ({ focused, color }) => TabIcon('bookings', focused, color) }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders', tabBarIcon: ({ focused, color }) => TabIcon('orders', focused, color) }} />
      <Tabs.Screen name="income" options={{ title: 'Income', tabBarIcon: ({ focused, color }) => TabIcon('income', focused, color) }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ focused, color }) => TabIcon('profile', focused, color) }} />
    </Tabs>
  );
}
