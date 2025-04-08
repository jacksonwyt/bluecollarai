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
import { useTheme } from '../../theme';
import { jobs } from '../../../api/mockData';

// Mock worker ID
const currentWorkerId = 'w1';

// StatusBadge component
const StatusBadge = ({ status, theme }) => {
  const styles = getStatusBadgeStyles(theme);
  const statusStyles = {
    Applied: { bg: theme.colors.warning.surface || 'rgba(245, 158, 11, 0.1)', text: theme.colors.warning.main },
    'In Progress': { bg: theme.colors.accent.surface || 'rgba(59, 130, 246, 0.1)', text: theme.colors.accent.main },
    Completed: { bg: theme.colors.success.surface || 'rgba(16, 185, 129, 0.1)', text: theme.colors.success.main },
  }[status] || { bg: theme.colors.neutral[200] || 'rgba(160, 174, 192, 0.1)', text: theme.colors.neutral[600] || '#A0AEC0' };

  return (
    <View style={[styles.statusBadge, { backgroundColor: statusStyles.bg }]}>
      <Text style={[styles.statusText, { color: statusStyles.text }]}>{status}</Text>
    </View>
  );
};

// JobCard component
const JobCard = ({ job, onPress, index, theme }) => {
  const styles = getJobCardStyles(theme);
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
        styles.jobCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.jobContent}>
          <View style={styles.jobIconContainer}>
            <MaterialIcons name="work" size={24} color={theme.colors.primary.main} />
          </View>
          <View style={styles.jobDetails}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobSubtitle}>Client: {job.client || 'N/A'}</Text>
            <Text style={styles.jobDate}>{formatDate(job.datePosted)}</Text>
          </View>
          <View style={styles.jobAmountContainer}>
            <Text style={styles.jobAmount}>${job.budget}</Text>
            <StatusBadge status={status} theme={theme} />
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
const FilterTabs = ({ activeTab, setActiveTab, theme }) => {
  const styles = getFilterTabsStyles(theme);
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
  const { theme } = useTheme();
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

  const styles = getMyJobsScreenStyles(theme);

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

      <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />

      {loading ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="hourglass-empty" size={48} color={theme.colors.neutral[300]} />
          <Text style={styles.emptyStateText}>Loading jobs...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={({ item, index }) => (
            <JobCard
              job={item}
              index={index}
              theme={theme}
              onPress={() => router.push(`/job/${item.id}`)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.jobsList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="work-off" size={48} color={theme.colors.neutral[300]} />
              <Text style={styles.emptyStateText}>No {activeTab.toLowerCase()} jobs</Text>
              {activeTab === 'Applied' && (
                <TouchableOpacity
                  onPress={() => router.push('/(worker)/(tabs)/index')}
                  style={styles.browseButton}
                >
                  <Text style={styles.browseButtonText}>Browse Available Jobs</Text>
                  <MaterialIcons name="keyboard-arrow-right" size={20} color={theme.colors.primary.contrast} />
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

// Functions to generate styles
const getStatusBadgeStyles = (theme) => StyleSheet.create({
  statusBadge: {
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.xs,
  },
  statusText: {
    fontSize: theme.typography.size.xs,
    fontWeight: '500',
  },
});

const getJobCardStyles = (theme) => StyleSheet.create({
  jobCard: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    ...theme.shadows.sm,
  },
  jobContent: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  jobIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  jobDetails: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  jobTitle: {
    fontSize: theme.typography.size.md,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xxs,
  },
  jobSubtitle: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  jobDate: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.tertiary,
  },
  jobAmountContainer: {
    alignItems: 'flex-end',
  },
  jobAmount: {
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  jobActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    marginTop: -theme.spacing.xs,
    borderTopWidth: 1,
    borderColor: theme.colors.divider,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  actionIcon: {
    padding: theme.spacing.xs,
  },
});

const getFilterTabsStyles = (theme) => StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderColor: theme.colors.divider,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm + 2,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: theme.colors.primary.main,
  },
  tabText: {
    fontSize: theme.typography.size.sm,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  activeTabText: {
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
});

const getMyJobsScreenStyles = (theme) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background?.secondary || '#F7FAFC' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingTop: 40,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  headerBackButton: { padding: theme.spacing.xs },
  headerTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
    flex: 1,
  },
  headerButton: { padding: theme.spacing.xs },
  balanceCard: {
    backgroundColor: theme.colors.primary.main,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  balanceLabel: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.primary.contrast + 'b3',
    marginBottom: theme.spacing.xs,
  },
  balanceAmount: {
    fontSize: theme.typography.size.md,
    fontWeight: '600',
    color: theme.colors.primary.contrast,
    textAlign: 'center',
  },
  jobsList: {
    paddingBottom: theme.spacing.xxl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: theme.typography.size.md,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.main,
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    marginTop: theme.spacing.lg,
  },
  browseButtonText: {
    color: theme.colors.primary.contrast,
    fontWeight: '500',
    marginRight: theme.spacing.xs,
  },
});
