import React, { createContext, useState, useEffect, useContext } from 'react';
import { Appearance, useColorScheme as useDeviceColorScheme, StatusBar, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

// Define the Light Theme (keep this)
const lightTheme = {
  // ... (keep existing lightTheme definition) ...
  colors: {
    primary: {
      main: '#1E40AF', // Blue-700
      light: '#3B82F6', // Blue-500
      dark: '#1D4ED8', // Blue-600 - Adjusted slightly for contrast if needed
      contrast: '#FFFFFF',
      gradient: ['#3B82F6', '#1E40AF'], // Example gradient
    },
    secondary: {
      main: '#F59E0B', // Amber-500
      light: '#FCD34D', // Amber-300
      dark: '#D97706', // Amber-600
      contrast: '#000000',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB', // Gray-50
      paper: '#FFFFFF',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    text: {
      primary: '#1F2937', // Gray-800
      secondary: '#6B7280', // Gray-500
      tertiary: '#9CA3AF', // Gray-400
      disabled: '#D1D5DB', // Gray-300
      contrast: '#FFFFFF',
      link: '#3B82F6', // Blue-500
    },
    error: {
      main: '#EF4444', // Red-500
      light: '#FCA5A5', // Red-300
      dark: '#DC2626', // Red-600
      contrast: '#FFFFFF',
    },
    warning: {
      main: '#F59E0B', // Amber-500
      light: '#FCD34D', // Amber-300
      dark: '#D97706', // Amber-600
      contrast: '#000000',
    },
    info: {
      main: '#3B82F6', // Blue-500
      light: '#93C5FD', // Blue-300
      dark: '#2563EB', // Blue-600
      contrast: '#FFFFFF',
    },
    success: {
      main: '#10B981', // Emerald-500
      light: '#6EE7B7', // Emerald-300
      dark: '#059669', // Emerald-600
      contrast: '#FFFFFF',
    },
    neutral: {
      // Grayscale for borders, backgrounds, placeholders etc.
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    accent: { // Example accent color
      main: '#EC4899', // Pink-500
      contrast: '#FFFFFF',
    },
    divider: '#E5E7EB', // Gray-200
    // ... potentially other colors ...
  },
  typography: {
    fontFamily: {
      regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
      medium: Platform.OS === 'ios' ? 'System' : 'Roboto-Medium',
      bold: Platform.OS === 'ios' ? 'System' : 'Roboto-Bold',
    },
    size: {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
      xl: 18,
      xxl: 22,
      xxxl: 28,
      // Adjust as needed
    },
    weight: {
      light: '300',
      regular: '400',
      medium: '500',
      bold: '700',
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    // Specific text styles (examples)
    h1: {
      // fontFamily: 'Roboto-Bold', // Use specific font if needed
      fontWeight: '700',
      fontSize: 28,
      lineHeight: 36,
    },
    h2: {
      fontWeight: '700',
      fontSize: 22,
      lineHeight: 30,
    },
    body1: {
      fontWeight: '400',
      fontSize: 16,
      lineHeight: 24,
    },
    caption: {
      fontWeight: '400',
      fontSize: 12,
      lineHeight: 16,
    }
  },
  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    // ... add more as needed
  },
  shape: {
    borderRadius: {
      xs: 2,
      sm: 4,
      md: 6,
      lg: 8,
      xl: 12,
      full: 9999, // For circles/pills
    },
  },
  elevation: (level) => { // Function to generate platform-specific elevation/shadow
    if (Platform.OS === 'ios') {
      if (level === 0) return {};
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: level * 0.5 + 1 }, // Adjust multiplier and base
        shadowOpacity: 0.1 + level * 0.02, // Adjust base opacity and increment
        shadowRadius: level * 0.75 + 1.5, // Adjust multiplier and base
      };
    } else {
      // Android elevation
      return {
        elevation: level,
      };
    }
  },
  // ... other theme properties like zIndex if needed
};

// REMOVE darkTheme definition entirely
// const darkTheme = { ... };

// Create the Theme Context with a default value
// The default value structure should match what the provider passes
const ThemeContext = createContext({
  theme: lightTheme, // Default to lightTheme
});

// Create the Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // State now only holds the theme object, always lightTheme
  const [theme, setTheme] = useState(lightTheme);

  // Remove useEffect for system theme changes
  // useEffect(() => { ... appearance listener logic ... }, []);

  // Set Status Bar and Navigation Bar for the light theme
  useEffect(() => {
    StatusBar.setBarStyle('dark-content'); // Use 'dark-content' for light backgrounds
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(lightTheme.colors.background.primary);
      NavigationBar.setBackgroundColorAsync(lightTheme.colors.background.primary);
      NavigationBar.setButtonStyleAsync("dark"); // Icons dark on light background
    }
  }, []); // Run only once

  // Provide only the theme object
  const value = { theme };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
// Simplify to return only the theme object
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  // Return only the theme object
  return context.theme;
};

// Optional: Export the light theme if needed elsewhere directly
// (Though using useTheme is generally preferred)
export { lightTheme }; 