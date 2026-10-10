import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutionalContext } from '@autional/react';

/**
 * SSO 回调页 — 路由 /oauth/callback 必须与 autionalConfig 中注册的 redirect_uri 一致。
 */
export function OAuthCallback() {
  const { autional } = useAutionalContext();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    autional
      .handleOAuthCallback(window.location.href)
      .then(() => {
        if (!cancelled) navigate('/dashboard', { replace: true });
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'SSO 登录失败');
      });
    return () => { cancelled = true; };
  }, [autional, navigate]);

  if (error) {
    return (
      <div style={{ padding: 60, textAlign: 'center' }}>
        <h2 style={{ marginBottom: 8 }}>登录失败</h2>
        <p style={{ color: '#ef4444', marginBottom: 16 }}>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/login', { replace: true })}>
          返回登录
        </button>
      </div>
    );
  }

  return <div style={{ padding: 60, textAlign: 'center' }}>正在完成登录…</div>;
}
