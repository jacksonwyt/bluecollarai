import { View, StyleSheet, Dimensions, Platform } from 'react-native';
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

const MARKER_ANIMATION_DURATION = 300;

export default function JobMap({ jobs, onMarkerPress, selectedJobId }) {
  const [region, setRegion] = useState(INITIAL_REGION);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      
      setUserLocation(location.coords);
      setRegion(newRegion);
      
      mapRef.current?.animateToRegion(newRegion, 1000);
    })();
  }, []);

  useEffect(() => {
    if (selectedJobId && markersRef.current[selectedJobId]) {
      const marker = markersRef.current[selectedJobId];
      
      const selectedJob = jobs.find(job => job.id === selectedJobId);
      if (selectedJob) {
        mapRef.current?.animateToRegion({
          latitude: selectedJob.latitude,
          longitude: selectedJob.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 500);
        
        Haptics.selectionAsync();
      }
    }
  }, [selectedJobId]);

  const handleMarkerPress = (job) => {
    onMarkerPress?.(job);
    Haptics.selectionAsync();
  };

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        mapPadding={{ top: 100, right: 0, bottom: 100, left: 0 }}
        onRegionChangeComplete={setRegion}
        customMapStyle={theme.mapStyle}
      >
        {jobs.map((job) => (
          <Marker
            ref={ref => markersRef.current[job.id] = ref}
            key={job.id}
            coordinate={{
              latitude: job.latitude,
              longitude: job.longitude,
            }}
            onPress={() => handleMarkerPress(job)}
            tracksViewChanges={false}
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
    transform: [{ scale: 1 }],
  },
  selectedMarker: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.contrast,
    transform: [{ scale: 1.2 }],
  },
});
