import { View, Text, TouchableOpacity, Animated, StyleSheet, Platform } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import theme from '../../theme';
import Input from './Input.js';

const Header = ({
  title,
  showSearch = false,
  showFilter = false,
  onSearch,
  onFilter,
  transparent = false,
  scrollOffset = 0,
}) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchHeight = useRef(new Animated.Value(0)).current;
  const searchOpacity = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(transparent ? 0 : 1)).current;

  useEffect(() => {
    if (transparent) {
      Animated.spring(headerOpacity, {
        toValue: Math.min(scrollOffset / 100, 1),
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
    ]).start();

    setIsSearchVisible(!isSearchVisible);
  };

  const handleFilterPress = () => {
    Haptics.selectionAsync();
    onFilter?.();
  };

  const renderIconButton = (icon, onPress, badge) => (
    <TouchableOpacity
      style={styles.iconButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Animated.View style={[
        styles.iconContainer,
        { transform: [{ scale: useRef(new Animated.Value(1)).current }] }
      ]}>
        <MaterialIcons
          name={icon}
          size={24}
          color={theme.colors.primary.contrast}
        />
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );

  return (
    <Animated.View style={[
      styles.container,
      transparent && {
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
      },
    ]}>
      <Animated.View 
        style={[
          styles.blurOverlay,
          { opacity: headerOpacity }
        ]}
      >
        <BlurView intensity={80} style={styles.blurContainer}>
          <View style={styles.mainHeader}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.actions}>
              {showSearch && renderIconButton('search', toggleSearch)}
              {showFilter && renderIconButton('tune', handleFilterPress)}
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
                onChangeText={onSearch}
                style={styles.searchInput}
                autoFocus={isSearchVisible}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
            </Animated.View>
          )}
        </BlurView>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary.main,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary.dark,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  blurContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  mainHeader: {
    height: theme.layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.size.xl,
    fontWeight: '600',
    color: theme.colors.primary.contrast,
    ...Platform.select({
      ios: {
        fontWeight: '700',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.full,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.error.main,
    borderRadius: theme.borderRadius.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: theme.colors.error.contrast,
    fontSize: theme.typography.size.xs,
    fontWeight: '600',
  },
  searchContainer: {
    overflow: 'hidden',
    backgroundColor: theme.colors.primary.light,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  searchInput: {
    backgroundColor: theme.colors.primary.contrast,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 40,
    ...theme.shadows.sm,
  },
});

export default Header;
