import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Placeholder for incident type
interface Incident {
  ID: number;
  description: string;
  latitude: number;
  longitude: number;
}

const MapView = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllIncidents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/incidents', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIncidents(response.data);
      } catch (err) {
        setError('Failed to fetch incidents.');
        console.error(err);
      }
    };
    fetchAllIncidents();
  }, []);

  const defaultPosition: [number, number] = [51.505, -0.09]; // Default map center

  return (
    <div className="h-full w-full">
      <h1 className="text-3xl font-bold text-primary mb-4">Incidents Map</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
      <div className="bg-white p-4 rounded-lg shadow" style={{ height: 'calc(100vh - 12rem)' }}>
        <MapContainer
            center={incidents.length > 0 ? [incidents[0].latitude, incidents[0].longitude] : defaultPosition}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {incidents.map(incident => (
            <Marker key={incident.ID} position={[incident.latitude, incident.longitude]}>
              <Popup>{incident.description}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
