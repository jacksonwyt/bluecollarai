import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
import Card from './Card';

// Import LinearGradient with try/catch to handle potential issues
let LinearGradient;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (error) {
  console.warn('expo-linear-gradient is not available:', error);
}

const Header = ({ 
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  transparent = false,
  floating = false,
  minimal = false,
  hideSubtitle = false,
  variant = 'default'
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isScrolling, setIsScrolling] = useState(false);
  
  const floatingAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (floating) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatingAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatingAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [floating]);

  const getHeaderOpacity = () => {
    if (transparent) return 0;
    return scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [0.8, 1],
      extrapolate: 'clamp',
    });
  };

  const getHeaderHeight = () => {
    return scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [100, 70],
      extrapolate: 'clamp',
    });
  };

  const getTitleOpacity = () => {
    return scrollY.interpolate({
      inputRange: [0, 50],
      outputRange: [1, minimal ? 0 : 1],
      extrapolate: 'clamp',
    });
  };
  
  // Transform for floating animation
  const getFloatingTransform = () => {
    if (!floating) return [];
    
    return [{
      translateY: floatingAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -6],
      })
    }];
  };

  const renderContent = () => (
    <Animated.View 
      style={[
        styles(theme).container, 
        { paddingTop: insets.top + (minimal ? 4 : 16) },
        transparent && styles(theme).transparentHeader,
        minimal && styles(theme).minimalContainer,
        {
          height: transparent ? 'auto' : getHeaderHeight(),
          transform: getFloatingTransform(),
        }
      ]}
    >
      <View style={styles(theme).leftContainer}>
        {leftIcon && (
          <TouchableOpacity 
            onPress={onLeftPress} 
            style={[styles(theme).iconButton, minimal && styles(theme).minimalIconButton]}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <MaterialIcons 
              name={leftIcon} 
              size={minimal ? 20 : 24} 
              color={theme.colors.neutral[800]} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      <Animated.View 
        style={[
          styles(theme).titleContainer,
          { opacity: getTitleOpacity() }
        ]}
      >
        <Text style={[styles(theme).title, minimal && styles(theme).minimalTitle]}>{title}</Text>
        {subtitle && !hideSubtitle && (
          <Text style={styles(theme).subtitle}>{subtitle}</Text>
        )}
      </Animated.View>
      
      <View style={styles(theme).rightContainer}>
        {rightIcon && (
          <TouchableOpacity 
            onPress={onRightPress}
            style={[styles(theme).iconButton, minimal && styles(theme).minimalIconButton]} 
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <MaterialIcons 
              name={rightIcon} 
              size={minimal ? 20 : 24} 
              color={theme.colors.neutral[800]} 
            />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );

  // Minimal floating header with card
  if (minimal && floating) {
    return (
      <Card 
        style={styles(theme).floatingCardHeader}
        variant="glass"
        floating={true}
        elevation="lg"
      >
        {renderContent()}
      </Card>
    );
  }

  // Glass effect header
  if (variant === 'glass') {
    return (
      <Animated.View
        style={[
          styles(theme).headerContainer,
          { 
            opacity: getHeaderOpacity(),
            transform: getFloatingTransform(),
          }
        ]}
      >
        <BlurView 
          intensity={90} 
          style={[
            StyleSheet.absoluteFill, 
            { backgroundColor: 'rgba(255, 255, 255, 0.7)' }
          ]} 
        />
        {renderContent()}
      </Animated.View>
    );
  }

  // Gradient header
  if (variant === 'gradient' && LinearGradient) {
    return (
      <Animated.View
        style={[
          styles(theme).headerContainer,
          { 
            opacity: getHeaderOpacity(),
            transform: getFloatingTransform(),
          }
        ]}
      >
        <LinearGradient
          colors={theme.colors.primary.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {renderContent()}
      </Animated.View>
    );
  }

  // Default header
  return (
    <Animated.View
      style={[
        styles(theme).headerContainer,
        { 
          opacity: getHeaderOpacity(),
          backgroundColor: theme.colors.neutral[100],
          transform: getFloatingTransform(),
        }
      ]}
    >
      {renderContent()}
    </Animated.View>
  );
};

// Convert styles to a function that accepts theme
const styles = (theme) => StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    ...theme.shadows.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  minimalContainer: {
    paddingBottom: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  transparentHeader: {
    backgroundColor: 'transparent',
    ...theme.shadows.none,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.size.xl,
    fontWeight: '600',
    color: theme.colors.neutral[900],
    textAlign: 'center',
  },
  minimalTitle: {
    fontSize: theme.typography.size.md,
  },
  subtitle: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[600],
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  iconButton: {
    height: 40,
    width: 40,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.neutral[200],
  },
  minimalIconButton: {
    height: 32,
    width: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  floatingCardHeader: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 15,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    margin: 0,
    padding: 0,
    zIndex: 100,
    borderRadius: theme.borderRadius.xl,
  },
});

export default Header;
