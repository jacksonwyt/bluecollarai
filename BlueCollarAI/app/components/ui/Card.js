import { View, Animated, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import theme from '../../theme';

const Card = ({ children, style, variant = 'default' }) => {
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const [opacityAnim] = useState(new Animated.Value(0));

  useEffect(() => {
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
  }, []);

  const getVariantStyle = () => {
    switch (variant) {
      case 'glass':
        return styles.glassCard;
      case 'elevated':
        return styles.elevatedCard;
      default:
        return styles.defaultCard;
    }
  };

  return (
    <Animated.View
      style={[
        styles.card,
        getVariantStyle(),
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    margin: theme.spacing.sm,
  },
  defaultCard: {
    backgroundColor: theme.colors.neutral[100],
    ...theme.shadows.sm,
  },
  glassCard: {
    backgroundColor: theme.colors.glass.light,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  elevatedCard: {
    backgroundColor: theme.colors.neutral[100],
    ...theme.shadows.lg,
  },
});

export default Card;
