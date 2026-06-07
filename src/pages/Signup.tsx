import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Fish, Mail, Lock, Eye, EyeOff, Loader2, User } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function SignupPage() {
  const { register } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const result = await register(email, name, password);
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${
      isDark ? 'bg-slate-950' : 'bg-gradient-to-br from-teal-100 via-sky-50 to-cyan-100'
    }`}>
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 ${
          isDark ? 'bg-teal-900' : 'bg-teal-300'
        }`} />
        <div className={`absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 ${
          isDark ? 'bg-sky-900' : 'bg-sky-300'
        }`} />
        <div className="absolute bottom-0 left-[20%] w-3 h-3 rounded-full bg-teal-400/20 animate-bubble" />
        <div className="absolute bottom-0 left-[60%] w-2 h-2 rounded-full bg-teal-400/15 animate-bubble" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative w-full max-w-md rounded-3xl p-8 border shadow-2xl backdrop-blur-xl ${
          isDark
            ? 'bg-slate-900/70 border-white/10 shadow-slate-900/50'
            : 'bg-white/70 border-white/60 shadow-teal-200/30'
        }`}
      >
        {success ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <span className="text-3xl">✓</span>
              </motion.div>
            </div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Account Created!</h2>
            <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Redirecting to login...</p>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-8">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className={`inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-4 ${
                  isDark ? 'bg-gradient-to-br from-teal-500 to-sky-500' : 'bg-gradient-to-br from-teal-400 to-sky-500'
                }`}
              >
                <Fish className="w-9 h-9 text-white" />
              </motion.div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Create Account
              </h1>
              <p className={`AquaMatetext-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Get started with 
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Full Name</label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all border ${
                      isDark ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-teal-500/50' : 'bg-white/60 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-teal-300'
                    }`} />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Email Address</label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all border ${
                      isDark ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-teal-500/50' : 'bg-white/60 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-teal-300'
                    }`} />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Password</label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                    className={`w-full pl-10 pr-12 py-3 rounded-xl text-sm outline-none transition-all border ${
                      isDark ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-teal-500/50' : 'bg-white/60 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-teal-300'
                    }`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Confirm Password</label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all border ${
                      isDark ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-teal-500/50' : 'bg-white/60 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-teal-300'
                    }`} />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 transition-all disabled:opacity-50 shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
              </button>
            </form>

            <p className={`text-center text-sm mt-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="text-teal-500 hover:text-teal-400 font-medium">
                Sign In
              </button>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
