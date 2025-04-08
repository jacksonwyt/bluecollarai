import { View, Animated, PanResponder, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../../theme';

// Import LinearGradient with try/catch to handle potential issues
let LinearGradient;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (error) {
  console.warn('expo-linear-gradient is not available:', error);
}

const { height } = Dimensions.get('window');
const MINIMUM_HEIGHT = theme.layout.bottomSheetHandleHeight;
const MAXIMUM_HEIGHT = height * 0.9;

const BottomSheet = ({ 
  children, 
  isOpen, 
  onClose, 
  snapPoints = ['25%', '50%', '90%'],
  initialSnapPoint = '25%',
  title = '',
  showHeader = false,
  closeButton = true,
  gradient = false,
  blurBackground = true,
  onSnapChange
}) => {
  const [currentSnapPoint, setCurrentSnapPoint] = useState(initialSnapPoint);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);
  const velocityY = useRef(0);
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Convert snap points to pixel values
  const snapPointsPixels = snapPoints.map(point => {
    const percentage = parseInt(point) / 100;
    return height * percentage;
  });

  const calculateSnapPoint = (gestureDistance, velocity = 0) => {
    const currentHeight = MAXIMUM_HEIGHT - gestureDistance;
    
    // If velocity is high enough, snap to next/previous point
    if (Math.abs(velocity) > 0.5) {
      const currentIndex = snapPointsPixels.findIndex(point => 
        Math.abs(point - currentHeight) < 50
      );
      
      if (velocity > 0 && currentIndex > 0) {
        // Swiping down
        return snapPointsPixels[currentIndex - 1];
      } else if (velocity < 0 && currentIndex < snapPointsPixels.length - 1) {
        // Swiping up
        return snapPointsPixels[currentIndex + 1];
      }
    }
    
    // Otherwise snap to closest point
    return snapPointsPixels.reduce((prev, curr) => {
      return Math.abs(curr - currentHeight) < Math.abs(prev - currentHeight) ? curr : prev;
    });
  };

  useEffect(() => {
    if (isOpen) {
      const initialHeight = snapPointsPixels.find(point => 
        point === (height * parseInt(initialSnapPoint) / 100)
      );
      
      Animated.parallel([
        Animated.spring(animatedValue, {
          toValue: MAXIMUM_HEIGHT - initialHeight,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(animatedValue, {
          toValue: MAXIMUM_HEIGHT,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isOpen]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        lastGestureDy.current = animatedValue._value;
        Haptics.selectionAsync();
      },
      onPanResponderMove: (_, { dy, vy }) => {
        velocityY.current = vy;
        const newValue = lastGestureDy.current + dy;
        if (newValue >= 0 && newValue <= MAXIMUM_HEIGHT) {
          animatedValue.setValue(newValue);
          
          // Update backdrop opacity based on sheet position
          const currHeight = MAXIMUM_HEIGHT - newValue;
          const maxHeight = snapPointsPixels[snapPointsPixels.length - 1];
          const opacity = Math.min(0.5, (currHeight / maxHeight) * 0.5);
          backdropOpacity.setValue(opacity);
        }
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        const snapPoint = calculateSnapPoint(lastGestureDy.current + dy, vy);
        const snapPercentage = Math.round((snapPoint / height) * 100) + '%';
        
        // Only update and trigger callback if the snap point changed
        if (snapPercentage !== currentSnapPoint) {
          setCurrentSnapPoint(snapPercentage);
          onSnapChange?.(snapPercentage);
        }
        
        if (snapPoint === snapPointsPixels[snapPointsPixels.length - 1]) {
          // Fully expanded
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (snapPoint === 0 || snapPoint < snapPointsPixels[0] / 2) {
          // Close if dragged below the minimum snap point
          onClose();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } else {
          // Intermediate snap point
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        
        Animated.spring(animatedValue, {
          toValue: MAXIMUM_HEIGHT - snapPoint,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
        
        // Update backdrop opacity
        const opacity = Math.min(0.5, (snapPoint / MAXIMUM_HEIGHT) * 0.5);
        Animated.timing(backdropOpacity, {
          toValue: opacity,
          duration: 200,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const translateY = animatedValue.interpolate({
    inputRange: [0, MAXIMUM_HEIGHT],
    outputRange: [0, MAXIMUM_HEIGHT],
  });

  const borderRadius = animatedValue.interpolate({
    inputRange: [0, MAXIMUM_HEIGHT],
    outputRange: [theme.borderRadius.xl, 0],
  });

  // Replace animated width with scale transform
  const handleIndicatorScale = animatedValue.interpolate({
    inputRange: [0, MAXIMUM_HEIGHT / 2, MAXIMUM_HEIGHT],
    outputRange: [1, 0.75, 0.5],
  });

  return (
    <>
      <Animated.View 
        style={[
          styles.overlay,
          { opacity: backdropOpacity }
        ]}
        pointerEvents={isOpen ? 'auto' : 'none'}
      >
        <TouchableOpacity 
          style={StyleSheet.absoluteFill} 
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }],
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
          }
        ]}
      >
        <View 
          style={styles.content}
          {...panResponder.panHandlers}
        >
          {blurBackground ? (
            <BlurView intensity={90} style={styles.blurContainer}>
              {gradient && LinearGradient && (
                <LinearGradient
                  colors={theme.colors.primary.gradient}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={[StyleSheet.absoluteFill, { opacity: 0.03 }]}
                />
              )}
              <View style={styles.handleContainer}>
                <Animated.View 
                  style={[
                    styles.handle, 
                    { 
                      transform: [{ scaleX: handleIndicatorScale }]
                    }
                  ]} 
                />
              </View>
              
              {showHeader && (
                <View style={styles.header}>
                  <Text style={styles.title}>{title}</Text>
                  {closeButton && (
                    <TouchableOpacity 
                      onPress={onClose}
                      style={styles.closeButton}
                      hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                    >
                      <MaterialIcons 
                        name="close" 
                        size={24} 
                        color={theme.colors.neutral[600]} 
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              
              <View style={styles.childrenContainer}>
                {children}
              </View>
            </BlurView>
          ) : (
            <View style={styles.container}>
              {gradient && LinearGradient && (
                <LinearGradient
                  colors={theme.colors.primary.gradient}
                  start={{ x: 0, y: 1 }}
                  end={{ x: 1, y: 0 }}
                  style={[StyleSheet.absoluteFill, { opacity: 0.03 }]}
                />
              )}
              <View style={styles.handleContainer}>
                <Animated.View 
                  style={[
                    styles.handle, 
                    { 
                      transform: [{ scaleX: handleIndicatorScale }]
                    }
                  ]} 
                />
              </View>
              
              {showHeader && (
                <View style={styles.header}>
                  <Text style={styles.title}>{title}</Text>
                  {closeButton && (
                    <TouchableOpacity 
                      onPress={onClose}
                      style={styles.closeButton}
                      hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}
                    >
                      <MaterialIcons 
                        name="close" 
                        size={24} 
                        color={theme.colors.neutral[600]} 
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              
              <View style={styles.childrenContainer}>
                {children}
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.neutral[900],
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: MAXIMUM_HEIGHT,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
    backgroundColor: theme.colors.neutral[100],
  },
  handleContainer: {
    width: '100%',
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 40, // Set a fixed width here
    height: 4,
    backgroundColor: theme.colors.neutral[400],
    borderRadius: theme.borderRadius.full,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.size.lg,
    fontWeight: '600',
    color: theme.colors.neutral[900],
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.neutral[200],
  },
  childrenContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  }
});

export default BottomSheet;
