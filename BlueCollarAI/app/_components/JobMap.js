import { View, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import theme from '../theme';
import JobMapCallout from './JobMapCallout';

const INITIAL_REGION = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function JobMap({ jobs, onMarkerPress, selectedJobId }) {
  const [region, setRegion] = useState(INITIAL_REGION);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  // Initialize map with user location
  useEffect(() => {
    let isMounted = true;
    
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Location permission denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        if (!isMounted) return;
        
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        
        setUserLocation(location.coords);
        setRegion(newRegion);
        
        // Use timeout to ensure map is properly initialized before animation
        setTimeout(() => {
          if (mapRef.current && isMounted) {
            mapRef.current.animateToRegion(newRegion, 500);
          }
        }, 500);
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    getLocation();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle selection of job marker
  useEffect(() => {
    if (selectedJobId && jobs.length) {
      const selectedJob = jobs.find(job => job.id === selectedJobId);
      if (selectedJob) {
        const region = {
          latitude: selectedJob.latitude,
          longitude: selectedJob.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        
        // Use timeout to ensure smooth animation
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.animateToRegion(region, 300);
          }
        }, 100);
        
        // Provide haptic feedback on selection
        if (Platform.OS !== 'web') {
          Haptics.selectionAsync();
        }
      }
    }
  }, [selectedJobId, jobs]);

  const handleMarkerPress = (job) => {
    onMarkerPress?.(job);
    // Provide haptic feedback on marker press
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
  };

  const centerOnUserLocation = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 300);
      
      if (Platform.OS !== 'web') {
        Haptics.selectionAsync();
      }
    }
  };

  // Simplified zoom functions with reduced haptic feedback calls
  const zoomIn = () => {
    if (mapRef.current) {
      const currentRegion = mapRef.current.__lastRegion || region;
      mapRef.current.animateToRegion({
        ...currentRegion,
        latitudeDelta: currentRegion.latitudeDelta / 1.5,
        longitudeDelta: currentRegion.longitudeDelta / 1.5,
      }, 200);
    }
  };

  const zoomOut = () => {
    if (mapRef.current) {
      const currentRegion = mapRef.current.__lastRegion || region;
      mapRef.current.animateToRegion({
        ...currentRegion,
        latitudeDelta: currentRegion.latitudeDelta * 1.5,
        longitudeDelta: currentRegion.longitudeDelta * 1.5,
      }, 200);
    }
  };

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        showsUserLocation={true}
        showsCompass={false}
        mapPadding={{ top: 10, right: 10, bottom: 10, left: 10 }}
        onRegionChangeComplete={setRegion}
        customMapStyle={theme.mapStyle}
        rotateEnabled={true}
        pitchEnabled={true}
        moveOnMarkerPress={false} // Disable auto-centering on marker press for more control
      >
        {jobs.map((job) => (
          <Marker
            key={job.id}
            ref={ref => {
              if (ref) markersRef.current[job.id] = ref;
            }}
            coordinate={{
              latitude: job.latitude,
              longitude: job.longitude,
            }}
            onPress={() => handleMarkerPress(job)}
            tracksViewChanges={false} // Improve performance
          >
            <View style={[
              styles.markerContainer,
              selectedJobId === job.id && styles.selectedMarker
            ]}>
              <MaterialIcons 
                name="work" 
                size={24} 
                color={selectedJobId === job.id ? theme.colors.primary.contrast : theme.colors.primary.main} 
              />
            </View>
            <Callout>
              <JobMapCallout job={job} />
            </Callout>
          </Marker>
        ))}
      </MapView>
      
      {/* Controls with increased touch area for better UX */}
      <View style={styles.floatingControls}>
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={centerOnUserLocation}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <MaterialIcons name="my-location" size={24} color={theme.colors.primary.main} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={zoomIn}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <MaterialIcons name="add" size={24} color={theme.colors.primary.main} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.controlButton} 
          onPress={zoomOut}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <MaterialIcons name="remove" size={24} color={theme.colors.primary.main} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral[100],
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  markerContainer: {
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.xs,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    ...theme.shadows.md,
  },
  selectedMarker: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.contrast,
    transform: [{ scale: 1.2 }],
  },
  floatingControls: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.xl * 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    ...theme.shadows.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
