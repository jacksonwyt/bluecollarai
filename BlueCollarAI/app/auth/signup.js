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
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import theme from '../theme';
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

export default function SignUpScreen() {
  const params = useLocalSearchParams();
  const role = params.role || 'worker';
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    
    setLoading(true);
    setError('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      // In a real app, we would call the API to create an account
      
      // For the demo, we'll just navigate to the next screen
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (role === 'worker') {
        router.push('/worker/profile-setup');
      } else {
        // For clients, we would typically go to the client dashboard
        router.replace('/(client)');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
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
          <Ionicons name="person-outline" size={20} color={theme.colors.neutral[600]} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor={theme.colors.neutral[500]}
          />
        </View>
        
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
        
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.colors.neutral[600]} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor={theme.colors.neutral[500]}
          />
        </View>
      </View>
      
      <TouchableOpacity
        style={[
          styles.signupButton,
          loading && styles.signupButtonLoading
        ]}
        onPress={handleSignUp}
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
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </LinearGradient>
        ) : (
          <Text style={styles.signupButtonText}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account?</Text>
        <TouchableOpacity 
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/auth/login');
          }}
        >
          <Text style={styles.loginButton}>Log In</Text>
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
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Sign up as a {role}</Text>
            </Animated.View>
            
            {renderGlassmorphicCard()}
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80, // Account for the back button
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
  signupButton: {
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
  signupButtonLoading: {
    opacity: 0.8,
  },
  gradientButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupButtonText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  loginText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[700],
    marginRight: theme.spacing.xs,
  },
  loginButton: {
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
});
