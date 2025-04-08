import React from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native'; // Import from styled-components

// Define a minimal theme object directly here for styled-components
const inlineLightTheme = {
  colors: {
    primary: {
      main: '#1E3A8A',
      light: '#3B82F6',
      dark: '#0F2060',
      contrast: '#FFFFFF',
    },
    neutral: {
      100: '#F9FAFB',
      200: '#F3F4F6',
      // Add other neutral shades if directly needed by styled components during init
      600: '#6B7280',
      900: '#1F2937'
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
    },
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
    },
    divider: 'rgba(0, 0, 0, 0.1)',
    // Add other colors if needed early
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  borderRadius: {
    md: 12,
    lg: 16,
    full: 9999,
  },
  typography: { // Add basic typography if needed early
      size: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
      }
  }
};

export default function RootLayout() {
  // Only wrap with styled-components ThemeProvider
  return (
    <StyledThemeProvider theme={inlineLightTheme}> 
      <Stack screenOptions={{ headerShown: false }} />
    </StyledThemeProvider>
  );
} 