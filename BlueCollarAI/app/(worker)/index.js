import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { mockApiCall } from '../../api/mockData';
import Header from '../components/ui/Header.js';
import Card from '../components/ui/Card.js';
import Button from '../components/ui/Button.js';
import JobListMapView from '../components/JobListMapView';
import BottomSheet from '../components/ui/BottomSheet.js';
import JobFilters from '../components/JobFilters';

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

export default function JobsScreen() {
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

  return (
    <View style={styles.container}>
      <Header
        title="Available Jobs"
        showSearch
        showFilter
        onSearch={handleSearch}
        onFilter={() => setIsFilterOpen(true)}
      />

      {loading ? (
        <View style={styles.centerContent}>
          <MaterialIcons name="hourglass-empty" size={48} color={theme.colors.neutral[400]} />
        </View>
      ) : filteredJobs.length === 0 ? (
        <View style={styles.centerContent}>
          <MaterialIcons name="search-off" size={48} color={theme.colors.neutral[400]} />
          <Text style={styles.emptyText}>No jobs found</Text>
          <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
        </View>
      ) : (
        <View style={styles.splitContainer}>
          <View style={styles.mapContainer}>
            <JobListMapView 
              jobs={filteredJobs}
              selectedJob={selectedJob}
              onJobSelect={(job) => setSelectedJob(job)}
            />
          </View>

          <View style={styles.listContainer}>
            <Animated.FlatList
              data={filteredJobs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Card
                  variant="glass"
                  style={[
                    styles.jobCard,
                    selectedJob?.id === item.id && styles.selectedJobCard
                  ]}
                  onPress={() => {
                    setSelectedJob(item);
                    router.push(`/job/${item.id}`);
                  }}
                >
                  <View style={styles.jobHeader}>
                    <View>
                      <Text style={styles.jobTitle}>{item.title}</Text>
                      <Text style={styles.jobLocation}>{item.location}</Text>
                    </View>
                    <Text style={styles.jobBudget}>${item.budget}</Text>
                  </View>

                  <View style={styles.jobDetails}>
                    <View style={styles.jobDetail}>
                      <MaterialIcons name="category" size={16} color={theme.colors.neutral[600]} />
                      <Text style={styles.jobDetailText}>{item.category}</Text>
                    </View>
                    <View style={styles.jobDetail}>
                      <MaterialIcons name="schedule" size={16} color={theme.colors.neutral[600]} />
                      <Text style={styles.jobDetailText}>Posted: {item.datePosted}</Text>
                    </View>
                    <View style={styles.jobDetail}>
                      <MaterialIcons name="place" size={16} color={theme.colors.neutral[600]} />
                      <Text style={styles.jobDetailText}>{item.distance} miles away</Text>
                    </View>
                  </View>

                  <Button
                    variant="primary"
                    size="sm"
                    style={styles.applyButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      // In a real app, this would call an API to apply for the job
                      alert(`Applied to: ${item.title}`);
                    }}
                  >
                    Apply Now
                  </Button>
                </Card>
              )}
              contentContainerStyle={styles.listContent}
            />
          </View>
        </View>
      )}

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
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mapContainer: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: theme.colors.neutral[300],
  },
  listContainer: {
    flex: 1,
  },
  selectedJobCard: {
    borderColor: theme.colors.accent.main,
    borderWidth: 2,
  },
  jobCard: {
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.primary.contrast,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
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
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.size.xl,
    fontWeight: '600',
    color: theme.colors.neutral[900],
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[600],
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  listContent: {
    padding: theme.spacing.md,
  },
});
