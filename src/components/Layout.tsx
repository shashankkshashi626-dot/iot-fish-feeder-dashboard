import { ReactNode, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Clock, Settings, LogOut, Menu,
  Fish, Sun, Moon, Waves
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'schedule', label: 'Schedules', icon: Calendar },
  { id: 'history', label: 'History', icon: Clock },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname.replace('/', '') || 'dashboard';

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-sky-50/50'}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {/* Gradient orbs */}
        <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 animate-pulse ${
          isDark ? 'bg-sky-900' : 'bg-sky-200'
        }`} />
        <div className={`absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 animate-pulse ${
          isDark ? 'bg-teal-900' : 'bg-teal-200'
        }`} style={{ animationDelay: '2s' }} />
        <div className={`absolute -bottom-40 right-1/3 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 animate-pulse ${
          isDark ? 'bg-blue-900' : 'bg-blue-200'
        }`} style={{ animationDelay: '4s' }} />
        {/* Bubbles */}
        <div className="absolute bottom-0 left-[10%] w-3 h-3 rounded-full bg-sky-400/20 animate-bubble" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-0 left-[30%] w-2 h-2 rounded-full bg-sky-400/15 animate-bubble" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-[60%] w-4 h-4 rounded-full bg-sky-400/10 animate-bubble" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-0 left-[85%] w-2.5 h-2.5 rounded-full bg-sky-400/20 animate-bubble" style={{ animationDelay: '6s' }} />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : 0 }}
        className={`fixed top-0 left-0 z-50 h-full w-72 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isDark
          ? 'bg-slate-900/95 border-r border-white/5'
          : 'bg-white/80 border-r border-white/50'
        } glass`}
        style={{ backdropFilter: 'blur(20px)' }}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="relative">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-gradient-to-br from-sky-500 to-teal-500' : 'bg-gradient-to-br from-sky-400 to-cyan-500'
            }`}>
              <Fish className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-sky-400 to-teal-400 opacity-20 blur-sm -z-10" />
          </div>
          <div>
            <h1 className={`font-bold text-xl tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Aqua<span className="text-sky-500">mate</span>
            </h1>
            <p className={`text-[10px] tracking-widest uppercase ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Smart Feeder</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="px-4 mt-2 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { navigate(`/${item.id}`); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? isDark
                      ? 'bg-gradient-to-r from-sky-500/20 to-teal-500/10 text-sky-400 border border-sky-500/20'
                      : 'bg-gradient-to-r from-sky-50 to-cyan-50 text-sky-600 border border-sky-200 shadow-sm'
                    : isDark
                      ? 'text-slate-400 hover:bg-white/5 hover:text-white'
                      : 'text-slate-500 hover:bg-sky-50/50 hover:text-slate-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-sky-500' : ''}`} />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className={`rounded-2xl p-4 mb-3 ${
            isDark ? 'bg-gradient-to-br from-sky-500/10 to-teal-500/10 border border-white/5' : 'bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-100'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Waves className="w-4 h-4 text-sky-500" />
              <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>Device Info</span>
            </div>
            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              ESP32 • v2.1.0
            </p>
            <p className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              {user?.email || ''}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleTheme}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isDark
                  ? 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? 'Light' : 'Dark'}
            </button>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className={`sticky top-0 z-30 px-4 lg:px-8 py-4 border-b backdrop-blur-xl ${
          isDark ? 'bg-slate-950/80 border-white/5' : 'bg-sky-50/60 border-white/50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`lg:hidden p-2 rounded-xl ${isDark ? 'hover:bg-white/5' : 'hover:bg-white/50'}`}
              >
                <Menu className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
              </button>
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl mr-2 bg-gradient-to-br from-sky-400 to-teal-500"
              >
                <Fish className="w-5 h-5 text-white" />
              </button>
              <h2 className={`text-lg font-semibold capitalize ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {currentPage}
              </h2>
            </div>
            <button
              onClick={toggleTheme}
              className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10' : 'bg-white/60 text-slate-500 hover:bg-white/80'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
