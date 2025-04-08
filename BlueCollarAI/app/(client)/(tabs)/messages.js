import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

// Mock data for demonstration
const mockConversations = [
  {
    id: '1',
    worker: {
      name: 'John Smith',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      profession: 'Plumber'
    },
    lastMessage: "I'll be there in 30 minutes",
    timestamp: '10:30 AM',
    unread: true,
    jobTitle: 'Fix Leaking Pipe'
  },
  {
    id: '2',
    worker: {
      name: 'Sarah Johnson',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      profession: 'Electrician'
    },
    lastMessage: 'The rewiring is complete',
    timestamp: 'Yesterday',
    unread: false,
    jobTitle: 'Electrical Rewiring'
  },
  {
    id: '3',
    worker: {
      name: 'Mike Wilson',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      profession: 'Carpenter'
    },
    lastMessage: 'Can you send photos of the kitchen?',
    timestamp: 'Yesterday',
    unread: false,
    jobTitle: 'Kitchen Renovation'
  },
];

export default function Messages() {
  const router = useRouter();

  const renderConversation = ({ item }) => (
    <TouchableOpacity 
      style={styles.conversationCard}
      onPress={() => router.push({
        pathname: '/conversation',
        params: { workerId: item.id }
      })}
    >
      <Image source={{ uri: item.worker.image }} style={styles.workerImage} />
      <View style={styles.conversationInfo}>
        <View style={styles.header}>
          <Text style={styles.workerName}>{item.worker.name}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.profession}>{item.worker.profession}</Text>
        <Text style={styles.jobTitle}>Re: {item.jobTitle}</Text>
        <Text 
          style={[styles.lastMessage, item.unread && styles.unreadMessage]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>
      {item.unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockConversations}
        renderItem={renderConversation}
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
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  conversationInfo: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  workerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A2A44',
  },
  timestamp: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  profession: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 14,
    color: '#4A90E2',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#4A5568',
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#1A2A44',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A90E2',
  },
});
