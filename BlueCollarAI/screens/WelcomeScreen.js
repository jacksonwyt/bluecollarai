import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, FONTS } from '../theme';

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>BlueCollar.ai</Text>
          <Text style={styles.tagline}>Connecting skilled workers with opportunities</Text>
        </View>
        
        <View style={styles.imageContainer}>
          {/* Placeholder for app illustration/logo */}
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>App Logo</Text>
          </View>
        </View>
        
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Find skilled blue-collar workers or get hired for jobs in your area.
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('RoleSelection')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary.darkBlue,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary.white,
    marginBottom: 10,
  },
  tagline: {
    fontSize: FONTS.sizes.body,
    color: COLORS.primary.white,
    textAlign: 'center',
  },
  imageContainer: {
    marginBottom: 40,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.primary.lightBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.primary.white,
  },
  descriptionContainer: {
    marginBottom: 40,
  },
  description: {
    fontSize: FONTS.sizes.body,
    color: COLORS.primary.white,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: COLORS.primary.lightBlue,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 8,
  },
  buttonText: {
    color: COLORS.primary.white,
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
