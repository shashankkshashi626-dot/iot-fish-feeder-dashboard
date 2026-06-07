import { User, FeedingSchedule, FeedingHistory, DeviceSettings, AppNotification } from '../types';

const STORAGE_KEYS = {
  USERS: 'AquaMate_users',
  CURRENT_USER: 'AquaMate_current_user',
  SCHEDULES: 'AquaMate_schedules',
  HISTORY: 'AquaMate_history',
  SETTINGS: 'AquaMate_settings',
  NOTIFICATIONS: 'AquaMate_notifications',
};

// ─── Users ───
export function getUsers(): User[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getCurrentUser(): User | null {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function registerUser(email: string, name: string, password: string): { success: boolean; message: string } {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Email already registered' };
  }
  const newUser: User = { id: crypto.randomUUID(), email, name, password };
  saveUsers([...users, newUser]);
  return { success: true, message: 'Account created successfully' };
}

export function login(email: string, password: string): { success: boolean; message: string; user?: User } {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    setCurrentUser(user);
    return { success: true, message: 'Welcome back!', user };
  }
  return { success: false, message: 'Invalid email or password' };
}

// ─── Schedules ───
export function getSchedules(): FeedingSchedule[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHEDULES) || '[]');
}

export function saveSchedules(schedules: FeedingSchedule[]): void {
  localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
}

export function addSchedule(schedule: FeedingSchedule): void {
  const schedules = getSchedules();
  saveSchedules([...schedules, schedule]);
}

export function updateSchedule(id: string, updates: Partial<FeedingSchedule>): void {
  const schedules = getSchedules();
  saveSchedules(schedules.map(s => s.id === id ? { ...s, ...updates } : s));
}

export function deleteSchedule(id: string): void {
  const schedules = getSchedules();
  saveSchedules(schedules.filter(s => s.id !== id));
}

// ─── History ───
export function getHistory(): FeedingHistory[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
}

export function saveHistory(history: FeedingHistory[]): void {
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

export function addHistoryEntry(entry: FeedingHistory): void {
  const history = getHistory();
  saveHistory([entry, ...history].slice(0, 100));
}

// ─── Settings ───
export const DEFAULT_SETTINGS: DeviceSettings = {
  wifiSSID: 'AquariumNetwork',
  wifiPassword: '',
  deviceName: 'AquaMate-ESP32',
  notifications: {
    lowFood: true,
    feedingComplete: true,
    connectionLost: true,
  },
  lowFoodThreshold: 20,
  apiEndpoint: 'http://192.168.1.100:8080',
  useWebSocket: false,
};

export function getSettings(): DeviceSettings {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || JSON.stringify(DEFAULT_SETTINGS));
}

export function saveSettings(settings: DeviceSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// ─── Notifications ───
export function getAppNotifications(): AppNotification[] {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || '[]');
}

export function saveAppNotifications(notifications: AppNotification[]): void {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
}

export function addAppNotification(n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>): void {
  const notifications = getAppNotifications();
  const newNotification: AppNotification = {
    ...n,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    read: false,
  };
  saveAppNotifications([newNotification, ...notifications].slice(0, 50));
}

export function clearAppNotifications(): void {
  saveAppNotifications([]);
}

// ─── Init defaults ───
export function initDefaults(): void {
  if (!getSettings()) {
    saveSettings(DEFAULT_SETTINGS);
  }
  if (!getSchedules().length) {
    const schedules: FeedingSchedule[] = [
      { id: crypto.randomUUID(), time: '07:00', portion: 5, enabled: true, name: 'Morning Feeding' },
      { id: crypto.randomUUID(), time: '12:00', portion: 5, enabled: true, name: 'Midday Feeding' },
      { id: crypto.randomUUID(), time: '18:00', portion: 5, enabled: true, name: 'Evening Feeding' },
    ];
    saveSchedules(schedules);
  }
  if (!getHistory().length) {
    const history: FeedingHistory[] = [
      { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 3600000).toISOString(), type: 'scheduled', portion: 5, status: 'success' },
      { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 7200000).toISOString(), type: 'manual', portion: 3, status: 'success' },
      { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 14400000).toISOString(), type: 'scheduled', portion: 5, status: 'success' },
      { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 28800000).toISOString(), type: 'scheduled', portion: 5, status: 'failed' },
      { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 43200000).toISOString(), type: 'scheduled', portion: 5, status: 'success' },
      { id: crypto.randomUUID(), timestamp: new Date(Date.now() - 72000000).toISOString(), type: 'manual', portion: 4, status: 'success' },
    ];
    saveHistory(history);
  }
  if (!getAppNotifications().length) {
    const notifications: AppNotification[] = [
      { id: crypto.randomUUID(), type: 'info', title: 'System Ready', message: 'AquaMate dashboard is online and ready.', timestamp: new Date().toISOString(), read: false },
      { id: crypto.randomUUID(), type: 'warning', title: 'Low Food Level', message: 'Food container is at 35%. Consider refilling soon.', timestamp: new Date(Date.now() - 1800000).toISOString(), read: false },
    ];
    saveAppNotifications(notifications);
  }
}
