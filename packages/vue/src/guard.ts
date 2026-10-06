import { getAutional } from './createAutional';

interface RouteLocation {
  path: string;
  fullPath: string;
  query: Record<string, unknown>;
}

type GuardReturn =
  | boolean
  | { path: string; query?: Record<string, string> };

type NavigationGuard = (to: RouteLocation, from: RouteLocation) => GuardReturn;

export function autionalGuard(roles?: string[]): NavigationGuard {
  return (to) => {
    const autional = getAutional();

    if (!autional || !autional.isReady()) {
      return true;
    }

    if (!autional.isAuthenticated()) {
      if (to.path === '/login') return true;
      return { path: '/login', query: { redirect: to.fullPath } };
    }

    if (roles && roles.length > 0) {
      const user = autional.user;
      const userRole = (user as Record<string, unknown> | null)?.['role'] as string | undefined;

      if (!userRole || !roles.includes(userRole)) {
        return { path: '/forbidden' };
      }
    }

    return true;
  };
}
