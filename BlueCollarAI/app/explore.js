import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  TouchableOpacity, 
  Dimensions,
  StatusBar,
  Platform,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from './theme';
import { mockApiCall } from '../api/mockData';
import JobListMapView from './_components/JobListMapView';
import Card from './_components/ui/Card';
import Header from './_components/ui/Header';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const { theme, mode, isLoading: isThemeLoading } = useTheme();
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

  const animateTab = (tab) => {
    Animated.timing(slideAnim, {
      toValue: tab === 'jobs' ? 0 : width / 2 - 20,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setActiveTab(tab);
  };

  if (isThemeLoading) {
    return (
      <View style={basicStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  const ItemCard = ({ item, type }) => {
    const isJob = type === 'job';
    const isSelected = selectedItem?.id === item.id;
    const cardStyles = getItemCardStyles(theme);

    return (
      <Card
        style={[
          cardStyles.card,
          isSelected && cardStyles.selectedCard
        ]}
        variant="glass"
        elevation={isSelected ? "lg" : "md"}
        onPress={() => {
          setSelectedItem(item);
          router.push(isJob ? `/job/${item.id}` : `/worker/${item.id}`);
        }}
      >
        <View style={cardStyles.cardHeader}>
          <Text style={cardStyles.cardTitle}>
            {isJob ? item.title : item.name}
          </Text>
          {isJob ? (
            <View style={[cardStyles.badge, { backgroundColor: theme.colors.accent.main }]}>
              <Text style={cardStyles.badgeText}>${item.budget}</Text>
            </View>
          ) : (
            <View style={[cardStyles.badge, { backgroundColor: theme.colors.success.main }]}>
              <Text style={cardStyles.badgeText}>{item.rating} ★</Text>
            </View>
          )}
        </View>

        <Text style={cardStyles.cardDescription} numberOfLines={2}>
          {isJob ? item.description : item.skills.join(', ')}
        </Text>

        <View style={cardStyles.cardFooter}>
          <View style={cardStyles.footerDetail}>
            <MaterialIcons 
              name={isJob ? 'location-on' : 'work'} 
              size={16} 
              color={theme.colors.neutral[600]} 
            />
            <Text style={cardStyles.footerText}>
              {isJob ? item.location : `${item.jobsCompleted} jobs`}
            </Text>
          </View>
        </View>
      </Card>
    );
  };

  const styles = getExploreStyles(theme, mode === 'dark');
  const isDark = mode === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
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
                  color={activeTab === 'jobs' ? theme.colors.primary.main : theme.colors.text.secondary}
                />
                <Text style={[
                  styles.tabText,
                  { color: activeTab === 'jobs' ? theme.colors.primary.main : theme.colors.text.secondary }
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
                  color={activeTab === 'workers' ? theme.colors.primary.main : theme.colors.text.secondary}
                />
                <Text style={[
                  styles.tabText,
                  { color: activeTab === 'workers' ? theme.colors.primary.main : theme.colors.text.secondary }
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

const getItemCardStyles = (theme) => StyleSheet.create({
  card: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  selectedCard: {
    borderColor: theme.colors.primary.main,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.typography.size.md,
    fontWeight: '600',
    color: theme.colors.text.primary,
    flexShrink: 1, 
    marginRight: theme.spacing.sm,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.full,
  },
  badgeText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.primary.contrast,
    fontWeight: '500',
  },
  cardDescription: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.size.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    marginTop: 'auto',
  },
  footerDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  footerText: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
  },
});

const getExploreStyles = (theme, isDark) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background?.primary || theme.colors.neutral[100],
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
    top: Platform.OS === 'ios' ? 100 : 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 90,
  },
  tabsCard: {
    width: width * 0.6,
    maxWidth: 250,
    marginHorizontal: theme.spacing.lg,
    padding: 0,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
    backgroundColor: theme.glass?.light || 'rgba(255, 255, 255, 0.9)',
    ...theme.shadows.md,
  },
  tabContainer: {
    flexDirection: 'row',
    height: 48,
    position: 'relative',
    justifyContent: 'space-between',
  },
  tabIndicator: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    backgroundColor: theme.colors.background?.primary || 'rgba(255, 255, 255, 0.9)', 
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.sm,
    zIndex: 0,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    zIndex: 1,
  },
  tabText: {
    fontSize: theme.typography.size.sm,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingCard: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderRadius: theme.borderRadius.lg,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.size.md,
    color: theme.colors.text.secondary,
  },
});

const basicStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  }
}); 