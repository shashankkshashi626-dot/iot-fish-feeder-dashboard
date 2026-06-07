import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DeviceProvider } from './contexts/DeviceContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/Login';
import { SignupPage } from './pages/Signup';
import { DashboardPage } from './pages/Dashboard';
import { SchedulePage } from './pages/Schedule';
import { HistoryPage } from './pages/History';
import { SettingsPage } from './pages/Settings';
import { initDefaults } from './utils/storage';

// Initialize defaults on first load
initDefaults();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/schedule"
        element={
          <ProtectedRoute>
            <SchedulePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DeviceProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </DeviceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
