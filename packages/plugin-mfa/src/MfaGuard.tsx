import { useState, useEffect, type ReactNode } from 'react';
import { useAuthmsContext } from '@authms/react';

interface MfaStatus {
  enrolled: boolean;
  challenged: boolean;
}

const styles = {
  overlay: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: 300, padding: 24,
  } as React.CSSProperties,
  card: { maxWidth: 380, width: '100%', textAlign: 'center' } as React.CSSProperties,
  title: { fontSize: 18, fontWeight: 600, marginBottom: 8 } as React.CSSProperties,
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 20 } as React.CSSProperties,
  input: {
    width: '100%', padding: '10px 12px', fontSize: 20, textAlign: 'center',
    letterSpacing: 8, border: '1px solid #d1d5db', borderRadius: 6, outline: 'none',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  button: {
    width: '100%', padding: '10px 0', marginTop: 12,
    background: '#4f46e5', color: '#fff', border: 'none',
    borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer',
  } as React.CSSProperties,
  buttonDisabled: {
    width: '100%', padding: '10px 0', marginTop: 12,
    background: '#9ca3af', color: '#fff', border: 'none',
    borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'not-allowed',
  } as React.CSSProperties,
  error: { color: '#ef4444', fontSize: 13, marginTop: 8 } as React.CSSProperties,
  loading: { fontSize: 14, color: '#9ca3af' } as React.CSSProperties,
};

export function MfaGuard({ children }: { children: ReactNode }) {
  const { authms } = useAuthmsContext();
  const [status, setStatus] = useState<MfaStatus | null>(null);
  const [busy, setBusy] = useState(true);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    authms.api.get<MfaStatus>('/identity/api/v1/mfa/status')
      .then((s) => { if (!cancelled) setStatus(s); })
      .catch(() => { if (!cancelled) setStatus({ enrolled: false, challenged: false }); })
      .finally(() => { if (!cancelled) setBusy(false); });
    return () => { cancelled = true; };
  }, [authms]);

  if (busy) {
    return <div style={styles.overlay}><div style={styles.loading}>Loading...</div></div>;
  }

  if (!status?.enrolled) {
    return <>{children}</>;
  }

  if (status.challenged) {
    return <>{children}</>;
  }

  async function handleChallenge() {
    if (!code) return;
    setLoading(true);
    setError('');
    try {
      await authms.api.post('/identity/api/v1/mfa/challenge/verify', { code });
      setStatus((prev) => prev ? { ...prev, challenged: true } : prev);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Challenge failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <div style={styles.title}>Two-Factor Authentication</div>
        <div style={styles.subtitle}>
          Enter the 6-digit code from your authenticator app to continue.
        </div>

        <input
          style={styles.input}
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          onKeyDown={(e) => { if (e.key === 'Enter') handleChallenge(); }}
          autoFocus
        />

        <button
          style={loading || code.length !== 6 ? styles.buttonDisabled : styles.button}
          onClick={handleChallenge}
          disabled={loading || code.length !== 6}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>

        {error && <div style={styles.error}>{error}</div>}
      </div>
    </div>
  );
}
