import { View, Animated, StyleSheet, Platform } from 'react-native';
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
  noAnimation = false
}) => {
  const [scaleAnim] = useState(new Animated.Value(noAnimation ? 1 : 0.95));
  const [opacityAnim] = useState(new Animated.Value(noAnimation ? 1 : 0));

  useEffect(() => {
    if (!noAnimation) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, []);

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

  const CardContent = () => (
    <>
      {children}
    </>
  );

  return (
    <Animated.View
      style={[
        styles.card,
        getVariantStyle(),
        noPadding ? styles.noPadding : {},
        {
          transform: [{ scale: scaleAnim }],
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
    </Animated.View>
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
    ...theme.shadows.sm,
  },
  glassCard: {
    backgroundColor: theme.colors.glass.light,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: Platform.OS === 'web' ? 'blur(10px)' : undefined,
  },
  elevatedCard: {
    backgroundColor: theme.colors.neutral[100],
    ...theme.shadows.lg,
  },
  outlineCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
  },
  flatCard: {
    backgroundColor: theme.colors.neutral[200],
    borderWidth: 0,
    ...theme.shadows.none,
  },
  gradientContainer: {
    flex: 1,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
});

export default Card;
