/**
 * AuthMS Demo — AI App Authentication
 *
 * 配置在 src/authms.ts，复制 examples/react-authms.ts 模式。
 * 项目里永远 import from './authms'。
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthmsProvider, authmsConfig } from './authms';
import { App } from './App';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div style={{ maxWidth: 640, margin: '80px auto', padding: 32, textAlign: 'center' }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Connection Error</h2>
      <p style={{ color: '#6b7280', marginBottom: 16, lineHeight: 1.6 }}>
        Could not connect to AuthMS at{' '}
        <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: 4 }}>
          {import.meta.env.VITE_AUTHMS_ISSUER || 'http://localhost:11080'}
        </code>
      </p>
      <pre style={{ background: '#fee2e2', color: '#991b1b', padding: 16, borderRadius: 8, fontSize: 13, textAlign: 'left', marginBottom: 16 }}>
        {error.message}
      </pre>
      <div style={{ background: '#f0f9ff', padding: 16, borderRadius: 8, fontSize: 13, textAlign: 'left', lineHeight: 1.8 }}>
        <strong>To run this demo:</strong><br />
        1. Start AuthMS: <code>docker compose -f docker-compose.infra.yml -f docker-compose.services.yml up -d</code><br />
        2. Set env var: <code>VITE_AUTHMS_URL=http://localhost:11080</code><br />
        3. Create an app and set: <code>VITE_AUTHMS_APP_ID=app_xxx</code><br />
        4. Or test with mock config: <code>VITE_AUTHMS_MOCK=true</code>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) return <ErrorFallback error={this.state.error} />;
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthmsProvider
          config={authmsConfig}
          loadingFallback={<div style={{ textAlign: 'center', padding: 60 }}>Connecting to AuthMS...</div>}
        >
          <App />
        </AuthmsProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
