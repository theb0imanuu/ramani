import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import Svg, { Path } from 'react-native-svg';
import { api, Meter } from './services/api';

// ---------- MOCK DATA ----------
const PIPELINE: { latitude: number; longitude: number }[] = [
  { latitude: 37.78825, longitude: -122.4324 },
  { latitude: 37.78925, longitude: -122.4304 },
  { latitude: 37.79025, longitude: -122.4284 },
  { latitude: 37.79125, longitude: -122.4264 },
  { latitude: 37.79225, longitude: -122.4244 },
];

// ---------- MAIN COMPONENT ----------
export const App = () => {
  const mapRef = useRef<MapView | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [whatsNextYCoord, setWhatsNextYCoord] = useState<number>(0);
  const [meters, setMeters] = useState<Meter[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObjectCoords | null>(null);

  // Filter meters that have issues (e.g., flow > 500 or status inactive/maintenance)
  // For this demo, let's assume if flow > 500 it's a "High" severity leak.
  const openCount = meters.filter((m) => m.currentFlowRate > 500).length;

  const fetchMeters = async () => {
    try {
      const data = await api.getMeters();
      setMeters(data);
    } catch (e) {
      console.error(e);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchMeters();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation(loc.coords);
    })();
    fetchMeters();
  }, []);

  const centerOnUser = () => {
    if (!userLocation || !mapRef.current) return;
    mapRef.current.animateToRegion({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const handleFix = (id: string) => {
    Alert.alert('Fix issue?', 'Mark this issue as resolved?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Fix',
        onPress: async () => {
            // Optimistic update
            const originalMeters = [...meters];
            setMeters((prev) =>
              prev.map((m) => (m.id === id ? { ...m, currentFlowRate: 0 } : m))
            );
            
            const result = await api.updateMeter(id, { currentFlowRate: 0 });
            if (!result) {
                Alert.alert("Error", "Failed to update meter");
                setMeters(originalMeters); // Revert
            }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        ref={(ref) => { scrollViewRef.current = ref; }}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* ---------------- HEADER ---------------- */}
        <View style={styles.section}>
          <Text style={styles.textLg}></Text>
          <Text style={[styles.textXL, styles.appTitleText]} testID="heading">
            {openCount === 0 ? 'All clear! ✅' : `${openCount} active alert(s)`}
          </Text>
        </View>

        {/* ---------------- MAP CARD ---------------- */}
        <View style={styles.section}>
          <View style={[styles.shadowBox, { padding: 0, overflow: 'hidden' }]}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_DEFAULT}
              style={{ height: 350 }}
              initialRegion={{
                latitude: 37.7895,
                longitude: -122.4284,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation
              showsMyLocationButton={false}
            >
              {/* Pipeline */}
              <Polyline
                coordinates={PIPELINE}
                strokeColor="#0ea5e9"
                strokeWidth={6}
              />
              {/* Issues */}
              {meters.map((m) => {
                  const isLeak = m.currentFlowRate > 500;
                  const lat = m.location?.coordinates[1] || 0;
                  const lng = m.location?.coordinates[0] || 0;
                  if (lat === 0 && lng === 0) return null; // Skip if no location

                  return (
                    <Marker
                      key={m.id}
                      coordinate={{ latitude: lat, longitude: lng }}
                      pinColor={isLeak ? '#ef4444' : '#10b981'}
                      onPress={() => isLeak && handleFix(m.id)}
                      title={`Meter: ${m.serialNumber}`}
                      description={`Flow: ${m.currentFlowRate} L/m`}
                    />
                  );
              })}
            </MapView>

            <View style={styles.mapButtons}>
              <TouchableOpacity
                style={styles.locateButton}
                onPress={centerOnUser}
              >
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <Path d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ---------------- ACTIONS ---------------- */}
        <View style={styles.section}>
          <View style={styles.hero}>
            <View style={styles.heroTitle}>
              <Svg width={32} height={32} stroke="#fff" fill="none" viewBox="0 0 24 24">
                <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </Svg>
              <Text style={[styles.textLg, styles.heroTitleText]}>
                You're on duty
              </Text>
            </View>
            <TouchableOpacity
              style={styles.whatsNextButton}
              onPress={() =>
                scrollViewRef.current?.scrollTo({ x: 0, y: whatsNextYCoord })
              }
            >
              <Text style={[styles.textMd, styles.textCenter]}>What's next?</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ---------------- NEXT STEPS ---------------- */}
        <View
          style={styles.section}
          onLayout={(e) => setWhatsNextYCoord(e.nativeEvent.layout.y)}
        >
          <View style={styles.shadowBox}>
            <Text style={[styles.textLg, styles.marginBottomMd]}>Next steps</Text>
            <Text style={[styles.textSm, styles.textLight, styles.marginBottomMd]}>
              Tap any red pin on the map to resolve the alert.
            </Text>

            <View style={styles.listItem}>
              <Svg width={24} height={24} stroke="#000" fill="none" viewBox="0 0 24 24">
                <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </Svg>
              <View style={styles.listItemTextContainer}>
                <Text style={styles.textSm}>Fix high-flow alerts first</Text>
              </View>
            </View>

            <View style={styles.listItem}>
              <Svg width={24} height={24} stroke="#000" fill="none" viewBox="0 0 24 24">
                <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </Svg>
              <View style={styles.listItemTextContainer}>
                <Text style={styles.textSm}>Use the locate button to centre on your position</Text>
              </View>
            </View>

            <View style={styles.listItem}>
              <Svg width={24} height={24} stroke="#000" fill="none" viewBox="0 0 24 24">
                <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </Svg>
              <View style={styles.listItemTextContainer}>
                <Text style={styles.textSm}>Swipe down to refresh meter list</Text>
              </View>
            </View>
          </View>

          <View style={[styles.listItem, styles.love]}>
            <Text style={styles.textSubtle}>Keeping the network safe </Text>
            <Svg width={24} height={24} fill="#fca5a5" stroke="none" viewBox="0 0 24 24">
              <Path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </Svg>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ---------- STYLES ----------
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
    // <--- 3. Add Top Padding for Android Devices
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 
  },
  scrollView: { backgroundColor: '#fff' },
  section: { marginVertical: 12, marginHorizontal: 12 },
  shadowBox: {
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: { width: 1, height: 4 },
    shadowRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  textLg: { fontSize: 24 },
  textXL: { fontSize: 48 },
  appTitleText: { paddingTop: 12, fontWeight: '500' },
  hero: {
    borderRadius: 12,
    backgroundColor: '#0ea5e9',
    padding: 36,
    marginBottom: 24,
  },
  heroTitle: { flexDirection: 'row', alignItems: 'center' },
  heroTitleText: { color: '#fff', marginLeft: 12 },
  whatsNextButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 8,
    width: '50%',
    marginTop: 24,
  },
  textCenter: { textAlign: 'center' },
  textMd: { fontSize: 18 },
  textSm: { fontSize: 16 },
  textLight: { fontWeight: '300' },
  textSubtle: { color: '#6b7280' },
  marginBottomMd: { marginBottom: 18 },
  listItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  listItemTextContainer: { marginLeft: 12, flex: 1 },
  love: { marginTop: 12, justifyContent: 'center' },
  mapButtons: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  locateButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 28,
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
});

export default App;