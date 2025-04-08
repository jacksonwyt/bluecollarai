import { Stack } from 'expo-router';
import React from 'react';

export default function ClientLayout() {
  // This layout now simply defines the group and renders children
  // The Tabs navigation is handled by (tabs)/_layout.js
  return <Stack screenOptions={{ headerShown: false }} />;
}
