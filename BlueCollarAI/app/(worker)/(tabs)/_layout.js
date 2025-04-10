import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../theme'; // Corrected import path

// Import BlurView with try/catch to handle potential issues
let BlurView;
try {
  BlurView = require('expo-blur').BlurView;
} catch (error) {
  console.warn('expo-blur is not available:', error);
}

// TabBarIcon component needs access to theme for the indicator
const TabBarIcon = ({ name, color, size, focused }) => {
  const { theme } = useTheme();

  // Ensure theme is available before creating dynamic styles
  if (!theme) return null;

  const dynamicStyles = createDynamicStyles(theme);

  return (
    <View style={[styles.iconContainer, focused ? styles.activeIconContainer : null]}>
      <Ionicons name={name} size={size} color={color} />
      {focused && <View style={dynamicStyles.indicator} />}
    </View>
  );
};

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

export default function WorkerTabsLayout() { // Renamed component
  const { theme } = useTheme();

  // Added check for theme availability
  if (!theme) {
     return null; // Render nothing if theme isn't ready
  }

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
        name="index" // Matches app/(worker)/(tabs)/index.js
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
        name="my-jobs" // Matches app/(worker)/(tabs)/my-jobs.js
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
        name="messages" // Matches app/(worker)/(tabs)/messages.js
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
        name="payments" // Matches app/(worker)/(tabs)/payments.js
        options={{
          title: 'Payments',
          tabBarLabel: 'Payments',
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon 
              name={focused ? "card" : "card-outline"} 
              size={size} 
              color={color} 
              focused={focused} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile" // Matches app/(worker)/(tabs)/profile.js
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

// Dynamic styles moved inside component or helper function where theme is available
const createDynamicStyles = (theme) => StyleSheet.create({
  indicator: {
    position: 'absolute',
    bottom: -8,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.colors.accent.main,
  }
});

// Static styles
const styles = StyleSheet.create({
  iconContainer: {
    width: 52,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // For indicator positioning
  },
  activeIconContainer: {
    // transform: [{ scale: 1.1 }],
  },
}); 