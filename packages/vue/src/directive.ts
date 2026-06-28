import { type Directive, type DirectiveBinding } from 'vue';
import { getAuthms } from './createAuthms';

type AuthRoles = string | string[];

function hasRequiredRole(roles: AuthRoles): boolean {
  const authms = getAuthms();
  if (!authms?.isAuthenticated()) return false;

  const user = authms.user;
  if (!user) return false;

  const userRole = user.role as string | undefined;
  if (!userRole) return false;

  const required = Array.isArray(roles) ? roles : [roles];
  return required.length === 0 || required.includes(userRole);
}

function updateVisibility(el: HTMLElement, binding: DirectiveBinding<AuthRoles>): void {
  const visible = hasRequiredRole(binding.value);

  if (visible) {
    if (el.style.display === 'none') {
      (el as HTMLElement & { __vAuthOrigDisplay?: string }).style.display =
        (el as HTMLElement & { __vAuthOrigDisplay?: string }).__vAuthOrigDisplay ?? '';
    }
  } else {
    if (el.style.display !== 'none') {
      (el as HTMLElement & { __vAuthOrigDisplay?: string }).__vAuthOrigDisplay = el.style.display;
      el.style.display = 'none';
    }
  }
}

export const vAuth: Directive<HTMLElement, AuthRoles> = {
  mounted(el, binding) {
    updateVisibility(el, binding);
  },

  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      updateVisibility(el, binding);
    }
  },
};
