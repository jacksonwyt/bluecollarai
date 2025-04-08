import { View, Text, TouchableOpacity, Animated, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { theme } from '../../theme';
import Input from './Input.js';

// Import BlurView with try/catch to handle potential issues
let BlurView;
try {
  BlurView = require('expo-blur').BlurView;
} catch (error) {
  console.warn('expo-blur is not available:', error);
}

// Import LinearGradient with try/catch to handle potential issues
let LinearGradient;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (error) {
  console.warn('expo-linear-gradient is not available:', error);
}

const Header = ({
  title,
  subtitle,
  showSearch = false,
  showFilter = false,
  onSearch,
  onFilter,
  transparent = false,
  scrollOffset = 0,
  leftAction,
  rightAction,
  style,
  variant = 'primary', // 'primary', 'glass', 'light'
  centerTitle = false
}) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchHeight = useRef(new Animated.Value(0)).current;
  const searchOpacity = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(transparent ? 0 : 1)).current;
  const headerHeight = useRef(new Animated.Value(Platform.OS === 'ios' ? 90 : 70)).current;
  const iconScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (transparent) {
      const toValue = Math.min(scrollOffset / 100, 1);
      Animated.spring(headerOpacity, {
        toValue,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  }, [scrollOffset, transparent]);

  const toggleSearch = () => {
    Haptics.selectionAsync();
    const toValue = isSearchVisible ? 0 : 56;
    const opacityToValue = isSearchVisible ? 0 : 1;
    const heightToValue = isSearchVisible 
      ? (Platform.OS === 'ios' ? 90 : 70)
      : (Platform.OS === 'ios' ? 146 : 126);

    Animated.parallel([
      Animated.spring(searchHeight, {
        toValue,
        tension: 50,
        friction: 7,
        useNativeDriver: false,
      }),
      Animated.timing(searchOpacity, {
        toValue: opacityToValue,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(headerHeight, {
        toValue: heightToValue,
        tension: 50,
        friction: 7,
        useNativeDriver: false,
      }),
    ]).start();

    if (isSearchVisible && searchText) {
      setSearchText('');
      onSearch?.('');
    }

    setIsSearchVisible(!isSearchVisible);
  };

  const handleFilterPress = () => {
    Haptics.selectionAsync();
    
    // Add scale animation
    Animated.sequence([
      Animated.timing(iconScale, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(iconScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
    
    onFilter?.();
  };

  const handleSearch = (text) => {
    setSearchText(text);
    onSearch?.(text);
  };

  const renderIconButton = (icon, onPress, badge, position = 'right') => {
    const buttonScale = useRef(new Animated.Value(1)).current;
    
    const handlePress = () => {
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(buttonScale, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
      
      onPress?.();
    };
    
    return (
      <TouchableOpacity
        style={[styles.iconButton, position === 'left' && styles.leftIconButton]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Animated.View style={[
          styles.iconContainer,
          { transform: [{ scale: buttonScale }] }
        ]}>
          <MaterialIcons
            name={icon}
            size={24}
            color={getIconColor()}
          />
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };
  
  const getHeaderStyle = () => {
    switch (variant) {
      case 'glass':
        return styles.glassHeader;
      case 'light':
        return styles.lightHeader;
      default:
        return styles.primaryHeader;
    }
  };
  
  const getIconColor = () => {
    switch (variant) {
      case 'light':
        return theme.colors.primary.main;
      default:
        return theme.colors.primary.contrast;
    }
  };
  
  const getTitleColor = () => {
    switch (variant) {
      case 'light':
        return theme.colors.primary.main;
      default:
        return theme.colors.primary.contrast;
    }
  };
  
  const renderBackground = () => {
    if (variant === 'glass' && Platform.OS === 'ios' && BlurView) {
      return (
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
      );
    } else if (variant === 'primary' && LinearGradient) {
      return (
        <LinearGradient
          colors={theme.colors.primary.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      );
    }
    
    return null;
  };

  return (
    <Animated.View style={[
      styles.container,
      getHeaderStyle(),
      transparent && styles.transparentHeader,
      { height: headerHeight },
      style
    ]}>
      <Animated.View 
        style={[
          StyleSheet.absoluteFill,
          { opacity: headerOpacity }
        ]}
      >
        {renderBackground()}
      </Animated.View>
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainHeader}>
          {leftAction && renderIconButton(leftAction.icon, leftAction.onPress, leftAction.badge, 'left')}
          
          <View style={[
            styles.titleContainer,
            centerTitle && styles.centeredTitleContainer,
            !leftAction && styles.noLeftAction,
            (!rightAction && !showSearch && !showFilter) && styles.noRightAction
          ]}>
            <Text 
              style={[
                styles.title, 
                { color: getTitleColor() },
                centerTitle && styles.centeredTitle
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
            {subtitle && (
              <Text 
                style={[
                  styles.subtitle, 
                  { color: getTitleColor() },
                  centerTitle && styles.centeredTitle
                ]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            )}
          </View>
          
          <View style={styles.actions}>
            {showSearch && renderIconButton('search', toggleSearch)}
            {showFilter && (
              <Animated.View style={{ transform: [{ scale: iconScale }] }}>
                {renderIconButton('tune', handleFilterPress)}
              </Animated.View>
            )}
            {rightAction && renderIconButton(rightAction.icon, rightAction.onPress, rightAction.badge)}
          </View>
        </View>

        {showSearch && (
          <Animated.View
            style={[
              styles.searchContainer,
              {
                height: searchHeight,
                opacity: searchOpacity,
              },
            ]}
          >
            <Input
              placeholder="Search..."
              value={searchText}
              onChangeText={handleSearch}
              style={styles.searchInput}
              autoFocus={isSearchVisible}
              returnKeyType="search"
              clearButtonMode="while-editing"
              icon="search"
              variant={variant === 'light' ? 'outline' : 'default'}
            />
          </Animated.View>
        )}
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  safeArea: {
    flex: 1,
  },
  primaryHeader: {
    backgroundColor: theme.colors.primary.main,
    borderBottomWidth: 0,
    ...theme.shadows.md,
  },
  glassHeader: {
    backgroundColor: theme.colors.glass.light,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    ...theme.shadows.sm,
  },
  lightHeader: {
    backgroundColor: theme.colors.neutral[100],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral[200],
    ...theme.shadows.sm,
  },
  transparentHeader: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  mainHeader: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    marginTop: Platform.OS === 'ios' ? 0 : theme.spacing.md,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: theme.spacing.sm,
  },
  centeredTitleContainer: {
    alignItems: 'center',
  },
  noLeftAction: {
    marginLeft: theme.spacing.md,
  },
  noRightAction: {
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.size.xl,
    fontWeight: '600',
    ...Platform.select({
      ios: {
        fontWeight: '700',
      },
    }),
  },
  centeredTitle: {
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.size.sm,
    opacity: 0.8,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: theme.spacing.xs,
  },
  leftIconButton: {
    marginRight: theme.spacing.xs,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.error.main,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: theme.colors.error.contrast,
    fontSize: theme.typography.size.xs,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
});

export default Header;
