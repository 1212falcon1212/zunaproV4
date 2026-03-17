import { getAccessToken, clearTokens } from './auth';

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
    clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Not authenticated');
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

  const response = await fetch(url, { ...rest, headers });

  if (response.status === 401) {
    clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
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
