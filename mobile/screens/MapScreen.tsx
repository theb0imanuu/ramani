import React, { useEffect, useState } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Text, Button } from 'react-native';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

const PRIMARY_COLOR = '#0e2944';

interface Incident {
  ID: number;
  description: string;
  latitude: number;
  longitude: number;
}

const Container = styled.View`
  flex: 1;
`;

const ReportButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 30px;
  right: 30px;
  background-color: ${PRIMARY_COLOR};
  padding: 15px;
  border-radius: 30px;
  elevation: 5;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: bold;
`;

const MapScreen = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await api.get('/incidents');
        setIncidents(response.data);
      } catch (error) {
        console.error('Failed to fetch incidents:', error);
      }
    };
    // Fetch incidents when the screen is focused
    const unsubscribe = navigation.addListener('focus', fetchIncidents);
    return unsubscribe;
  }, [navigation]);

  return (
    <Container>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {incidents.map(incident => (
          <Marker
            key={incident.ID}
            coordinate={{ latitude: incident.latitude, longitude: incident.longitude }}
            title={incident.description}
          >
            <Callout>
              <Text>{incident.description}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <ReportButton onPress={() => navigation.navigate('ReportIncident')}>
        <ButtonText>Report Incident</ButtonText>
      </ReportButton>
    </Container>
  );
};

export default MapScreen;
