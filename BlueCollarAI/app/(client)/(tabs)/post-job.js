import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

// Map categories to their icons
const categoryIcons = {
  'Plumbing': 'plumbing',
  'Electrical': 'electrical-services',
  'Carpentry': 'carpenter',
  'Painting': 'format-paint',
  'HVAC': 'hvac',
  'Landscaping': 'grass',
  'General Labor': 'construction',
  'Roofing': 'roofing',
  'Flooring': 'grid-on',
  'Moving': 'dolly',
  'Cleaning': 'cleaning-services',
  'Other': 'more-horiz'
};

const categories = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'HVAC',
  'Landscaping',
  'General Labor',
  'Roofing',
  'Flooring',
  'Moving',
  'Cleaning',
  'Other',
];

export default function PostJob() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budgetRange, setBudgetRange] = useState('medium');
  const [otherCategory, setOtherCategory] = useState('');

  const handlePost = () => {
    // Mock post functionality
    console.log('Job Posted:', { 
      title, 
      description, 
      budget: budget || getBudgetValue(budgetRange), 
      location, 
      category: selectedCategory === 'Other' ? otherCategory : selectedCategory 
    });
  };

  const getBudgetValue = (range) => {
    switch(range) {
      case 'low': return '< $100';
      case 'medium': return '$100 - $500';
      case 'high': return '$500+';
      default: return 'Not specified';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.formTitle}>Post a Job</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>What do you need help with?</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Fix Leaking Bathroom Pipe"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryCard,
                  selectedCategory === category && styles.selectedCategoryCard,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <View style={[
                  styles.categoryIconContainer,
                  selectedCategory === category && styles.selectedCategoryIconContainer
                ]}>
                  <MaterialIcons 
                    name={categoryIcons[category] || 'category'} 
                    size={28} 
                    color={selectedCategory === category ? '#FFFFFF' : '#1A2A44'} 
                  />
                </View>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.selectedCategoryText,
                  ]}
                  numberOfLines={1}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {selectedCategory === 'Other' && (
            <TextInput
              style={[styles.input, { marginTop: 8 }]}
              value={otherCategory}
              onChangeText={setOtherCategory}
              placeholder="Please specify category"
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Budget Range</Text>
          <View style={styles.budgetGrid}>
            <TouchableOpacity
              style={[
                styles.budgetCard,
                budgetRange === 'low' && styles.selectedBudgetCard,
              ]}
              onPress={() => setBudgetRange('low')}
            >
              <MaterialIcons 
                name="attach-money" 
                size={24} 
                color={budgetRange === 'low' ? '#FFFFFF' : '#1A2A44'} 
              />
              <Text
                style={[
                  styles.budgetText,
                  budgetRange === 'low' && styles.selectedBudgetText,
                ]}
              >
                Under $100
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.budgetCard,
                budgetRange === 'medium' && styles.selectedBudgetCard,
              ]}
              onPress={() => setBudgetRange('medium')}
            >
              <MaterialIcons 
                name="attach-money" 
                size={24} 
                color={budgetRange === 'medium' ? '#FFFFFF' : '#1A2A44'} 
              />
              <MaterialIcons 
                name="attach-money" 
                size={24} 
                color={budgetRange === 'medium' ? '#FFFFFF' : '#1A2A44'} 
              />
              <Text
                style={[
                  styles.budgetText,
                  budgetRange === 'medium' && styles.selectedBudgetText,
                ]}
              >
                $100 - $500
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.budgetCard,
                budgetRange === 'high' && styles.selectedBudgetCard,
              ]}
              onPress={() => setBudgetRange('high')}
            >
              <MaterialIcons 
                name="attach-money" 
                size={24} 
                color={budgetRange === 'high' ? '#FFFFFF' : '#1A2A44'} 
              />
              <MaterialIcons 
                name="attach-money" 
                size={24} 
                color={budgetRange === 'high' ? '#FFFFFF' : '#1A2A44'} 
              />
              <MaterialIcons 
                name="attach-money" 
                size={24} 
                color={budgetRange === 'high' ? '#FFFFFF' : '#1A2A44'} 
              />
              <Text
                style={[
                  styles.budgetText,
                  budgetRange === 'high' && styles.selectedBudgetText,
                ]}
              >
                $500+
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TouchableOpacity style={styles.locationCard}>
            <MaterialIcons name="my-location" size={24} color="#1A2A44" />
            <Text style={styles.locationButtonText}>Use Current Location</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Or enter address manually"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Additional Details (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Anything else the worker should know?"
            multiline
            numberOfLines={4}
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
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A2A44',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2A44',
    marginBottom: 4,
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  categoryCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCategoryCard: {
    backgroundColor: '#1A2A44',
    borderColor: '#1A2A44',
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedCategoryIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  budgetGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  budgetCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedBudgetCard: {
    backgroundColor: '#1A2A44',
    borderColor: '#1A2A44',
  },
  budgetText: {
    color: '#4A5568',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
    width: '100%',
  },
  selectedBudgetText: {
    color: '#FFFFFF',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
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
