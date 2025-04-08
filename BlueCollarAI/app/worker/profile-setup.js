import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import theme, { COLORS, FONTS } from '../theme';
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
      router.replace('/(worker)');
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
            <Ionicons name="arrow-back" size={24} color={COLORS.primary.darkBlue} />
          </TouchableOpacity>
          
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Tell clients more about your services</Text>
          
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="person" size={50} color={COLORS.secondary.gray} />
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
    backgroundColor: COLORS.primary.white,
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
    fontSize: FONTS.sizes.header,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: FONTS.sizes.body,
    color: COLORS.secondary.gray,
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
    backgroundColor: COLORS.primary.white,
    borderWidth: 2,
    borderColor: COLORS.secondary.gray,
    borderRadius: 75,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: COLORS.secondary.gray,
    marginTop: 5,
  },
  formContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.secondary.gray,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: FONTS.sizes.body,
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.secondary.gray,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: FONTS.sizes.body,
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
    backgroundColor: COLORS.primary.white,
    borderWidth: 1,
    borderColor: COLORS.secondary.gray,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
  },
  selectedSkill: {
    backgroundColor: COLORS.primary.lightBlue,
    borderColor: COLORS.primary.lightBlue,
  },
  skillChipText: {
    color: COLORS.primary.darkBlue,
  },
  selectedSkillText: {
    color: COLORS.primary.white,
  },
  submitButton: {
    backgroundColor: COLORS.primary.lightBlue,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  submitButtonText: {
    color: COLORS.primary.white,
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
  },
});
