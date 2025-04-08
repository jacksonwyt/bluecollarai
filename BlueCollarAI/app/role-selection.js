import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import theme, { COLORS, FONTS } from './theme';

export default function RoleSelectionScreen() {
  const handleRoleSelection = (role) => {
    // In a real app, we would store the selected role
    // For demo, just navigate to sign up passing the role
    router.push({
      pathname: '/auth/signup',
      params: { role }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>I am a...</Text>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => handleRoleSelection('worker')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="hammer" size={50} color={COLORS.primary.lightBlue} />
            </View>
            <Text style={styles.optionTitle}>Worker</Text>
            <Text style={styles.optionDescription}>
              I want to offer my skills and find jobs in my area
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.optionCard}
            onPress={() => handleRoleSelection('client')}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="briefcase" size={50} color={COLORS.primary.lightBlue} />
            </View>
            <Text style={styles.optionTitle}>Client</Text>
            <Text style={styles.optionDescription}>
              I need to hire skilled workers for my projects
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginButton}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary.white,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FONTS.sizes.header,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
    marginBottom: 40,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  optionCard: {
    backgroundColor: COLORS.primary.white,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.secondary.gray,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 15,
  },
  optionTitle: {
    fontSize: FONTS.sizes.subheader,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
    marginBottom: 10,
  },
  optionDescription: {
    fontSize: FONTS.sizes.body,
    color: COLORS.secondary.gray,
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.secondary.gray,
    marginRight: 5,
  },
  loginButton: {
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
    color: COLORS.primary.lightBlue,
  },
});
