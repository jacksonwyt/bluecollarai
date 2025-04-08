import { View, TextInput, Text, Animated, StyleSheet } from 'react-native';
import { useState, useRef } from 'react';
import theme from '../../theme';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  type = 'default',
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
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

  const labelStyle = {
    position: 'absolute',
    left: theme.spacing.sm,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.spacing.md, 0],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.typography.size.md, theme.typography.size.sm],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [theme.colors.neutral[500], theme.colors.primary.main],
    }),
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.Text style={[styles.label, labelStyle]}>
        {label}
      </Animated.Text>
      <TextInput
        style={[
          styles.input,
          isFocused && styles.focusedInput,
          error && styles.errorInput,
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={!isFocused ? placeholder : ''}
        placeholderTextColor={theme.colors.neutral[400]}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.xs,
  },
  input: {
    height: 56,
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.lg,
    fontSize: theme.typography.size.md,
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral[100],
    color: theme.colors.neutral[900],
  },
  focusedInput: {
    borderColor: theme.colors.primary.main,
    borderWidth: 2,
    backgroundColor: theme.colors.neutral[100],
  },
  errorInput: {
    borderColor: theme.colors.error.main,
  },
  errorText: {
    color: theme.colors.error.main,
    fontSize: theme.typography.size.sm,
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
});

export default Input;
