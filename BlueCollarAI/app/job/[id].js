import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert, 
  Animated,
  Image,
  Dimensions,
  StatusBar,
  Platform,
  Share
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { jobs, users } from '../../api/mockData';
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

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [job, setJob] = useState(null);
  const [client, setClient] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerHeight = useRef(new Animated.Value(200)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Load job details
    setIsLoading(true);
    const jobData = jobs.find(j => j.id === id);
    if (jobData) {
      setJob(jobData);
      
      // Check if current user has applied
      setHasApplied(jobData.applications.includes(currentUserId));
      
      // Check if current user is assigned
      setIsAssigned(jobData.assignedWorker === currentUserId);
      
      // Load client details
      const clientData = users.find(u => u.id === jobData.clientId);
      setClient(clientData);
      
      // Start animations after data is loaded
      setTimeout(() => {
        setIsLoading(false);
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
          Animated.timing(headerOpacity, {
            toValue: 1,
            duration: theme.animation.duration.normal,
            useNativeDriver: true,
          }),
        ]).start();
      }, 300);
    }
  }, [id]);

  // Calculate header animations based on scroll
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [50, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const backgroundOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleApply = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // In a real app, this would make an API call
    Alert.alert(
      "Application Submitted",
      "Your application has been submitted. The client will review your profile and respond soon.",
      [{ text: "OK" }]
    );
    
    // Update local state to reflect the application
    setHasApplied(true);
  };

  const handleMessage = () => {
    Haptics.selectionAsync();
    
    if (client) {
      router.push({
        pathname: '/conversation',
        params: { partnerId: client.id, jobId: job.id }
      });
    }
  };

  const handleShare = async () => {
    Haptics.selectionAsync();
    
    try {
      await Share.share({
        message: `Check out this job opportunity: ${job.title} - $${job.budget} in ${job.location}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContent}>
          <Animated.View 
            style={[
              styles.loadingIndicator,
              { transform: [{ scale: fadeAnim }] }
            ]}
          >
            <Ionicons name="briefcase-outline" size={40} color={theme.colors.primary.main} />
          </Animated.View>
          <Animated.Text 
            style={[
              styles.loadingText,
              { opacity: fadeAnim }
            ]}
          >
            Loading job details...
          </Animated.Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated header background */}
      <Animated.View 
        style={[
          styles.headerBackground,
          {
            opacity: backgroundOpacity,
            transform: [{ translateY: headerTranslate }]
          }
        ]}
      >
        {BlurView ? (
          <BlurView intensity={80} tint="dark" style={styles.blurView}>
            <Animated.Text style={[styles.headerTitle, { opacity: headerTitleOpacity }]}>
              {job.title}
            </Animated.Text>
          </BlurView>
        ) : (
          <View style={styles.headerBackgroundFallback}>
            <Animated.Text style={[styles.headerTitle, { opacity: headerTitleOpacity }]}>
              {job.title}
            </Animated.Text>
          </View>
        )}
      </Animated.View>
      
      <Animated.ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* Hero section */}
        <Animated.View 
          style={[
            styles.heroSection,
            { 
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslate }] 
            }
          ]}
        >
          {LinearGradient && (
            <LinearGradient
              colors={[theme.colors.primary.dark, theme.colors.primary.main]}
              style={styles.heroGradient}
            >
              <View style={styles.heroContent}>
                <TouchableOpacity 
                  style={styles.backButton} 
                  onPress={() => {
                    Haptics.selectionAsync();
                    router.back();
                  }}
                >
                  <Ionicons name="arrow-back" size={24} color={theme.colors.primary.contrast} />
                </TouchableOpacity>
                
                <Text style={styles.jobHeroTitle}>{job.title}</Text>
                
                <View style={styles.heroMeta}>
                  <View style={styles.metaTag}>
                    <Ionicons name="cash-outline" size={16} color={theme.colors.primary.contrast} />
                    <Text style={styles.metaTagText}>${job.budget}</Text>
                  </View>
                  
                  <View style={styles.metaTag}>
                    <Ionicons name="location-outline" size={16} color={theme.colors.primary.contrast} />
                    <Text style={styles.metaTagText}>{job.location}</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          )}
        </Animated.View>
        
        {/* Main content */}
        <Animated.View 
          style={[
            styles.mainContent,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          {/* Status bar */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, getStatusStyle(job.status).badge]}>
              <Text style={[styles.statusText, getStatusStyle(job.status).text]}>
                {job.status}
              </Text>
            </View>
            
            <Text style={styles.datePosted}>
              Posted: {formatDate(job.datePosted)}
            </Text>
            
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={22} color={theme.colors.primary.main} />
            </TouchableOpacity>
          </View>
          
          {/* Job details card */}
          <View style={styles.jobCard}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{job.description}</Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.categories}>
                <View style={styles.categoryChip}>
                  <Ionicons name="construct-outline" size={16} color={theme.colors.primary.contrast} />
                  <Text style={styles.categoryText}>{job.category}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Client card */}
          <View style={styles.clientCard}>
            <Text style={styles.sectionTitle}>Client Information</Text>
            
            <View style={styles.clientContainer}>
              <View style={styles.clientInfo}>
                {client.profilePicture ? (
                  <Image source={{ uri: client.profilePicture }} style={styles.clientImage} />
                ) : (
                  <View style={styles.clientImagePlaceholder}>
                    <Ionicons name="person" size={24} color={theme.colors.primary.contrast} />
                  </View>
                )}
                <View>
                  <Text style={styles.clientName}>{client.name}</Text>
                  <Text style={styles.clientRating}>
                    <Ionicons name="star" size={14} color="#FFD700" /> 
                    {client.rating || "4.8"} Rating
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.messageButton}
                onPress={handleMessage}
              >
                <LinearGradient
                  colors={theme.colors.primary.gradient}
                  style={styles.messageButtonGradient}
                >
                  <Ionicons name="chatbubble-outline" size={18} color={theme.colors.primary.contrast} />
                  <Text style={styles.messageButtonText}>Message</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.applicationsSection}>
            <Text style={styles.applicationsTitle}>
              Applications: <Text style={styles.applicationCount}>{job.applications.length}</Text>
            </Text>
            
            {job.applications.length > 0 && (
              <View style={styles.applicationAvatars}>
                {job.applications.slice(0, 3).map((appId, index) => {
                  const applicant = users.find(u => u.id === appId);
                  return (
                    <View key={appId} style={[styles.avatarContainer, { zIndex: 10 - index, marginLeft: index > 0 ? -15 : 0 }]}>
                      {applicant?.profilePicture ? (
                        <Image source={{ uri: applicant.profilePicture }} style={styles.avatarImage} />
                      ) : (
                        <View style={styles.avatarPlaceholder}>
                          <Text style={styles.avatarInitial}>{applicant?.name?.charAt(0) || '?'}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
                
                {job.applications.length > 3 && (
                  <View style={[styles.avatarContainer, { marginLeft: -15, backgroundColor: theme.colors.neutral[200] }]}>
                    <Text style={styles.moreBadge}>+{job.applications.length - 3}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
          
          {/* Action buttons */}
          <View style={styles.actionContainer}>
            {job.status === 'open' ? (
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={handleApply}
              >
                <LinearGradient
                  colors={theme.colors.primary.gradient}
                  style={styles.applyButtonGradient}
                >
                  <Text style={styles.applyButtonText}>Apply Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : job.status === 'in_progress' && job.isClient ? (
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => router.push('/payment-details?id=' + id)}
              >
                <LinearGradient
                  colors={theme.colors.success.gradient}
                  style={styles.applyButtonGradient}
                >
                  <Text style={styles.applyButtonText}>Pay Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : null}
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

// Helper function to get status style
const getStatusStyle = (status) => {
  switch (status) {
    case 'Open':
      return {
        badge: { backgroundColor: theme.colors.success.light + '30' },
        text: { color: theme.colors.success.main }
      };
    case 'In Progress':
      return {
        badge: { backgroundColor: theme.colors.accent.light + '30' },
        text: { color: theme.colors.accent.main }
      };
    case 'Completed':
      return {
        badge: { backgroundColor: theme.colors.warning.light + '30' },
        text: { color: theme.colors.warning.main }
      };
    default:
      return {
        badge: { backgroundColor: theme.colors.neutral[300] },
        text: { color: theme.colors.neutral[700] }
      };
  }
};

const { width, height } = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[100],
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60 + statusBarHeight,
    backgroundColor: theme.colors.primary.main,
    zIndex: 10,
  },
  blurView: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  headerBackgroundFallback: {
    flex: 1,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'flex-end',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  headerTitle: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.size.lg,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxxl,
  },
  heroSection: {
    height: 200,
    width: '100%',
    marginBottom: -theme.spacing.xl,
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroContent: {
    padding: theme.spacing.lg,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : statusBarHeight + 10,
    left: theme.spacing.md,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobHeroTitle: {
    fontSize: theme.typography.size.xxl,
    fontWeight: 'bold',
    color: theme.colors.primary.contrast,
    marginBottom: theme.spacing.sm,
  },
  heroMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  metaTagText: {
    color: theme.colors.primary.contrast,
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.size.sm,
  },
  mainContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxxl,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: theme.typography.size.xs,
    fontWeight: 'bold',
  },
  datePosted: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.neutral[600],
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.glass.light,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  jobCard: {
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: 'bold',
    color: theme.colors.primary.dark,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[800],
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.size.md,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    backgroundColor: theme.colors.primary.main,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  categoryText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.size.sm,
    fontWeight: '500',
    marginLeft: theme.spacing.xs,
  },
  clientCard: {
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  clientContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.md,
  },
  clientImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  clientName: {
    fontSize: theme.typography.size.md,
    fontWeight: '600',
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing.xxs,
  },
  clientRating: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[600],
  },
  messageButton: {
    overflow: 'hidden',
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  messageButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  messageButtonText: {
    color: theme.colors.primary.contrast,
    marginLeft: theme.spacing.xs,
    fontWeight: '500',
  },
  applicationsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  applicationsTitle: {
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[800],
  },
  applicationCount: {
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  applicationAvatars: {
    flexDirection: 'row',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.neutral[100],
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: theme.colors.primary.contrast,
    fontWeight: 'bold',
  },
  moreBadge: {
    fontSize: theme.typography.size.xs,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    textAlign: 'center',
    lineHeight: 36,
  },
  applyButton: {
    height: 56,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  applyButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: theme.spacing.md,
  },
  appliedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success.light + '20',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.success.light,
  },
  assignedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warning.light + '20',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.warning.light,
  },
  statusIndicator: {
    marginRight: theme.spacing.md,
  },
  statusMessage: {
    flex: 1,
  },
  statusMessageTitle: {
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing.xxs,
  },
  statusMessageSubtitle: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[700],
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
  loadingIndicator: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary.light + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  loadingText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.primary.main,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
});
