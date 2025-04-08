import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../theme';
import { mockApiCall } from '../api/mockData';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // For demo purposes, we're using mockApiCall instead of a real API
      const response = await mockApiCall('users/login', 'POST', { email, password });
      
      if (response.error) {
        setError(response.error);
      } else {
        // In a real app, we would store the user data and token
        // For demo, we'll navigate to the appropriate screen based on role
        if (response.role === 'worker') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'WorkerTabs' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'ClientTabs' }],
          });
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes, let's add helper functions to login as a worker or client
  const loginAsDemoWorker = () => {
    setEmail('james@example.com');
    setPassword('password123');
  };

  const loginAsDemoClient = () => {
    setEmail('emily@example.com');
    setPassword('password123');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary.darkBlue} />
          </TouchableOpacity>
          
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to your account</Text>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={COLORS.secondary.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.secondary.gray} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>{loading ? 'Logging in...' : 'Log In'}</Text>
          </TouchableOpacity>
          
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RoleSelection')}>
              <Text style={styles.signupButton}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          
          {/* Demo helpers - would be removed in production */}
          <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>Demo Accounts:</Text>
            <TouchableOpacity style={styles.demoButton} onPress={loginAsDemoWorker}>
              <Text style={styles.demoButtonText}>Login as Worker</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoButton} onPress={loginAsDemoClient}>
              <Text style={styles.demoButtonText}>Login as Client</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  title: {
    fontSize: FONTS.sizes.header,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.sizes.body,
    color: COLORS.secondary.gray,
    marginBottom: 30,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondary.gray,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: FONTS.sizes.body,
  },
  loginButton: {
    backgroundColor: COLORS.primary.lightBlue,
    paddingVertical: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: COLORS.primary.white,
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.secondary.gray,
    marginRight: 5,
  },
  signupButton: {
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
    color: COLORS.primary.lightBlue,
  },
  demoContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
    marginBottom: 10,
  },
  demoButton: {
    backgroundColor: COLORS.secondary.gray,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 4,
    marginBottom: 8,
  },
  demoButtonText: {
    color: COLORS.primary.white,
    fontSize: FONTS.sizes.secondary,
  },
});

export default LoginScreen;
