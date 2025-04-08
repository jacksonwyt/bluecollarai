import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../theme';
import { jobs } from '../../../api/mockData';

// Mock worker ID
const currentWorkerId = 'w1';

// StatusBadge component
const StatusBadge = ({ status }) => {
  const statusStyles = {
    Applied: { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B' },
    'In Progress': { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6' },
    Completed: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' },
  }[status] || { bg: 'rgba(160, 174, 192, 0.1)', text: '#A0AEC0' };

  return (
    <View style={[styles.statusBadge, { backgroundColor: statusStyles.bg }]}>
      <Text style={[styles.statusText, { color: statusStyles.text }]}>{status}</Text>
    </View>
  );
};

// JobCard component
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
      }),
    ]).start();
  }, [index]);

  const status = job.assignedWorker === currentWorkerId
    ? job.status === 'Completed' ? 'Completed' : 'In Progress'
    : 'Applied';

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Animated.View
      style={[
        styles.transactionCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.jobContent}>
          <View style={styles.transactionIconContainer}>
            <MaterialIcons name="work" size={24} color={theme.colors.primary.main} />
          </View>
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionTitle}>{job.title}</Text>
            <Text style={styles.transactionSubtitle}>Client: {job.client || 'N/A'}</Text>
            <Text style={styles.transactionDate}>{formatDate(job.datePosted)}</Text>
          </View>
          <View style={styles.transactionAmountContainer}>
            <Text style={styles.transactionAmount}>${job.budget}</Text>
            <StatusBadge status={status} />
          </View>
        </View>
        <View style={styles.jobActions}>
          {status === 'Applied' && (
            <TouchableOpacity onPress={() => {}} style={styles.actionIcon}>
              <MaterialIcons name="close" size={20} color={theme.colors.error.main} />
            </TouchableOpacity>
          )}
          {status === 'In Progress' && (
            <TouchableOpacity onPress={() => {}} style={styles.actionIcon}>
              <MaterialIcons name="check" size={20} color={theme.colors.success.main} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => router.push(`/conversation?jobId=${job.id}`)}
            style={styles.actionIcon}
          >
            <MaterialIcons name="chat" size={20} color={theme.colors.primary.main} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// FilterTabs component
const FilterTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ['Applied', 'In Progress', 'Completed'];
  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Main MyJobsScreen component
export default function MyJobsScreen() {
  const [activeTab, setActiveTab] = useState('Applied');
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      const workerJobs = jobs.filter(
        (job) =>
          job.applications.includes(currentWorkerId) ||
          job.assignedWorker === currentWorkerId
      );
      setMyJobs(workerJobs);
      setLoading(false);
    };
    loadJobs();
  }, []);

  const filteredJobs = myJobs.filter((job) => {
    if (activeTab === 'Applied') {
      return (
        job.applications.includes(currentWorkerId) &&
        job.assignedWorker !== currentWorkerId
      );
    } else if (activeTab === 'In Progress') {
      return job.assignedWorker === currentWorkerId && job.status !== 'Completed';
    } else if (activeTab === 'Completed') {
      return job.assignedWorker === currentWorkerId && job.status === 'Completed';
    }
    return false;
  });

  const appliedCount = myJobs.filter(
    (job) =>
      job.applications.includes(currentWorkerId) &&
      job.assignedWorker !== currentWorkerId
  ).length;
  const inProgressCount = myJobs.filter(
    (job) => job.assignedWorker === currentWorkerId && job.status !== 'Completed'
  ).length;
  const completedCount = myJobs.filter(
    (job) => job.assignedWorker === currentWorkerId && job.status === 'Completed'
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.canGoBack() ? router.back() : null}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary.main} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Jobs</Text>
        <TouchableOpacity style={styles.headerButton}>
          <MaterialIcons name="filter-list" size={24} color={theme.colors.primary.main} />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Job Overview</Text>
        <Text style={styles.balanceAmount}>
          Applied: {appliedCount} • In Progress: {inProgressCount} • Completed: {completedCount}
        </Text>
      </View>

      <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {loading ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="hourglass-empty" size={48} color="#CBD5E0" />
          <Text style={styles.emptyStateText}>Loading jobs...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={({ item, index }) => (
            <JobCard
              job={item}
              index={index}
              onPress={() => router.push(`/job/${item.id}`)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.transactionsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="work-off" size={48} color="#CBD5E0" />
              <Text style={styles.emptyStateText}>No {activeTab.toLowerCase()} jobs</Text>
              {activeTab === 'Applied' && (
                <TouchableOpacity
                  onPress={() => router.push('/explore')}
                  style={styles.withdrawButton}
                >
                  <Text style={styles.withdrawButtonText}>Browse Available Jobs</Text>
                  <MaterialIcons name="keyboard-arrow-right" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerBackButton: { padding: 8 },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    flex: 1,
    textAlign: 'center',
  },
  headerButton: { padding: 8 },
  balanceCard: {
    backgroundColor: theme.colors.primary.main,
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 16,
  },
  withdrawButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginRight: 4,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  activeTab: { backgroundColor: theme.colors.primary.main },
  tabText: { fontSize: 14, color: '#4A5568' },
  activeTabText: { color: '#FFFFFF', fontWeight: '500' },
  transactionsList: { paddingHorizontal: 16, paddingBottom: 20 },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  jobContent: { flexDirection: 'row', alignItems: 'center' },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: { flex: 1 },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.primary.dark,
    marginBottom: 4,
  },
  transactionSubtitle: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 4,
  },
  transactionDate: { fontSize: 12, color: '#A0AEC0' },
  transactionAmountContainer: { alignItems: 'flex-end' },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A2A44',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { fontSize: 12, fontWeight: '500' },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  actionIcon: { marginLeft: 12 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#A0AEC0',
  },
});
