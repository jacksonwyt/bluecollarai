import { View, Text, Animated, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useState, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../theme';
import JobMap from './JobMap';
import Card from './ui/Card.js';

const { height } = Dimensions.get('window');
const BOTTOM_SHEET_MIN_HEIGHT = 100;
const BOTTOM_SHEET_MAX_HEIGHT = height * 0.8;

export const JobListItem = ({ job }) => (
  <Card style={styles.jobCard}>
    <View style={styles.jobHeader}>
      <View>
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.jobLocation}>{job.location}</Text>
      </View>
      <Text style={styles.jobBudget}>${job.budget}</Text>
    </View>
    
    <View style={styles.jobDetails}>
      <View style={styles.jobDetail}>
        <MaterialIcons name="category" size={16} color={theme.colors.neutral[600]} />
        <Text style={styles.jobDetailText}>{job.category}</Text>
      </View>
      
      <View style={styles.jobDetail}>
        <MaterialIcons name="schedule" size={16} color={theme.colors.neutral[600]} />
        <Text style={styles.jobDetailText}>{job.duration}</Text>
      </View>
      
      <View style={styles.jobDetail}>
        <MaterialIcons name="location-on" size={16} color={theme.colors.neutral[600]} />
        <Text style={styles.jobDetailText}>{job.distance} miles away</Text>
      </View>
    </View>
  </Card>
);

const JobListMapView = ({ jobs }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedValue = useRef(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)).current;

  const toggleBottomSheet = () => {
    const toValue = isExpanded ? BOTTOM_SHEET_MIN_HEIGHT : BOTTOM_SHEET_MAX_HEIGHT;
    
    Animated.spring(animatedValue, {
      toValue,
      tension: 50,
      friction: 7,
      useNativeDriver: false,
    }).start();
    
    setIsExpanded(!isExpanded);
  };

  const bottomSheetStyle = {
    height: animatedValue,
  };

  return (
    <View style={styles.container}>
      <JobMap jobs={jobs} />
      
      <Animated.View style={[styles.bottomSheet, bottomSheetStyle]}>
        <Card variant="glass" style={styles.bottomSheetContent}>
          <View style={styles.handle} />
          
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={toggleBottomSheet}
          >
            <MaterialIcons
              name={isExpanded ? 'keyboard-arrow-down' : 'keyboard-arrow-up'}
              size={24}
              color={theme.colors.neutral[600]}
            />
          </TouchableOpacity>

          <Animated.FlatList
            data={jobs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <JobListItem job={item} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </Card>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  bottomSheetContent: {
    flex: 1,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: 0,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.neutral[300],
    borderRadius: theme.borderRadius.full,
    alignSelf: 'center',
    marginTop: theme.spacing.sm,
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  jobCard: {
    marginBottom: theme.spacing.sm,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  jobTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: '600',
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing.xs,
  },
  jobLocation: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[600],
  },
  jobBudget: {
    fontSize: theme.typography.size.lg,
    fontWeight: '600',
    color: theme.colors.success.main,
  },
  jobDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  jobDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobDetailText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[600],
  },
});

export default JobListMapView;
