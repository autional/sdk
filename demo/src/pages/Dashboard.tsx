import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthms } from '@authms/react';
import { getProfile } from '@authms/api-identity';

export function Dashboard() {
  const { user, logout, getAccessToken, authConfig } = useAuthms();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    getAccessToken().then(t => setToken(t || ''));
    // Fetch profile using the api-identity package
    getProfile({} as any).then(p => setProfile(p as any)).catch(() => {});
  }, []);

  const handleLogout = async () => {
    addLog('Logging out...');
    try {
      await logout();
      navigate('/login');
    } catch (e: any) {
      addLog(`Logout error: ${e.message}`);
    }
  };

  const addLog = (msg: string) => {
    setLog(prev => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleTestApi = async () => {
    addLog('GET /auth/me ...');
    try {
      const result = await getProfile({} as any);
      setProfile(result as any);
      addLog('GET /auth/me OK');
    } catch (e: any) {
      addLog(`GET /auth/me FAILED: ${e.message}`);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', padding: '0 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Dashboard</h1>
          <p style={{ color: '#6b7280' }}>Welcome, {user?.email || user?.username || user?.id || 'User'}</p>
        </div>
        <button className="btn btn-danger" style={{ width: 'auto', padding: '8px 20px' }} onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      {/* Auth Config Summary */}
      <div className="container">
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Auth Config</h2>
        <div className="info-row">
          <span>Login Methods</span>
          <span>{(authConfig as any)?.loginMethods?.join(', ') || 'N/A'}</span>
        </div>
        <div className="info-row">
          <span>Password Transmission</span>
          <span className="badge badge-blue">{(authConfig as any)?.passwordPolicy?.passwordTransmission || 'plain'}</span>
        </div>
        <div className="info-row">
          <span>CAPTCHA</span>
          <span className="badge badge-green">{(authConfig as any)?.captchaProvider || 'none'}</span>
        </div>
      </div>

      {/* User Info */}
      <div className="container" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>User Profile</h2>
        {profile ? (
          <>
            <div className="info-row"><span>ID</span><span>{profile.id as string}</span></div>
            {profile.email && <div className="info-row"><span>Email</span><span>{profile.email as string}</span></div>}
            <div className="info-row"><span>Status</span><span className="badge badge-green">{profile.status as string || 'active'}</span></div>
          </>
        ) : (
          <button className="btn btn-primary" onClick={handleTestApi}>Fetch Profile</button>
        )}
      </div>

      {/* Access Token */}
      <div className="container" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Access Token (JWT)</h2>
        <pre>{token.substring(0, 80)}...</pre>
      </div>

      {/* Log */}
      <div className="container" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Event Log</h2>
        {log.length === 0 && <p style={{ color: '#9ca3af' }}>No events yet. Try logging out or refreshing the profile.</p>}
        {log.map((l, i) => <div key={i} style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>{l}</div>)}
      </div>
    </div>
  );
}
