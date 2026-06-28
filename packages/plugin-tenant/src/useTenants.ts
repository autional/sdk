import { useState, useCallback } from 'react';
import type { AuthMS } from '@authms/core';

export interface Tenant {
  id: string;
  name: string;
  displayName?: string;
}

export function useTenants(authms: AuthMS, tenants: Tenant[]) {
  const [currentId, setCurrentId] = useState<string | null>(
    () => authms.getTenantId(),
  );

  const switchTenant = useCallback(
    (id: string) => {
      authms.setTenantId(id);
      setCurrentId(id);
      authms.emit('TOKEN_CHANGED');
    },
    [authms],
  );

  return { tenants, currentId, switchTenant };
}
