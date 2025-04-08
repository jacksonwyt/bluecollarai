import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../theme/index';
import { users, workerProfiles } from '../../../api/mockData';
import Button from '../../_components/ui/Button';
import Card from '../../_components/ui/Card';

// For demo purposes, use the first worker in the mock data
const worker = workerProfiles[0];
const user = users.find(u => u.id === worker.userId);

const ReviewCard = ({ review, theme }) => {
  const styles = getReviewCardStyles(theme);
  const client = users.find(u => u.id === review.clientId);
  
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image 
          source={{ uri: client.profilePicture }} 
          style={styles.reviewerImage} 
        />
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{client.name}</Text>
          <Text style={styles.reviewDate}>{review.date}</Text>
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
    </View>
  );
};

const WorkerProfileScreen = () => {
  const { theme } = useTheme();
  
  const styles = getProfileScreenStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      {/* Static Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image 
            source={{ uri: user.profilePicture }} 
            style={styles.profileImage} 
          />
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
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
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
            <Text style={styles.skillsText}>{worker.skills.join(', ')}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.bioContainer}>
            <View style={styles.bioHeader}>
              <MaterialIcons name="person" size={22} color={theme.colors.primary.main} />
              <Text style={styles.bioLabel}>About Me:</Text>
            </View>
            <Text style={styles.bioText}>{worker.bio}</Text>
          </View>
        </View>

        {/* Reviews Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <View style={styles.sectionCount}>
            <Text style={styles.sectionCountText}>{worker.reviews.length}</Text>
          </View>
        </View>
        {worker.reviews.map((review, index) => (
          <ReviewCard key={index} review={review} theme={theme} />
        ))}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button 
            variant="primary" 
            size="lg" 
            icon="edit" 
            block 
            onPress={() => {}}
          >
            Edit Profile
          </Button>
          <View style={{ height: theme.spacing.md }} />
          <Button 
            variant="outline" 
            size="lg" 
            icon="visibility" 
            block 
            onPress={() => {}}
          >
            Preview Public Profile
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getReviewCardStyles = (theme) => StyleSheet.create({
  reviewCard: {
    backgroundColor: theme.colors.background.primary,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.md,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: theme.typography.size.md,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  reviewDate: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.tertiary,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.size.sm,
  },
});

const getProfileScreenStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background?.secondary || '#F7FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingTop: 40,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  headerTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: theme.spacing.lg,
  },
  profileCard: {
    backgroundColor: theme.colors.primary.main,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.md,
    borderWidth: 3,
    borderColor: theme.colors.primary.contrast + '80',
  },
  name: {
    fontSize: theme.typography.size.xxl,
    fontWeight: 'bold',
    color: theme.colors.primary.contrast,
    marginBottom: theme.spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: theme.colors.primary.contrast,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.size.md,
  },
  infoCard: {
    backgroundColor: theme.colors.background.primary,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
    overflow: 'hidden',
    marginTop: theme.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  infoLabel: {
    fontSize: theme.typography.size.md,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.sm,
  },
  infoValue: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginHorizontal: theme.spacing.md,
  },
  skillsContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  skillsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  skillsLabel: {
    fontSize: theme.typography.size.md,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.md,
  },
  skillsText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md + 22,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.size.sm,
  },
  bioContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  bioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  bioLabel: {
    fontSize: theme.typography.size.md,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.md,
  },
  bioText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md + 22,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.size.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  sectionCount: {
    backgroundColor: theme.colors.primary.surface,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
  },
  sectionCountText: {
    fontSize: theme.typography.size.xs,
    fontWeight: '600',
    color: theme.colors.primary.main,
  },
  actionsContainer: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
});

export default WorkerProfileScreen;
