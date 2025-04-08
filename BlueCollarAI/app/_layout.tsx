import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="role-selection" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="(worker)" />
        <Stack.Screen name="(client)" />
        <Stack.Screen name="job/[id]" />
        <Stack.Screen name="conversation" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
