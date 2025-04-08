import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from './theme';

export default function HomeScreen() {
  // Animation values
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const RoleCard = ({ title, description, icon, route, color }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: color }]}
      onPress={() => router.push(route)}
      activeOpacity={0.9}
    >
      <MaterialIcons name={icon} size={40} color={theme.colors.primary.contrast} />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
      <View style={styles.arrowContainer}>
        <MaterialIcons 
          name="arrow-forward" 
          size={24} 
          color={theme.colors.primary.contrast} 
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>BlueCollar.ai</Text>
          <Text style={styles.subtitle}>Connect. Work. Succeed.</Text>
        </View>

        <View style={styles.cardsContainer}>
          <RoleCard
            title="Find Work"
            description="Browse and apply for jobs that match your skills"
            icon="work"
            route="/(worker)"
            color={theme.colors.accent.main}
          />

          <RoleCard
            title="Hire Talent"
            description="Post jobs and find skilled workers near you"
            icon="search"
            route="/(client)"
            color={theme.colors.success.main}
          />
        </View>

        <TouchableOpacity 
          style={styles.exploreButton}
          onPress={() => router.push('/explore')}
        >
          <Text style={styles.exploreButtonText}>Explore Jobs</Text>
          <MaterialIcons 
            name="explore" 
            size={24} 
            color={theme.colors.primary.contrast} 
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.main,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.primary.contrast,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.size.lg,
    color: theme.colors.neutral[300],
  },
  cardsContainer: {
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  card: {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.lg,
  },
  cardTitle: {
    fontSize: theme.typography.size.xl,
    fontWeight: 'bold',
    color: theme.colors.primary.contrast,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: theme.typography.size.md,
    color: theme.colors.primary.contrast,
    opacity: 0.9,
  },
  arrowContainer: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.accent.dark,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.sm,
  },
  exploreButtonText: {
    fontSize: theme.typography.size.lg,
    fontWeight: '600',
    color: theme.colors.primary.contrast,
  },
});
