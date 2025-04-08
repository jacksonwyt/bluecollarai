import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: 'person', label: 'Edit Profile' },
        { icon: 'security', label: 'Privacy & Security' },
        { icon: 'payment', label: 'Payment Methods' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'notifications',
          label: 'Push Notifications',
          toggle: true,
          value: notifications,
          onToggle: setNotifications
        },
        {
          icon: 'location-on',
          label: 'Location Services',
          toggle: true,
          value: locationServices,
          onToggle: setLocationServices
        },
        {
          icon: 'dark-mode',
          label: 'Dark Mode',
          toggle: true,
          value: darkMode,
          onToggle: setDarkMode
        }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: 'help', label: 'Help Center' },
        { icon: 'policy', label: 'Terms of Service' },
        { icon: 'info', label: 'About' },
      ]
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {settingsSections.map((section, index) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.settingItem,
                itemIndex === section.items.length - 1 && styles.lastItem
              ]}
              onPress={() => !item.toggle && console.log(`Navigate to ${item.label}`)}
            >
              <View style={styles.settingItemLeft}>
                <MaterialIcons name={item.icon} size={24} color="#1A2A44" />
                <Text style={styles.settingLabel}>{item.label}</Text>
              </View>
              {item.toggle ? (
                <Switch
                  value={item.value}
                  onValueChange={item.onToggle}
                  trackColor={{ false: '#E2E8F0', true: '#4A90E2' }}
                  thumbColor={item.value ? '#1A2A44' : '#f4f3f4'}
                />
              ) : (
                <MaterialIcons name="chevron-right" size={24} color="#A0AEC0" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.logoutButton}>
        <MaterialIcons name="logout" size={24} color="#E53E3E" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A2A44',
    marginLeft: 16,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#2D3748',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF5F5',
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 16,
    borderRadius: 8,
  },
  logoutText: {
    color: '#E53E3E',
    fontSize: 16,
    fontWeight: '600',
  },
});
