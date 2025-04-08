import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import theme, { COLORS, FONTS } from '../theme';
import { users, workerProfiles } from '../../api/mockData';

// For demo purposes, use the first worker in the mock data
const worker = workerProfiles[0];
const user = users.find(u => u.id === worker.userId);

const ReviewCard = ({ review }) => {
  const client = users.find(u => u.id === review.clientId);
  
  return (
    <View style={styles.reviewCard}>
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
            <Ionicons 
              key={i}
              name={i < Math.floor(review.rating) ? "star" : i < review.rating ? "star-half" : "star-outline"} 
              size={16} 
              color={COLORS.secondary.yellow} 
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewText}>{review.text}</Text>
    </View>
  );
};

export default function WorkerProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user.profilePicture }}
            style={styles.profileImage}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.name}</Text>
            <View style={styles.ratingContainer}>
              {Array(5).fill(0).map((_, i) => (
                <Ionicons 
                  key={i}
                  name={i < Math.floor(worker.ratings) ? "star" : i < worker.ratings ? "star-half" : "star-outline"} 
                  size={18} 
                  color={COLORS.secondary.yellow} 
                />
              ))}
              <Text style={styles.ratingText}>{worker.ratings.toFixed(1)} ({worker.reviews.length})</Text>
            </View>
          </View>
        </View>
        
        {/* Profile Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Ionicons name="cash-outline" size={20} color={COLORS.primary.darkBlue} />
            <Text style={styles.infoLabel}>Hourly Rate:</Text>
            <Text style={styles.infoValue}>${worker.rate}/hr</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={20} color={COLORS.primary.darkBlue} />
            <Text style={styles.infoLabel}>Service Areas:</Text>
            <Text style={styles.infoValue}>{worker.serviceAreas.join(', ')}</Text>
          </View>
          
          <View style={styles.skillsContainer}>
            <Text style={styles.skillsLabel}>Skills:</Text>
            <View style={styles.skillsWrapper}>
              {worker.skills.map(skill => (
                <View key={skill} style={styles.skillChip}>
                  <Text style={styles.skillChipText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.bioContainer}>
            <Text style={styles.bioLabel}>About Me:</Text>
            <Text style={styles.bioText}>{worker.bio}</Text>
          </View>
        </View>
        
        {/* Reviews Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <Text style={styles.sectionCount}>{worker.reviews.length}</Text>
        </View>
        
        {worker.reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
        
        {/* Edit Profile Button */}
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={20} color={COLORS.primary.white} />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    padding: 15,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: FONTS.sizes.header,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    color: COLORS.secondary.gray,
    fontSize: FONTS.sizes.secondary,
  },
  infoCard: {
    backgroundColor: COLORS.primary.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
    marginLeft: 10,
    marginRight: 5,
  },
  infoValue: {
    fontSize: FONTS.sizes.body,
    color: COLORS.primary.darkBlue,
  },
  skillsContainer: {
    marginBottom: 15,
  },
  skillsLabel: {
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
    marginBottom: 10,
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    backgroundColor: COLORS.primary.lightBlue,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  skillChipText: {
    color: COLORS.primary.white,
    fontSize: FONTS.sizes.secondary,
  },
  bioContainer: {
    marginTop: 10,
  },
  bioLabel: {
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
    marginBottom: 5,
  },
  bioText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.primary.darkBlue,
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.subheader,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
  },
  sectionCount: {
    backgroundColor: COLORS.primary.lightBlue,
    color: COLORS.primary.white,
    fontSize: FONTS.sizes.secondary,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  reviewCard: {
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
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewerName: {
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
  },
  reviewDate: {
    fontSize: FONTS.sizes.secondary,
    color: COLORS.secondary.gray,
  },
  reviewText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.primary.darkBlue,
    lineHeight: 20,
  },
  editButton: {
    backgroundColor: COLORS.primary.lightBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 30,
  },
  editButtonText: {
    color: COLORS.primary.white,
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  skill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary.white,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1
  },
});
