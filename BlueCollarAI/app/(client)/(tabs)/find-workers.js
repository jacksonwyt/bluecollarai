import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Mock data for demonstration
const mockWorkers = [
  {
    id: '1',
    name: 'John Smith',
    profession: 'Plumber',
    rating: 4.8,
    reviews: 124,
    hourlyRate: 75,
    skills: ['Emergency Repairs', 'Installation', 'Maintenance'],
    image: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    profession: 'Electrician',
    rating: 4.9,
    reviews: 89,
    hourlyRate: 85,
    skills: ['Wiring', 'Troubleshooting', 'Installation'],
    image: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    profession: 'Carpenter',
    rating: 4.7,
    reviews: 156,
    hourlyRate: 65,
    skills: ['Custom Furniture', 'Renovation', 'Repairs'],
    image: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
];

export default function FindWorkers() {
  const renderWorker = ({ item }) => (
    <TouchableOpacity style={styles.workerCard}>
      <View style={styles.workerHeader}>
        <Image
          source={{ uri: item.image }}
          style={styles.workerImage}
        />
        <View style={styles.workerInfo}>
          <Text style={styles.workerName}>{item.name}</Text>
          <Text style={styles.profession}>{item.profession}</Text>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={16} color="#FBBF24" />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviews}>({item.reviews} reviews)</Text>
          </View>
        </View>
        <Text style={styles.rate}>${item.hourlyRate}/hr</Text>
      </View>
      
      <View style={styles.skillsContainer}>
        {item.skills.map((skill, index) => (
          <View key={index} style={styles.skillChip}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity style={styles.contactButton}>
        <Text style={styles.contactButtonText}>Contact Worker</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockWorkers}
        renderItem={renderWorker}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  listContainer: {
    padding: 16,
  },
  workerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  workerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A2A44',
  },
  profession: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#1A2A44',
  },
  reviews: {
    marginLeft: 4,
    fontSize: 14,
    color: '#A0AEC0',
  },
  rate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A90E2',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  skillChip: {
    backgroundColor: '#F0F4F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 14,
    color: '#4A5568',
  },
  contactButton: {
    backgroundColor: '#1A2A44',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
