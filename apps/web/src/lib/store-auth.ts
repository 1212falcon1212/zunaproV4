import {
  getCustomerToken,
  setCustomerToken,
  clearCustomerToken,
} from './store-api';

interface CustomerPayload {
  customerId: string;
  tenantSlug: string;
  isGuest: boolean;
}

export function getCustomerFromToken(): CustomerPayload | null {
  const token = getCustomerToken();
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return {
      customerId: payload.customerId,
      tenantSlug: payload.tenantSlug,
      isGuest: payload.isGuest,
    };
  } catch {
    return null;
  }
}

export { setCustomerToken, clearCustomerToken, getCustomerToken };
