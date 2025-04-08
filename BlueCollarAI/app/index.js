import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from './theme';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Card from './_components/ui/Card';

export default function HomeScreen() {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 30,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Start continuous floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const RoleCard = ({ title, description, icon, route, color, delay = 0 }) => {
    const cardAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 800,
        delay,
        useNativeDriver: true,
      }).start();
    }, []);
    
    return (
      <Animated.View
        style={{
          opacity: cardAnim,
          transform: [
            { 
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              }) 
            }
          ]
        }}
      >
        <Card
          style={[styles.card, { backgroundColor: color }]}
          onPress={() => router.push(route)}
          elevation="lg"
          floating={true}
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
        </Card>
      </Animated.View>
    );
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
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
          <Animated.View 
            style={[
              styles.header,
              {
                transform: [{
                  translateY: floatingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -15]
                  })
                }]
              }
            ]}
          >
            <Text style={styles.title}>BlueCollar.ai</Text>
            <Text style={styles.subtitle}>Connect. Work. Succeed.</Text>
          </Animated.View>

          <View style={styles.cardsContainer}>
            <RoleCard
              title="Find Work"
              description="Browse and apply for jobs that match your skills"
              icon="work"
              route="/(worker)"
              color={theme.colors.accent.main}
              delay={200}
            />

            <RoleCard
              title="Hire Talent"
              description="Post jobs and find skilled workers near you"
              icon="search"
              route="/(client)"
              color={theme.colors.success.main}
              delay={400}
            />
          </View>

          <Card
            style={styles.exploreButton}
            variant="glass"
            onPress={() => router.push('/explore')}
            floating={true}
            elevation="md"
          >
            <View style={styles.exploreButtonContent}>
              <Text style={styles.exploreButtonText}>Explore Jobs</Text>
              <MaterialIcons 
                name="explore" 
                size={24} 
                color={theme.colors.primary.main} 
              />
            </View>
          </Card>

          <View style={styles.authContainer}>
            <TouchableOpacity 
              style={styles.authButton} 
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.authButtonText}>Login</Text>
            </TouchableOpacity>
            <Text style={styles.authDivider}>or</Text>
            <TouchableOpacity 
              style={styles.authButton} 
              onPress={() => router.push('/auth/signup')}
            >
              <Text style={styles.authButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </SafeAreaProvider>
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
    fontSize: 42,
    fontWeight: 'bold',
    color: theme.colors.primary.contrast,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.size.lg,
    color: theme.colors.neutral[300],
  },
  cardsContainer: {
    gap: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
  },
  card: {
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    margin: 0,
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.borderRadius.full,
    padding: 0,
    margin: 0,
    alignSelf: 'center',
  },
  exploreButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  exploreButtonText: {
    fontSize: theme.typography.size.lg,
    fontWeight: '600',
    color: theme.colors.primary.main,
  },
  authContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  authButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  authButtonText: {
    fontSize: theme.typography.size.md,
    fontWeight: '600',
    color: theme.colors.neutral[300],
  },
  authDivider: {
    color: theme.colors.neutral[300],
    marginHorizontal: theme.spacing.sm,
  },
});