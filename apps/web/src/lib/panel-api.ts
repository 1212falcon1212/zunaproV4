import { getAccessToken, getRefreshToken, clearTokens, setAccessToken } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | undefined>;
}

async function panelFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, headers: customHeaders, ...rest } = options;

  const token = getAccessToken();
  if (!token) {
    // Try refresh before giving up
    const refreshed = await tryRefreshToken();
    if (!refreshed) {
      clearTokens();
      if (typeof window !== 'undefined') {
        const locale = window.location.pathname.split('/')[1] || 'tr';
        window.location.href = `/${locale}/auth/login`;
      }
      throw new Error('Not authenticated');
    }
  }

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
    Authorization: `Bearer ${token}`,
    ...(customHeaders as Record<string, string>),
  };

  if (
    rest.body &&
    typeof rest.body === 'string' &&
    !headers['Content-Type']
  ) {
    headers['Content-Type'] = 'application/json';
  }

  let response = await fetch(url, { ...rest, headers });

  if (response.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      const retryToken = getAccessToken();
      response = await fetch(url, {
        ...rest,
        headers: {
          ...headers,
          Authorization: `Bearer ${retryToken}`,
        },
      });
    }
  }

  if (response.status === 401) {
    clearTokens();
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
      const locale = window.location.pathname.split('/')[1] || 'tr';
      window.location.href = `/${locale}/auth/login`;
    }
    throw new Error('Session expired');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'Request failed',
    }));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return undefined as T;

  return response.json();
}

async function tryRefreshToken(): Promise<boolean> {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include',
    });

    if (!response.ok) return false;

    const data = await response.json().catch(() => null);
    if (!data?.accessToken) return false;

    setAccessToken(data.accessToken);
    return true;
  } catch {
    return false;
  }
}

export const panelApi = {
  get<T>(path: string, params?: Record<string, string | number | undefined>) {
    return panelFetch<T>(path, { method: 'GET', params });
  },

  post<T>(path: string, body?: unknown) {
    return panelFetch<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(path: string, body?: unknown) {
    return panelFetch<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(path: string, body?: unknown) {
    return panelFetch<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(path: string) {
    return panelFetch<T>(path, { method: 'DELETE' });
  },

  async upload<T>(path: string, formData: FormData) {
    const token = getAccessToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Upload failed',
      }));
      throw new Error(error.message || 'Upload failed');
    }

    return response.json() as Promise<T>;
  },
};
