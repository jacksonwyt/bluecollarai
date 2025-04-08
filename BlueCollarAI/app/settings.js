import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Switch, 
  SafeAreaView, 
  ScrollView,
  Alert,
  Animated,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from './theme';
import * as Haptics from 'expo-haptics';

// Import LinearGradient with try/catch to handle potential issues
let LinearGradient;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (error) {
  console.warn('expo-linear-gradient is not available:', error);
}

export default function SettingsScreen() {
  const { theme, isDark, toggleTheme, setTheme, themeMode } = useTheme();
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(1));
  
  // For demo purposes
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  
  const handleToggleTheme = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Toggle theme
      toggleTheme();
      
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };
  
  const handleThemeModeChange = (mode) => {
    Haptics.selectionAsync();
    
    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Set specific theme mode
      setTheme(mode);
      
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };
  
  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => {
            // For demo purposes, navigate to login
            router.replace('/auth/login');
          },
          style: "destructive"
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={[
      styles.container, 
      { backgroundColor: theme.colors.background.primary }
    ]}>
      <Animated.View style={[
        styles.settingsWrapper,
        { opacity: fadeAnim }
      ]}>
        <View style={styles.header}>
          {LinearGradient ? (
            <LinearGradient
              colors={theme.colors.primary.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.headerGradient}
            >
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => {
                  Haptics.selectionAsync();
                  router.back();
                }}
              >
                <Ionicons name="arrow-back" size={24} color={theme.colors.primary.contrast} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Settings</Text>
            </LinearGradient>
          ) : (
            <View style={[
              styles.headerGradient, 
              { backgroundColor: theme.colors.primary.main }
            ]}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color={theme.colors.primary.contrast} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Settings</Text>
            </View>
          )}
        </View>
        
        <ScrollView contentContainerStyle={styles.content}>
          {/* Appearance Settings */}
          <View style={[
            styles.settingsSection,
            { backgroundColor: theme.colors.background.secondary }
          ]}>
            <Text style={[
              styles.sectionTitle,
              { color: theme.colors.text.primary }
            ]}>
              Appearance
            </Text>
            
            <View style={[
              styles.settingItem,
              { borderBottomColor: theme.colors.divider }
            ]}>
              <View style={styles.settingInfo}>
                <Ionicons 
                  name={isDark ? "moon" : "sunny"} 
                  size={24} 
                  color={isDark ? "#FDB813" : "#FDB813"} 
                  style={styles.settingIcon} 
                />
                <Text style={[
                  styles.settingText,
                  { color: theme.colors.text.primary }
                ]}>
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={handleToggleTheme}
                trackColor={{ 
                  false: Platform.OS === 'ios' ? '#D1D5DB' : 'rgba(120, 120, 128, 0.16)', 
                  true: theme.colors.primary.main 
                }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isDark ? theme.colors.primary.light : '#F3F4F6'}
              />
            </View>
            
            <View style={styles.themeSelector}>
              <TouchableOpacity 
                style={[
                  styles.themeModeOption,
                  themeMode === 'light' && styles.themeModeOptionSelected,
                  themeMode === 'light' && { borderColor: theme.colors.primary.main }
                ]}
                onPress={() => handleThemeModeChange('light')}
              >
                <Ionicons name="sunny" size={24} color="#FDB813" style={styles.themeModeIcon} />
                <Text style={[
                  styles.themeModeText,
                  { color: theme.colors.text.primary }
                ]}>
                  Light
                </Text>
                {themeMode === 'light' && (
                  <View style={[
                    styles.selectedIndicator,
                    { backgroundColor: theme.colors.primary.main }
                  ]}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.themeModeOption,
                  themeMode === 'dark' && styles.themeModeOptionSelected,
                  themeMode === 'dark' && { borderColor: theme.colors.primary.main }
                ]}
                onPress={() => handleThemeModeChange('dark')}
              >
                <Ionicons name="moon" size={24} color="#5C6BC0" style={styles.themeModeIcon} />
                <Text style={[
                  styles.themeModeText,
                  { color: theme.colors.text.primary }
                ]}>
                  Dark
                </Text>
                {themeMode === 'dark' && (
                  <View style={[
                    styles.selectedIndicator,
                    { backgroundColor: theme.colors.primary.main }
                  ]}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.themeModeOption,
                  themeMode === 'system' && styles.themeModeOptionSelected,
                  themeMode === 'system' && { borderColor: theme.colors.primary.main }
                ]}
                onPress={() => handleThemeModeChange('system')}
              >
                <Ionicons name="phone-portrait-outline" size={24} color={theme.colors.text.primary} style={styles.themeModeIcon} />
                <Text style={[
                  styles.themeModeText,
                  { color: theme.colors.text.primary }
                ]}>
                  System
                </Text>
                {themeMode === 'system' && (
                  <View style={[
                    styles.selectedIndicator,
                    { backgroundColor: theme.colors.primary.main }
                  ]}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Notifications Settings */}
          <View style={[
            styles.settingsSection,
            { backgroundColor: theme.colors.background.secondary }
          ]}>
            <Text style={[
              styles.sectionTitle,
              { color: theme.colors.text.primary }
            ]}>
              Notifications
            </Text>
            
            <View style={[
              styles.settingItem,
              { borderBottomColor: theme.colors.divider }
            ]}>
              <View style={styles.settingInfo}>
                <Ionicons 
                  name="notifications" 
                  size={24} 
                  color={theme.colors.primary.main} 
                  style={styles.settingIcon} 
                />
                <Text style={[
                  styles.settingText,
                  { color: theme.colors.text.primary }
                ]}>
                  Push Notifications
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={(value) => {
                  Haptics.selectionAsync();
                  setNotificationsEnabled(value);
                }}
                trackColor={{ 
                  false: Platform.OS === 'ios' ? '#D1D5DB' : 'rgba(120, 120, 128, 0.16)', 
                  true: theme.colors.primary.main 
                }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : notificationsEnabled ? theme.colors.primary.light : '#F3F4F6'}
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons 
                  name="location" 
                  size={24} 
                  color={theme.colors.primary.main} 
                  style={styles.settingIcon} 
                />
                <Text style={[
                  styles.settingText,
                  { color: theme.colors.text.primary }
                ]}>
                  Location Services
                </Text>
              </View>
              <Switch
                value={locationEnabled}
                onValueChange={(value) => {
                  Haptics.selectionAsync();
                  setLocationEnabled(value);
                }}
                trackColor={{ 
                  false: Platform.OS === 'ios' ? '#D1D5DB' : 'rgba(120, 120, 128, 0.16)', 
                  true: theme.colors.primary.main 
                }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : locationEnabled ? theme.colors.primary.light : '#F3F4F6'}
              />
            </View>
          </View>
          
          {/* Account Settings */}
          <View style={[
            styles.settingsSection,
            { backgroundColor: theme.colors.background.secondary }
          ]}>
            <Text style={[
              styles.sectionTitle,
              { color: theme.colors.text.primary }
            ]}>
              Account
            </Text>
            
            <TouchableOpacity 
              style={[
                styles.settingItem,
                { borderBottomColor: theme.colors.divider }
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                // Navigation to profile editing would go here
                Alert.alert("Profile", "Edit profile functionality would go here");
              }}
            >
              <View style={styles.settingInfo}>
                <Ionicons 
                  name="person" 
                  size={24} 
                  color={theme.colors.primary.main} 
                  style={styles.settingIcon} 
                />
                <Text style={[
                  styles.settingText,
                  { color: theme.colors.text.primary }
                ]}>
                  Edit Profile
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={theme.colors.text.tertiary} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.settingItem,
                { borderBottomColor: theme.colors.divider }
              ]}
              onPress={() => {
                Haptics.selectionAsync();
                // Navigate to password change
                Alert.alert("Security", "Change password functionality would go here");
              }}
            >
              <View style={styles.settingInfo}>
                <Ionicons 
                  name="lock-closed" 
                  size={24} 
                  color={theme.colors.primary.main} 
                  style={styles.settingIcon} 
                />
                <Text style={[
                  styles.settingText,
                  { color: theme.colors.text.primary }
                ]}>
                  Change Password
                </Text>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={theme.colors.text.tertiary} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleLogout}
            >
              <View style={styles.settingInfo}>
                <Ionicons 
                  name="log-out" 
                  size={24} 
                  color={theme.colors.error.main} 
                  style={styles.settingIcon} 
                />
                <Text style={[
                  styles.settingText,
                  { color: theme.colors.error.main }
                ]}>
                  Logout
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={[
              styles.appVersion,
              { color: theme.colors.text.tertiary }
            ]}>
              BlueCollar.ai v1.0.0
            </Text>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingsWrapper: {
    flex: 1,
  },
  header: {
    height: 60,
    width: '100%',
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  settingsSection: {
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
  themeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  themeModeOption: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 12,
    padding: 12,
    width: '30%',
    position: 'relative',
  },
  themeModeOptionSelected: {
    borderWidth: 2,
  },
  themeModeIcon: {
    marginBottom: 8,
  },
  themeModeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  appVersion: {
    fontSize: 14,
  },
});
