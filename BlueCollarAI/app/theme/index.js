import { Dimensions, useColorScheme, Platform } from 'react-native';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    dark: 'rgba(30, 58, 138, 0.85)',
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

const darkColors = {
  // Primary colors with expanded palette - slightly adjusted for dark mode
  primary: {
    main: '#3B82F6', // Lighter blue for better visibility
    light: '#60A5FA',
    dark: '#1E3A8A',
    contrast: '#FFFFFF',
    gradient: ['#2563EB', '#3B82F6'],
    surface: 'rgba(59, 130, 246, 0.1)'
  },
  // Accent colors - same as light
  accent: {
    main: '#3B82F6',
    light: '#60A5FA',
    dark: '#2563EB',
    contrast: '#FFFFFF',
    gradient: ['#3B82F6', '#60A5FA']
  },
  // Success states - slightly brighter for dark backgrounds
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
    contrast: '#FFFFFF',
    gradient: ['#10B981', '#34D399']
  },
  // Warning states - same as light
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
    contrast: '#000000',
    gradient: ['#F59E0B', '#FBBF24']
  },
  // Error states - same as light
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
    contrast: '#FFFFFF',
    gradient: ['#EF4444', '#F87171']
  },
  // Neutral colors - inverted for dark mode
  neutral: {
    900: '#F9FAFB', // Inverted
    800: '#F3F4F6',
    700: '#E5E7EB',
    600: '#D1D5DB',
    500: '#9CA3AF',
    400: '#6B7280',
    300: '#4B5563',
    200: '#374151',
    100: '#1F2937'
  },
  // Glass effect colors adjusted for dark mode
  glass: {
    light: 'rgba(31, 41, 55, 0.85)',
    dark: 'rgba(59, 130, 246, 0.85)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    blur: {
      light: 15,
      medium: 25,
      heavy: 40
    }
  },
  background: {
    primary: '#111827',
    secondary: '#1F2937',
    tertiary: '#374151',
  },
  text: {
    primary: '#F9FAFB',
    secondary: '#E5E7EB',
    tertiary: '#D1D5DB',
    inverse: '#1F2937',
  },
  divider: 'rgba(255, 255, 255, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: '#000000',
};

// Create theme with passed colors
const createTheme = (colors) => {
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
    // Enhanced shadows for depth - adjusted based on dark/light
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
        shadowOpacity: colors === darkColors ? 0.3 : 0.15,
        shadowRadius: 3.0,
        elevation: 2
      },
      md: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: colors === darkColors ? 0.35 : 0.2,
        shadowRadius: 4.65,
        elevation: 6
      },
      lg: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: colors === darkColors ? 0.4 : 0.25,
        shadowRadius: 8.0,
        elevation: 10
      },
      xl: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: colors === darkColors ? 0.5 : 0.35,
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
    // Map styles for a cleaner look - adjusted for dark mode
    mapStyle: colors === darkColors ? 
    [
      {
        featureType: 'all',
        elementType: 'geometry',
        stylers: [{ color: '#242f3e' }]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#746855' }]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#242f3e' }]
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }]
      }
    ] : [
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

// Create the theme instances
const lightTheme = createTheme(lightColors);
const darkTheme = createTheme(darkColors);

// Create the theme context
const ThemeContext = createContext({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

// Storage keys
const THEME_PREFERENCE_KEY = '@bluecollar_theme_preference';

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system'); // 'light', 'dark', or 'system'
  
  // Calculate the actual theme based on preference and system
  const isDark = 
    themeMode === 'system' 
      ? deviceTheme === 'dark' 
      : themeMode === 'dark';
  
  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    // Load saved theme preference
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (savedTheme) {
          setThemeMode(savedTheme);
        }
      } catch (e) {
        console.warn('Failed to load theme preference', e);
      }
    };
    
    loadThemePreference();
  }, []);

  // Toggle between light and dark
  const toggleTheme = async () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
    
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, newMode);
    } catch (e) {
      console.warn('Failed to save theme preference', e);
    }
  };
  
  // Set specific theme mode (light, dark, system)
  const setTheme = async (mode) => {
    if (['light', 'dark', 'system'].includes(mode)) {
      setThemeMode(mode);
      
      try {
        await AsyncStorage.setItem(THEME_PREFERENCE_KEY, mode);
      } catch (e) {
        console.warn('Failed to save theme preference', e);
      }
    }
  };
  
  // Update StatusBar based on theme
  useEffect(() => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(
        isDark ? darkColors.background.primary : lightColors.background.primary
      );
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme, themeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

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
  families: lightTheme.typography.fontFamily
};

// Export theme object for direct usage
export const theme = lightTheme;

// Default theme export is light theme
export default lightTheme;

