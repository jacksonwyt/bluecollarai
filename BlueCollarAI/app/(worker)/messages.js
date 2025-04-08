import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import theme, { COLORS, FONTS } from '../theme';
import { messages, users, jobs } from '../../api/mockData';

// For demo purposes, we'll assume the current user is worker w1
const currentUserId = 'w1';

// Function to get unique conversation partners
const getUniqueConversations = () => {
  // Filter messages that involve the current user
  const userMessages = messages.filter(
    msg => msg.senderId === currentUserId || msg.receiverId === currentUserId
  );
  
  // Get unique conversation partners
  const conversations = {};
  userMessages.forEach(msg => {
    const partnerId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId;
    const jobId = msg.jobId;
    
    // Use a combination of partnerId and jobId as key
    const conversationKey = `${partnerId}_${jobId}`;
    
    if (!conversations[conversationKey] || new Date(msg.timestamp) > new Date(conversations[conversationKey].timestamp)) {
      conversations[conversationKey] = {
        partnerId,
        jobId,
        lastMessage: msg.text,
        timestamp: msg.timestamp,
        read: msg.read
      };
    }
  });
  
  // Convert to array and sort by most recent
  return Object.values(conversations).sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
};

// Message conversation card component
const ConversationCard = ({ conversation, onPress }) => {
  const partner = users.find(u => u.id === conversation.partnerId);
  const job = jobs.find(j => j.id === conversation.jobId);
  
  // Format the timestamp
  const messageDate = new Date(conversation.timestamp);
  const today = new Date();
  const isToday = messageDate.getDate() === today.getDate() && 
                  messageDate.getMonth() === today.getMonth() && 
                  messageDate.getFullYear() === today.getFullYear();
  
  const formattedTime = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = isToday ? formattedTime : messageDate.toLocaleDateString();
  
  return (
    <TouchableOpacity 
      style={[styles.conversationCard, !conversation.read && styles.unreadCard]} 
      onPress={onPress}
    >
      <Image source={{ uri: partner.profilePicture }} style={styles.partnerImage} />
      
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.partnerName}>{partner.name}</Text>
          <Text style={styles.timestamp}>{formattedDate}</Text>
        </View>
        
        <Text style={styles.jobTitle} numberOfLines={1}>
          Re: {job.title}
        </Text>
        
        <Text style={[styles.lastMessage, !conversation.read && styles.unreadMessage]} numberOfLines={1}>
          {conversation.lastMessage}
        </Text>
      </View>
      
      {!conversation.read && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
};

export default function MessagesScreen() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch conversations from the server
    // For demo, use our helper function with mock data
    const loadConversations = () => {
      setLoading(true);
      try {
        const userConversations = getUniqueConversations();
        setConversations(userConversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  const navigateToConversation = (partnerId, jobId) => {
    router.push({
      pathname: '/conversation',
      params: { partnerId, jobId }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading messages...</Text>
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubble-ellipses-outline" size={60} color={COLORS.secondary.gray} />
          <Text style={styles.emptyText}>No messages yet</Text>
          <Text style={styles.emptySubtext}>
            Messages from clients will appear here once you start receiving job inquiries
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Messages</Text>
          </View>
          
          <FlatList
            data={conversations}
            keyExtractor={(item, index) => `${item.partnerId}_${item.jobId}_${index}`}
            renderItem={({ item }) => (
              <ConversationCard 
                conversation={item} 
                onPress={() => navigateToConversation(item.partnerId, item.jobId)}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    backgroundColor: COLORS.primary.white,
  },
  headerTitle: {
    fontSize: FONTS.sizes.subheader,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
  },
  listContent: {
    padding: 15,
  },
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1
  },
  unreadCard: {
    backgroundColor: '#F0F8FF', // Light blue tint for unread messages
  },
  partnerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  partnerName: {
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
  },
  timestamp: {
    fontSize: FONTS.sizes.secondary,
    color: COLORS.secondary.gray,
  },
  jobTitle: {
    fontSize: FONTS.sizes.secondary,
    color: COLORS.primary.lightBlue,
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: FONTS.sizes.body,
    color: COLORS.secondary.gray,
  },
  unreadMessage: {
    color: COLORS.primary.darkBlue,
    fontWeight: '500',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary.lightBlue,
    position: 'absolute',
    top: 15,
    right: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: FONTS.sizes.subheader,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: FONTS.sizes.body,
    color: COLORS.secondary.gray,
    textAlign: 'center',
    marginTop: 5,
    maxWidth: '80%',
  },
});
