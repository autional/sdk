'use client';

import { useState } from 'react';

export interface PasskeyRegisterProps {
  onSuccess?: () => void;
  onError?: (e: Error) => void;
}

export function PasskeyRegister({ onSuccess, onError }: PasskeyRegisterProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    setState('loading');
    try {
      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rp: { name: 'AuthMS', id: window.location.hostname },
        user: {
          id: crypto.getRandomValues(new Uint8Array(16)),
          name: 'user@example.com',
          displayName: 'User',
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        timeout: 60000,
        attestation: 'none',
      };

      await navigator.credentials.create({ publicKey });
      setState('success');
      onSuccess?.();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Registration failed';
      setState('error');
      setErrorMsg(msg);
      onError?.(e instanceof Error ? e : new Error(msg));
    }
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <button
        onClick={handleRegister}
        disabled={state === 'loading'}
        style={{
          padding: '10px 24px',
          fontSize: 16,
          borderRadius: 8,
          border: '1px solid #4F46E5',
          background: state === 'loading' ? '#A5B4FC' : '#4F46E5',
          color: '#fff',
          cursor: state === 'loading' ? 'not-allowed' : 'pointer',
        }}
      >
        {state === 'loading' ? 'Registering...' : 'Register Passkey'}
      </button>
      {state === 'success' && (
        <span style={{ color: '#16A34A', fontSize: 14 }}>Passkey registered!</span>
      )}
      {state === 'error' && (
        <span style={{ color: '#DC2626', fontSize: 14 }}>{errorMsg}</span>
      )}
    </div>
  );
}
