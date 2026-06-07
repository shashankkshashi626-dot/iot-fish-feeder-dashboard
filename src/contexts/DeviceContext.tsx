import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { DeviceStatus, FeedingSchedule, FeedingHistory, AppNotification } from '../types';
import {
  getSchedules, getHistory, addHistoryEntry, addAppNotification,
  getAppNotifications, updateSchedule, deleteSchedule, addSchedule
} from '../utils/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface DeviceContextType {
  deviceStatus: DeviceStatus;
  schedules: FeedingSchedule[];
  history: FeedingHistory[];
  notifications: AppNotification[];
  feedNow: () => void;
  addSchedule: (schedule: Omit<FeedingSchedule, 'id'>) => void;
  updateSchedule: (id: string, updates: Partial<FeedingSchedule>) => void;
  deleteSchedule: (id: string) => void;
  unreadCount: number;
}

const DeviceContext = createContext<DeviceContextType>({
  deviceStatus: {} as DeviceStatus,
  schedules: [],
  history: [],
  notifications: [],
  feedNow: () => {},
  addSchedule: () => {},
  updateSchedule: () => {},
  deleteSchedule: () => {},
  unreadCount: 0,
});

const defaultStatus: DeviceStatus = {
  esp32Online: true,
  lastFeeding: new Date(Date.now() - 3600000).toISOString(),
  nextFeeding: new Date(Date.now() + 18000000).toISOString(),
  foodLevel: 35,
  waterTemp: 25.5,
  wifiStatus: 'connected',
  servoStatus: 'idle',
  deviceName: 'AquaMate-ESP32',
  signalStrength: 85,
};

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>(defaultStatus);
  const [schedules, setSchedules] = useState<FeedingSchedule[]>(getSchedules);
  const [history, setHistory] = useState<FeedingHistory[]>(getHistory);
  const [notifications, setNotifications] = useState<AppNotification[]>(getAppNotifications());

  useEffect(() => {
    const interval = setInterval(() => {
      setDeviceStatus(prev => ({
        ...prev,
        waterTemp: Math.round((24 + Math.random() * 3) * 10) / 10,
        foodLevel: Math.max(0, Math.min(100, prev.foodLevel + (Math.random() * 2 - 1))),
        signalStrength: Math.max(60, Math.min(100, prev.signalStrength + Math.floor(Math.random() * 5 - 2))),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const feedNow = useCallback(() => {
    setDeviceStatus(prev => ({ ...prev, servoStatus: 'feeding' }));
    const newNotif: AppNotification = {
      id: crypto.randomUUID(),
      type: 'success',
      title: 'Manual Feeding Started',
      message: 'Servo motor activated. Distributing food portion...',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
    addAppNotification({ type: 'success', title: 'Manual Feeding Started', message: 'Servo motor activated.' });
    setTimeout(() => {
      const entry: FeedingHistory = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        type: 'manual',
        portion: 3,
        status: 'success',
      };
      addHistoryEntry(entry);
      setHistory(prev => [entry, ...prev]);
      setDeviceStatus(prev => ({
        ...prev,
        servoStatus: 'idle',
        foodLevel: Math.max(0, prev.foodLevel - 3),
        lastFeeding: new Date().toISOString(),
      }));
    }, 2000);
  }, []);

  const addScheduleAction = useCallback((schedule: Omit<FeedingSchedule, 'id'>) => {
    const newSchedule: FeedingSchedule = { ...schedule, id: crypto.randomUUID() };
    addSchedule(newSchedule);
    setSchedules(getSchedules());
  }, []);

  const updateScheduleAction = useCallback((id: string, updates: Partial<FeedingSchedule>) => {
    updateSchedule(id, updates);
    setSchedules(getSchedules());
  }, []);

  const deleteScheduleAction = useCallback((id: string) => {
    deleteSchedule(id);
    setSchedules(getSchedules());
  }, []);

  return (
    <DeviceContext.Provider value={{
      deviceStatus, schedules, history, notifications,
      feedNow, addSchedule: addScheduleAction, updateSchedule: updateScheduleAction, deleteSchedule: deleteScheduleAction,
      unreadCount,
    }}>
      {children}
      <FloatingNotificationBell />
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  return useContext(DeviceContext);
}

function FloatingNotificationBell() {
  const { notifications, unreadCount } = useDevice();
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl cursor-pointer border backdrop-blur-xl transition-all ${
          isDark
            ? 'bg-slate-800/80 border-white/10 shadow-slate-900/50'
            : 'bg-white/80 border-white/40 shadow-sky-200/50'
        }`}
      >
        <Bell className="w-6 h-6 text-sky-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
            {unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/30"
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className={`fixed bottom-24 right-6 z-50 w-80 max-h-96 overflow-y-auto rounded-2xl shadow-2xl p-4 border backdrop-blur-xl ${
                isDark
                  ? 'bg-slate-800/95 border-white/10'
                  : 'bg-white/95 border-white/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>Notifications</h3>
                <button onClick={() => setOpen(false)} className={`p-1 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100'}`}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No notifications</p>
              ) : (
                notifications.slice(0, 10).map(n => (
                  <div key={n.id} className={`p-3 rounded-xl mb-2 ${!n.read ? (isDark ? 'bg-sky-500/10 border border-sky-500/20' : 'bg-sky-50 border border-sky-100') : 'bg-transparent'}`}>
                    <div className="flex items-start gap-2">
                      <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                        n.type === 'alert' ? 'bg-red-500' :
                        n.type === 'warning' ? 'bg-amber-500' :
                        n.type === 'success' ? 'bg-green-500' : 'bg-sky-500'
                      }`} />
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{n.title}</p>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{n.message}</p>
                        <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
