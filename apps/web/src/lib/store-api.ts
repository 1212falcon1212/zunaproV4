const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const SESSION_KEY = 'zunapro_session_id';
const CUSTOMER_TOKEN_KEY = 'zunapro_customer_token';

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function getCustomerToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CUSTOMER_TOKEN_KEY);
}

export function setCustomerToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  }
}

export function clearCustomerToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  }
}

export function isCustomerAuthenticated(): boolean {
  return !!getCustomerToken();
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
  auth?: boolean;
}

async function storeFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, headers: customHeaders, auth = false, ...rest } = options;

  let url = `${API_URL}${path}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, String(value));
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {
    'X-Session-Id': getSessionId(),
    ...(customHeaders as Record<string, string>),
  };

  if (auth) {
    const token = getCustomerToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  if (rest.body && typeof rest.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, { ...rest, headers });

  // Update session ID from response
  const newSessionId = response.headers.get('X-Session-Id');
  if (newSessionId && typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, newSessionId);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Request failed',
    }));
    throw new Error(
      error.message || `Request failed with status ${response.status}`,
    );
  }

  if (response.status === 204) return undefined as T;

  return response.json();
}

export const storeApi = {
  get<T>(path: string, params?: Record<string, string | number | undefined>) {
    return storeFetch<T>(path, { method: 'GET', params });
  },

  post<T>(path: string, body?: unknown, auth = false) {
    return storeFetch<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      auth,
    });
  },

  patch<T>(path: string, body?: unknown, auth = true) {
    return storeFetch<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      auth,
    });
  },

  delete<T>(path: string) {
    return storeFetch<T>(path, { method: 'DELETE' });
  },

  authGet<T>(
    path: string,
    params?: Record<string, string | number | undefined>,
  ) {
    return storeFetch<T>(path, { method: 'GET', params, auth: true });
  },
};
