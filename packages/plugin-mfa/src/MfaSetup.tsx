import { useState } from 'react';
import { useAuthmsContext } from '@authms/react';
import { BackupCodes } from './BackupCodes';

type FlowState = 'setup' | 'verify' | 'done';

interface TotpSetupData {
  secret: string;
  qrCodeUri: string;
  backupCodes: string[];
}

const styles = {
  container: { maxWidth: 420, margin: '0 auto', padding: 24 } as React.CSSProperties,
  title: { fontSize: 20, fontWeight: 600, marginBottom: 8 } as React.CSSProperties,
  subtitle: { fontSize: 14, color: '#6b7280', marginBottom: 20 } as React.CSSProperties,
  qrPlaceholder: {
    width: 200, height: 200, margin: '0 auto 16px',
    background: '#f3f4f6', borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, color: '#9ca3af', textAlign: 'center',
  } as React.CSSProperties,
  secretBox: {
    background: '#f9fafb', border: '1px solid #e5e7eb',
    borderRadius: 6, padding: '10px 14px', marginBottom: 20,
    fontFamily: 'monospace', fontSize: 14, wordBreak: 'break-all',
  } as React.CSSProperties,
  input: {
    width: '100%', padding: '10px 12px', fontSize: 16,
    border: '1px solid #d1d5db', borderRadius: 6, outline: 'none',
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
  doneIcon: { fontSize: 48, marginBottom: 12, textAlign: 'center' } as React.CSSProperties,
};

export function MfaSetup() {
  const { authms } = useAuthmsContext();
  const [flow, setFlow] = useState<FlowState>('setup');
  const [data, setData] = useState<TotpSetupData | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setLoading(true);
    setError('');
    try {
      const result = await authms.api.post<TotpSetupData>(
        '/identity/api/v1/mfa/totp/generate',
      );
      setData(result);
      setFlow('verify');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate MFA setup');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!code || !data) return;
    setLoading(true);
    setError('');
    try {
      await authms.api.post('/identity/api/v1/mfa/totp/verify', { code });
      setFlow('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  if (flow === 'done') {
    return (
      <div style={styles.container}>
        <div style={styles.doneIcon}>&#10003;</div>
        <div style={styles.title}>MFA Enabled</div>
        <div style={styles.subtitle}>
          Two-factor authentication has been set up successfully.
        </div>
        {data?.backupCodes && data.backupCodes.length > 0 && (
          <BackupCodes codes={data.backupCodes} />
        )}
      </div>
    );
  }

  if (flow === 'verify' && data) {
    return (
      <div style={styles.container}>
        <div style={styles.title}>Verify Setup</div>
        <div style={styles.subtitle}>
          Scan the QR code with your authenticator app, then enter the 6-digit code.
        </div>

        {/* QR Code placeholder — replace with actual qrcode generation in your app */}
        <div style={styles.qrPlaceholder}>
          <div>
            <div style={{ marginBottom: 8 }}>&#128268;</div>
            QR Code
            <br />
            <span style={{ fontSize: 11 }}>Use a qrcode library to render:</span>
            <br />
            <span style={{ fontSize: 11, fontFamily: 'monospace' }}>
              {data.qrCodeUri.substring(0, 60)}...
            </span>
          </div>
        </div>

        <div style={styles.secretBox}>
          Or enter manually: <strong>{data.secret}</strong>
        </div>

        <input
          style={styles.input}
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          onKeyDown={(e) => { if (e.key === 'Enter') handleVerify(); }}
          autoFocus
        />

        <button
          style={loading || code.length !== 6 ? styles.buttonDisabled : styles.button}
          onClick={handleVerify}
          disabled={loading || code.length !== 6}
        >
          {loading ? 'Verifying...' : 'Confirm'}
        </button>

        {error && <div style={styles.error}>{error}</div>}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.title}>Set Up Two-Factor Authentication</div>
      <div style={styles.subtitle}>
        Add an extra layer of security to your account by enabling
        time-based one-time passwords (TOTP).
      </div>

      <button
        style={loading ? styles.buttonDisabled : styles.button}
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Enable Authenticator App'}
      </button>

      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}
