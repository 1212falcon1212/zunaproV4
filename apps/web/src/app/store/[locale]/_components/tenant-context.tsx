'use client';

import { createContext, useContext } from 'react';

const TenantContext = createContext<string>('demo');

export function TenantProvider({ slug, children }: { slug: string; children: React.ReactNode }) {
  return <TenantContext.Provider value={slug}>{children}</TenantContext.Provider>;
}

export function useTenantSlug(): string {
  return useContext(TenantContext);
}
