import { type FC } from 'react';
import type { AuthMS } from '@authms/core';
import { useTenants } from './useTenants';
import type { Tenant } from './useTenants';

export interface TenantSwitcherProps {
  authms: AuthMS;
  tenants: Tenant[];
}

const wrapper: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '4px 12px',
  borderRadius: 6,
  border: '1px solid #e2e8f0',
  background: '#fff',
  fontSize: 14,
  fontFamily: 'inherit',
};

const label: React.CSSProperties = {
  color: '#64748b',
  whiteSpace: 'nowrap',
};

const select: React.CSSProperties = {
  border: 'none',
  outline: 'none',
  background: 'transparent',
  fontSize: 14,
  fontWeight: 500,
  color: '#1e293b',
  cursor: 'pointer',
  maxWidth: 200,
};

export const TenantSwitcher: FC<TenantSwitcherProps> = ({ authms, tenants }) => {
  const { currentId, switchTenant } = useTenants(authms, tenants);
  const current = tenants.find((t) => t.id === currentId);

  return (
    <div style={wrapper}>
      <span style={label}>
        {current?.displayName ?? current?.name ?? '\u2014'}
      </span>
      <select
        style={select}
        value={currentId ?? ''}
        onChange={(e) => switchTenant(e.target.value)}
      >
        <option value="" disabled>
          Switch tenant
        </option>
        {tenants.map((t) => (
          <option key={t.id} value={t.id}>
            {t.displayName ?? t.name}
          </option>
        ))}
      </select>
    </div>
  );
};
