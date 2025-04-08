import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../theme';
import { categories } from '../../api/mockData';

export default function WorkerProfileSetupScreen() {
  const { theme } = useTheme();
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

  const styles = getProfileSetupStyles(theme);

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

const getProfileSetupStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background?.primary || theme.colors.primary.contrast,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  backButton: {
    marginBottom: theme.spacing.lg,
    alignSelf: 'flex-start',
    padding: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.size.xxxl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  imagePickerButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.neutral[100],
    borderWidth: 2,
    borderColor: theme.colors.neutral[300],
    borderRadius: 60,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: theme.colors.neutral[500],
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.size.sm,
  },
  formContainer: {
    marginBottom: theme.spacing.xl,
  },
  inputLabel: {
    fontSize: theme.typography.size.md,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    fontSize: theme.typography.size.md,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.background.primary,
  },
  textArea: {
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    fontSize: theme.typography.size.md,
    marginBottom: theme.spacing.lg,
    height: 120,
    textAlignVertical: 'top',
    backgroundColor: theme.colors.background.primary,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.lg,
    marginLeft: -theme.spacing.xs,
  },
  skillChip: {
    backgroundColor: theme.colors.neutral[100],
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    margin: theme.spacing.xs,
  },
  selectedSkill: {
    backgroundColor: theme.colors.primary.surface,
    borderColor: theme.colors.primary.light,
  },
  skillChipText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
  },
  selectedSkillText: {
    color: theme.colors.primary.main,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.md,
    ...theme.shadows.sm,
  },
  submitButtonText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.primary.contrast,
    fontWeight: '600',
  },
}); 