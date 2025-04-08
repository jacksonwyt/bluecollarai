import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/index';
import { mockApiCall } from '../../../api/mockData';
import Header from '../../_components/ui/Header';
import Card from '../../_components/ui/Card';
import Button from '../../_components/ui/Button';
import JobListMapView from '../../_components/JobListMapView';
import BottomSheet from '../../_components/ui/BottomSheet';
import JobFilters from '../../_components/JobFilters';

const { width } = Dimensions.get('window');

// Function to generate styles for JobCard (moved definition)
const getJobCardStyles = (theme) => StyleSheet.create({
  jobCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
  },
  selectedJobCard: {
    borderColor: theme.colors.accent.main,
    borderWidth: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  jobTitle: {
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    flexShrink: 1, // Prevent long titles pushing budget off
    marginRight: theme.spacing.sm,
  },
  jobLocation: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
  },
  jobBudget: {
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
    color: theme.colors.success.main,
  },
  jobDetails: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  jobDetailText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
  },
});

// Job card component - Refactored to accept theme as prop
const JobCard = ({ job, onPress, theme, isSelected }) => {
  // Call INSIDE component
  const styles = getJobCardStyles(theme); 

  return (
    <Card
      key={job.id}
      style={[
        styles.jobCard,
        isSelected && styles.selectedJobCard
      ]}
      onPress={onPress}
    >
      <View style={styles.jobHeader}>
        <View>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.jobLocation}>{job.location}</Text>
        </View>
        <Text style={styles.jobBudget}>${job.budget}</Text>
      </View>

      <View style={styles.jobDetails}>
        <View style={styles.jobDetail}>
          <MaterialIcons name="category" size={16} color={theme.colors.neutral[600]} />
          <Text style={styles.jobDetailText}>{job.category}</Text>
        </View>
        <View style={styles.jobDetail}>
          <MaterialIcons name="schedule" size={16} color={theme.colors.neutral[600]} />
          <Text style={styles.jobDetailText}>Posted: {job.datePosted}</Text>
        </View>
        <View style={styles.jobDetail}>
          <MaterialIcons name="place" size={16} color={theme.colors.neutral[600]} />
          <Text style={styles.jobDetailText}>{job.distance} miles away</Text>
        </View>
      </View>
    </Card>
  );
};

// Function to generate styles for WorkerDashboard (moved definition)
const getDashboardStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background?.secondary || theme.colors.neutral[100], 
  },
  header: {
    backgroundColor: theme.colors.primary.main,
    paddingTop: 40, // Adjust as needed for status bar
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary.contrast,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 15,
  },
  content: {
    paddingBottom: 80, // Space for potential bottom nav
  },
  mapSection: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  seeAllButton: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.accent.main,
    fontWeight: '500',
  },
  mapContainer: {
    height: 250,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    marginHorizontal: theme.spacing.lg,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg, 
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.typography.size.lg,
    color: theme.colors.neutral[500],
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[400],
    marginTop: theme.spacing.xs,
  },
  jobsList: {
    gap: theme.spacing.md,
  },
});

export default function WorkerDashboard() {
  const { theme } = useTheme();
  // Call INSIDE component
  const styles = getDashboardStyles(theme); 
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    category: 'All',
    sort: 'distance',
    distance: 10,
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobsData = await mockApiCall('jobs/nearby');
        setJobs(jobsData);
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  const filteredJobs = jobs
    .filter(job => {
      const matchesCategory = filters.category === 'All' || job.category === filters.category;
      const matchesSearch = !searchQuery || 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistance = job.distance <= filters.distance;
      
      return matchesCategory && matchesSearch && matchesDistance;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case 'budget_desc':
          return b.budget - a.budget;
        case 'date':
          return new Date(b.datePosted) - new Date(a.datePosted);
        default: // distance
          return a.distance - b.distance;
      }
    });

  if (loading) {
    // Use inline style or recreate basicStyles with styled-components if needed elsewhere
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background?.secondary || '#FFFFFF' }} > 
        <ActivityIndicator size="large" color={theme.colors.primary.main} /> 
      </View>
    );
  }

  const renderSection = ({ item: section }) => {
    switch (section.type) {
      case 'map':
        return (
          <View style={styles.mapSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Jobs Near You</Text>
              <TouchableOpacity onPress={() => router.push('/explore')}>
                <Text style={styles.seeAllButton}>Explore All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mapContainer}>
              <JobListMapView
                jobs={filteredJobs}
                selectedJob={selectedJob}
                onJobSelect={setSelectedJob}
              />
            </View>
          </View>
        );
      case 'jobs':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Jobs</Text>
            {loading ? (
              <View style={styles.centerContent}>
                <ActivityIndicator size="large" color={theme.colors.primary.main} />
              </View>
            ) : filteredJobs.length === 0 ? (
              <View style={styles.centerContent}>
                <MaterialIcons name="search-off" size={48} color={theme.colors.neutral[400]} />
                <Text style={styles.emptyText}>No jobs found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search</Text>
              </View>
            ) : (
              <View style={styles.jobsList}>
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    theme={theme} 
                    isSelected={selectedJob?.id === job.id}
                    onPress={() => {
                      setSelectedJob(job);
                      router.push(`/job/${job.id}`);
                    }}
                  />
                ))}
              </View>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  const sections = [
    { id: 'map', type: 'map' },
    { id: 'jobs', type: 'jobs' }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons 
              name="arrow-back" 
              size={24} 
              color={theme.colors.primary.contrast} 
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Available Jobs</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => setIsFilterOpen(true)}
          >
            <MaterialIcons 
              name="filter-list" 
              size={24} 
              color={theme.colors.primary.contrast} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderSection}
        contentContainerStyle={styles.content}
      />

      <BottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        snapPoints={['50%', '75%']}
      >
        <JobFilters
          initialFilters={filters}
          onApply={handleFilter}
        />
      </BottomSheet>
    </View>
  );
}
