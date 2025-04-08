import React from 'react';
import { Tabs, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';
import theme, { COLORS } from '../theme';

// Import BlurView with try/catch to handle potential issues
let BlurView;
try {
  BlurView = require('expo-blur').BlurView;
} catch (error) {
  console.warn('expo-blur is not available:', error);
}

const TabBarIcon = ({ name, color, size, focused }) => (
  <View style={[styles.iconContainer, focused ? styles.activeIconContainer : null]}>
    <Ionicons name={name} size={size} color={color} />
    {focused && <View style={styles.indicator} />}
  </View>
);

const TabBarBackground = () => {
  if (Platform.OS === 'ios' && BlurView) {
    return (
      <BlurView 
        tint="light"
        intensity={95} 
        style={StyleSheet.absoluteFill} 
      />
    );
  }
  return null;
};

export default function WorkerTabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="profile-setup"
        options={{ 
          presentation: 'modal', 
        }}
      />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.accent.main,
        tabBarInactiveTintColor: theme.colors.neutral[500],
        headerStyle: {
          backgroundColor: theme.colors.primary.main,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: theme.colors.primary.contrast,
        tabBarStyle: {
          height: theme.layout.tabBarHeight,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : theme.colors.primary.contrast,
        },
        tabBarBackground: TabBarBackground,
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Available Jobs',
          tabBarLabel: 'Jobs',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon 
              name={focused ? "briefcase" : "briefcase-outline"} 
              size={size} 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my-jobs"
        options={{
          title: 'My Jobs',
          tabBarLabel: 'My Jobs',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon 
              name={focused ? "list" : "list-outline"} 
              size={size} 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon 
              name={focused ? "chatbubble" : "chatbubble-outline"} 
              size={size} 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon 
              name={focused ? "person" : "person-outline"} 
              size={size} 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 52,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconContainer: {
    transform: [{ scale: 1.1 }],
  },
  indicator: {
    position: 'absolute',
    bottom: -8,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.colors.accent.main,
  }
});
