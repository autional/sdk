import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthms } from '../authms';

export function Login() {
  const { authConfig, login, loginWithOAuth, isLoading } = useAuthms();
  const navigate = useNavigate();
  const [identity, setIdentity] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loginMethods = (authConfig as any)?.loginMethods || ['password'];
  const oauthProviders = (authConfig as any)?.oauthProviders || [];
  const passwordPolicy = (authConfig as any)?.passwordPolicy || {};
  const transmissionMode = passwordPolicy.passwordTransmission || 'plain';
  const captchaProvider = (authConfig as any)?.captchaProvider || 'none';

  const handlePasswordLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!identity || !password) {
      setError('Please enter email and password');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await login({ email: identity, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOAuth = (provider: string) => {
    loginWithOAuth({ provider });
  };

  if (isLoading) {
    return <div style={{ padding: 60, textAlign: 'center' }}>Loading auth config...</div>;
  }

  return (
    <div className="container">
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Sign In</h1>
      <p style={{ color: '#6b7280', marginBottom: 24 }}>
        {(authConfig as any)?.displayName || 'AuthMS Demo'} — AI-powered authentication
      </p>

      {/* Auth Config Info */}
      <div style={{ background: '#f0f9ff', padding: 12, borderRadius: 8, marginBottom: 24, fontSize: 13 }}>
        <div className="info-row">
          <span>Transmission</span>
          <span className={`badge ${transmissionMode === 'plain' ? 'badge-red' : 'badge-green'}`}>{transmissionMode}</span>
        </div>
        <div className="info-row">
          <span>CAPTCHA</span>
          <span className={`badge ${captchaProvider !== 'none' ? 'badge-blue' : 'badge-red'}`}>{captchaProvider}</span>
        </div>
        <div className="info-row">
          <span>Login Methods</span>
          <span>{loginMethods.join(', ')}</span>
        </div>
      </div>

      {/* Password Login */}
      {loginMethods.includes('password') && (
        <form onSubmit={handlePasswordLogin}>
          <label className="label">Email</label>
          <input className="input" type="email" value={identity} onChange={e => setIdentity(e.target.value)} placeholder="you@example.com" />

          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          {passwordPolicy.minLength > 0 && (
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
              Min {passwordPolicy.minLength} chars {passwordPolicy.requireUpper ? '+ uppercase' : ''} {passwordPolicy.requireDigit ? '+ digit' : ''}
            </p>
          )}

          {error && <p className="error">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In with Password'}
          </button>
        </form>
      )}

      {/* OAuth Buttons */}
      {oauthProviders.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: 12 }}>or continue with</p>
          {oauthProviders.map((provider: string) => (
            <button key={provider} className="btn btn-oauth" onClick={() => handleOAuth(provider)}>
              <span style={{ fontSize: 18 }}>{getOAuthIcon(provider)}</span>
              Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Magic Link */}
      {loginMethods.includes('magic_link') && (
        <div style={{ marginTop: 20 }}>
          <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: 12 }}>or</p>
          <button className="btn btn-oauth" onClick={() => alert('Magic link flow — not implemented in demo')}>
            Send Magic Link
          </button>
        </div>
      )}
    </div>
  );
}

function getOAuthIcon(provider: string): string {
  const icons: Record<string, string> = { google: '🔵', github: '⚫', wechat: '🟢', apple: '⚪' };
  return icons[provider] || '🔗';
}
