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

const TabBarIcon = ({ name, color, size, focused }) => (
  <View style={[styles.iconContainer, focused ? styles.activeIconContainer : null]}>
    <Ionicons name={name} size={size} color={color} />
    {/* Indicator logic relies on theme, so needs to be dynamic or removed if theme access is problematic here */}
    {/* focused && <View style={styles.indicator} /> */} 
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

export default function ClientTabsLayout() { // Renamed component
  const { theme } = useTheme(); 

  // Added check for theme availability
  if (!theme) {
     // Render a minimal fallback or null while theme is loading
     // This might flash briefly if theme loads async
     return null; 
  }

  // Dynamic styles relying on theme
  const dynamicStyles = StyleSheet.create({
    indicator: {
      position: 'absolute',
      bottom: -8,
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: theme.colors.accent.main, // Now safe to access
    }
  });

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
        name="index" // This should match app/(client)/(tabs)/index.js
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused ? styles.activeIconContainer : null]}>
              <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
              {focused && <View style={dynamicStyles.indicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="post-job" // This should match app/(client)/(tabs)/post-job.js
        options={{
          title: 'Post a Job',
          tabBarLabel: 'Post Job',
          tabBarIcon: ({ color, size, focused }) => (
             <View style={[styles.iconContainer, focused ? styles.activeIconContainer : null]}>
                <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={size} color={color} />
                {focused && <View style={dynamicStyles.indicator} />}
             </View>
          ),
        }}
      />
      <Tabs.Screen
        name="find-workers" // This should match app/(client)/(tabs)/find-workers.js
        options={{
          title: 'Find Workers',
          tabBarLabel: 'Find',
          tabBarIcon: ({ color, size, focused }) => (
             <View style={[styles.iconContainer, focused ? styles.activeIconContainer : null]}>
                <Ionicons name={focused ? "search" : "search-outline"} size={size} color={color} />
               {focused && <View style={dynamicStyles.indicator} />}
             </View>
          ),
        }}
      />
      <Tabs.Screen
        name="messages" // This should match app/(client)/(tabs)/messages.js
        options={{
          title: 'Messages',
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused ? styles.activeIconContainer : null]}>
               <Ionicons name={focused ? "chatbubble" : "chatbubble-outline"} size={size} color={color} />
               {focused && <View style={dynamicStyles.indicator} />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

// Static styles (not dependent on theme)
const styles = StyleSheet.create({
  iconContainer: {
    width: 52, // Adjust as needed
    height: 28, // Adjust as needed
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // Needed for absolute positioning of indicator
  },
  activeIconContainer: {
    // Add any styling for the active state if needed, e.g., slight scale
    // transform: [{ scale: 1.1 }], 
  },
  // Indicator style definition moved to dynamicStyles as it uses theme.colors
}); 