import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  Animated, 
  Platform 
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { mockApiCall, jobs } from '../../../api/mockData';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';

// Try to import LinearGradient
let LinearGradient;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (error) {
  console.warn('expo-linear-gradient is not available:', error);
}

// For demo, we'll assume the current worker is w1
const currentWorkerId = 'w1';

// Job status badge component
const StatusBadge = ({ status }) => {
  let statusColors;

  switch (status) {
    case 'Applied':
      statusColors = theme.colors.warning;
      break;
    case 'In Progress':
      statusColors = theme.colors.accent;
      break;
    case 'Completed':
      statusColors = theme.colors.success;
      break;
    default:
      statusColors = theme.colors.neutral;
  }

  return (
    <View style={[styles.statusBadge, { backgroundColor: statusColors.main }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

// Job card component
const JobCard = ({ job, onPress, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  // Determine job status for this worker
  let status = 'Applied';
  if (job.assignedWorker === currentWorkerId) {
    status = job.status === 'Completed' ? 'Completed' : 'In Progress';
  }
  
  const getButtonVariant = () => {
    switch(status) {
      case 'In Progress':
        return 'primary';
      case 'Applied':
        return 'outline';
      default:
        return 'ghost';
    }
  };

  return (
    <Animated.View style={[
      styles.jobCardContainer,
      {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }
    ]}>
      <Card 
        variant={status === 'Completed' ? 'glass' : 'elevated'}
        style={styles.jobCard}
      >
        <TouchableOpacity 
          style={styles.cardTouchable}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View style={styles.jobHeader}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <StatusBadge status={status} />
          </View>
          
          <View style={styles.jobDetails}>
            <View style={styles.jobDetail}>
              <MaterialIcons name="location-on" size={16} color={theme.colors.neutral[600]} />
              <Text style={styles.jobDetailText}>{job.location}</Text>
            </View>
            
            <View style={styles.jobDetail}>
              <MaterialIcons name="attach-money" size={16} color={theme.colors.neutral[600]} />
              <Text style={styles.jobDetailText}>${job.budget}</Text>
            </View>
            
            <View style={styles.jobDetail}>
              <MaterialIcons name="event" size={16} color={theme.colors.neutral[600]} />
              <Text style={styles.jobDetailText}>Posted: {job.datePosted}</Text>
            </View>
          </View>
          
          <Text style={styles.jobDescription} numberOfLines={2}>
            {job.description}
          </Text>
          
          <View style={styles.jobFooter}>
            {status === 'Applied' && (
              <Button
                variant="outline"
                icon="close"
                size="sm"
                onPress={() => {}}
                style={styles.buttonContainer}
              >
                Cancel Application
              </Button>
            )}
            
            {status === 'In Progress' && (
              <Button
                variant="primary"
                icon="check-circle"
                size="sm"
                gradient
                onPress={() => {}}
                style={styles.buttonContainer}
              >
                Mark as Complete
              </Button>
            )}
            
            {status === 'Completed' && (
              <View style={styles.completedInfo}>
                <MaterialIcons name="check-circle" size={20} color={theme.colors.success.main} />
                <Text style={styles.completedText}>Completed on {job.completedDate || 'N/A'}</Text>
              </View>
            )}
            
            <Button
              variant="accent"
              icon="chat"
              size="sm"
              style={styles.messageButton}
              onPress={() => router.push(`/conversation?jobId=${job.id}`)}
            />
          </View>
        </TouchableOpacity>
      </Card>
    </Animated.View>
  );
};

// Screen tabs for job filtering
const FilterTabs = ({ activeTab, setActiveTab }) => {
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const tabWidth = 100; // Approximate width of each tab
  
  useEffect(() => {
    let position = 0;
    if (activeTab === 'In Progress') position = 1;
    if (activeTab === 'Completed') position = 2;
    
    Animated.spring(indicatorPosition, {
      toValue: position * tabWidth,
      tension: 60,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);
  
  return (
    <View style={styles.tabsContainer}>
      <Animated.View 
        style={[
          styles.tabIndicator, 
          { transform: [{ translateX: indicatorPosition }] }
        ]}
      />
      <TabButton 
        title="Applied" 
        active={activeTab === 'Applied'} 
        onPress={() => setActiveTab('Applied')} 
      />
      <TabButton 
        title="In Progress" 
        active={activeTab === 'In Progress'} 
        onPress={() => setActiveTab('In Progress')} 
      />
      <TabButton 
        title="Completed" 
        active={activeTab === 'Completed'} 
        onPress={() => setActiveTab('Completed')} 
      />
    </View>
  );
};

const TabButton = ({ title, active, onPress }) => (
  <TouchableOpacity
    style={styles.filterTab}
    onPress={onPress}
  >
    <Text style={[
      styles.filterTabText, 
      active && styles.activeFilterTabText
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default function MyJobsScreen() {
  const [activeTab, setActiveTab] = useState('Applied');
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

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
    <View style={styles.container}>
      <Header 
        title="My Jobs"
        leftAction={{
          icon: 'arrow-back',
          onPress: () => router.back(),
        }}
        rightAction={{
          icon: 'filter-list',
          onPress: () => {},
        }}
        scrollOffset={scrollY.__getValue()}
        variant="primary"
      />
      
      <Animated.View style={styles.content}>
        <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {loading ? (
          <View style={styles.loadingContainer}>
            <MaterialIcons name="hourglass-empty" size={48} color={theme.colors.neutral[400]} />
            <Text style={styles.loadingText}>Loading jobs...</Text>
          </View>
        ) : filteredJobs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="work-off" size={60} color={theme.colors.neutral[400]} />
            <Text style={styles.emptyText}>No {activeTab.toLowerCase()} jobs</Text>
            {activeTab === 'Applied' && (
              <Button
                variant="primary"
                icon="search"
                gradient
                onPress={() => router.push('/explore')}
                style={{ marginTop: theme.spacing.md }}
              >
                Browse Available Jobs
              </Button>
            )}
          </View>
        ) : (
          <Animated.FlatList
            data={filteredJobs}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <JobCard 
                job={item} 
                index={index}
                onPress={() => router.push(`/job/${item.id}`)} 
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          />
        )}
      </Animated.View>
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
    marginTop: Platform.OS === 'ios' ? 90 : 70,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.neutral[100],
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: theme.spacing.lg,
    width: 100, // Match with tabWidth in component
    height: 3,
    backgroundColor: theme.colors.primary.main,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  filterTab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  filterTabText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[600],
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: theme.colors.primary.main,
    fontWeight: 'bold',
  },
  listContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  jobCardContainer: {
    marginBottom: theme.spacing.md,
  },
  jobCard: {
    overflow: 'hidden',
  },
  cardTouchable: {
    flex: 1,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  jobTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: 'bold',
    color: theme.colors.neutral[800],
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.neutral[100],
    fontWeight: '500',
  },
  jobDetails: {
    marginBottom: theme.spacing.sm,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  jobDetailText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[600],
    marginLeft: theme.spacing.xs,
  },
  jobDescription: {
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[700],
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  jobFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 0,
  },
  completedInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.success.dark,
    marginLeft: theme.spacing.xs,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[600],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emptyText: {
    fontSize: theme.typography.size.lg,
    color: theme.colors.neutral[600],
    fontWeight: 'bold',
    marginTop: theme.spacing.md,
  },
});
