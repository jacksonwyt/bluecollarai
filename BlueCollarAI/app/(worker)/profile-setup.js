import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../theme';
import { categories } from '../../api/mockData';

export default function WorkerProfileSetupScreen() {
  const [profileImage, setProfileImage] = useState(null);
  const [bio, setBio] = useState('');
  const [rate, setRate] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [serviceAreas, setServiceAreas] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const toggleSkillSelection = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = () => {
    if (!bio || !rate || selectedSkills.length === 0 || !serviceAreas) {
      // Show error
      return;
    }

    setLoading(true);
    
    // In a real app, send this data to the backend
    setTimeout(() => {
      setLoading(false);
      router.replace('/(worker)/(tabs)');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.primary.main} />
          </TouchableOpacity>
          
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Tell clients more about your services</Text>
          
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="person" size={50} color={theme.colors.neutral[400]} />
                  <Text style={styles.imagePlaceholderText}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.inputLabel}>About (Bio)</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              placeholder="Describe your experience, qualifications, and services offered..."
              value={bio}
              onChangeText={setBio}
            />
            
            <Text style={styles.inputLabel}>Hourly Rate ($)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your hourly rate"
              keyboardType="numeric"
              value={rate}
              onChangeText={setRate}
            />
            
            <Text style={styles.inputLabel}>Service Areas</Text>
            <TextInput
              style={styles.input}
              placeholder="Cities or neighborhoods where you can work..."
              value={serviceAreas}
              onChangeText={setServiceAreas}
            />
            
            <Text style={styles.inputLabel}>Skills & Services</Text>
            <View style={styles.skillsContainer}>
              {categories.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={[
                    styles.skillChip,
                    selectedSkills.includes(skill) && styles.selectedSkill,
                  ]}
                  onPress={() => toggleSkillSelection(skill)}
                >
                  <Text
                    style={[
                      styles.skillChipText,
                      selectedSkills.includes(skill) && styles.selectedSkillText,
                    ]}
                  >
                    {skill}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating Profile...' : 'Complete Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.contrast,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: theme.typography.size.xl,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[500],
    marginBottom: 30,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imagePickerButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.primary.contrast,
    borderWidth: 2,
    borderColor: theme.colors.neutral[300],
    borderRadius: 75,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: theme.colors.neutral[500],
    marginTop: 5,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: theme.typography.size.md,
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: theme.typography.size.md,
    marginBottom: 20,
    height: 100,
    textAlignVertical: 'top',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  skillChip: {
    backgroundColor: theme.colors.primary.contrast,
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
  },
  selectedSkill: {
    backgroundColor: theme.colors.primary.light,
    borderColor: theme.colors.primary.light,
  },
  skillChipText: {
    color: theme.colors.primary.main,
  },
  selectedSkillText: {
    color: theme.colors.primary.contrast,
  },
  submitButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
  },
}); 