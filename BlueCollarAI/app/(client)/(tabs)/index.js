import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Animated,
  Platform,
  SafeAreaView,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import theme, { useTheme, COLORS } from '../../theme';
import { mockApiCall } from '../../../api/mockData';
import JobListMapView from '../../components/JobListMapView';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Try to import BlurView
let BlurView;
try {
  BlurView = require('expo-blur').BlurView;
} catch (error) {
  console.warn('expo-blur is not available:', error);
}

// Try to import LinearGradient
let LinearGradient;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (error) {
  console.warn('expo-linear-gradient is not available:', error);
}

const { width } = Dimensions.get('window');

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'open':
      return theme.colors.warning;
    case 'in-progress':
      return theme.colors.accent;
    case 'completed':
      return theme.colors.success;
    default:
      return theme.colors.neutral;
  }
};

export default function ClientDashboard() {
  const [activeJobs, setActiveJobs] = useState([]);
  const [nearbyWorkers, setNearbyWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMapItem, setSelectedMapItem] = useState(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
  
  // For quick actions animation
  const quickActionAnims = [0, 1, 2].map(() => useRef(new Animated.Value(0)).current);

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
        
        // Start animations when data is loaded
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
          ...quickActionAnims.map((anim, index) => 
            Animated.timing(anim, {
              toValue: 1,
              duration: 400,
              delay: 100 + (index * 100),
              useNativeDriver: true,
            })
          )
        ]).start();
      }
    };

    loadData();
  }, []);

  const QuickAction = ({ icon, label, onPress, animValue }) => (
    <Animated.View style={{
      opacity: animValue,
      transform: [
        { scale: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1]
          })
        }
      ]
    }}>
      <TouchableOpacity 
        style={styles.quickAction}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <MaterialIcons name={icon} size={28} color={theme.colors.primary.main} />
        <Text style={styles.quickActionLabel}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const JobCard = ({ job, index }) => {
    const itemFade = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      Animated.timing(itemFade, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);
    
    const statusColor = getStatusColor(job.status);
    
    return (
      <Animated.View style={{
        opacity: itemFade,
        transform: [{ translateY: itemFade.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0]
        })}]
      }}>
        <Card 
          variant="elevated" 
          style={styles.jobCard}
        >
          <TouchableOpacity 
            style={styles.cardTouchable}
            onPress={() => router.push(`/job/${job.id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.jobHeader}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor.main }]}>
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
          </TouchableOpacity>
        </Card>
      </Animated.View>
    );
  };

  const WorkerCard = ({ worker, index }) => {
    const itemFade = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      Animated.timing(itemFade, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);
    
    return (
      <Animated.View style={{
        opacity: itemFade,
        transform: [{ translateY: itemFade.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0]
        })}]
      }}>
        <Card 
          variant={index % 2 === 0 ? "elevated" : "glass"}
          style={styles.workerCard}
        >
          <TouchableOpacity 
            style={styles.cardTouchable}
            onPress={() => router.push(`/worker/${worker.id}`)}
            activeOpacity={0.7}
          >
            <View style={styles.workerHeader}>
              {worker.profilePicture ? (
                <View style={styles.workerImageContainer}>
                  <View style={styles.workerImageBorder}>
                    <Image 
                      source={{ uri: worker.profilePicture }} 
                      style={styles.workerImage} 
                    />
                  </View>
                </View>
              ) : (
                <View style={styles.workerAvatarContainer}>
                  <MaterialIcons name="account-circle" size={48} color={theme.colors.primary.main} />
                </View>
              )}
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
          </TouchableOpacity>
        </Card>
      </Animated.View>
    );
  };

  const renderSection = ({ item: section, index }) => {
    switch (section.type) {
      case 'quickActions':
        return (
          <Animated.View style={[
            styles.quickActions,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }] 
            }
          ]}>
            <QuickAction
              icon="add-circle"
              label="Post Job"
              onPress={() => router.push('/post-job')}
              animValue={quickActionAnims[0]}
            />
            <QuickAction
              icon="people"
              label="Find Workers"
              onPress={() => router.push('/find-workers')}
              animValue={quickActionAnims[1]}
            />
            <QuickAction
              icon="work"
              label="My Jobs"
              onPress={() => router.push('/my-jobs')}
              animValue={quickActionAnims[2]}
            />
          </Animated.View>
        );
      case 'map':
        return (
          <Animated.View style={[
            styles.mapSection,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }] 
            }
          ]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Activity Map</Text>
              <Button 
                variant="ghost"
                icon="explore"
                size="sm"
                onPress={() => router.push('/explore')}
              >
                Explore
              </Button>
            </View>
            <Card variant="glass" style={styles.mapCard}>
              <View style={styles.mapContainer}>
                <JobListMapView
                  jobs={activeJobs}
                  workers={nearbyWorkers}
                  selectedItem={selectedMapItem}
                  onItemSelect={setSelectedMapItem}
                />
              </View>
            </Card>
          </Animated.View>
        );
      case 'activeJobs':
        return (
          <Animated.View style={[
            styles.section,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }] 
            }
          ]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Jobs</Text>
              <Button 
                variant="ghost"
                icon="arrow-forward"
                size="sm"
                onPress={() => router.push('/my-jobs')}
              >
                See All
              </Button>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={activeJobs}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => <JobCard job={item} index={index} />}
              contentContainerStyle={styles.jobsList}
            />
          </Animated.View>
        );
      case 'nearbyWorkers':
        return (
          <Animated.View style={[
            styles.section,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }] 
            }
          ]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Available Workers Nearby</Text>
              <Button 
                variant="ghost"
                icon="arrow-forward"
                size="sm"
                onPress={() => router.push('/find-workers')}
              >
                See All
              </Button>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={nearbyWorkers}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => <WorkerCard worker={item} index={index} />}
              contentContainerStyle={styles.workersList}
            />
          </Animated.View>
        );
      default:
        return null;
    }
  };

  const sections = [
    { id: 'quickActions', type: 'quickActions' },
    { id: 'map', type: 'map' },
    { id: 'activeJobs', type: 'activeJobs' },
    { id: 'nearbyWorkers', type: 'nearbyWorkers' }
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerBackButton}
            onPress={() => router.canGoBack() ? router.back() : null}
          >
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary.main} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialIcons name="notifications" size={24} color={theme.colors.primary.main} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {loading ? (
        <View style={styles.centerContent}>
          <MaterialIcons name="hourglass-empty" size={48} color={theme.colors.neutral[400]} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderSection}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[100],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: '#FFFFFF',
  },
  headerBackButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    flex: 1,
    textAlign: 'center',
  },
  headerButton: {
    padding: 8,
  },
  content: {
    paddingBottom: theme.spacing.xxxl,
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
    flexDirection: 'column',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  quickAction: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
    ...theme.shadows.md,
  },
  quickActionLabel: {
    fontSize: theme.typography.size.lg,
    fontWeight: '600',
    color: theme.colors.neutral[800],
    marginLeft: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  mapSection: {
    marginBottom: theme.spacing.xl,
  },
  mapCard: {
    marginHorizontal: theme.spacing.lg,
    ...theme.shadows.md,
  },
  mapContainer: {
    height: 180,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  jobsList: {
    paddingHorizontal: theme.spacing.lg,
  },
  jobCard: {
    width: width * 0.7,
    marginRight: theme.spacing.md,
    ...theme.shadows.md,
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
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
    color: theme.colors.neutral[800],
    flex: 1,
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
    marginTop: theme.spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  detailText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[600],
    marginLeft: theme.spacing.xs,
  },
  workersList: {
    paddingHorizontal: theme.spacing.lg,
  },
  workerCard: {
    width: width * 0.65,
    marginRight: theme.spacing.md,
    ...theme.shadows.md,
  },
  workerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  workerImageContainer: {
    marginRight: theme.spacing.md,
  },
  workerImageBorder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    padding: 2,
    backgroundColor: theme.colors.primary.light,
  },
  workerImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  workerAvatarContainer: {
    marginRight: theme.spacing.md,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: theme.typography.size.md,
    fontWeight: 'bold',
    color: theme.colors.neutral[800],
    marginBottom: theme.spacing.xxs,
  },
  workerSkills: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.neutral[600],
  },
  workerStats: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  statText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[700],
    marginLeft: theme.spacing.xxs,
  },
});
