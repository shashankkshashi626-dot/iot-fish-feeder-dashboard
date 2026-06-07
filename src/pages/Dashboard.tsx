import { useState, useEffect } from 'react';
import { useDevice } from '../contexts/DeviceContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  Fish, Wifi, Thermometer, Zap, Clock, Battery,
  Activity, Droplets, Settings2, ChevronRight,
  CheckCircle2, Play
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

export function DashboardPage() {
  const { deviceStatus, feedNow, schedules } = useDevice();
  const { isDark } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [feeding, setFeeding] = useState(false);
  const [foodLevelHistory] = useState(() => {
    const data: { time: string; level: number }[] = [];
    for (let i = 24; i >= 0; i--) {
      const h = (new Date().getHours() - i + 24) % 24;
      data.push({ time: `${h.toString().padStart(2, '0')}:00`, level: Math.max(5, Math.min(100, 45 + Math.random() * 30 - i * 0.5)) });
    }
    return data;
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setFeeding(deviceStatus.servoStatus === 'feeding');
  }, [deviceStatus.servoStatus]);

  const handleFeedNow = () => {
    feedNow();
    setFeeding(true);
    setTimeout(() => setFeeding(false), 2000);
  };

  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatDate = (d: Date) => d.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const cardBase = isDark
    ? 'bg-slate-900/60 border-white/5 hover:border-white/10'
    : 'bg-white/60 border-white/50 hover:border-white/70';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Dashboard
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Monitor and control your fish feeder
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`text-right ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <p className="text-2xl font-bold tabular-nums">{formatTime(currentTime)}</p>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{formatDate(currentTime)}</p>
          </div>
        </div>
      </div>

      {/* ESP32 Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-4 border flex items-center justify-between ${
          deviceStatus.esp32Online
            ? isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
            : isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${deviceStatus.esp32Online ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <div className={`absolute inset-0 w-3 h-3 rounded-full ${deviceStatus.esp32Online ? 'bg-emerald-500' : 'bg-red-500'} animate-ping opacity-50`} />
          </div>
          <div>
            <p className={`text-sm font-semibold ${deviceStatus.esp32Online ? (isDark ? 'text-emerald-400' : 'text-emerald-700') : (isDark ? 'text-red-400' : 'text-red-700')}`}>
              {deviceStatus.esp32Online ? 'ESP32 Online' : 'ESP32 Offline'}
            </p>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {deviceStatus.esp32Online ? `Signal: ${deviceStatus.signalStrength}% • ` : 'Connection lost • '}
              {deviceStatus.deviceName}
            </p>
          </div>
        </div>
        <button
          onClick={handleFeedNow}
          disabled={feeding}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shadow-lg ${
            feeding
              ? 'bg-amber-500 shadow-amber-500/20 cursor-wait'
              : 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 shadow-sky-500/20 hover:shadow-sky-500/30 active:scale-95'
          }`}
        >
          {feeding ? (
            <>
              <span className="animate-spin">⏳</span>
              Feeding...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Feed Now
            </>
          )}
        </button>
      </motion.div>

      {/* Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          isDark={isDark}
          icon={Thermometer}
          iconColor="text-orange-500"
          iconBg={isDark ? 'bg-orange-500/10' : 'bg-orange-100'}
          label="Water Temperature"
          value={`${deviceStatus.waterTemp}°C`}
          sub="Optimal range: 22-28°C"
          delay={0.1}
        />
        <StatCard
          isDark={isDark}
          icon={Wifi}
          iconColor={deviceStatus.wifiStatus === 'connected' ? 'text-green-500' : 'text-red-500'}
          iconBg={isDark ? (deviceStatus.wifiStatus === 'connected' ? 'bg-green-500/10' : 'bg-red-500/10') : (deviceStatus.wifiStatus === 'connected' ? 'bg-green-100' : 'bg-red-100')}
          label="Wi-Fi Status"
          value={deviceStatus.wifiStatus === 'connected' ? 'Connected' : 'Disconnected'}
          sub={`Signal: ${deviceStatus.signalStrength}%`}
          delay={0.2}
        />
        <StatCard
          isDark={isDark}
          icon={Activity}
          iconColor={deviceStatus.servoStatus === 'idle' ? 'text-blue-500' : deviceStatus.servoStatus === 'feeding' ? 'text-amber-500' : 'text-red-500'}
          iconBg={isDark ? (deviceStatus.servoStatus === 'idle' ? 'bg-blue-500/10' : 'bg-amber-500/10') : (deviceStatus.servoStatus === 'idle' ? 'bg-blue-100' : 'bg-amber-100')}
          label="Servo Motor"
          value={deviceStatus.servoStatus.charAt(0).toUpperCase() + deviceStatus.servoStatus.slice(1)}
          sub={deviceStatus.servoStatus === 'feeding' ? 'Currently distributing food' : 'Motor idle'}
          delay={0.3}
        />
        <StatCard
          isDark={isDark}
          icon={Battery}
          iconColor={deviceStatus.foodLevel < 25 ? 'text-red-500' : deviceStatus.foodLevel < 50 ? 'text-amber-500' : 'text-green-500'}
          iconBg={isDark ? (deviceStatus.foodLevel < 25 ? 'bg-red-500/10' : deviceStatus.foodLevel < 50 ? 'bg-amber-500/10' : 'bg-green-500/10') : (deviceStatus.foodLevel < 25 ? 'bg-red-100' : deviceStatus.foodLevel < 50 ? 'bg-amber-100' : 'bg-green-100')}
          label="Food Level"
          value={`${Math.round(deviceStatus.foodLevel)}%`}
          sub={deviceStatus.foodLevel < 25 ? '⚠ Refill recommended' : 'Sufficient supply'}
          delay={0.4}
        />
      </div>

      {/* Feeding Info + Food Level Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Last/Next Feeding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl border p-6 ${cardBase}`}
        >
          <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <Clock className="w-4 h-4 text-sky-500" />
            Feeding Schedule
          </h3>
          <div className="space-y-4">
            <div>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Last Feeding</p>
              <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {deviceStatus.lastFeeding ? new Date(deviceStatus.lastFeeding).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {deviceStatus.lastFeeding ? new Date(deviceStatus.lastFeeding).toLocaleDateString() : 'No data'}
              </p>
            </div>
            <div className={`h-px ${isDark ? 'bg-white/5' : 'bg-slate-100'}`} />
            <div>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Next Feeding</p>
              <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {deviceStatus.nextFeeding ? new Date(deviceStatus.nextFeeding).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                {deviceStatus.nextFeeding ? new Date(deviceStatus.nextFeeding).toLocaleDateString() : 'No data'}
              </p>
            </div>
            {schedules.filter(s => s.enabled).length > 0 && (
              <>
                <div className={`h-px ${isDark ? 'bg-white/5' : 'bg-slate-100'}`} />
                <div>
                  <p className={`text-xs mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Active Schedules</p>
                  <div className="space-y-1.5">
                    {schedules.filter(s => s.enabled).slice(0, 3).map(s => (
                      <div key={s.id} className={`flex items-center justify-between text-xs px-3 py-2 rounded-lg ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{s.name}</span>
                        <span className="font-mono font-semibold text-sky-500">{s.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Food Level Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`lg:col-span-2 rounded-2xl border p-6 ${cardBase}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <Fish className="w-4 h-4 text-sky-500" />
              Food Level (24h)
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Current: {Math.round(deviceStatus.foodLevel)}%</span>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={foodLevelHistory}>
                <defs>
                  <linearGradient id="foodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff0a' : '#00000008'} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    border: '1px solid',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: isDark ? '#94a3b8' : '#64748b' }}
                />
                <Area type="monotone" dataKey="level" stroke="#0ea5e9" strokeWidth={2} fill="url(#foodGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStat
          isDark={isDark}
          icon={Droplets}
          iconColor="text-blue-500"
          label="Water Quality"
          value="Good"
          valueColor="text-green-500"
        />
        <QuickStat
          isDark={isDark}
          icon={Zap}
          iconColor="text-yellow-500"
          label="Power"
          value="AC 220V"
          valueColor="text-slate-500"
        />
        <QuickStat
          isDark={isDark}
          icon={CheckCircle2}
          iconColor="text-emerald-500"
          label="Today's Feeds"
          value="2 / 3"
          valueColor="text-slate-500"
        />
        <QuickStat
          isDark={isDark}
          icon={Settings2}
          iconColor="text-purple-500"
          label="Firmware"
          value="v2.1.0"
          valueColor="text-slate-500"
        />
      </div>
    </div>
  );
}

function StatCard({ isDark, icon: Icon, iconColor, iconBg, label, value, sub, delay }: {
  isDark: boolean; icon: any; iconColor: string; iconBg: string; label: string; value: string; sub: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
        isDark ? 'bg-slate-900/60 border-white/5 hover:shadow-slate-900/50' : 'bg-white/60 border-white/50 hover:shadow-sky-100/50'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <ChevronRight className={`w-4 h-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
      </div>
      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
      <p className={`text-xl font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-800'}`}>{value}</p>
      <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{sub}</p>
    </motion.div>
  );
}

function QuickStat({ isDark, icon: Icon, iconColor, label, value, valueColor }: {
  isDark: boolean; icon: any; iconColor: string; label: string; value: string; valueColor: string;
}) {
  return (
    <div className={`rounded-xl p-4 flex items-center gap-3 ${isDark ? 'bg-slate-900/40 border border-white/5' : 'bg-white/40 border border-white/40'}`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <div>
        <p className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
        <p className={`text-sm font-semibold ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
}
