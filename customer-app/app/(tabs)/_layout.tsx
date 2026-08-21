import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, ColorValue } from 'react-native';
import { colors } from '../../constants/theme';
import { useApp } from '../../store/AppState';

function TabIcon({ name, color }: { name: keyof typeof Ionicons.glyphMap; color: ColorValue }) {
  return <Ionicons name={name} size={23} color={color} />;
}

function Dot() {
  return (
    <View
      style={{
        position: 'absolute',
        top: -2,
        right: -6,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.error,
      }}
    />
  );
}

export default function TabLayout() {
  const { notifications } = useApp();
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { height: 62, paddingTop: 6, paddingBottom: 10, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: 'Inter_500Medium', fontSize: 11 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <TabIcon name="home-outline" color={color} /> }} />
      <Tabs.Screen name="tailors" options={{ title: 'Tailors', tabBarIcon: ({ color }) => <TabIcon name="cut-outline" color={color} /> }} />
      <Tabs.Screen name="bookings" options={{ title: 'Bookings', tabBarIcon: ({ color }) => <TabIcon name="calendar-outline" color={color} /> }} />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => (
            <View>
              <TabIcon name="notifications-outline" color={color} />
              {hasUnread ? <Dot /> : null}
            </View>
          ),
        }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <TabIcon name="person-outline" color={color} /> }} />
    </Tabs>
  );
}
