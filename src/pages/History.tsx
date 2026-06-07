import { useState, useMemo } from 'react';
import { useDevice } from '../contexts/DeviceContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  Clock, CheckCircle2, XCircle, Play, Calendar as CalendarIcon,
  AlertCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function HistoryPage() {
  const { history } = useDevice();
  const { isDark } = useTheme();
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'manual'>('all');

  const filteredHistory = useMemo(() => {
    if (filter === 'all') return history;
    return history.filter(h => h.type === filter);
  }, [history, filter]);

  const summary = useMemo(() => {
    const total = history.length;
    const success = history.filter(h => h.status === 'success').length;
    const failed = history.filter(h => h.status === 'failed').length;
    const manual = history.filter(h => h.type === 'manual').length;
    const scheduled = history.filter(h => h.type === 'scheduled').length;
    return { total, success, failed, manual, scheduled };
  }, [history]);

  const chartData = useMemo(() => {
    const days: Record<string, { success: number; failed: number }> = {};
    history.slice(0, 7).forEach(h => {
      const day = new Date(h.timestamp).toLocaleDateString([], { weekday: 'short' });
      if (!days[day]) days[day] = { success: 0, failed: 0 };
      days[day][h.status]++;
    });
    return Object.entries(days).map(([name, data]) => ({ name, ...data }));
  }, [history]);

  const cardBg = isDark
    ? 'bg-slate-900/60 border-white/5'
    : 'bg-white/60 border-white/50';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Feeding History
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            View all past feeding records
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'scheduled', 'manual'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                filter === f
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-white/60 text-slate-500 hover:bg-white/80'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard isDark={isDark} label="Total Feeds" value={summary.total} icon={Clock} color="text-sky-500" />
        <SummaryCard isDark={isDark} label="Successful" value={summary.success} icon={CheckCircle2} color="text-green-500" />
        <SummaryCard isDark={isDark} label="Failed" value={summary.failed} icon={XCircle} color="text-red-500" />
        <SummaryCard isDark={isDark} label="Manual Feeds" value={summary.manual} icon={Play} color="text-amber-500" />
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border p-6 ${cardBg}`}
      >
        <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          Recent Feeding Activity
        </h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#ffffff0a' : '#00000008'} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  border: '1px solid',
                  borderColor: isDark ? '#334155' : '#e2e8f0',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="success" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`rounded-2xl border overflow-hidden ${cardBg}`}
      >
        <div className={`px-6 py-4 border-b ${isDark ? 'border-white/5' : 'border-white/50'}`}>
          <h3 className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            All Records ({filteredHistory.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={isDark ? 'bg-white/[0.02]' : 'bg-slate-50/50'}>
                <th className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Date & Time</th>
                <th className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Type</th>
                <th className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Portion</th>
                <th className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <AlertCircle className={`w-8 h-8 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No feeding records found</p>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((entry, i) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={`transition-colors ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-sky-50/30'}`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {new Date(entry.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        entry.type === 'scheduled'
                          ? isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                          : isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {entry.type === 'scheduled' ? <CalendarIcon className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {entry.portion}g
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        entry.status === 'success'
                          ? isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'
                          : isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'
                      }`}>
                        {entry.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

function SummaryCard({ isDark, label, value, icon: Icon, color }: {
  isDark: boolean; label: string; value: number; icon: any; color: string;
}) {
  return (
    <div className={`rounded-xl p-4 border ${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-white/40 border-white/40'}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <div>
          <p className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
          <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
