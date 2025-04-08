import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Animated,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import theme, { COLORS } from '../theme';
import { mockApiCall } from '../api/mockData';
import * as Haptics from 'expo-haptics';

// Import LinearGradient with try/catch to handle potential issues
let LinearGradient;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (error) {
  console.warn('expo-linear-gradient is not available:', error);
}

// Import BlurView with try/catch to handle potential issues
let BlurView;
try {
  BlurView = require('expo-blur').BlurView;
} catch (error) {
  console.warn('expo-blur is not available:', error);
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const formFadeAnim = useState(new Animated.Value(0))[0];
  const formSlideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    // Run entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: theme.animation.duration.normal,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: theme.animation.duration.normal,
        useNativeDriver: true,
      }),
    ]).start();

    // Delayed animation for form
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(formFadeAnim, {
          toValue: 1,
          duration: theme.animation.duration.normal,
          useNativeDriver: true,
        }),
        Animated.timing(formSlideAnim, {
          toValue: 0,
          duration: theme.animation.duration.normal,
          useNativeDriver: true,
        }),
      ]).start();
    }, 300);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    setLoading(true);
    setError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      // For demo purposes, we're using mockApiCall instead of a real API
      const response = await mockApiCall('users/login', 'POST', { email, password });
      
      if (response.error) {
        setError(response.error);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // In a real app, we would store the user data and token
        // For demo, we'll navigate to the appropriate screen based on role
        if (response.role === 'worker') {
          router.replace('/(worker)');
        } else {
          router.replace('/(client)');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes, let's add helper functions to login as a worker or client
  const loginAsDemoWorker = () => {
    setEmail('james@example.com');
    setPassword('password123');
    Haptics.selectionAsync();
  };

  const loginAsDemoClient = () => {
    setEmail('emily@example.com');
    setPassword('password123');
    Haptics.selectionAsync();
  };

  const handleForgotPassword = () => {
    Haptics.selectionAsync();
    // This would normally navigate to a forgot password screen
    alert('Password reset functionality would be implemented here.');
  };

  const renderGlassmorphicCard = () => {
    // If BlurView is available, use it for a true glassmorphism effect
    if (BlurView) {
      return (
        <BlurView intensity={30} tint="light" style={styles.formContainer}>
          {renderForm()}
        </BlurView>
      );
    }
    
    // Fallback to a pseudo-glass effect
    return (
      <View style={[styles.formContainer, styles.formContainerFallback]}>
        {renderForm()}
      </View>
    );
  };

  const renderForm = () => (
    <Animated.View 
      style={[
        styles.formInner,
        { 
          opacity: formFadeAnim,
          transform: [{ translateY: formSlideAnim }]
        }
      ]}
    >
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={20} color={theme.colors.error.main} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color={theme.colors.neutral[600]} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor={theme.colors.neutral[500]}
          />
        </View>
        
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.colors.neutral[600]} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={theme.colors.neutral[500]}
          />
        </View>
      </View>

      <TouchableOpacity 
        style={styles.forgotPassword} 
        onPress={handleForgotPassword}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.loginButton,
          loading && styles.loginButtonLoading
        ]}
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.8}
      >
        {LinearGradient ? (
          <LinearGradient
            colors={theme.colors.primary.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.primary.contrast} />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </LinearGradient>
        ) : (
          <Text style={styles.loginButtonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity 
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/role-selection');
          }}
        >
          <Text style={styles.signupButton}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {LinearGradient && (
        <LinearGradient
          colors={['#1E3A8A20', '#3B82F610']}
          style={styles.gradientBackground}
        />
      )}
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary.main} />
        </TouchableOpacity>
        
        <View style={styles.content}>
          <Animated.View 
            style={[
              styles.headerContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue to BlueCollar</Text>
          </Animated.View>
          
          {renderGlassmorphicCard()}
          
          {/* Demo helpers - would be removed in production */}
          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>Demo Accounts:</Text>
            <View style={styles.demoButtonsRow}>
              <TouchableOpacity 
                style={[styles.demoButton, { marginRight: 10 }]} 
                onPress={loginAsDemoWorker}
              >
                <Text style={styles.demoButtonText}>Worker Demo</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.demoButton} 
                onPress={loginAsDemoClient}
              >
                <Text style={styles.demoButtonText}>Client Demo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[100],
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: theme.spacing.lg,
    left: theme.spacing.lg,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.glass.light,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.size.xxxl,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[700],
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: theme.spacing.xl,
  },
  formContainerFallback: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    ...theme.shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  formInner: {
    padding: theme.spacing.lg,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.error.light + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error.main,
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.size.sm,
    flex: 1,
  },
  inputContainer: {
    width: '100%',
    marginBottom: theme.spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.neutral[100],
    height: 56,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[900],
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.xl,
  },
  forgotPasswordText: {
    color: theme.colors.primary.light,
    fontSize: theme.typography.size.sm,
  },
  loginButton: {
    width: '100%',
    height: 56,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    ...theme.shadows.md,
    overflow: 'hidden',
  },
  loginButtonLoading: {
    opacity: 0.8,
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[700],
    marginRight: theme.spacing.xs,
  },
  signupButton: {
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  demoContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  demoTitle: {
    fontSize: theme.typography.size.sm,
    fontWeight: 'bold',
    color: theme.colors.primary.dark,
    marginBottom: theme.spacing.sm,
  },
  demoButtonsRow: {
    flexDirection: 'row',
  },
  demoButton: {
    backgroundColor: theme.colors.neutral[800],
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  demoButtonText: {
    color: theme.colors.neutral[100],
    fontSize: theme.typography.size.sm,
  },
});
