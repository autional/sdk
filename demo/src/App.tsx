import { Routes, Route, Navigate } from 'react-router-dom';
import { useAutional, RequireAuth } from './autional';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { OAuthCallback } from './pages/OAuthCallback';

export function App() {
  const { isAuthenticated } = useAutional();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />
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
