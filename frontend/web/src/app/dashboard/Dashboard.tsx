import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Meter {
  id: string;
  serialNumber: string;
  location: {
    coordinates: [number, number]; // [lng, lat]
    type: 'Point';
  };
  status: 'active' | 'inactive' | 'maintenance_required';
  currentFlowRate: number;
  lastUpdated: string;
}

export function Dashboard() {
  const [meters, setMeters] = useState<Meter[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/meters')
      .then((res) => res.json())
      .then((data) => setMeters(data))
      .catch((err) => console.error('Failed to fetch meters:', err));
  }, []);

  const activeAlerts = meters.filter(m => m.currentFlowRate > 500).length;

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <header style={{ padding: '1rem', background: '#0ea5e9', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0 }}>Ramani Water Monitoring</h1>
        <div>
            {activeAlerts > 0 ? (
                <span style={{ background: '#ef4444', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold' }}>
                    🚨 {activeAlerts} Active Alerts
                </span>
            ) : (
                <span style={{ background: '#10b981', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 'bold' }}>
                    ✅ Systems Normal
                </span>
            )}
        </div>
      </header>
      
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar List */}
        <div style={{ width: '300px', overflowY: 'auto', borderRight: '1px solid #ddd', padding: '1rem' }}>
            <h2>Meters ({meters.length})</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {meters.map(meter => (
                    <li key={meter.id} style={{ 
                        padding: '1rem', 
                        borderBottom: '1px solid #eee',
                        background: meter.currentFlowRate > 500 ? '#fef2f2' : 'white'
                    }}>
                        <div style={{ fontWeight: 'bold' }}>{meter.serialNumber}</div>
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>
                            Flow: {meter.currentFlowRate.toFixed(2)} L/m
                        </div>
                        <div style={{ marginTop: '0.5rem' }}>
                            {meter.currentFlowRate > 500 ? (
                                <span style={{ color: '#dc2626', fontWeight: 'bold' }}>Burst Detected</span>
                            ) : (
                                <span style={{ color: '#059669' }}>Active</span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>

        {/* Map View */}
        <div style={{ flex: 1 }}>
             <MapContainer center={[37.7895, -122.4284]} zoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {meters.map((meter) => {
                    const lat = meter.location?.coordinates[1] || 0;
                    const lng = meter.location?.coordinates[0] || 0;
                    if (lat === 0 && lng === 0) return null;

                    return (
                        <Marker key={meter.id} position={[lat, lng]}>
                            <Popup>
                                <strong>{meter.serialNumber}</strong><br />
                                Flow: {meter.currentFlowRate} L/m<br />
                                Last Updated: {new Date(meter.lastUpdated).toLocaleTimeString()}
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
      </div>
    </div>
  );
}
