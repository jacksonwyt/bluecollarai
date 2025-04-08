import { Dimensions, Platform } from 'react-native';
import React, { createContext, useContext } from 'react';
import { StatusBar, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// Define light and dark color themes
const lightColors = {
  // Primary colors with expanded palette
  primary: {
    main: '#1E3A8A',
    light: '#3B82F6',
    dark: '#0F2060',
    contrast: '#FFFFFF',
    gradient: ['#1E3A8A', '#3B82F6'],
    surface: 'rgba(30, 58, 138, 0.05)'
  },
  // Accent colors for CTAs and highlights
  accent: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
    contrast: '#FFFFFF',
    gradient: ['#3B82F6', '#60A5FA']
  },
  // Success states
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
    contrast: '#FFFFFF',
    gradient: ['#10B981', '#34D399']
  },
  // Warning states
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
    contrast: '#000000',
    gradient: ['#F59E0B', '#FBBF24']
  },
  // Error states
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
    contrast: '#FFFFFF',
    gradient: ['#EF4444', '#F87171']
  },
  // Neutral colors for text and backgrounds
  neutral: {
    100: '#F9FAFB',
    200: '#F3F4F6',
    300: '#E5E7EB',
    400: '#D1D5DB',
    500: '#9CA3AF',
    600: '#6B7280',
    700: '#4B5563',
    800: '#374151',
    900: '#1F2937'
  },
  // Glass effect colors with blur values
  glass: {
    light: 'rgba(255, 255, 255, 0.85)',
    dark: 'rgba(30, 58, 138, 0.85)', // Keep for potential reference? Or remove if strictly light only
    overlay: 'rgba(0, 0, 0, 0.5)',
    blur: {
      light: 15,
      medium: 25,
      heavy: 40
    }
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
  },
  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    tertiary: '#6B7280',
    inverse: '#FFFFFF',
  },
  divider: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: '#000000',
};

// Create theme with passed colors
const createTheme = (colors) => {
  // Simplified shadow calculation (always assumes light)
  const shadowOpacity = 0.15; // Example fixed value for light theme

  return {
    colors,
    // Typography with custom fonts
    typography: {
      fontFamily: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
        mono: 'System'
      },
      size: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
        display: 40
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75
      },
      letterSpacing: {
        tight: -0.5,
        normal: 0,
        wide: 0.5
      }
    },
    // Enhanced spacing scale
    spacing: {
      xxs: 2,
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
      xxxl: 64,
      huge: 80
    },
    // Border Radius with new values
    borderRadius: {
      none: 0,
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      xxl: 32,
      full: 9999
    },
    // Enhanced shadows for depth - simplified for light theme
    shadows: {
      none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0
      },
      sm: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: shadowOpacity, // Simplified
        shadowRadius: 3.0,
        elevation: 2
      },
      md: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: shadowOpacity + 0.05, // Simplified
        shadowRadius: 4.65,
        elevation: 6
      },
      lg: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: shadowOpacity + 0.1, // Simplified
        shadowRadius: 8.0,
        elevation: 10
      },
      xl: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: shadowOpacity + 0.2, // Simplified
        shadowRadius: 10.0,
        elevation: 15
      }
    },
    // Layout constants
    layout: {
      screenWidth: width,
      screenHeight: height,
      maxContentWidth: 500,
      headerHeight: 60,
      tabBarHeight: 76,
      bottomSheetHandleHeight: 20
    },
    // Enhanced animations
    animation: {
      duration: {
        instant: 100,
        fast: 200,
        normal: 300,
        slow: 500,
        verySlow: 700
      },
      easing: {
        easeInOut: 'ease-in-out',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        spring: {
          tension: 50,
          friction: 7
        }
      },
      scale: {
        pressed: 0.95,
        active: 1.05
      }
    },
    // Map styles - Simplified to only light theme map style
    mapStyle: [
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#1A2A44' }]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#FFFFFF' }]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers: [{ color: '#F7FAFC' }]
      },
      {
        featureType: 'landscape',
        elementType: 'geometry',
        stylers: [{ color: '#F0F4F8' }]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{ color: '#E2E8F0' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#FFFFFF' }]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#E2E8F0' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#BEE3F8' }]
      }
    ]
  };
};

// Create the theme instance
const lightTheme = createTheme(lightColors);

// Create the theme context - Provide lightTheme directly
const ThemeContext = createContext({
  theme: lightTheme, // Provide static light theme
  mode: 'light',     // Hardcode mode
  isLoading: false, // Hardcode isLoading
  // Remove toggle/set theme functions as they are no longer needed
  // toggleTheme: () => {},
  // setTheme: () => {},
});

// Simplified Theme provider component
export const ThemeProvider = ({ children }) => {
  // Set status bar style directly for light theme
  StatusBar.setBarStyle('dark-content');
  if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor(lightTheme.colors.background.primary);
  }

  // Prepare the context value - Now static
  const themeContextValue = {
    theme: lightTheme,
    mode: 'light',
    isLoading: false,
    // No toggle/set functions needed
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Adjusted useTheme hook - Context value is now simpler
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  // isLoading is always false now, theme is always lightTheme
  return context; // Return the static context object { theme, mode, isLoading }
};

// Export constants for direct imports
export const COLORS = {
  primary: {
    main: '#1E3A8A',
    light: '#3B82F6',
    dark: '#0F2060',
    contrast: '#FFFFFF',
    white: '#FFFFFF',
    darkBlue: '#1E3A8A',
    lightBlue: '#3B82F6'
  },
  secondary: {
    gray: '#6B7280'
  },
  ...lightColors
};

export const FONTS = {
  sizes: {
    header: 24,
    subheader: 20,
    body: 16,
    secondary: 14,
    small: 12
  },
  families: lightTheme.typography.fontFamily // Still based on lightTheme
};

// Default export is the simplified ThemeProvider
export default ThemeProvider;

