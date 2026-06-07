import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  Wifi, Server, Bell, Save, Check, Shield,
  Signal, Smartphone, Globe, RefreshCw
} from 'lucide-react';
import { getSettings, saveSettings, clearAppNotifications } from '../utils/storage';
import { DeviceSettings } from '../types';

export function SettingsPage() {
  const { isDark } = useTheme();
  const [settings, setSettings] = useState<DeviceSettings>(getSettings());
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'device' | 'notifications' | 'api'>('device');

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const cardBg = isDark
    ? 'bg-slate-900/60 border-white/5'
    : 'bg-white/60 border-white/50';

  const inputClass = isDark
    ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-sky-500/50'
    : 'bg-white/60 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-300';

  const tabs = [
    { id: 'device' as const, label: 'Device', icon: Server },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'api' as const, label: 'API Config', icon: Globe },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Settings
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Configure your fish feeder device
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg ${
            saved
              ? 'bg-green-500 text-white shadow-green-500/20'
              : 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white hover:from-sky-600 hover:to-cyan-600 shadow-sky-500/20'
          }`}
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Settings'}
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-slate-500/10 w-fit">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? isDark ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-800 shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Device Settings */}
      {activeTab === 'device' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className={`rounded-2xl border p-6 space-y-5 ${cardBg}`}>
            <h3 className={`text-base font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Wifi className="w-5 h-5 text-sky-500" />
              Wi-Fi Configuration
            </h3>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Network Name (SSID)
              </label>
              <input
                type="text"
                value={settings.wifiSSID}
                onChange={e => setSettings(prev => ({ ...prev, wifiSSID: e.target.value }))}
                placeholder="Enter Wi-Fi SSID"
                className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all ${inputClass}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Password
              </label>
              <input
                type="password"
                value={settings.wifiPassword}
                onChange={e => setSettings(prev => ({ ...prev, wifiPassword: e.target.value }))}
                placeholder="Enter Wi-Fi password"
                className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all ${inputClass}`}
              />
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
              <Signal className="w-4 h-4 text-green-500" />
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Signal Strength: <span className="font-medium">85%</span>
              </span>
              <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>

          <div className={`rounded-2xl border p-6 space-y-5 ${cardBg}`}>
            <h3 className={`text-base font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Server className="w-5 h-5 text-sky-500" />
              Device Information
            </h3>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Device Name
              </label>
              <input
                type="text"
                value={settings.deviceName}
                onChange={e => setSettings(prev => ({ ...prev, deviceName: e.target.value }))}
                placeholder="AquaMate-ESP32"
                className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all ${inputClass}`}
              />
            </div>
            <div className={`rounded-xl p-4 space-y-3 ${isDark ? 'bg-white/[0.02]' : 'bg-slate-50'}`}>
              {[
                { label: 'Firmware Version', value: 'v2.1.0' },
                { label: 'Hardware', value: 'ESP32-WROOM-32D' },
                { label: 'Build Date', value: '2025-01-15' },
                { label: 'MAC Address', value: 'A4:CF:12:34:56:78' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.label}</span>
                  <span className={`text-xs font-medium font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}>
              <RefreshCw className="w-4 h-4" />
              Check for Updates
            </button>
          </div>
        </motion.div>
      )}

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className={`rounded-2xl border p-6 space-y-5 ${cardBg}`}>
            <h3 className={`text-base font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Bell className="w-5 h-5 text-sky-500" />
              Notification Preferences
            </h3>
            <NotificationToggle
              isDark={isDark}
              label="Low Food Alerts"
              description="Get notified when food level is below threshold"
              checked={settings.notifications.lowFood}
              onChange={checked => setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, lowFood: checked } }))}
            />
            <NotificationToggle
              isDark={isDark}
              label="Feeding Complete"
              description="Receive confirmation after each feeding"
              checked={settings.notifications.feedingComplete}
              onChange={checked => setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, feedingComplete: checked } }))}
            />
            <NotificationToggle
              isDark={isDark}
              label="Connection Alerts"
              description="Get notified when device connection is lost"
              checked={settings.notifications.connectionLost}
              onChange={checked => setSettings(prev => ({ ...prev, notifications: { ...prev.notifications, connectionLost: checked } }))}
            />
          </div>

          <div className={`rounded-2xl border p-6 space-y-5 ${cardBg}`}>
            <h3 className={`text-base font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Shield className="w-5 h-5 text-sky-500" />
              Alert Thresholds
            </h3>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Low Food Threshold ({settings.lowFoodThreshold}%)
              </label>
              <input
                type="range"
                min="5"
                max="80"
                value={settings.lowFoodThreshold}
                onChange={e => setSettings(prev => ({ ...prev, lowFoodThreshold: parseInt(e.target.value) }))}
                className="w-full accent-sky-500"
              />
              <div className="flex justify-between mt-1">
                <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>5%</span>
                <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>80%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* API Configuration */}
      {activeTab === 'api' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className={`rounded-2xl border p-6 space-y-5 ${cardBg}`}>
            <h3 className={`text-base font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Globe className="w-5 h-5 text-sky-500" />
              ESP32 API Endpoint
            </h3>
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Base URL
              </label>
              <input
                type="url"
                value={settings.apiEndpoint}
                onChange={e => setSettings(prev => ({ ...prev, apiEndpoint: e.target.value }))}
                placeholder="http://192.168.1.100:8080"
                className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all ${inputClass}`}
              />
            </div>
            <NotificationToggle
              isDark={isDark}
              label="Use WebSocket"
              description="Enable real-time WebSocket connection (alternative to REST polling)"
              checked={settings.useWebSocket}
              onChange={checked => setSettings(prev => ({ ...prev, useWebSocket: checked }))}
            />
          </div>

          <div className={`rounded-2xl border p-6 space-y-4 ${cardBg}`}>
            <h3 className={`text-base font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
              <Server className="w-5 h-5 text-sky-500" />
              API Endpoints Reference
            </h3>
            <div className={`rounded-xl p-4 font-mono text-xs space-y-2 ${isDark ? 'bg-white/[0.02]' : 'bg-slate-50'}`}>
              <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                <span className="text-green-500">GET</span>  /api/status        — Device status
              </p>
              <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                <span className="text-blue-500">POST</span> /api/feed         — Trigger feeding
              </p>
              <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                <span className="text-green-500">GET</span>  /api/schedules    — Get schedules
              </p>
              <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                <span className="text-amber-500">PUT</span>  /api/schedules/:id — Update schedule
              </p>
              <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                <span className="text-red-400">DELETE</span> /api/schedules/:id — Delete schedule
              </p>
              <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                <span className="text-green-500">GET</span>  /api/history      — Feeding history
              </p>
              <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                <span className="text-green-500">GET</span>  /api/settings     — Get settings
              </p>
              <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                <span className="text-amber-500">PUT</span>  /api/settings     — Update settings
              </p>
            </div>
          </div>

          <div className={`rounded-2xl border p-6 ${cardBg}`}>
            <button
              onClick={clearAppNotifications}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isDark ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Clear All Notifications
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function NotificationToggle({ isDark, label, description, checked, onChange }: {
  isDark: boolean; label: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-white/[0.02]' : 'bg-slate-50/50'}`}>
      <div>
        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>{label}</p>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`w-12 h-7 rounded-full transition-colors relative flex-shrink-0 ml-4 ${
          checked ? 'bg-sky-500' : isDark ? 'bg-slate-700' : 'bg-slate-300'
        }`}
      >
        <motion.div
          layout
          className={`w-5 h-5 rounded-full absolute top-1 bg-white shadow-sm ${
            checked ? 'right-1' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}
