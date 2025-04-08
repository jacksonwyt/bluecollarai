import { View, Animated, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import theme from '../../theme';

// Import LinearGradient with try/catch to handle potential issues
let LinearGradient;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (error) {
  console.warn('expo-linear-gradient is not available:', error);
}

const Card = ({ 
  children, 
  style, 
  variant = 'default',
  gradient = false,
  noPadding = false,
  noAnimation = false,
  onPress,
  elevation = 'md',
  floating = false
}) => {
  const [scaleAnim] = useState(new Animated.Value(noAnimation ? 1 : 0.98));
  const [opacityAnim] = useState(new Animated.Value(noAnimation ? 1 : 0));
  const [pressedAnim] = useState(new Animated.Value(1));
  
  // Simple and more performant floating animation
  const floatingAnimValue = useState(new Animated.Value(0))[0];
  
  useEffect(() => {
    // Entry animation - simplified with just one timing animation
    if (!noAnimation) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    
    // Create floating animation if enabled - with simpler parameters
    if (floating) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatingAnimValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(floatingAnimValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      ).start();
    }
  }, [floating]); // Added floating as a dependency to reinitialize when changed

  const getVariantStyle = () => {
    switch (variant) {
      case 'glass':
        return styles.glassCard;
      case 'elevated':
        return styles.elevatedCard;
      case 'outline':
        return styles.outlineCard;
      case 'flat':
        return styles.flatCard;
      default:
        return styles.defaultCard;
    }
  };
  
  const getShadowStyle = () => {
    switch (elevation) {
      case 'none':
        return theme.shadows.none;
      case 'sm':
        return theme.shadows.sm;
      case 'md':
        return theme.shadows.md;
      case 'lg':
        return theme.shadows.lg;
      case 'xl':
        return theme.shadows.xl;
      default:
        return theme.shadows.md;
    }
  };

  const CardContent = () => (
    <>
      {children}
    </>
  );
  
  // Simplified press animations
  const handlePressIn = () => {
    if (onPress) {
      Animated.timing(pressedAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.timing(pressedAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };
  
  // Generate transform array with potential floating animation - simplified logic
  const transformArray = [
    { scale: Animated.multiply(scaleAnim, pressedAnim) }
  ];
  
  // Only add floating animation if explicitly enabled
  if (floating) {
    transformArray.push({
      translateY: floatingAnimValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -3] // Reduced animation range for better stability
      })
    });
  }
  
  const WrapperComponent = onPress ? TouchableOpacity : Animated.View;
  const wrapperProps = onPress ? {
    activeOpacity: 0.9,
    onPress,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
  } : {};

  return (
    <WrapperComponent
      {...wrapperProps}
      style={[
        styles.card,
        getVariantStyle(),
        getShadowStyle(),
        noPadding ? styles.noPadding : {},
        {
          transform: transformArray,
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      {gradient && variant !== 'outline' && variant !== 'glass' && LinearGradient ? (
        <LinearGradient
          colors={variant === 'elevated' ? theme.colors.primary.gradient : theme.colors.accent.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientContainer, noPadding ? styles.noPadding : {}]}
        >
          <CardContent />
        </LinearGradient>
      ) : (
        <CardContent />
      )}
    </WrapperComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    margin: theme.spacing.sm,
    overflow: 'hidden',
  },
  noPadding: {
    padding: 0,
  },
  defaultCard: {
    backgroundColor: theme.colors.neutral[100],
  },
  glassCard: {
    backgroundColor: theme.colors.glass.light,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: Platform.OS === 'web' ? 'blur(10px)' : undefined,
  },
  elevatedCard: {
    backgroundColor: theme.colors.neutral[100],
  },
  outlineCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
  },
  flatCard: {
    backgroundColor: theme.colors.neutral[200],
    borderWidth: 0,
  },
  gradientContainer: {
    flex: 1,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
});

export default Card;
