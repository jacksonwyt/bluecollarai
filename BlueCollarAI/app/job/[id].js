import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import theme, { COLORS, FONTS } from '../theme';
import { jobs, users } from '../../api/mockData';

// For demo purposes, we'll assume the current user is worker w1
const currentUserId = 'w1';

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [job, setJob] = useState(null);
  const [client, setClient] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isAssigned, setIsAssigned] = useState(false);
  
  useEffect(() => {
    // Load job details
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
    }
  }, [id]);

  const handleApply = () => {
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
    if (client) {
      router.push({
        pathname: '/conversation',
        params: { partnerId: client.id, jobId: job.id }
      });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (!job || !client) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading job details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Details</Text>
        </View>

        <View style={styles.jobCard}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          
          <View style={styles.jobMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="cash-outline" size={18} color={COLORS.primary.darkBlue} />
              <Text style={styles.metaText}>${job.budget}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={18} color={COLORS.primary.darkBlue} />
              <Text style={styles.metaText}>{job.location}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={18} color={COLORS.primary.darkBlue} />
              <Text style={styles.metaText}>Posted: {formatDate(job.datePosted)}</Text>
            </View>
            
            <View style={styles.statusContainer}>
              <View style={[styles.statusBadge, getStatusStyle(job.status).badge]}>
                <Text style={[styles.statusText, getStatusStyle(job.status).text]}>
                  {job.status}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{job.description}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.categoryChip}>
              <Text style={styles.categoryText}>{job.category}</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Client</Text>
            <View style={styles.clientContainer}>
              <View style={styles.clientInfo}>
                <Ionicons name="person" size={24} color={COLORS.primary.darkBlue} />
                <Text style={styles.clientName}>{client.name}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.messageButton}
                onPress={handleMessage}
              >
                <Ionicons name="chatbubble-outline" size={18} color={COLORS.primary.white} />
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.applicationsSection}>
          <Text style={styles.applicationsTitle}>
            Applications: {job.applications.length}
          </Text>
        </View>
        
        {job.status === 'Open' && !hasApplied && !isAssigned && (
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={handleApply}
          >
            <Text style={styles.applyButtonText}>Apply for this Job</Text>
          </TouchableOpacity>
        )}
        
        {hasApplied && !isAssigned && (
          <View style={styles.appliedContainer}>
            <Ionicons name="checkmark-circle" size={24} color={COLORS.primary.lightBlue} />
            <Text style={styles.appliedText}>You have applied for this job</Text>
          </View>
        )}
        
        {isAssigned && (
          <View style={styles.assignedContainer}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.assignedText}>You are working on this job</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function to get status style
const getStatusStyle = (status) => {
  switch (status) {
    case 'Open':
      return {
        badge: { backgroundColor: '#D5F5E3' },
        text: { color: '#27AE60' }
      };
    case 'In Progress':
      return {
        badge: { backgroundColor: '#D4E6F1' },
        text: { color: '#2980B9' }
      };
    case 'Completed':
      return {
        badge: { backgroundColor: '#FDEBD0' },
        text: { color: '#F39C12' }
      };
    default:
      return {
        badge: { backgroundColor: COLORS.secondary.gray },
        text: { color: COLORS.primary.white }
      };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    paddingBottom: 30,
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
  headerTitle: {
    fontSize: FONTS.sizes.subheader,
    fontWeight: 'bold',
    color: COLORS.primary.white,
  },
  jobCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1
  },
  jobTitle: {
    fontSize: FONTS.sizes.header,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
    marginBottom: 15,
  },
  jobMeta: {
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.primary.darkBlue,
    marginLeft: 10,
  },
  statusContainer: {
    marginTop: 5,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    fontSize: FONTS.sizes.secondary,
    fontWeight: 'bold',
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    paddingTop: 15,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.subheader,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
    marginBottom: 10,
  },
  description: {
    fontSize: FONTS.sizes.body,
    color: COLORS.primary.darkBlue,
    lineHeight: 22,
  },
  categoryChip: {
    backgroundColor: COLORS.primary.lightBlue,
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  categoryText: {
    color: COLORS.primary.white,
    fontSize: FONTS.sizes.body,
    fontWeight: '500',
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
  clientName: {
    fontSize: FONTS.sizes.body,
    fontWeight: '500',
    color: COLORS.primary.darkBlue,
    marginLeft: 10,
  },
  messageButton: {
    backgroundColor: COLORS.primary.lightBlue,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  messageButtonText: {
    color: COLORS.primary.white,
    marginLeft: 5,
    fontWeight: '500',
  },
  applicationsSection: {
    padding: 15,
  },
  applicationsTitle: {
    fontSize: FONTS.sizes.body,
    fontWeight: '500',
    color: COLORS.secondary.gray,
  },
  applyButton: {
    backgroundColor: COLORS.primary.lightBlue,
    marginHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: COLORS.primary.white,
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
  },
  appliedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 15,
  },
  appliedText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.primary.lightBlue,
    fontWeight: '500',
    marginLeft: 10,
  },
  assignedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    padding: 15,
  },
  assignedText: {
    fontSize: FONTS.sizes.body,
    color: '#F39C12',
    fontWeight: '500',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
