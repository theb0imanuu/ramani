
import { Platform } from 'react-native';

// Use localhost for iOS/web, and 10.0.2.2 for Android Emulator
// If running on physical device, replace with your machine's LAN IP (e.g., 192.168.1.x)
const API_URL = Platform.select({
  android: 'http://10.0.2.2:3000/api',
  ios: 'http://localhost:3000/api',
  default: 'http://localhost:3000/api',
});

export type Meter = {
  id: string;
  serialNumber: string;
  location: {
    coordinates: [number, number]; // [lng, lat]
    type: 'Point';
  };
  status: 'active' | 'inactive' | 'maintenance_required';
  currentFlowRate: number;
  lastUpdated: string;
};

export const api = {
  getMeters: async (): Promise<Meter[]> => {
    try {
      const response = await fetch(`${API_URL}/meters`);
      if (!response.ok) throw new Error('Failed to fetch meters');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  updateMeter: async (id: string, data: Partial<Meter>): Promise<Meter | null> => {
    try {
      const response = await fetch(`${API_URL}/meters/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update meter');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  },
};
