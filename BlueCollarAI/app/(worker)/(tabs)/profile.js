import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, Animated, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../../theme';
import { users, workerProfiles } from '../../../api/mockData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Try to import LinearGradient
let LinearGradient;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (error) {
  console.warn('expo-linear-gradient is not available:', error);
}

// Try to import BlurView
let BlurView;
try {
  BlurView = require('expo-blur').BlurView;
} catch (error) {
  console.warn('expo-blur is not available:', error);
}

// For demo purposes, use the first worker in the mock data
const worker = workerProfiles[0];
const user = users.find(u => u.id === worker.userId);

const ReviewCard = ({ review }) => {
  const client = users.find(u => u.id === review.clientId);
  
  return (
    <Card variant="default" style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <Image 
            source={{ uri: client.profilePicture }} 
            style={styles.reviewerImage} 
          />
          <View>
            <Text style={styles.reviewerName}>{client.name}</Text>
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          {Array(5).fill(0).map((_, i) => (
            <MaterialIcons 
              key={i}
              name={i < Math.floor(review.rating) ? "star" : i < review.rating ? "star-half" : "star-outline"} 
              size={16} 
              color={theme.colors.warning.main} 
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewText}>{review.text}</Text>
    </Card>
  );
};

export default function WorkerProfileScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerHeight] = useState(Platform.OS === 'ios' ? 90 : 70);
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.5, 1],
    extrapolate: 'clamp',
  });

  // Animation for content
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderHeader = () => (
    <Animated.View style={[
      styles.animatedHeader, 
      { 
        opacity: headerOpacity,
        height: headerHeight 
      }
    ]}>
      {Platform.OS === 'ios' && BlurView ? (
        <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFill} />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.neutral[100] }]} />
      )}
      <SafeAreaView style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: theme.spacing.lg }}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary.main} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.actionButton}>
          <MaterialIcons name="more-vert" size={24} color={theme.colors.primary.main} />
        </TouchableOpacity>
      </SafeAreaView>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <Animated.ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Profile Header */}
        <Animated.View style={[
          styles.profileHeaderContainer,
          { transform: [{ translateY: translateYAnim }], opacity: fadeAnim }
        ]}>
          <LinearGradient
            colors={theme.colors.primary.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientHeader}
          >
            <Animated.Image
              source={{ uri: user.profilePicture }}
              style={[
                styles.profileImage, 
                { transform: [{ scale: imageScale }] }
              ]}
            />
          </LinearGradient>
          
          <Card variant="glass" style={styles.nameCard}>
            <Text style={styles.name}>{user.name}</Text>
            <View style={styles.ratingContainer}>
              {Array(5).fill(0).map((_, i) => (
                <MaterialIcons 
                  key={i}
                  name={i < Math.floor(worker.ratings) ? "star" : i < worker.ratings ? "star-half" : "star-outline"} 
                  size={20} 
                  color={theme.colors.warning.main} 
                />
              ))}
              <Text style={styles.ratingText}>{worker.ratings.toFixed(1)} ({worker.reviews.length})</Text>
            </View>
          </Card>
        </Animated.View>
        
        {/* Info Cards */}
        <Animated.View style={[
          { transform: [{ translateY: translateYAnim }], opacity: fadeAnim }
        ]}>
          {/* Profile Info */}
          <Card variant="elevated" style={styles.infoCard}>
            <View style={styles.infoItem}>
              <MaterialIcons name="payments" size={22} color={theme.colors.primary.main} />
              <Text style={styles.infoLabel}>Hourly Rate:</Text>
              <Text style={styles.infoValue}>${worker.rate}/hr</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoItem}>
              <MaterialIcons name="location-on" size={22} color={theme.colors.primary.main} />
              <Text style={styles.infoLabel}>Service Areas:</Text>
              <Text style={styles.infoValue}>{worker.serviceAreas.join(', ')}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.skillsContainer}>
              <View style={styles.skillsHeader}>
                <MaterialIcons name="build" size={22} color={theme.colors.primary.main} />
                <Text style={styles.skillsLabel}>Skills:</Text>
              </View>
              <View style={styles.skillsWrapper}>
                {worker.skills.map(skill => (
                  <View key={skill} style={styles.skillChip}>
                    <Text style={styles.skillChipText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.bioContainer}>
              <View style={styles.bioHeader}>
                <MaterialIcons name="person" size={22} color={theme.colors.primary.main} />
                <Text style={styles.bioLabel}>About Me:</Text>
              </View>
              <Text style={styles.bioText}>{worker.bio}</Text>
            </View>
          </Card>
          
          {/* Reviews Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <View style={styles.sectionCount}>
              <Text style={styles.sectionCountText}>{worker.reviews.length}</Text>
            </View>
          </View>
          
          {worker.reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
          
          {/* Actions Buttons */}
          <View style={styles.actionsContainer}>
            <Button 
              variant="primary" 
              size="lg"
              icon="edit"
              block
              gradient
            >
              Edit Profile
            </Button>
            
            <View style={{ height: theme.spacing.md }} />
            
            <Button 
              variant="outline" 
              size="lg"
              icon="visibility"
              block
            >
              Preview Public Profile
            </Button>
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[100],
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    justifyContent: 'flex-end',
  },
  headerTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  actionButton: {
    padding: theme.spacing.xs,
  },
  profileHeaderContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  gradientHeader: {
    height: 120,
    width: '100%',
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.neutral[100],
    position: 'absolute',
    top: 70,
  },
  nameCard: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: theme.spacing.md,
    marginTop: -30,
    width: '100%',
    ...theme.shadows.sm,
  },
  name: {
    fontSize: theme.typography.size.xxl,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: theme.spacing.xs,
    color: theme.colors.neutral[600],
    fontSize: theme.typography.size.sm,
  },
  infoCard: {
    marginTop: theme.spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  infoLabel: {
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.xs,
  },
  infoValue: {
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[800],
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.neutral[200],
    marginVertical: theme.spacing.xs,
  },
  skillsContainer: {
    paddingVertical: theme.spacing.md,
  },
  skillsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  skillsLabel: {
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginLeft: theme.spacing.md,
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: theme.spacing.xl + theme.spacing.xs,
  },
  skillChip: {
    backgroundColor: theme.colors.primary.light,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  skillChipText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.size.sm,
    fontWeight: '500',
  },
  bioContainer: {
    paddingVertical: theme.spacing.md,
  },
  bioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  bioLabel: {
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginLeft: theme.spacing.md,
  },
  bioText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[800],
    lineHeight: 22,
    paddingLeft: theme.spacing.xl + theme.spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  sectionCount: {
    backgroundColor: theme.colors.primary.light,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.sm,
  },
  sectionCountText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.size.sm,
    fontWeight: 'bold',
  },
  reviewCard: {
    marginBottom: theme.spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: theme.spacing.sm,
  },
  reviewerName: {
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  reviewDate: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.neutral[500],
  },
  reviewText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[800],
    lineHeight: 20,
  },
  actionsContainer: {
    marginTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
});
