import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity, 
  ScrollView,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from './theme';
import { mockApiCall } from '../api/mockData';
import JobListMapView from './components/JobListMapView';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const mapScale = useRef(new Animated.Value(1)).current;

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
          Animated.spring(mapScale, {
            toValue: 0.95,
            tension: 40,
            friction: 7,
            useNativeDriver: true
          }).start(() => {
            Animated.spring(mapScale, {
              toValue: 1,
              tension: 40,
              friction: 7,
              useNativeDriver: true
            }).start();
          });
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
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push(isJob ? `/job/${item.id}` : `/worker/${item.id}`)}
          >
            <Text style={styles.actionButtonText}>
              {isJob ? 'Apply' : 'Contact'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
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

      <Animated.View style={[styles.mapContainer, { transform: [{ scale: mapScale }] }]}>
        <JobListMapView
          jobs={activeTab === 'jobs' ? jobs : []}
          workers={activeTab === 'workers' ? workers : []}
          selectedItem={selectedItem}
          onItemSelect={setSelectedItem}
        />
      </Animated.View>

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
          (activeTab === 'jobs' ? jobs : workers).map((item) => (
            <ItemCard 
              key={item.id} 
              item={item} 
              type={activeTab === 'jobs' ? 'job' : 'worker'} 
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.main,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: 0,
  },
  title: {
    fontSize: theme.typography.size.xxl,
    fontWeight: 'bold',
    color: theme.colors.primary.contrast,
    marginBottom: theme.spacing.md,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary.light,
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.md,
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
  mapContainer: {
    height: 200,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  cardsContainer: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.primary.light,
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
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: '600',
    color: theme.colors.primary.contrast,
    flex: 1,
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
    color: theme.colors.neutral[300],
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
    gap: theme.spacing.xs,
  },
  footerText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[400],
  },
  actionButton: {
    backgroundColor: theme.colors.accent.main,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  actionButtonText: {
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
  loadingText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.size.md,
    color: theme.colors.neutral[400],
  },
}); 