import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from './theme';
import { mockApiCall } from '../api/mockData';
import JobListMapView from './components/JobListMapView';

const { width, height } = Dimensions.get('window');
const BOTTOM_SHEET_MIN_HEIGHT = 100;
const BOTTOM_SHEET_MAX_HEIGHT = height * 0.6;

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isBottomSheetExpanded, setIsBottomSheetExpanded] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const bottomSheetAnim = useRef(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)).current;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [jobsData, workersData] = await Promise.all([
          mockApiCall('jobs/nearby'),
          mockApiCall('workers/nearby')
        ]);
        setJobs(jobsData);
        setWorkers(workersData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const animateTab = (tab) => {
    Animated.spring(slideAnim, {
      toValue: tab === 'jobs' ? 0 : width - 40,
      tension: 50,
      friction: 10,
      useNativeDriver: true,
    }).start();
    setActiveTab(tab);
  };

  const toggleBottomSheet = () => {
    Animated.spring(bottomSheetAnim, {
      toValue: isBottomSheetExpanded ? BOTTOM_SHEET_MIN_HEIGHT : BOTTOM_SHEET_MAX_HEIGHT,
      tension: 50,
      friction: 7,
      useNativeDriver: false,
    }).start();
    setIsBottomSheetExpanded(!isBottomSheetExpanded);
  };

  const ItemCard = ({ item, type }) => {
    const isJob = type === 'job';
    const isSelected = selectedItem?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          isSelected && styles.selectedCard
        ]}
        onPress={() => {
          setSelectedItem(item);
          router.push(isJob ? `/job/${item.id}` : `/worker/${item.id}`);
        }}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            {isJob ? item.title : item.name}
          </Text>
          {isJob ? (
            <View style={[styles.badge, { backgroundColor: theme.colors.accent.main }]}>
              <Text style={styles.badgeText}>${item.budget}</Text>
            </View>
          ) : (
            <View style={[styles.badge, { backgroundColor: theme.colors.success.main }]}>
              <Text style={styles.badgeText}>{item.rating} ★</Text>
            </View>
          )}
        </View>

        <Text style={styles.cardDescription}>
          {isJob ? item.description : item.skills.join(', ')}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.footerDetail}>
            <MaterialIcons 
              name={isJob ? 'location-on' : 'work'} 
              size={16} 
              color={theme.colors.neutral[600]} 
            />
            <Text style={styles.footerText}>
              {isJob ? item.location : `${item.jobsCompleted} jobs`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.push('/')}
          >
            <MaterialIcons 
              name="arrow-back" 
              size={24} 
              color={theme.colors.primary.contrast} 
            />
          </TouchableOpacity>
          <Text style={styles.title}>Explore</Text>
        </View>
        <View style={styles.tabContainer}>
          <Animated.View 
            style={[
              styles.tabIndicator,
              { transform: [{ translateX: slideAnim }] }
            ]} 
          />
          <TouchableOpacity 
            style={styles.tab} 
            onPress={() => animateTab('jobs')}
          >
            <MaterialIcons 
              name="work" 
              size={24} 
              color={activeTab === 'jobs' ? theme.colors.primary.contrast : theme.colors.neutral[400]} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'jobs' ? theme.colors.primary.contrast : theme.colors.neutral[400] }
            ]}>
              Jobs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.tab} 
            onPress={() => animateTab('workers')}
          >
            <MaterialIcons 
              name="people" 
              size={24} 
              color={activeTab === 'workers' ? theme.colors.primary.contrast : theme.colors.neutral[400]} 
            />
            <Text style={[
              styles.tabText,
              { color: activeTab === 'workers' ? theme.colors.primary.contrast : theme.colors.neutral[400] }
            ]}>
              Workers
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapWrapper}>
        <JobListMapView
          jobs={activeTab === 'jobs' ? jobs : []}
          workers={activeTab === 'workers' ? workers : []}
          selectedItem={selectedItem}
          onItemSelect={setSelectedItem}
        />
      </View>

      <Animated.View style={[styles.bottomSheet, { height: bottomSheetAnim }]}>
        <TouchableOpacity style={styles.bottomSheetHandle} onPress={toggleBottomSheet}>
          <View style={styles.handle} />
        </TouchableOpacity>
        
        <ScrollView 
          style={styles.cardsContainer}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.centerContent}>
              <MaterialIcons name="hourglass-empty" size={48} color={theme.colors.neutral[400]} />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            activeTab === 'jobs' ? jobs.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item} 
                type="job"
              />
            )) : workers.map((item) => (
              <ItemCard 
                key={item.id} 
                item={item} 
                type="worker"
              />
            ))
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.main,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    zIndex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  backButton: {
    marginRight: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.size.xxl,
    fontWeight: 'bold',
    color: theme.colors.primary.contrast,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary.light,
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.xs,
    position: 'relative',
  },
  tabIndicator: {
    position: 'absolute',
    width: (width - 40) / 2,
    height: '100%',
    backgroundColor: theme.colors.accent.main,
    borderRadius: theme.borderRadius.full,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    gap: theme.spacing.xs,
    zIndex: 1,
  },
  tabText: {
    fontSize: theme.typography.size.md,
    fontWeight: '600',
  },
  mapWrapper: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.neutral[100],
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    ...theme.shadows.lg,
  },
  bottomSheetHandle: {
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.neutral[300],
    borderRadius: theme.borderRadius.full,
  },
  cardsContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  selectedCard: {
    borderColor: theme.colors.accent.main,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: '600',
    color: theme.colors.neutral[900],
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    color: theme.colors.primary.contrast,
    fontSize: theme.typography.size.sm,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[600],
    marginBottom: theme.spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[600],
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[600],
  },
}); 