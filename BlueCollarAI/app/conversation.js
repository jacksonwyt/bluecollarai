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
  Image,
  Animated,
  Dimensions,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import theme from './theme';
import { messages, users, jobs } from '../api/mockData';
import * as Haptics from 'expo-haptics';

// Import LinearGradient with try/catch to handle potential issues
let LinearGradient;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (error) {
  console.warn('expo-linear-gradient is not available:', error);
}

// Import BlurView with try/catch to handle potential issues
let BlurView;
try {
  BlurView = require('expo-blur').BlurView;
} catch (error) {
  console.warn('expo-blur is not available:', error);
}

// For demo purposes, we'll assume the current user is worker w1
const currentUserId = 'w1';

// Typing animation component for recipient
const TypingIndicator = () => (
  <View style={styles.typingContainer}>
    <View style={styles.typingBubble}>
      <View style={styles.typingDot} />
      <View style={[styles.typingDot, { marginLeft: 4 }]} />
      <View style={[styles.typingDot, { marginLeft: 4 }]} />
    </View>
  </View>
);

// Message bubble component with animations
const MessageBubble = ({ message, isSender, isLast, showImage, partner }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(isSender ? 50 : -50)).current;
  
  useEffect(() => {
    // Animate the message bubble when it appears
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: theme.animation.duration.normal,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: theme.animation.duration.normal,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  const isImageMessage = message.text && message.text.includes('[IMAGE]');
  
  return (
    <Animated.View 
      style={[
        styles.messageRow,
        isSender ? styles.senderRow : styles.receiverRow,
        { 
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }]
        }
      ]}
    >
      {!isSender && showImage && partner?.profilePicture ? (
        <Image source={{ uri: partner.profilePicture }} style={styles.avatarImage} />
      ) : !isSender && showImage ? (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{partner?.name?.charAt(0) || '?'}</Text>
        </View>
      ) : !isSender ? (
        <View style={styles.avatarSpacer} />
      ) : null}
      
      <View style={[
        styles.messageBubble, 
        isSender ? styles.senderBubble : styles.receiverBubble,
        isLast && isSender ? styles.lastSenderBubble : isLast && !isSender ? styles.lastReceiverBubble : null
      ]}>
        {isImageMessage ? (
          <View style={styles.imageMessageContainer}>
            <Image 
              source={{ uri: 'https://picsum.photos/300/200' }} 
              style={styles.messageImage}
              resizeMode="cover"
            />
            <Text style={[
              styles.messageImageCaption, 
              isSender ? styles.senderText : styles.receiverText
            ]}>
              {message.text.replace('[IMAGE]', '')}
            </Text>
          </View>
        ) : (
          <Text style={[
            styles.messageText, 
            isSender ? styles.senderText : styles.receiverText
          ]}>
            {message.text}
          </Text>
        )}
        
        <Text style={[
          styles.messageTime,
          isSender ? styles.senderTime : styles.receiverTime
        ]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </Animated.View>
  );
};

// Date separator component
const DateSeparator = ({ date }) => {
  const formattedDate = new Date(date).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  });
  
  return (
    <View style={styles.dateSeparator}>
      <View style={styles.dateLine} />
      <Text style={styles.dateText}>{formattedDate}</Text>
      <View style={styles.dateLine} />
    </View>
  );
};

