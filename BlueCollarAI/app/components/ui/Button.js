import { TouchableOpacity, Text, Animated, StyleSheet, View, ActivityIndicator } from 'react-native';
import { useState, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import theme from '../../theme';

// Import LinearGradient with try/catch to handle potential issues
let LinearGradient;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (error) {
  console.warn('expo-linear-gradient is not available:', error);
}

const Button = ({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  badge,
  block = false,
  gradient = false,
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const isPressing = useRef(false);

  const handlePressIn = () => {
    if (disabled || loading) return;
    
    isPressing.current = true;
    Haptics.selectionAsync();
    
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      tension: 100,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (!isPressing.current) return;
    
    isPressing.current = false;
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'ghost':
        return styles.ghostButton;
      case 'danger':
        return styles.dangerButton;
      case 'success':
        return styles.successButton;
      default:
        return styles.primaryButton;
    }
  };

  const getVariantTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      case 'danger':
        return styles.dangerText;
      case 'success':
        return styles.successText;
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'xs':
        return styles.extraSmallButton;
      case 'sm':
        return styles.smallButton;
      case 'lg':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'xs':
        return styles.extraSmallText;
      case 'sm':
        return styles.smallText;
      case 'lg':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  const getColors = () => {
    if (disabled) return [theme.colors.neutral[300], theme.colors.neutral[400]];
    
    switch (variant) {
      case 'secondary':
        return theme.colors.accent.gradient;
      case 'danger':
        return theme.colors.error.gradient;
      case 'success':
        return theme.colors.success.gradient;
      default:
        return theme.colors.primary.gradient;
    }
  };

  const buttonContent = (
    <View style={styles.contentContainer}>
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' 
            ? theme.colors.primary.main 
            : theme.colors.primary.contrast} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <MaterialIcons
              name={icon}
              size={size === 'lg' ? 24 : size === 'sm' ? 16 : 20}
              color={getVariantTextStyle().color}
              style={styles.leftIcon}
            />
          )}
          <Text
            style={[
              styles.text,
              getVariantTextStyle(),
              getTextSizeStyle(),
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {children}
          </Text>
          {icon && iconPosition === 'right' && (
            <MaterialIcons
              name={icon}
              size={size === 'lg' ? 24 : size === 'sm' ? 16 : 20}
              color={getVariantTextStyle().color}
              style={styles.rightIcon}
            />
          )}
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[block && styles.blockContainer, style]}
    >
      <Animated.View
        style={[
          styles.button,
          getVariantStyle(),
          getSizeStyle(),
          block && styles.blockButton,
          { transform: [{ scale: scaleAnim }] },
          disabled && styles.disabledButton,
        ]}
      >
        {gradient && !disabled && variant !== 'outline' && variant !== 'ghost' && LinearGradient ? (
          <LinearGradient
            colors={getColors()}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradientContainer]}
          >
            {buttonContent}
          </LinearGradient>
        ) : (
          buttonContent
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  blockContainer: {
    width: '100%',
  },
  button: {
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  blockButton: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: theme.colors.primary.main,
    ...theme.shadows.md,
  },
  secondaryButton: {
    backgroundColor: theme.colors.accent.main,
    ...theme.shadows.md,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  dangerButton: {
    backgroundColor: theme.colors.error.main,
    ...theme.shadows.md,
  },
  successButton: {
    backgroundColor: theme.colors.success.main,
    ...theme.shadows.md,
  },
  extraSmallButton: {
    paddingVertical: theme.spacing.xxs,
    paddingHorizontal: theme.spacing.sm,
    minHeight: 28,
  },
  smallButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    minHeight: 36,
  },
  mediumButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 44,
  },
  largeButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    minHeight: 52,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  extraSmallText: {
    fontSize: theme.typography.size.xs,
  },
  smallText: {
    fontSize: theme.typography.size.sm,
  },
  mediumText: {
    fontSize: theme.typography.size.md,
  },
  largeText: {
    fontSize: theme.typography.size.lg,
  },
  primaryText: {
    color: theme.colors.primary.contrast,
  },
  secondaryText: {
    color: theme.colors.accent.contrast,
  },
  outlineText: {
    color: theme.colors.primary.main,
  },
  ghostText: {
    color: theme.colors.primary.main,
  },
  dangerText: {
    color: theme.colors.error.contrast,
  },
  successText: {
    color: theme.colors.success.contrast,
  },
  disabledButton: {
    backgroundColor: theme.colors.neutral[300],
    borderColor: theme.colors.neutral[300],
    ...theme.shadows.sm,
  },
  disabledText: {
    color: theme.colors.neutral[500],
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing.xs,
  },
  rightIcon: {
    marginLeft: theme.spacing.xs,
  },
  badge: {
    backgroundColor: theme.colors.error.main,
    borderRadius: theme.borderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    marginLeft: theme.spacing.xs,
  },
  badgeText: {
    color: theme.colors.error.contrast,
    fontSize: theme.typography.size.xs,
    fontWeight: '600',
  },
  gradientContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xs,
  },
});

export default Button;
