import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import theme from '../../theme';
import { messages, users, jobs } from '../../../api/mockData';

// For demo purposes, assume the current user is worker 'w1'
const currentUserId = 'w1';

// Function to get unique conversations
const getUniqueConversations = () => {
  const userMessages = messages.filter(
    msg => msg.senderId === currentUserId || msg.receiverId === currentUserId
  );
  
  const conversations = {};
  userMessages.forEach(msg => {
    const partnerId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId;
    const jobId = msg.jobId;
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
  
  return Object.values(conversations).sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
};

// Conversation card component
const ConversationCard = ({ conversation, onPress }) => {
  const partner = users.find(u => u.id === conversation.partnerId);
  const job = jobs.find(j => j.id === conversation.jobId);
  
  const messageDate = new Date(conversation.timestamp);
  const today = new Date();
  const isToday = messageDate.getDate() === today.getDate() && 
                  messageDate.getMonth() === today.getMonth() && 
                  messageDate.getFullYear() === today.getFullYear();
  
  const formattedTime = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = isToday ? formattedTime : messageDate.toLocaleDateString();
  
  return (
    <TouchableOpacity style={styles.conversationCard} onPress={onPress}>
      <Image source={{ uri: partner.profilePicture }} style={styles.partnerImage} />
      <View style={styles.conversationInfo}>
        <Text style={styles.partnerName}>{partner.name}</Text>
        <Text style={styles.jobTitle} numberOfLines={1}>
          Re: {job.title}
        </Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {conversation.lastMessage}
        </Text>
      </View>
      <View style={styles.timestampContainer}>
        <Text style={styles.timestamp}>{formattedDate}</Text>
        {!conversation.read && <View style={styles.unreadIndicator} />}
      </View>
    </TouchableOpacity>
  );
};

export default function MessagesScreen() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const unreadCount = conversations.filter(c => !c.read).length;

  const navigateToConversation = (partnerId, jobId) => {
    router.push({
      pathname: '/conversation',
      params: { partnerId, jobId }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary.main} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <MaterialIcons name="search" size={24} color={theme.colors.primary.main} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading messages...</Text>
        </View>
      ) : (
        <>
          <View style={styles.unreadCard}>
            <Text style={styles.unreadLabel}>Unread Conversations</Text>
            <Text style={styles.unreadCount}>{unreadCount}</Text>
          </View>
          {conversations.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-ellipses-outline" size={48} color="#CBD5E0" />
              <Text style={styles.emptyStateText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>
                Messages from clients will appear here once you start receiving job inquiries
              </Text>
            </View>
          ) : (
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
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    flex: 1,
    textAlign: 'center',
  },
  unreadCard: {
    backgroundColor: theme.colors.primary.main,
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  unreadLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  unreadCount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  partnerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  conversationInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.primary.dark,
  },
  jobTitle: {
    fontSize: 14,
    color: '#4A5568',
    marginTop: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#4A5568',
    marginTop: 4,
  },
  timestampContainer: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary.main,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#A0AEC0',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
  },
});
