import { View, TextInput, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import theme from '../../theme';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  type = 'default',
  style,
  icon,
  iconPosition = 'left',
  iconColor,
  rightIcon,
  onRightIconPress,
  variant = 'outline',
  disabled = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureTextVisible, setIsSecureTextVisible] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;
  const isPasswordInput = type === 'password' || props.secureTextEntry;

  const handleFocus = () => {
    if (disabled) return;
    
    setIsFocused(true);
    Haptics.selectionAsync();
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSecureTextToggle = () => {
    setIsSecureTextVisible(!isSecureTextVisible);
    Haptics.selectionAsync();
  };

  const labelStyle = {
    position: 'absolute',
    left: icon && iconPosition === 'left' ? theme.spacing.xl + theme.spacing.sm : theme.spacing.sm,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.spacing.md, theme.spacing.xxs],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.typography.size.md, theme.typography.size.xs],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        disabled ? theme.colors.neutral[400] : theme.colors.neutral[500], 
        disabled ? theme.colors.neutral[400] : theme.colors.primary.main
      ],
    }),
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'filled':
        return styles.filledInput;
      case 'flat':
        return styles.flatInput;
      default:
        return styles.outlineInput;
    }
  };

  const getFocusedVariantStyle = () => {
    switch (variant) {
      case 'filled':
        return styles.focusedFilledInput;
      case 'flat':
        return styles.focusedFlatInput;
      default:
        return styles.focusedOutlineInput;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Animated.Text style={[styles.label, labelStyle, disabled && styles.disabledText]}>
          {label}
        </Animated.Text>
      )}
      
      <View style={styles.inputWrapper}>
        {icon && iconPosition === 'left' && (
          <View style={styles.iconContainer}>
            <MaterialIcons 
              name={icon} 
              size={20} 
              color={iconColor || (disabled ? theme.colors.neutral[400] : theme.colors.neutral[500])} 
            />
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            getVariantStyle(),
            isFocused && getFocusedVariantStyle(),
            error && styles.errorInput,
            icon && iconPosition === 'left' && styles.inputWithLeftIcon,
            (rightIcon || isPasswordInput) && styles.inputWithRightIcon,
            disabled && styles.disabledInput,
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused || !label ? placeholder : ''}
          placeholderTextColor={theme.colors.neutral[400]}
          secureTextEntry={isPasswordInput && !isSecureTextVisible}
          editable={!disabled}
          {...props}
        />
        
        {(rightIcon || isPasswordInput) && (
          <TouchableOpacity 
            style={styles.rightIconContainer}
            onPress={isPasswordInput ? handleSecureTextToggle : onRightIconPress}
            disabled={disabled}
          >
            <MaterialIcons 
              name={isPasswordInput ? (isSecureTextVisible ? 'visibility' : 'visibility-off') : rightIcon} 
              size={20} 
              color={disabled ? theme.colors.neutral[400] : theme.colors.neutral[500]} 
            />
          </TouchableOpacity>
        )}
        
        {icon && iconPosition === 'right' && !rightIcon && !isPasswordInput && (
          <View style={styles.rightIconContainer}>
            <MaterialIcons 
              name={icon} 
              size={20} 
              color={iconColor || (disabled ? theme.colors.neutral[400] : theme.colors.neutral[500])} 
            />
          </View>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.xs,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    fontSize: theme.typography.size.md,
    borderRadius: theme.borderRadius.md,
    color: theme.colors.neutral[900],
  },
  outlineInput: {
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
    backgroundColor: theme.colors.neutral[100],
  },
  filledInput: {
    borderWidth: 0,
    backgroundColor: theme.colors.neutral[200],
  },
  flatInput: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: theme.colors.neutral[300],
    backgroundColor: 'transparent',
    borderRadius: 0,
  },
  focusedOutlineInput: {
    borderColor: theme.colors.primary.main,
    borderWidth: 2,
    backgroundColor: theme.colors.neutral[100],
  },
  focusedFilledInput: {
    backgroundColor: theme.colors.neutral[200],
    ...theme.shadows.sm,
  },
  focusedFlatInput: {
    borderBottomColor: theme.colors.primary.main,
    borderBottomWidth: 2,
  },
  errorInput: {
    borderColor: theme.colors.error.main,
  },
  disabledInput: {
    backgroundColor: theme.colors.neutral[200],
    color: theme.colors.neutral[500],
    borderColor: theme.colors.neutral[300],
  },
  errorText: {
    color: theme.colors.error.main,
    fontSize: theme.typography.size.sm,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  disabledText: {
    color: theme.colors.neutral[400],
  },
  inputWithLeftIcon: {
    paddingLeft: theme.spacing.xl + theme.spacing.md,
  },
  inputWithRightIcon: {
    paddingRight: theme.spacing.xl + theme.spacing.xs,
  },
  iconContainer: {
    position: 'absolute',
    left: theme.spacing.sm,
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: theme.spacing.sm,
    zIndex: 1,
  },
});

export default Input;
