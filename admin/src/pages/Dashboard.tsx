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
  createdAt: string;
}

const Dashboard = () => {
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/incidents', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Get the 5 most recent incidents
        setRecentIncidents(response.data.slice(0, 5));
      } catch (err) {
        setError('Failed to fetch incidents.');
        console.error(err);
      }
    };
    fetchIncidents();
  }, []);

  const defaultPosition: [number, number] = [51.505, -0.09]; // Default map center

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Dashboard</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Incidents List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Incidents</h2>
          <ul className="space-y-4">
            {recentIncidents.length > 0 ? (
              recentIncidents.map(incident => (
                <li key={incident.ID} className="border-b pb-2">
                  <p className="font-bold">{incident.description}</p>
                  <p className="text-sm text-gray-500">
                    Reported on {new Date(incident.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))
            ) : (
              <p>No recent incidents found.</p>
            )}
          </ul>
        </div>

        {/* Mini Map View */}
        <div className="bg-white p-6 rounded-lg shadow h-96">
           <MapContainer center={defaultPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {recentIncidents.map(incident => (
              <Marker key={incident.ID} position={[incident.latitude, incident.longitude]}>
                <Popup>{incident.description}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
