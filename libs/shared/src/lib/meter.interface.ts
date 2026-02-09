export enum MeterStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  OFFLINE = 'OFFLINE',
}

export interface Meter {
  id: string;              // Unique UUID
  serialNumber: string;    // e.g. "M-1024"
  latitude: number;
  longitude: number;
  status: MeterStatus;
  lastHeartbeat?: Date;
}