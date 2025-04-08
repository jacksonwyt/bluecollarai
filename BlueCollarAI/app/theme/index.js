import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const theme = {
  colors: {
    // Primary colors with expanded palette
    primary: {
      main: '#1A2A44',
      light: '#2A4A74',
      dark: '#0F1729',
      contrast: '#FFFFFF',
      gradient: ['#1A2A44', '#2A4A74'],
      surface: 'rgba(26, 42, 68, 0.03)'
    },
    // Accent colors for CTAs and highlights
    accent: {
      main: '#4A90E2',
      light: '#6BA5E9',
      dark: '#3570B3',
      contrast: '#FFFFFF',
      gradient: ['#4A90E2', '#6BA5E9']
    },
    // Success states
    success: {
      main: '#48BB78',
      light: '#68D391',
      dark: '#2F855A',
      contrast: '#FFFFFF',
      gradient: ['#48BB78', '#68D391']
    },
    // Warning states
    warning: {
      main: '#FBBF24',
      light: '#FCD34D',
      dark: '#D97706',
      contrast: '#000000',
      gradient: ['#FBBF24', '#FCD34D']
    },
    // Error states
    error: {
      main: '#E53E3E',
      light: '#FC8181',
      dark: '#C53030',
      contrast: '#FFFFFF',
      gradient: ['#E53E3E', '#FC8181']
    },
    // Neutral colors for text and backgrounds
    neutral: {
      100: '#F7FAFC',
      200: '#EDF2F7',
      300: '#E2E8F0',
      400: '#CBD5E0',
      500: '#A0AEC0',
      600: '#718096',
      700: '#4A5568',
      800: '#2D3748',
      900: '#1A202C'
    },
    // Glass effect colors with blur values
    glass: {
      light: 'rgba(255, 255, 255, 0.8)',
      dark: 'rgba(26, 42, 68, 0.8)',
      overlay: 'rgba(0, 0, 0, 0.5)',
      blur: {
        light: 10,
        medium: 20,
        heavy: 30
      }
    }
  },
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
    xxxl: 64
  },
  // Border Radius with new values
  borderRadius: {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999
  },
  // Enhanced shadows for depth
  shadows: {
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 2
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 6.27,
      elevation: 12
    }
  },
  // Layout constants
  layout: {
    screenWidth: width,
    screenHeight: height,
    maxContentWidth: 500,
    headerHeight: 60,
    tabBarHeight: 80,
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
  // Map styles for a cleaner look
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

// Export constants for direct imports
export const COLORS = {
  primary: {
    main: '#1A2A44',
    light: '#2A4A74',
    dark: '#0F1729',
    contrast: '#FFFFFF',
    white: '#FFFFFF',
    darkBlue: '#1A2A44',
    lightBlue: '#4A90E2'
  },
  secondary: {
    gray: '#718096'
  },
  ...theme.colors
};

export const FONTS = {
  sizes: {
    header: 24,
    subheader: 20,
    body: 16,
    secondary: 14,
    small: 12
  },
  families: theme.typography.fontFamily
};

export default theme;

