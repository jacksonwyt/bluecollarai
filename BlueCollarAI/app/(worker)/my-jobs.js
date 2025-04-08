import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import theme, { COLORS, FONTS } from '../theme';
import { mockApiCall, jobs } from '../../api/mockData';

// For demo, we'll assume the current worker is w1
const currentWorkerId = 'w1';

// Job status badge component
const StatusBadge = ({ status }) => {
  let backgroundColor = COLORS.secondary.gray;
  let textColor = COLORS.primary.white;

  if (status === 'Applied') {
    backgroundColor = '#FFD700'; // Gold
    textColor = '#000000';
  } else if (status === 'In Progress') {
    backgroundColor = COLORS.primary.lightBlue;
  } else if (status === 'Completed') {
    backgroundColor = '#4CAF50'; // Green
  }

  return (
    <View style={[styles.statusBadge, { backgroundColor }]}>
      <Text style={[styles.statusText, { color: textColor }]}>{status}</Text>
    </View>
  );
};

// Job card component
const JobCard = ({ job, onPress }) => {
  // Determine job status for this worker
  let status = 'Applied';
  if (job.assignedWorker === currentWorkerId) {
    status = job.status === 'Completed' ? 'Completed' : 'In Progress';
  }

  return (
    <TouchableOpacity style={styles.jobCard} onPress={onPress}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <StatusBadge status={status} />
      </View>
      
      <View style={styles.jobDetails}>
        <View style={styles.jobDetail}>
          <Ionicons name="location-outline" size={16} color={COLORS.secondary.gray} />
          <Text style={styles.jobDetailText}>{job.location}</Text>
        </View>
        
        <View style={styles.jobDetail}>
          <Ionicons name="cash-outline" size={16} color={COLORS.secondary.gray} />
          <Text style={styles.jobDetailText}>${job.budget}</Text>
        </View>
        
        <View style={styles.jobDetail}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.secondary.gray} />
          <Text style={styles.jobDetailText}>Posted: {job.datePosted}</Text>
        </View>
      </View>
      
      <Text style={styles.jobDescription} numberOfLines={2}>
        {job.description}
      </Text>
      
      <View style={styles.jobFooter}>
        {status === 'Applied' && (
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel Application</Text>
          </TouchableOpacity>
        )}
        
        {status === 'In Progress' && (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Mark as Complete</Text>
          </TouchableOpacity>
        )}
        
        {status === 'Completed' && (
          <View style={styles.completedInfo}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.completedText}>Completed on {job.completedDate || 'N/A'}</Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.messageButton}
          onPress={() => router.push(`/messages/${job.clientId}`)}
        >
          <Ionicons name="chatbubble-outline" size={18} color={COLORS.primary.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// Screen tabs for job filtering
const FilterTab = ({ title, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.filterTab, selected && styles.selectedFilterTab]}
    onPress={onPress}
  >
    <Text style={[styles.filterTabText, selected && styles.selectedFilterTabText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default function MyJobsScreen() {
  const [activeTab, setActiveTab] = useState('Applied');
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch data from the server
    // For demo, we'll use mock data
    const loadJobs = async () => {
      setLoading(true);
      try {
        // Filter jobs that the worker has applied to
        const workerJobs = jobs.filter(job => 
          job.applications.includes(currentWorkerId) || 
          job.assignedWorker === currentWorkerId
        );
        setMyJobs(workerJobs);
      } catch (error) {
        console.error('Error loading jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Filter jobs based on selected tab
  const filteredJobs = myJobs.filter(job => {
    if (activeTab === 'Applied') {
      return job.applications.includes(currentWorkerId) && job.assignedWorker !== currentWorkerId;
    } else if (activeTab === 'In Progress') {
      return job.assignedWorker === currentWorkerId && job.status !== 'Completed';
    } else if (activeTab === 'Completed') {
      return job.assignedWorker === currentWorkerId && job.status === 'Completed';
    }
    return false;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabsContainer}>
        <FilterTab 
          title="Applied" 
          selected={activeTab === 'Applied'} 
          onPress={() => setActiveTab('Applied')} 
        />
        <FilterTab 
          title="In Progress" 
          selected={activeTab === 'In Progress'} 
          onPress={() => setActiveTab('In Progress')} 
        />
        <FilterTab 
          title="Completed" 
          selected={activeTab === 'Completed'} 
          onPress={() => setActiveTab('Completed')} 
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading jobs...</Text>
        </View>
      ) : filteredJobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="briefcase-outline" size={60} color={COLORS.secondary.gray} />
          <Text style={styles.emptyText}>No {activeTab.toLowerCase()} jobs</Text>
          {activeTab === 'Applied' && (
            <Text style={styles.emptySubtext}>Browse available jobs and apply!</Text>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobCard job={item} onPress={() => router.push(`/job/${item.id}`)} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedFilterTab: {
    borderBottomColor: COLORS.primary.lightBlue,
  },
  filterTabText: {
    fontSize: FONTS.sizes.body,
    color: COLORS.secondary.gray,
    fontWeight: '500',
  },
  selectedFilterTabText: {
    color: COLORS.primary.lightBlue,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
  },
  jobCard: {
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
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: FONTS.sizes.subheader,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: FONTS.sizes.secondary,
    fontWeight: 'bold',
  },
  jobDetails: {
    marginBottom: 10,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  jobDetailText: {
    fontSize: FONTS.sizes.secondary,
    color: COLORS.secondary.gray,
    marginLeft: 5,
  },
  jobDescription: {
    fontSize: FONTS.sizes.body,
    color: COLORS.primary.darkBlue,
    marginBottom: 15,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.secondary.gray,
  },
  cancelButtonText: {
    color: COLORS.secondary.gray,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: COLORS.primary.lightBlue,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  actionButtonText: {
    color: COLORS.primary.white,
    fontWeight: 'bold',
  },
  completedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedText: {
    fontSize: FONTS.sizes.secondary,
    color: '#4CAF50',
    marginLeft: 5,
    fontWeight: '500',
  },
  messageButton: {
    backgroundColor: COLORS.primary.lightBlue,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: FONTS.sizes.subheader,
    fontWeight: 'bold',
    color: COLORS.primary.darkBlue,
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: FONTS.sizes.body,
    color: COLORS.secondary.gray,
    textAlign: 'center',
    marginTop: 5,
  },
});
