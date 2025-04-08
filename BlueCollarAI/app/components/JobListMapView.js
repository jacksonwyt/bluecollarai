import { View, Text, Animated, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import JobMap from './JobMap';
import Card from './ui/Card.js';

const { height, width } = Dimensions.get('window');
const BOTTOM_SHEET_MIN_HEIGHT = 80;
const BOTTOM_SHEET_MAX_HEIGHT = height * 0.6;

export const JobListItem = ({ job, isSelected, onPress }) => {
  const theme = useTheme();
  const styles = createJobListItemStyles(theme);

  return (
    <Card 
      style={[styles.jobCard, isSelected && styles.selectedJobCard]} 
      onPress={onPress}
      variant="glass"
      noPadding={false}
      floating={false}
    >
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
          <Text style={styles.jobDetailText}>{job.duration || 'Flexible'}</Text>
        </View>
        
        <View style={styles.jobDetail}>
          <MaterialIcons name="location-on" size={16} color={theme.colors.neutral[600]} />
          <Text style={styles.jobDetailText}>{job.distance} miles away</Text>
        </View>
      </View>
    </Card>
  );
};

const JobListMapView = ({ jobs, selectedJob, onJobSelect }) => {
  const theme = useTheme();
  const styles = createJobListMapViewStyles(theme);

  const [isExpanded, setIsExpanded] = useState(false);
  const animatedValue = useRef(new Animated.Value(BOTTOM_SHEET_MIN_HEIGHT)).current;
  
  const handleJobSelect = (job) => {
    onJobSelect?.(job);
  };

  const toggleBottomSheet = () => {
    const toValue = isExpanded ? BOTTOM_SHEET_MIN_HEIGHT : BOTTOM_SHEET_MAX_HEIGHT;
    
    Animated.timing(animatedValue, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    setIsExpanded(!isExpanded);
  };
  
  useEffect(() => {
    if (selectedJob && isExpanded) {
      // If a job is selected from the map, collapse the sheet
      // toggleBottomSheet(); // Commenting this out as it might be unintended auto-collapse
    }
  }, [selectedJob]);

  return (
    <View style={styles.container}>
      <JobMap 
        jobs={jobs} 
        selectedJobId={selectedJob?.id}
        onMarkerPress={handleJobSelect}
      />
      
      <Animated.View style={[styles.bottomSheet, { height: animatedValue }]}>
        <Card variant="glass" style={styles.bottomSheetContent} floating={false}>
          <View style={styles.handle} />
          
          <TouchableOpacity 
            style={styles.toggleButton}
            onPress={toggleBottomSheet}
            activeOpacity={0.7}
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
              <JobListItem 
                job={item}
                isSelected={selectedJob?.id === item.id}
                onPress={() => handleJobSelect(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            decelerationRate="normal"
            removeClippedSubviews={true}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
          />
        </Card>
      </Animated.View>
      
      {selectedJob && (
        <View style={styles.floatingDetail}>
          <Card 
            variant="glass" 
            style={styles.floatingCard}
            floating={false}
          >
            <View style={styles.floatingCardHeader}>
              <Text style={styles.floatingCardTitle}>{selectedJob.title}</Text>
              <Text style={styles.floatingCardBudget}>${selectedJob.budget}</Text>
            </View>
            <Text style={styles.floatingCardLocation}>{selectedJob.location}</Text>
          </Card>
        </View>
      )}
    </View>
  );
};

const createJobListItemStyles = (theme) => StyleSheet.create({
  jobCard: {
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: theme.spacing.md,
  },
  selectedJobCard: {
    borderColor: theme.colors.primary.main,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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

const createJobListMapViewStyles = (theme) => StyleSheet.create({
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
    overflow: 'hidden',
    borderWidth: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
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
    paddingBottom: theme.spacing.xl * 2,
  },
  floatingDetail: {
    position: 'absolute',
    top: theme.spacing.lg,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    zIndex: 10,
  },
  floatingCard: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    ...theme.shadows.lg,
  },
  floatingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  floatingCardTitle: {
    fontSize: theme.typography.size.lg,
    fontWeight: '700',
    color: theme.colors.neutral[900],
    flex: 1,
  },
  floatingCardBudget: {
    fontSize: theme.typography.size.lg,
    fontWeight: '700',
    color: theme.colors.success.main,
  },
  floatingCardLocation: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[600],
  },
});

export default JobListMapView;
