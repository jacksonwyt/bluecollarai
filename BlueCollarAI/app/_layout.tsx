import { Stack } from 'expo-router';
import { ThemeProvider } from './theme';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack initialRouteName="role-selection" screenOptions={{ headerShown: false }}>
        {/* Main entry screens */}
        <Stack.Screen name="index" />
        <Stack.Screen name="role-selection" />
        
        {/* Auth screens */}
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        
        {/* Role-specific groups */}
        <Stack.Screen name="(worker)" />
        <Stack.Screen name="(client)" />
        
        {/* Shared screens */}
        <Stack.Screen name="job/[id]" />
        <Stack.Screen name="conversation" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="explore" />
      </Stack>
    </ThemeProvider>
  );
}
