import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';
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
const ConversationCard = ({ conversation, onPress, theme }) => {
  const partner = users.find(u => u.id === conversation.partnerId);
  const job = jobs.find(j => j.id === conversation.jobId);
  const styles = getCardStyles(theme);
  
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

const MessagesScreen = () => {
  const { theme } = useTheme();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const styles = getScreenStyles(theme);

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
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
        </View>
      ) : (
        <>
          <View style={styles.unreadCard}>
            <Text style={styles.unreadLabel}>Unread Conversations</Text>
            <Text style={styles.unreadCount}>{unreadCount}</Text>
          </View>
          {conversations.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-ellipses-outline" size={48} color={theme.colors.neutral[400]} />
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
                  theme={theme}
                />
              )}
              contentContainerStyle={styles.listContent}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

// Generate screen styles
const getScreenStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    backgroundColor: theme.colors.background.primary,
  },
  headerTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    flex: 1,
    textAlign: 'center',
  },
  unreadCard: {
    backgroundColor: theme.colors.primary.main,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  unreadLabel: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.primary.contrast + 'aa',
    marginBottom: theme.spacing.xs,
  },
  unreadCount: {
    fontSize: theme.typography.size.xxxl,
    fontWeight: 'bold',
    color: theme.colors.primary.contrast,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxxl,
  },
  emptyStateText: {
    fontSize: theme.typography.size.lg,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
  },
});

// Generate card styles
const getCardStyles = (theme) => StyleSheet.create({
  conversationCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  partnerImage: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.md,
  },
  conversationInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: theme.typography.size.md,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  jobTitle: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xxs,
  },
  lastMessage: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing.xs,
  },
  timestampContainer: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.tertiary,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.main,
    marginTop: theme.spacing.xs,
  },
});

export default MessagesScreen;
