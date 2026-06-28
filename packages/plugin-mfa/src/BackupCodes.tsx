import { useState } from 'react';

const styles = {
  wrapper: { marginTop: 20 } as React.CSSProperties,
  warning: {
    background: '#fef3c7', border: '1px solid #f59e0b',
    borderRadius: 6, padding: '10px 14px', marginBottom: 14,
    fontSize: 13, color: '#92400e',
  } as React.CSSProperties,
  codeList: {
    background: '#1f2937', color: '#e5e7eb',
    borderRadius: 8, padding: '14px 18px',
    fontFamily: 'monospace', fontSize: 14, lineHeight: 2,
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px',
    marginBottom: 14,
  } as React.CSSProperties,
  button: {
    width: '100%', padding: '8px 0',
    background: '#fff', color: '#374151', border: '1px solid #d1d5db',
    borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer',
  } as React.CSSProperties,
  copied: {
    width: '100%', padding: '8px 0',
    background: '#ecfdf5', color: '#065f46', border: '1px solid #6ee7b7',
    borderRadius: 6, fontSize: 13, fontWeight: 500,
  } as React.CSSProperties,
};

export function BackupCodes({ codes }: { codes: string[] }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(codes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.warning}>
        &#9888; Store these recovery codes in a safe place. Each code can only be
        used once. If you lose access to your authenticator app, these codes are
        the only way to recover your account.
      </div>

      <div style={styles.codeList}>
        {codes.map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>

      <button
        style={copied ? styles.copied : styles.button}
        onClick={handleCopy}
      >
        {copied ? 'Copied!' : 'Copy All Codes'}
      </button>
    </div>
  );
}
