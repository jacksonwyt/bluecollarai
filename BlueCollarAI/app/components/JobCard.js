import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from '../theme';

const JobCard = ({ job, onPress, style }) => {
  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{job.category}</Text>
        </View>
        <Text style={styles.date}>{formatDate(job.datePosted)}</Text>
      </View>
      
      <Text style={styles.title}>{job.title}</Text>
      
      <Text 
        style={styles.description}
        numberOfLines={2}
      >
        {job.description}
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.infoRow}>
          <MaterialIcons name="attach-money" size={16} color={theme.colors.success.main} />
          <Text style={styles.budget}>${job.budget}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={16} color={theme.colors.neutral[500]} />
          <Text style={styles.distance}>{job.distance} mi</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => router.push(`/job/${job.id}`)}
        >
          <Text style={styles.detailsText}>View Details</Text>
          <MaterialIcons name="arrow-forward" size={14} color={theme.colors.primary.main} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.neutral[50],
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryTag: {
    backgroundColor: theme.colors.primary.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: theme.colors.primary.main,
    fontWeight: '600',
    fontSize: 12,
  },
  date: {
    color: theme.colors.neutral[500],
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.neutral[900],
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: theme.colors.neutral[700],
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budget: {
    color: theme.colors.success.main,
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
  distance: {
    color: theme.colors.neutral[600],
    fontSize: 14,
    marginLeft: 4,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsText: {
    color: theme.colors.primary.main,
    fontSize: 13,
    fontWeight: '600',
    marginRight: 4,
  },
});

export default JobCard; 