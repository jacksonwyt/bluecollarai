import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const categories = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'HVAC',
  'Landscaping',
  'General Labor',
];

export default function PostJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handlePost = () => {
    // Mock post functionality
    console.log('Job Posted:', { title, description, budget, location, selectedCategory });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Job Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Fix Leaking Bathroom Pipe"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.selectedCategoryChip,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.selectedCategoryText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the job in detail..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Budget</Text>
          <TextInput
            style={styles.input}
            value={budget}
            onChangeText={setBudget}
            placeholder="Enter amount in $"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TouchableOpacity style={styles.locationButton}>
            <MaterialIcons name="my-location" size={24} color="#1A2A44" />
            <Text style={styles.locationButtonText}>Use Current Location</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter address"
          />
        </View>

        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Post Job</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  form: {
    padding: 16,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2A44',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryList: {
    flexGrow: 0,
    marginVertical: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F4F8',
    marginRight: 8,
  },
  selectedCategoryChip: {
    backgroundColor: '#1A2A44',
  },
  categoryText: {
    color: '#4A5568',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  locationButtonText: {
    color: '#1A2A44',
    fontSize: 16,
    fontWeight: '500',
  },
  postButton: {
    backgroundColor: '#1A2A44',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
