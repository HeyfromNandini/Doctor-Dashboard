import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Today from './pages/Today';
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';
import './App.css';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/today" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/today" element={<ProtectedRoute><Today /></ProtectedRoute>} />
      <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/today" replace />} />
      <Route path="*" element={<Navigate to="/today" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
