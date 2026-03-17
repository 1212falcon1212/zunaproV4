import { headers } from 'next/headers';

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function getTenantSlug(): Promise<string> {
  const headersList = await headers();
  return headersList.get('x-tenant-slug') || 'demo';
}

export async function getTenantLocale(): Promise<string> {
  const headersList = await headers();
  return headersList.get('x-tenant-locale') || 'en';
}

export async function serverFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const tenantSlug = await getTenantSlug();
  const url = `${API_URL}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'x-tenant-slug': tenantSlug,
      ...options?.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}
