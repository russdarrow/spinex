import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Search, Bell, User } from 'lucide-react-native';
import { useColorScheme } from '@/lib/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: isDark ? '#71717a' : '#a1a1aa',
        tabBarStyle: {
          backgroundColor: isDark ? '#000' : '#fff',
          borderTopColor: isDark ? '#27272a' : '#f4f4f5',
          borderTopWidth: 1,
          paddingTop: 8,
          height: 85,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 4,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Home size={24} color={color} fill={focused ? color : 'transparent'} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, focused }) => (
            <Bell size={24} color={color} fill={focused ? color : 'transparent'} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <User size={24} color={color} fill={focused ? color : 'transparent'} />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          href: null, // Hide this tab
        }}
      />
    </Tabs>
  );
}
