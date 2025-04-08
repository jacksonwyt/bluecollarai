import { View, Animated, PanResponder, StyleSheet, Dimensions } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import theme from '../../theme';

const { height } = Dimensions.get('window');
const MINIMUM_HEIGHT = theme.layout.bottomSheetHandleHeight;
const MAXIMUM_HEIGHT = height * 0.9;

const BottomSheet = ({ 
  children, 
  isOpen, 
  onClose, 
  snapPoints = ['25%', '50%', '90%'],
  initialSnapPoint = '25%'
}) => {
  const [currentSnapPoint, setCurrentSnapPoint] = useState(initialSnapPoint);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const lastGestureDy = useRef(0);
  const velocityY = useRef(0);

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
      
      Animated.spring(animatedValue, {
        toValue: MAXIMUM_HEIGHT - initialHeight,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(animatedValue, {
        toValue: MAXIMUM_HEIGHT,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
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
        }
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        const snapPoint = calculateSnapPoint(lastGestureDy.current + dy, vy);
        const snapPercentage = Math.round((snapPoint / height) * 100) + '%';
        setCurrentSnapPoint(snapPercentage);
        
        if (snapPoint === 0) {
          // Fully expanded
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (snapPoint === MAXIMUM_HEIGHT) {
          // Closed
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
      },
    })
  ).current;

  const translateY = animatedValue.interpolate({
    inputRange: [0, MAXIMUM_HEIGHT],
    outputRange: [0, MAXIMUM_HEIGHT],
  });

  const overlayOpacity = animatedValue.interpolate({
    inputRange: [0, MAXIMUM_HEIGHT],
    outputRange: [0.5, 0],
  });

  return (
    <>
      <Animated.View 
        style={[
          styles.overlay,
          { opacity: overlayOpacity }
        ]}
        pointerEvents={isOpen ? 'auto' : 'none'}
        onTouchEnd={onClose}
      />
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }]
          }
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.content}>
          <BlurView intensity={80} style={styles.blurContainer}>
            <View style={styles.handle} />
            {children}
          </BlurView>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.glass.overlay,
  },
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: MAXIMUM_HEIGHT,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
  },
  blurContainer: {
    flex: 1,
    paddingTop: theme.spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.neutral[300],
    borderRadius: theme.borderRadius.full,
    alignSelf: 'center',
    marginBottom: theme.spacing.md,
  },
});

export default BottomSheet;
