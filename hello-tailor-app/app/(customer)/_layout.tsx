// Tab shell for the Customer role. 5 real tabs (index/tailors/bookings/notifications/profile);
// everything else that lives as a sibling file under this same (customer) group (search,
// category, tailor/[id], booking/*) is hidden from the tab bar via href:null so it doesn't
// show up as an extra tab button — it's still reachable via router.push().
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, ColorValue } from 'react-native';
import { colors } from '@/theme';
import { useTotalUnread } from '@/store/chatStore';

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

export default function CustomerTabLayout() {
  const totalUnreadMessages = useTotalUnread('customer');

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
        name="messages/index"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => (
            <View>
              <TabIcon name="chatbubble-outline" color={color} />
              {totalUnreadMessages > 0 ? <Dot /> : null}
            </View>
          ),
        }}
      />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <TabIcon name="person-outline" color={color} /> }} />

      {/* Non-tab screens living under this same group — hidden from the tab bar. */}
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="search/index" options={{ href: null }} />
      <Tabs.Screen name="category/index" options={{ href: null }} />
      <Tabs.Screen name="tailor/[id]/index" options={{ href: null }} />
      <Tabs.Screen name="tailor/[id]/reviews" options={{ href: null }} />
      <Tabs.Screen name="chat/[conversationId]/index" options={{ href: null }} />
      <Tabs.Screen name="chat/[conversationId]/preview" options={{ href: null }} />
    </Tabs>
  );
}
