import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { mockApiCall } from '../../../api/mockData';
import Header from '../../components/ui/Header.js';
import Card from '../../components/ui/Card.js';
import Button from '../../components/ui/Button.js';
import JobListMapView from '../../components/JobListMapView';
import BottomSheet from '../../components/ui/BottomSheet.js';
import JobFilters from '../../components/JobFilters';

const { width } = Dimensions.get('window');

// Job card component to display job listings
const JobCard = ({ job, onPress }) => {
  return (
    <TouchableOpacity style={styles.jobCard} onPress={onPress}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.jobBudget}>${job.budget}</Text>
      </View>
      
      <View style={styles.jobDetails}>
        <View style={styles.jobDetail}>
          <Ionicons name="location-outline" size={16} color={theme.colors.neutral[600]} />
          <Text style={styles.jobDetailText}>{job.location}</Text>
        </View>
        
        <View style={styles.jobDetail}>
          <Ionicons name="construct-outline" size={16} color={theme.colors.neutral[600]} />
          <Text style={styles.jobDetailText}>{job.category}</Text>
        </View>
        
        <View style={styles.jobDetail}>
          <Ionicons name="calendar-outline" size={16} color={theme.colors.neutral[600]} />
          <Text style={styles.jobDetailText}>Posted: {job.datePosted}</Text>
        </View>
      </View>
      
      <Text style={styles.jobDescription} numberOfLines={2}>
        {job.description}
      </Text>
      
      <View style={styles.jobFooter}>
        <TouchableOpacity 
          style={styles.applyButton} 
          onPress={(e) => {
            e.stopPropagation();
            // In a real app, this would call an API to apply for the job
            alert(`Applied to: ${job.title}`);
          }}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default function WorkerDashboard() {
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
                <MaterialIcons name="hourglass-empty" size={48} color={theme.colors.neutral[400]} />
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
                  <Card
                    key={job.id}
                    style={[
                      styles.jobCard,
                      selectedJob?.id === job.id && styles.selectedJobCard
                    ]}
                    onPress={() => {
                      setSelectedJob(job);
                      router.push(`/job/${job.id}`);
                    }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[100],
  },
  content: {
    flex: 1,
  },
  mapSection: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  mapContainer: {
    height: 200,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  section: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: '600',
    color: theme.colors.neutral[900],
  },
  seeAllButton: {
    color: theme.colors.primary.main,
    fontSize: theme.typography.size.md,
  },
  jobsList: {
    gap: theme.spacing.md,
  },
  jobCard: {
    marginBottom: theme.spacing.md,
  },
  selectedJobCard: {
    borderColor: theme.colors.primary.main,
    borderWidth: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  jobTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: '600',
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing.xs,
  },
  jobLocation: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[600],
  },
  jobBudget: {
    fontSize: theme.typography.size.lg,
    fontWeight: '600',
    color: theme.colors.success.main,
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobDetailText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[600],
  },
  jobDescription: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[700],
    marginBottom: theme.spacing.md,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  applyButton: {
    backgroundColor: theme.colors.accent.main,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  applyButtonText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.size.sm,
    fontWeight: '600',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.size.lg,
    fontWeight: '600',
    color: theme.colors.neutral[600],
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[400],
    marginTop: theme.spacing.xs,
  },
  header: {
    backgroundColor: theme.colors.primary.main,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: theme.spacing.lg,
  },
  backButton: {
    marginRight: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  headerButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: 'bold',
    color: theme.colors.primary.contrast,
  },
});
