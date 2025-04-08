import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Header from '../components/ui/Header';
import Card from '../components/ui/Card';
import theme from '../theme';
import { mockApiCall } from '../../api/mockData';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'open':
      return theme.colors.warning.main;
    case 'in-progress':
      return theme.colors.accent.main;
    case 'completed':
      return theme.colors.success.main;
    default:
      return theme.colors.neutral[400];
  }
};

export default function ClientDashboard() {
  const [activeJobs, setActiveJobs] = useState([]);
  const [nearbyWorkers, setNearbyWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobsData, workersData] = await Promise.all([
          mockApiCall('jobs/active'),
          mockApiCall('workers/nearby')
        ]);
        setActiveJobs(jobsData);
        setNearbyWorkers(workersData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const QuickAction = ({ icon, label, onPress }) => (
    <TouchableOpacity 
      style={styles.quickAction}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.quickActionIcon}>
        <MaterialIcons name={icon} size={24} color={theme.colors.primary.contrast} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const JobCard = ({ job }) => (
    <Card style={styles.jobCard} onPress={() => router.push(`/job/${job.id}`)}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) }]}>
          <Text style={styles.statusText}>{job.status}</Text>
        </View>
      </View>
      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <MaterialIcons name="person" size={16} color={theme.colors.neutral[600]} />
          <Text style={styles.detailText}>{job.worker || 'No worker assigned'}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialIcons name="attach-money" size={16} color={theme.colors.neutral[600]} />
          <Text style={styles.detailText}>{job.budget}</Text>
        </View>
      </View>
    </Card>
  );

  const WorkerCard = ({ worker }) => (
    <Card style={styles.workerCard} onPress={() => router.push(`/worker/${worker.id}`)}>
      <View style={styles.workerHeader}>
        <MaterialIcons name="account-circle" size={40} color={theme.colors.neutral[400]} />
        <View style={styles.workerInfo}>
          <Text style={styles.workerName}>{worker.name}</Text>
          <Text style={styles.workerSkills}>{worker.skills.join(', ')}</Text>
        </View>
      </View>
      <View style={styles.workerStats}>
        <View style={styles.statItem}>
          <MaterialIcons name="star" size={16} color={theme.colors.warning.main} />
          <Text style={styles.statText}>{worker.rating}</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialIcons name="work" size={16} color={theme.colors.neutral[600]} />
          <Text style={styles.statText}>{worker.jobsCompleted} jobs</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Dashboard"
        showSearch
        onSearch={(query) => {/* Handle search */}}
      />

      {loading ? (
        <View style={styles.centerContent}>
          <MaterialIcons name="hourglass-empty" size={48} color={theme.colors.neutral[400]} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.quickActions}>
            <QuickAction
              icon="add-circle"
              label="Post Job"
              onPress={() => router.push('/post-job')}
            />
            <QuickAction
              icon="people"
              label="Find Workers"
              onPress={() => router.push('/browse-workers')}
            />
            <QuickAction
              icon="work"
              label="My Jobs"
              onPress={() => router.push('/my-jobs')}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Jobs</Text>
              <TouchableOpacity onPress={() => router.push('/my-jobs')}>
                <Text style={styles.seeAllButton}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.jobsList}
            >
              {activeJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Workers Nearby</Text>
              <TouchableOpacity onPress={() => router.push('/browse-workers')}>
                <Text style={styles.seeAllButton}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.workersList}
            >
              {nearbyWorkers.map(worker => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.surface,
  },
  content: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[600],
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary.main,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.accent.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  quickActionLabel: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.size.sm,
    fontWeight: '500',
  },
  section: {
    marginVertical: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: 'bold',
    color: theme.colors.neutral[800],
  },
  seeAllButton: {
    color: theme.colors.accent.main,
    fontSize: theme.typography.size.sm,
    fontWeight: '600',
  },
  jobsList: {
    paddingHorizontal: theme.spacing.md,
  },
  jobCard: {
    width: 280,
    marginRight: theme.spacing.sm,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  jobTitle: {
    fontSize: theme.typography.size.md,
    fontWeight: '600',
    color: theme.colors.neutral[800],
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.size.xs,
    fontWeight: '600',
  },
  jobDetails: {
    gap: theme.spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  detailText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[600],
  },
  workersList: {
    paddingHorizontal: theme.spacing.md,
  },
  workerCard: {
    width: 200,
    marginRight: theme.spacing.sm,
  },
  workerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  workerInfo: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  workerName: {
    fontSize: theme.typography.size.md,
    fontWeight: '600',
    color: theme.colors.neutral[800],
  },
  workerSkills: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.neutral[600],
  },
  workerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[600],
  },
});
