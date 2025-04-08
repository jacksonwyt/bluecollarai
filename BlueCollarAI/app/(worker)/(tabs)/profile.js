import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../../theme';
import { users, workerProfiles } from '../../../api/mockData';
import Button from '../../components/ui/Button';

// For demo purposes, use the first worker in the mock data
const worker = workerProfiles[0];
const user = users.find(u => u.id === worker.userId);

const ReviewCard = ({ review }) => {
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
          <Text style={styles.reviewText}>{review.text}</Text>
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
    </View>
  );
};

export default function WorkerProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Static Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary.main} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color={theme.colors.primary.main} />
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
          <ReviewCard key={index} review={review} />
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
  scrollContent: {
    paddingBottom: 20,
  },
  profileCard: {
    backgroundColor: theme.colors.primary.main,
    margin: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.primary.dark,
    marginLeft: 12,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 16,
    color: '#1A2A44',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  skillsContainer: {
    paddingVertical: 12,
  },
  skillsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillsLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.primary.dark,
    marginLeft: 12,
  },
  skillsText: {
    fontSize: 14,
    color: '#4A5568',
    marginLeft: 34,
  },
  bioContainer: {
    paddingVertical: 12,
  },
  bioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bioLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.primary.dark,
    marginLeft: 12,
  },
  bioText: {
    fontSize: 14,
    color: '#4A5568',
    marginLeft: 34,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  sectionCount: {
    backgroundColor: theme.colors.primary.light,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  sectionCountText: {
    color: theme.colors.primary.contrast,
    fontSize: 12,
    fontWeight: 'bold',
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
    marginRight: 12,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.primary.dark,
  },
  reviewDate: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 2,
  },
  reviewText: {
    fontSize: 14,
    color: '#4A5568',
    marginTop: 8,
  },
  actionsContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    paddingBottom: 20,
  },
});
