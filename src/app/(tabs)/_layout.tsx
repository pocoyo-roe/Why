import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import { usePalette } from '../../theme';

export default function TabsLayout() {
  const palette = usePalette();
  return (
    <Tabs
      screenOptions={{
        headerShadowVisible: false,
        tabBarActiveTintColor: palette.accent,
        tabBarInactiveTintColor: palette.muted,
        tabBarStyle: { backgroundColor: palette.card, borderTopColor: palette.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Book',
          headerTitle: 'Roe Saunas',
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'My bookings',
          tabBarIcon: ({ color, size }) => <Ionicons name="ticket" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: 'Info',
          tabBarIcon: ({ color, size }) => <Ionicons name="information-circle" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