export default function ConversationScreen() {
  const params = useLocalSearchParams();
  const { partnerId, jobId } = params;
  
  const [conversation, setConversation] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [partner, setPartner] = useState(null);
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  
  const flatListRef = useRef();
  const scrollViewHeight = useRef(new Animated.Value(0)).current;
  
  // Animation values
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Run entrance animations
    Animated.timing(headerFadeAnim, {
      toValue: 1,
      duration: theme.animation.duration.normal,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // Load the conversation partner details
    setIsLoading(true);
    
    setTimeout(() => {
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
      setIsLoading(false);
    }, 1000); // Simulate loading
  }, [partnerId, jobId]);

  // Determine if we should show a date separator
  const shouldShowDateSeparator = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;
    
    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const prevDate = new Date(prevMsg.timestamp).toDateString();
    
    return currentDate !== prevDate;
  };
  
  // Determine if we should show the avatar for a message
  const shouldShowAvatar = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;
    
    const currentSender = currentMsg.senderId;
    const prevSender = prevMsg.senderId;
    
    return currentSender !== prevSender || 
           shouldShowDateSeparator(currentMsg, prevMsg);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Simulate sending message
    setSendingMessage(true);
    
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
    setTimeout(() => {
      setSendingMessage(false);
      
      // Simulate partner typing
      setTimeout(() => {
        setIsTyping(true);
        
        // Simulate partner response after typing
        setTimeout(() => {
          setIsTyping(false);
          
          // Create a partner response
          const responseMsg = {
            id: `m${Date.now() + 1}`,
            jobId,
            senderId: partnerId,
            receiverId: currentUserId,
            text: "Thanks for your message. I'll take a look and get back to you soon!",
            timestamp: new Date().toISOString(),
            read: false,
          };
          
          // Add to the conversation
          setConversation(prev => [...prev, responseMsg]);
        }, 2000);
      }, 1000);
    }, 500);
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (flatListRef.current && conversation.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [conversation, isTyping]);

  const handleBackPress = () => {
    Haptics.selectionAsync();
    router.back();
  };
  
  const attachImage = () => {
    Haptics.selectionAsync();
    
    // Simulate attaching an image
    const imageMsg = {
      id: `m${Date.now()}`,
      jobId,
      senderId: currentUserId,
      receiverId: partnerId,
      text: "[IMAGE] Here's a photo of the site.",
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    // Add to the conversation
    setConversation([...conversation, imageMsg]);
  };
  
  const renderMessageItem = ({ item, index }) => {
    const prevMessage = index > 0 ? conversation[index - 1] : null;
    const isSender = item.senderId === currentUserId;
    const isLast = 
      index === conversation.length - 1 || 
      conversation[index + 1]?.senderId !== item.senderId;
    
    return (
      <View>
        {shouldShowDateSeparator(item, prevMessage) && (
          <DateSeparator date={item.timestamp} />
        )}
        <MessageBubble 
          message={item} 
          isSender={isSender}
          isLast={isLast}
          showImage={shouldShowAvatar(item, prevMessage)}
          partner={partner}
        />
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <Animated.View 
          style={[
            styles.header,
            { opacity: headerFadeAnim }
          ]}
        >
          {LinearGradient ? (
            <LinearGradient
              colors={[theme.colors.primary.dark, theme.colors.primary.main]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.headerGradient}
            >
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={handleBackPress}
              >
                <Ionicons name="arrow-back" size={24} color={theme.colors.primary.contrast} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.headerProfile}
                onPress={() => {
                  Haptics.selectionAsync();
                  // Could navigate to partner profile
                }}
              >
                {partner?.profilePicture ? (
                  <Image source={{ uri: partner.profilePicture }} style={styles.headerImage} />
                ) : (
                  <View style={styles.headerImagePlaceholder}>
                    <Text style={styles.headerImageText}>{partner?.name?.charAt(0) || '?'}</Text>
                  </View>
                )}
                <View style={styles.headerInfo}>
                  <Text style={styles.headerName}>{partner?.name}</Text>
                  <Text style={styles.headerJob} numberOfLines={1}>
                    {job?.title ? `Re: ${job.title}` : 'Conversation'}
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.headerAction}
                onPress={() => {
                  Haptics.selectionAsync();
                  // Could open options menu
                }}
              >
                <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.primary.contrast} />
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <View style={[styles.headerGradient, { backgroundColor: theme.colors.primary.main }]}>
              <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Ionicons name="arrow-back" size={24} color={theme.colors.primary.contrast} />
              </TouchableOpacity>
              
              <View style={styles.headerProfile}>
                <Image source={{ uri: partner?.profilePicture }} style={styles.headerImage} />
                <View>
                  <Text style={styles.headerName}>{partner?.name}</Text>
                  <Text style={styles.headerJob} numberOfLines={1}>
                    {job?.title ? `Re: ${job.title}` : 'Conversation'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>
        
        <FlatList
          ref={flatListRef}
          data={conversation}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubble-ellipses-outline" size={40} color={theme.colors.neutral[300]} />
              <Text style={styles.emptyText}>No messages yet</Text>
              <Text style={styles.emptySubtext}>Start the conversation!</Text>
            </View>
          }
          ListFooterComponent={
            isTyping ? <TypingIndicator /> : null
          }
        />
        
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={attachImage}
          >
            <Ionicons name="image-outline" size={24} color={theme.colors.primary.main} />
          </TouchableOpacity>
          
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={1000}
              placeholderTextColor={theme.colors.neutral[500]}
            />
          </View>
          
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              !newMessage.trim() && !sendingMessage && styles.disabledSendButton
            ]}
            onPress={sendMessage}
            disabled={!newMessage.trim() || sendingMessage}
          >
            {sendingMessage ? (
              <ActivityIndicator size="small" color={theme.colors.primary.contrast} />
            ) : (
              <Ionicons 
                name="send" 
                size={20} 
                color={newMessage.trim() ? theme.colors.primary.contrast : theme.colors.neutral[400]} 
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[100],
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    height: 70 + statusBarHeight,
    width: '100%',
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: statusBarHeight,
    paddingHorizontal: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerInfo: {
    flex: 1,
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing.md,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  headerImageText: {
    color: theme.colors.primary.contrast,
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerName: {
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
    color: theme.colors.primary.contrast,
  },
  headerJob: {
    fontSize: theme.typography.size.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    maxWidth: width * 0.4,
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  messagesList: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    alignItems: 'flex-end',
  },
  senderRow: {
    justifyContent: 'flex-end',
  },
  receiverRow: {
    justifyContent: 'flex-start',
  },
  avatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: theme.spacing.sm,
  },
  avatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  avatarText: {
    color: theme.colors.primary.contrast,
    fontWeight: 'bold',
    fontSize: 12,
  },
  avatarSpacer: {
    width: 30,
    marginRight: theme.spacing.sm,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: 2,
  },
  senderBubble: {
    backgroundColor: theme.colors.primary.main,
    borderBottomRightRadius: 4,
  },
  lastSenderBubble: {
    borderBottomRightRadius: theme.borderRadius.lg,
  },
  receiverBubble: {
    backgroundColor: theme.colors.neutral[200],
    borderBottomLeftRadius: 4,
  },
  lastReceiverBubble: {
    borderBottomLeftRadius: theme.borderRadius.lg,
  },
  messageText: {
    fontSize: theme.typography.size.md,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.size.md,
  },
  senderText: {
    color: theme.colors.primary.contrast,
  },
  receiverText: {
    color: theme.colors.neutral[900],
  },
  messageTime: {
    fontSize: theme.typography.size.xs,
    alignSelf: 'flex-end',
  },
  senderTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  receiverTime: {
    color: theme.colors.neutral[600],
  },
  imageMessageContainer: {
    marginBottom: theme.spacing.xs,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xs,
  },
  messageImageCaption: {
    fontSize: theme.typography.size.sm,
  },
  typingContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    marginLeft: 38, // align with the avatar
  },
  typingBubble: {
    flexDirection: 'row',
    backgroundColor: theme.colors.neutral[200],
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.neutral[600],
    opacity: 0.7,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.neutral[300],
  },
  dateText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.neutral[600],
    marginHorizontal: theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral[200],
    backgroundColor: theme.colors.neutral[100],
  },
  attachButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
    backgroundColor: theme.colors.neutral[200],
  },
  textInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.neutral[300],
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.neutral[100],
    maxHeight: 120,
  },
  textInput: {
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[900],
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  disabledSendButton: {
    backgroundColor: theme.colors.neutral[300],
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxxl,
  },
  emptyText: {
    fontSize: theme.typography.size.lg,
    fontWeight: 'bold',
    color: theme.colors.neutral[700],
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[600],
    marginTop: theme.spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.neutral[100],
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.size.md,
    color: theme.colors.primary.main,
  },
});
