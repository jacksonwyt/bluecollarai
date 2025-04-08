import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens - these will be created later
import WelcomeScreen from '../screens/WelcomeScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LoginScreen from '../screens/LoginScreen';

// Worker screens
import WorkerProfileSetupScreen from '../screens/worker/WorkerProfileSetupScreen';
import JobListingsScreen from '../screens/worker/JobListingsScreen';
import JobDetailsScreen from '../screens/worker/JobDetailsScreen';
import WorkerProfileScreen from '../screens/worker/WorkerProfileScreen';
import WorkerMessagesScreen from '../screens/worker/WorkerMessagesScreen';

// Client screens
import JobPostingScreen from '../screens/client/JobPostingScreen';
import BrowseWorkersScreen from '../screens/client/BrowseWorkersScreen';
import MyJobsScreen from '../screens/client/MyJobsScreen';
import ClientMessagesScreen from '../screens/client/ClientMessagesScreen';

import { COLORS } from '../theme';

// Create navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth navigator for onboarding and authentication
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="WorkerProfileSetup" component={WorkerProfileSetupScreen} />
  </Stack.Navigator>
);

// Worker tab navigator (after login)
const WorkerTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Jobs') {
          iconName = focused ? 'briefcase' : 'briefcase-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'Messages') {
          iconName = focused ? 'chatbubble' : 'chatbubble-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary.lightBlue,
      tabBarInactiveTintColor: COLORS.secondary.gray,
      headerShown: true,
      headerStyle: {
        backgroundColor: COLORS.primary.darkBlue,
      },
      headerTintColor: COLORS.primary.white,
    })}
  >
    <Tab.Screen name="Jobs" component={JobListingsScreen} />
    <Tab.Screen name="Profile" component={WorkerProfileScreen} />
    <Tab.Screen name="Messages" component={WorkerMessagesScreen} />
  </Tab.Navigator>
);

// Client tab navigator (after login)
const ClientTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Post Job') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
        } else if (route.name === 'My Jobs') {
          iconName = focused ? 'list' : 'list-outline';
        } else if (route.name === 'Workers') {
          iconName = focused ? 'people' : 'people-outline';
        } else if (route.name === 'Messages') {
          iconName = focused ? 'chatbubble' : 'chatbubble-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary.lightBlue,
      tabBarInactiveTintColor: COLORS.secondary.gray,
      headerShown: true,
      headerStyle: {
        backgroundColor: COLORS.primary.darkBlue,
      },
      headerTintColor: COLORS.primary.white,
    })}
  >
    <Tab.Screen name="Post Job" component={JobPostingScreen} />
    <Tab.Screen name="My Jobs" component={MyJobsScreen} />
    <Tab.Screen name="Workers" component={BrowseWorkersScreen} />
    <Tab.Screen name="Messages" component={ClientMessagesScreen} />
  </Tab.Navigator>
);

// Main app navigator
const AppNavigator = () => {
  // For demo purposes, we'll start with the auth flow
  // In a real app, we'd check if the user is authenticated
  const isAuthenticated = false;
  const userRole = null; // 'worker' or 'client'

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthNavigator />
      ) : userRole === 'worker' ? (
        <WorkerTabNavigator />
      ) : (
        <ClientTabNavigator />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
