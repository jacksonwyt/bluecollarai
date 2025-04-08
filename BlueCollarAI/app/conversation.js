import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import theme, { COLORS, FONTS } from './theme';
import { messages, users, jobs } from '../api/mockData';

// For demo purposes, we'll assume the current user is worker w1
const currentUserId = 'w1';

// Message bubble component
const MessageBubble = ({ message, isSender }) => (
  <View style={[
    styles.messageBubble, 
    isSender ? styles.senderBubble : styles.receiverBubble
  ]}>
    <Text style={[
      styles.messageText, 
      isSender ? styles.senderText : styles.receiverText
    ]}>
      {message.text}
    </Text>
    <Text style={[
      styles.messageTime,
      isSender ? styles.senderTime : styles.receiverTime
    ]}>
      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </Text>
  </View>
);

export default function ConversationScreen() {
  const params = useLocalSearchParams();
  const { partnerId, jobId } = params;
  
  const [conversation, setConversation] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [partner, setPartner] = useState(null);
  const [job, setJob] = useState(null);
  
  const flatListRef = useRef();

  useEffect(() => {
    // Load the conversation partner details
    const partnerData = users.find(u => u.id === partnerId);
    setPartner(partnerData);
    
    // Load the job details
    const jobData = jobs.find(j => j.id === jobId);
    setJob(jobData);
    
    // Filter messages for this conversation
    const conversationMessages = messages.filter(
      msg => 
        (msg.jobId === jobId) && 
        ((msg.senderId === currentUserId && msg.receiverId === partnerId) ||
         (msg.senderId === partnerId && msg.receiverId === currentUserId))
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    setConversation(conversationMessages);
  }, [partnerId, jobId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Create a new message
    const newMsg = {
      id: `m${Date.now()}`,
      jobId,
      senderId: currentUserId,
      receiverId: partnerId,
      text: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    // Add to the conversation
    setConversation([...conversation, newMsg]);
    
    // Clear the input
    setNewMessage('');
    
    // In a real app, we would send this to the server
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (flatListRef.current && conversation.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [conversation]);

  if (!partner || !job) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading conversation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary.white} />
          </TouchableOpacity>
          
          <View style={styles.headerProfile}>
            <Image source={{ uri: partner.profilePicture }} style={styles.headerImage} />
            <View>
              <Text style={styles.headerName}>{partner.name}</Text>
              <Text style={styles.headerJob} numberOfLines={1}>Re: {job.title}</Text>
            </View>
          </View>
        </View>
        
        <FlatList
          ref={flatListRef}
          data={conversation}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble 
              message={item} 
              isSender={item.senderId === currentUserId}
            />
          )}
          contentContainerStyle={styles.messagesList}
        />
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={setNewMessage}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !newMessage.trim() && styles.disabledSendButton]}
            onPress={sendMessage}
            disabled={!newMessage.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={newMessage.trim() ? COLORS.primary.white : COLORS.secondary.gray} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: COLORS.primary.darkBlue,
  },
  backButton: {
    marginRight: 15,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerName: {
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
    color: COLORS.primary.white,
  },
  headerJob: {
    fontSize: FONTS.sizes.secondary,
    color: COLORS.primary.white,
    opacity: 0.8,
    maxWidth: 250,
  },
  messagesList: {
    padding: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  senderBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary.lightBlue,
    borderBottomRightRadius: 4,
  },
  receiverBubble: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary.white,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1
  },
  messageText: {
    fontSize: FONTS.sizes.body,
    marginBottom: 5,
  },
  senderText: {
    color: COLORS.primary.white,
  },
  receiverText: {
    color: COLORS.primary.darkBlue,
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  senderTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  receiverTime: {
    color: COLORS.secondary.gray,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: COLORS.primary.white,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: FONTS.sizes.body,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: COLORS.primary.lightBlue,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  disabledSendButton: {
    backgroundColor: '#EAEAEA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
