import { Tabs } from 'expo-router';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../theme';

export default function ClientLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: COLORS.primary.darkBlue,
      tabBarInactiveTintColor: COLORS.secondary.gray,
      headerStyle: {
        backgroundColor: COLORS.primary.darkBlue,
      },
      headerTintColor: COLORS.primary.white,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'My Jobs',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="work" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="post-job"
        options={{
          title: 'Post Job',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="post-add" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="find-workers"
        options={{
          title: 'Find Workers',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="hard-hat" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="message" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="payment"
        options={{
          title: 'Payment',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="payment" size={24} color={color} />
          ),
          href: null, // Hide from tab bar
        }}
      />
    </Tabs>
  );
}
