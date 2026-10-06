import { useState, useCallback } from 'react';
import type { Autional } from '@autional/core';

export interface Tenant {
  id: string;
  name: string;
  displayName?: string;
}

export function useTenants(autional: Autional, tenants: Tenant[]) {
  const [currentId, setCurrentId] = useState<string | null>(
    () => autional.getTenantId(),
  );

  const switchTenant = useCallback(
    (id: string) => {
      autional.setTenantId(id);
      setCurrentId(id);
      autional.emit('TOKEN_CHANGED');
    },
    [autional],
  );

  return { tenants, currentId, switchTenant };
}
