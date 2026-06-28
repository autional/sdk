import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthms, RequireAuth } from './authms';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

export function App() {
  const { isAuthenticated } = useAuthms();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth loadingFallback={<div style={{ padding: 60, textAlign: 'center' }}>Loading...</div>}>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
