'use client';

import { useState } from 'react';

export interface PasskeyLoginProps {
  onSuccess?: (user: any) => void;
  onError?: (e: Error) => void;
}

export function PasskeyLogin({ onSuccess, onError }: PasskeyLoginProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setState('loading');
    try {
      const publicKey: PublicKeyCredentialRequestOptions = {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rpId: window.location.hostname,
        userVerification: 'required',
        timeout: 60000,
      };

      const assertion = await navigator.credentials.get({ publicKey });
      setState('success');
      onSuccess?.({ credential: assertion });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Authentication failed';
      setState('error');
      setErrorMsg(msg);
      onError?.(e instanceof Error ? e : new Error(msg));
    }
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <button
        onClick={handleLogin}
        disabled={state === 'loading'}
        style={{
          padding: '10px 24px',
          fontSize: 16,
          borderRadius: 8,
          border: '1px solid #4F46E5',
          background: state === 'loading' ? '#A5B4FC' : '#fff',
          color: state === 'loading' ? '#fff' : '#4F46E5',
          cursor: state === 'loading' ? 'not-allowed' : 'pointer',
        }}
      >
        {state === 'loading' ? 'Signing in...' : 'Sign in with Passkey'}
      </button>
      {state === 'success' && (
        <span style={{ color: '#16A34A', fontSize: 14 }}>Signed in!</span>
      )}
      {state === 'error' && (
        <span style={{ color: '#DC2626', fontSize: 14 }}>{errorMsg}</span>
      )}
    </div>
  );
}
