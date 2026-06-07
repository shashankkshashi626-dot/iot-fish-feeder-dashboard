// Types for the AquaMateIoT Dashboard

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

export interface FeedingSchedule {
  id: string;
  time: string;
  portion: number; // in grams
  enabled: boolean;
  name: string;
}

export interface FeedingHistory {
  id: string;
  timestamp: string;
  type: 'scheduled' | 'manual';
  portion: number;
  status: 'success' | 'failed';
}

export interface DeviceStatus {
  esp32Online: boolean;
  lastFeeding: string;
  nextFeeding: string;
  foodLevel: number;
  waterTemp: number;
  wifiStatus: 'connected' | 'disconnected' | 'weak';
  servoStatus: 'idle' | 'feeding' | 'error';
  deviceName: string;
  signalStrength: number;
}

export interface DeviceSettings {
  wifiSSID: string;
  wifiPassword: string;
  deviceName: string;
  notifications: {
    lowFood: boolean;
    feedingComplete: boolean;
    connectionLost: boolean;
  };
  lowFoodThreshold: number;
  apiEndpoint: string;
  useWebSocket: boolean;
}

export interface AppNotification {
  id: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export type Page = 'dashboard' | 'schedule' | 'history' | 'settings';
export type ThemeMode = 'light' | 'dark';
