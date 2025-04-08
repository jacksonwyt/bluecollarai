import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRef, useEffect } from 'react';
import theme from '../theme';

export default function JobMapCallout({ job }) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>{job.title}</Text>
        <Text style={styles.budget}>${job.budget}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <MaterialIcons name="category" size={16} color={theme.colors.neutral[600]} />
          <Text style={styles.detailText}>{job.category}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons name="schedule" size={16} color={theme.colors.neutral[600]} />
          <Text style={styles.detailText}>{job.duration || 'Flexible'}</Text>
        </View>

        <View style={styles.detailRow}>
          <MaterialIcons name="location-on" size={16} color={theme.colors.neutral[600]} />
          <Text style={styles.detailText}>{job.distance} miles away</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.description} numberOfLines={2}>
          {job.description}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: theme.typography.size.lg,
    fontWeight: '600',
    color: theme.colors.neutral[900],
    marginRight: theme.spacing.sm,
  },
  budget: {
    fontSize: theme.typography.size.md,
    fontWeight: '600',
    color: theme.colors.success.main,
  },
  details: {
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  detailText: {
    marginLeft: theme.spacing.xs,
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[600],
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.neutral[200],
    paddingTop: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.size.sm,
    color: theme.colors.neutral[700],
    lineHeight: theme.typography.lineHeight.normal,
  },
});
