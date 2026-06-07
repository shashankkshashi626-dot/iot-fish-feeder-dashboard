import { useState } from 'react';
import { useDevice } from '../contexts/DeviceContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Plus, Trash2, Edit2, Save, X, Clock
} from 'lucide-react';
import { FeedingSchedule } from '../types';

export function SchedulePage() {
  const { schedules, addSchedule, updateSchedule, deleteSchedule } = useDevice();
  const { isDark } = useTheme();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ name: string; time: string; portion: number } | null>(null);
  const [showForm, setShowForm] = useState(false);

  const cardBg = isDark
    ? 'bg-slate-900/60 border-white/5'
    : 'bg-white/60 border-white/50';

  const inputClass = isDark
    ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-sky-500/50'
    : 'bg-white/60 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-sky-300';

  const startEdit = (schedule?: FeedingSchedule) => {
    setEditingId(schedule?.id || null);
    setFormData({
      name: schedule?.name || '',
      time: schedule?.time || '08:00',
      portion: schedule?.portion || 5,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData) return;
    if (editingId) {
      updateSchedule(editingId, formData);
    } else {
      addSchedule({ ...formData, enabled: true });
    }
    setShowForm(false);
    setEditingId(null);
    setFormData(null);
  };

  const toggleEnabled = (id: string, enabled: boolean) => {
    updateSchedule(id, { enabled: !enabled });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl lg:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Feeding Schedules
          </h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage automatic feeding times and portions
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => startEdit()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 shadow-lg shadow-sky-500/20"
        >
          <Plus className="w-4 h-4" />
          Add Schedule
        </motion.button>
      </div>

      {/* Schedules List */}
      {schedules.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-2xl border p-12 text-center ${cardBg}`}
        >
          <Calendar className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
          <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>No Schedules Yet</h3>
          <p className={`text-sm mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Add your first feeding schedule to automate feeding
          </p>
          <button
            onClick={() => startEdit()}
            className="mt-4 px-4 py-2 rounded-xl text-sm font-medium text-sky-500 border border-sky-500/20 hover:bg-sky-500/10 transition-all"
          >
            Create Schedule
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {schedules.map((schedule, i) => (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-2xl border p-5 transition-all duration-300 ${
                schedule.enabled
                  ? cardBg
                  : isDark ? 'bg-slate-900/30 border-white/3' : 'bg-slate-50/60 border-slate-200/50'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Time */}
                  <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${
                    schedule.enabled
                      ? isDark ? 'bg-sky-500/10 border border-sky-500/20' : 'bg-sky-50 border border-sky-200'
                      : isDark ? 'bg-slate-800/50' : 'bg-slate-100'
                  }`}>
                    <Clock className={`w-4 h-4 mb-0.5 ${schedule.enabled ? 'text-sky-500' : (isDark ? 'text-slate-600' : 'text-slate-400')}`} />
                    <span className={`text-sm font-bold font-mono ${schedule.enabled ? 'text-sky-500' : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>
                      {schedule.time}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold ${schedule.enabled ? (isDark ? 'text-white' : 'text-slate-800') : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>
                      {schedule.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Portion: <span className="font-medium">{schedule.portion}g</span>
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        schedule.enabled
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-slate-500/10 text-slate-500'
                      }`}>
                        {schedule.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleEnabled(schedule.id, schedule.enabled)}
                    className={`w-12 h-7 rounded-full transition-colors relative ${
                      schedule.enabled ? 'bg-sky-500' : isDark ? 'bg-slate-700' : 'bg-slate-300'
                    }`}
                  >
                    <motion.div
                      layout
                      className={`w-5 h-5 rounded-full absolute top-1 ${
                        schedule.enabled ? 'right-1 bg-white' : 'left-1 bg-white'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => startEdit(schedule)}
                    className={`p-2 rounded-lg transition-all ${isDark ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteSchedule(schedule.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowForm(false); setEditingId(null); setFormData(null); }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`fixed inset-0 z-50 flex items-center justify-center p-4`}
            >
              <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
                isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-white/50'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {editingId ? 'Edit Schedule' : 'New Schedule'}
                  </h3>
                  <button
                    onClick={() => { setShowForm(false); setEditingId(null); setFormData(null); }}
                    className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-100'}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Schedule Name
                    </label>
                    <input
                      type="text"
                      value={formData?.name || ''}
                      onChange={e => setFormData(prev => prev ? { ...prev, name: e.target.value } : null)}
                      placeholder="e.g., Morning Feeding"
                      className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Time
                    </label>
                    <input
                      type="time"
                      value={formData?.time || ''}
                      onChange={e => setFormData(prev => prev ? { ...prev, time: e.target.value } : null)}
                      className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all ${inputClass}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Portion (grams)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={formData?.portion || 5}
                      onChange={e => setFormData(prev => prev ? { ...prev, portion: parseInt(e.target.value) || 1 } : null)}
                      className={`w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all ${inputClass}`}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => { setShowForm(false); setEditingId(null); setFormData(null); }}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                      isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
