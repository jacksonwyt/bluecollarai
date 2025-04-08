import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  FlatList, 
  TouchableOpacity, 
  Dimensions, 
  Animated,
  Platform,
  SafeAreaView,
  Image,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';
import { useTheme } from '../../theme/index';
import { mockApiCall } from '../../../api/mockData';
import JobListMapView from '../../_components/JobListMapView';
import Card from '../../_components/ui/Card';
import Button from '../../_components/ui/Button';

const { width } = Dimensions.get('window');

export default function ClientDashboard() {
  const theme = useTheme();
  const [activeJobs, setActiveJobs] = useState([]);
  const [nearbyWorkers, setNearbyWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMapItem, setSelectedMapItem] = useState(null);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;
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
      <QuickActionTouchable 
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <MaterialIcons name={icon} size={28} color={theme.colors.primary.main} />
        <QuickActionLabel>{label}</QuickActionLabel>
      </QuickActionTouchable>
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
      <JobCardContainer style={{
        opacity: itemFade,
        transform: [{ translateY: itemFade.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0]
        })}]
      }}>
        <StyledJobCard variant="elevated">
          <CardTouchable 
            onPress={() => router.push(`/job/${job.id}`)}
            activeOpacity={0.7}
          >
            <JobHeader>
              <JobTitle>{job.title}</JobTitle>
              <StatusBadge backgroundColor={statusColor.main}>
                <StatusText>{job.status}</StatusText>
              </StatusBadge>
            </JobHeader>
            <JobDetails>
              <DetailRow>
                <MaterialIcons name="person" size={16} color={theme.colors.neutral[600]} />
                <DetailText>{job.worker || 'No worker assigned'}</DetailText>
              </DetailRow>
              <DetailRow>
                <MaterialIcons name="attach-money" size={16} color={theme.colors.neutral[600]} />
                <DetailText>{job.budget}</DetailText>
              </DetailRow>
            </JobDetails>
          </CardTouchable>
        </StyledJobCard>
      </JobCardContainer>
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
      <WorkerCardContainer style={{
        opacity: itemFade,
        transform: [{ translateY: itemFade.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0]
        })}]
      }}>
        <StyledWorkerCard variant={index % 2 === 0 ? "elevated" : "glass"}>
          <CardTouchable 
            onPress={() => router.push(`/worker/${worker.id}`)}
            activeOpacity={0.7}
          >
            <WorkerHeader>
              {worker.profilePicture ? (
                <WorkerImageContainer>
                  <WorkerImageBorder>
                    <WorkerImage 
                      source={{ uri: worker.profilePicture }} 
                    />
                  </WorkerImageBorder>
                </WorkerImageContainer>
              ) : (
                <WorkerAvatarContainer>
                  <MaterialIcons name="account-circle" size={48} color={theme.colors.primary.main} />
                </WorkerAvatarContainer>
              )}
              <WorkerInfo>
                <WorkerName>{worker.name}</WorkerName>
                <WorkerSkills>{worker.skills.join(', ')}</WorkerSkills>
              </WorkerInfo>
            </WorkerHeader>
            <WorkerStats>
              <StatItem>
                <MaterialIcons name="star" size={16} color={theme.colors.warning.main} />
                <StatText>{worker.rating}</StatText>
              </StatItem>
              <StatItem>
                <MaterialIcons name="work" size={16} color={theme.colors.neutral[600]} />
                <StatText>{worker.jobsCompleted} jobs</StatText>
              </StatItem>
            </WorkerStats>
          </CardTouchable>
        </StyledWorkerCard>
      </WorkerCardContainer>
    );
  };

  const renderSection = ({ item: section, index }) => {
    switch (section.type) {
      case 'quickActions':
        return (
          <QuickActionsContainer style={{
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }]
          }}>
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
          </QuickActionsContainer>
        );
      case 'map':
        return (
          <MapSectionView style={{
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }]
          }}>
            <SectionHeader>
              <SectionTitle>Activity Map</SectionTitle>
              <Button 
                variant="ghost"
                icon="explore"
                size="sm"
                onPress={() => router.push('/explore')}
              >
                Explore
              </Button>
            </SectionHeader>
            <MapCard variant="glass">
              <MapContainer>
                <JobListMapView
                  jobs={activeJobs}
                  workers={nearbyWorkers}
                  selectedItem={selectedMapItem}
                  onItemSelect={setSelectedMapItem}
                />
              </MapContainer>
            </MapCard>
          </MapSectionView>
        );
      case 'activeJobs':
        return (
          <SectionView style={{
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }]
          }}>
            <SectionHeader>
              <SectionTitle>Active Jobs</SectionTitle>
              <Button 
                variant="ghost"
                icon="arrow-forward"
                size="sm"
                onPress={() => router.push('/my-jobs')}
              >
                See All
              </Button>
            </SectionHeader>
            <StyledFlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={activeJobs}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => <JobCard job={item} index={index} />}
              ListEmptyComponent={() => <EmptyListText>No active jobs.</EmptyListText>}
              theme={theme}
            />
          </SectionView>
        );
      case 'nearbyWorkers':
        return (
          <SectionView style={{
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }]
          }}>
            <SectionHeader>
              <SectionTitle>Available Workers Nearby</SectionTitle>
              <Button 
                variant="ghost"
                icon="arrow-forward"
                size="sm"
                onPress={() => router.push('/find-workers')}
              >
                See All
              </Button>
            </SectionHeader>
            <StyledFlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={nearbyWorkers}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => <WorkerCard worker={item} index={index} />}
              ListEmptyComponent={() => <EmptyListText>No nearby workers.</EmptyListText>}
              theme={theme}
            />
          </SectionView>
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

  const StyledSafeAreaView = styled(SafeAreaView)`
    flex: 1;
    background-color: ${theme.colors.background.secondary};
  `;

  const StyledHeaderView = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom-width: 1px;
    border-bottom-color: ${theme.colors.divider};
    background-color: ${theme.colors.background.primary};
  `;

  const HeaderButton = styled.TouchableOpacity`
    padding: 8px;
  `;

  const HeaderTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: ${theme.colors.primary.main};
    flex: 1;
    text-align: center;
  `;

  const LoadingContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${theme.colors.background.secondary};
  `;

  const ListContentContainer = styled.View`
    padding-bottom: ${(props) => props.theme.spacing.xxxl}px;
  `;

  const WelcomeText = styled.Text`
    font-size: ${theme.typography.size.xxxl}px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.xs}px;
    padding: ${theme.spacing.md}px ${theme.spacing.lg}px 0;
  `;

  const DashboardSubtitle = styled.Text`
    font-size: ${theme.typography.size.lg}px;
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing.xl}px;
    padding: 0 ${theme.spacing.lg}px;
  `;

  const QuickActionsContainer = styled(Animated.View)`
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin: 0 ${theme.spacing.lg}px ${theme.spacing.xl}px;
    background-color: ${theme.colors.background.primary};
    padding: ${theme.spacing.lg}px 0;
    border-radius: ${theme.borderRadius.lg}px;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    elevation: 3;
  `;

  const QuickActionTouchable = styled.TouchableOpacity`
    align-items: center;
    padding: ${theme.spacing.sm}px;
  `;

  const QuickActionLabel = styled.Text`
    margin-top: ${theme.spacing.xs}px;
    font-size: ${theme.typography.size.sm}px;
    color: ${theme.colors.primary.main};
    font-weight: 500;
  `;

  const SectionView = styled(Animated.View)`
    margin-bottom: ${theme.spacing.xl}px;
  `;

  const SectionHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 ${theme.spacing.lg}px;
    margin-bottom: ${theme.spacing.md}px;
    margin-top: ${theme.spacing.lg}px;
  `;

  const SectionTitle = styled.Text`
    font-size: ${theme.typography.size.lg}px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
  `;

  const MapSectionView = styled(SectionView)`
  `;

  const MapCard = styled(Card)`
    margin: 0 ${theme.spacing.lg}px;
  `;

  const MapContainer = styled.View`
    height: 180px;
    border-radius: ${theme.borderRadius.lg}px;
    overflow: hidden;
  `;

  const MapCalloutView = styled.View`
    position: absolute;
    bottom: ${theme.spacing.lg}px;
    left: ${theme.spacing.lg}px;
    right: ${theme.spacing.lg}px;
    background-color: ${theme.colors.background.primary};
    padding: ${theme.spacing.md}px;
    border-radius: ${theme.borderRadius.md}px;
    shadow-color: #000;
    shadow-offset: 0px 4px;
    shadow-opacity: 0.15;
    shadow-radius: 6px;
    elevation: 5;
  `;

  const CalloutTitle = styled.Text`
    font-size: ${theme.typography.size.lg}px;
    font-weight: 600;
    margin-bottom: ${theme.spacing.xs}px;
    color: ${theme.colors.text.primary};
  `;

  const CalloutDescription = styled.Text`
    font-size: ${theme.typography.size.sm}px;
    color: ${theme.colors.text.secondary};
  `;

  const StyledFlatList = styled(FlatList).attrs(props => ({
    contentContainerStyle: {
      paddingHorizontal: props.horizontal ? theme.spacing.lg : 0,
      paddingBottom: theme.spacing.md,
    }
  }))``;

  const JobCardContainer = styled(Animated.View)`
    width: ${width * 0.7}px;
    margin-right: ${theme.spacing.md}px;
  `;

  const StyledJobCard = styled(Card)`
    padding: 0;
  `;

  const CardTouchable = styled.TouchableOpacity`
    flex: 1;
    padding: ${theme.spacing.md}px;
  `;

  const JobHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacing.sm}px;
  `;

  const JobTitle = styled.Text`
    font-size: ${theme.typography.size.md}px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
    flex: 1;
    margin-right: ${theme.spacing.sm}px;
  `;

  const StatusBadge = styled.View`
    padding: ${theme.spacing.xxs}px ${theme.spacing.sm}px;
    border-radius: ${theme.borderRadius.full}px;
    background-color: ${(props) => props.backgroundColor || theme.colors.neutral.main};
  `;

  const StatusText = styled.Text`
    font-size: ${theme.typography.size.xs}px;
    color: ${theme.colors.primary.contrast};
    font-weight: 500;
  `;

  const JobDetails = styled.View`
    margin-top: ${theme.spacing.xs}px;
  `;

  const DetailRow = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: ${theme.spacing.xs}px;
  `;

  const DetailText = styled.Text`
    font-size: ${theme.typography.size.sm}px;
    color: ${theme.colors.text.secondary};
    margin-left: ${theme.spacing.xs}px;
  `;

  const WorkerCardContainer = styled(Animated.View)`
    width: ${width * 0.65}px;
    margin-right: ${theme.spacing.md}px;
  `;

  const StyledWorkerCard = styled(Card)`
    padding: 0;
  `;

  const WorkerHeader = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: ${theme.spacing.sm}px;
  `;

  const WorkerImageContainer = styled.View`
    margin-right: ${theme.spacing.md}px;
  `;

  const WorkerImageBorder = styled.View`
    width: 52px;
    height: 52px;
    border-radius: ${theme.borderRadius.full}px;
    padding: 2px;
    background-color: ${theme.colors.primary.light};
    align-items: center;
    justify-content: center;
  `;

  const WorkerImage = styled.Image`
    width: 48px;
    height: 48px;
    border-radius: ${theme.borderRadius.full}px;
  `;

  const WorkerAvatarContainer = styled.View`
    margin-right: ${theme.spacing.md}px;
    width: 52px;
    height: 52px;
    border-radius: ${theme.borderRadius.full}px;
    align-items: center;
    justify-content: center;
    background-color: ${theme.colors.primary.surface};
  `;

  const WorkerInfo = styled.View`
    flex: 1;
  `;

  const WorkerName = styled.Text`
    font-size: ${theme.typography.size.md}px;
    font-weight: bold;
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing.xxs}px;
  `;

  const WorkerSkills = styled.Text`
    font-size: ${theme.typography.size.xs}px;
    color: ${theme.colors.text.secondary};
  `;

  const WorkerStats = styled.View`
    flex-direction: row;
    margin-top: ${theme.spacing.sm}px;
    border-top-width: 1px;
    border-top-color: ${theme.colors.divider};
    padding-top: ${theme.spacing.sm}px;
  `;

  const StatItem = styled.View`
    flex-direction: row;
    align-items: center;
    margin-right: ${theme.spacing.md}px;
  `;

  const StatText = styled.Text`
    font-size: ${theme.typography.size.sm}px;
    color: ${theme.colors.text.secondary};
    margin-left: ${theme.spacing.xxs}px;
  `;

  const EmptyListText = styled.Text`
    text-align: center;
    margin-top: ${theme.spacing.xl}px;
    color: ${theme.colors.text.tertiary};
    font-size: ${theme.typography.size.md}px;
    padding: 0 ${theme.spacing.lg}px;
  `;

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

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </LoadingContainer>
    );
  }

  return (
    <StyledSafeAreaView>
      <StyledHeaderView>
        <HeaderButton 
          onPress={() => router.canGoBack() ? router.back() : null}
        >
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary.main} />
        </HeaderButton>
        <HeaderTitle>Dashboard</HeaderTitle>
        <HeaderButton>
          <MaterialIcons name="notifications" size={24} color={theme.colors.primary.main} />
        </HeaderButton>
      </StyledHeaderView>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderSection}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
            <Animated.View style={{
                opacity: fadeAnim,
                transform: [{ translateY: translateYAnim }]
            }}>
                <WelcomeText>Welcome Back!</WelcomeText>
                <DashboardSubtitle>Here's what's happening today.</DashboardSubtitle>
            </Animated.View>
        }
        ListFooterComponent={<View style={{ height: theme.spacing.xxxl }} />}
      />
    </StyledSafeAreaView>
  );
}
