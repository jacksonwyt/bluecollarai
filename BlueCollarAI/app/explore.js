import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { theme } from './theme';
import { mockApiCall } from '../api/mockData';
import JobListMapView from './components/JobListMapView';
import Card from './components/ui/Card';
import Header from './components/ui/Header';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const slideAnim = React.useRef(new Animated.Value(0)).current;

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

  // Simple tab animation without complexity
  const animateTab = (tab) => {
    Animated.timing(slideAnim, {
      toValue: tab === 'jobs' ? 0 : width / 2 - 20,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setActiveTab(tab);
  };

  const ItemCard = ({ item, type }) => {
    const isJob = type === 'job';
    const isSelected = selectedItem?.id === item.id;

    return (
      <Card
        style={[
          styles.card,
          isSelected && styles.selectedCard
        ]}
        variant="glass"
        elevation={isSelected ? "lg" : "md"}
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

        <Text style={styles.cardDescription} numberOfLines={2}>
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
      </Card>
    );
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Header
          title="Explore"
          leftIcon="arrow-back"
          onLeftPress={() => router.push('/')}
          variant="glass"
          minimal={true}
          floating={false}
          hideSubtitle={true}
        />
        
        <View style={styles.mapWrapper}>
          <JobListMapView
            jobs={activeTab === 'jobs' ? jobs : []}
            workers={activeTab === 'workers' ? workers : []}
            selectedJob={selectedItem}
            onJobSelect={setSelectedItem}
          />
        </View>
        
        {/* Simplified tab container with stable animation */}
        <View style={styles.tabsFloatingContainer}>
          <Card 
            style={styles.tabsCard}
            variant="glass"
            elevation="md"
            floating={false}
          >
            <View style={styles.tabContainer}>
              <Animated.View 
                style={[
                  styles.tabIndicator,
                  { transform: [{ translateX: slideAnim }] }
                ]}
                pointerEvents="none" 
              />
              <TouchableOpacity 
                style={styles.tab} 
                onPress={() => animateTab('jobs')}
                activeOpacity={0.7}
              >
                <MaterialIcons 
                  name="work" 
                  size={24} 
                  color={activeTab === 'jobs' ? theme.colors.primary.main : theme.colors.neutral[400]} 
                />
                <Text style={[
                  styles.tabText,
                  { color: activeTab === 'jobs' ? theme.colors.primary.main : theme.colors.neutral[400] }
                ]}>
                  Jobs
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.tab} 
                onPress={() => animateTab('workers')}
                activeOpacity={0.7}
              >
                <MaterialIcons 
                  name="people" 
                  size={24} 
                  color={activeTab === 'workers' ? theme.colors.primary.main : theme.colors.neutral[400]} 
                />
                <Text style={[
                  styles.tabText,
                  { color: activeTab === 'workers' ? theme.colors.primary.main : theme.colors.neutral[400] }
                ]}>
                  Workers
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <Card variant="glass" style={styles.loadingCard} floating={false}>
              <MaterialIcons name="hourglass-empty" size={48} color={theme.colors.neutral[400]} />
              <Text style={styles.loadingText}>Loading...</Text>
            </Card>
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[100],
  },
  mapWrapper: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tabsFloatingContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 140 : 110,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 90,
  },
  tabsCard: {
    width: width - 48,
    margin: 0,
    marginHorizontal: 24,
    padding: 0,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  tabContainer: {
    flexDirection: 'row',
    height: 56,
    position: 'relative',
    justifyContent: 'space-between',
  },
  tabIndicator: {
    position: 'absolute',
    width: (width - 48) / 2,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
    zIndex: 0,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    zIndex: 2,
    height: '100%',
  },
  tabText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.size.md,
    fontWeight: '600',
  },
  card: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    padding: theme.spacing.md,
  },
  selectedCard: {
    borderColor: theme.colors.primary.main,
    borderWidth: 1,
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
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  badgeText: {
    color: theme.colors.neutral[100],
    fontSize: theme.typography.size.sm,
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[700],
    marginBottom: theme.spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  loadingCard: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.size.lg,
    color: theme.colors.neutral[700],
  },
}); 