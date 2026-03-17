'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { getUserFromToken } from '@/lib/auth';
import { PanelOnboarding } from '../_components/panel-onboarding';
import { ExternalLink, Store, Settings, Globe, ArrowRight } from 'lucide-react';

const PLATFORM_TENANT_ID = '00000000-0000-0000-0000-000000000000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface TenantInfo {
  name: string;
  slug: string;
  domain: string | null;
  status: string;
  plan: { name: string } | null;
}

export default function EcommerceDashboardPage() {
  const t = useTranslations('panel');
  const [hasStore, setHasStore] = useState<boolean | null>(null);
  const [tenant, setTenant] = useState<TenantInfo | null>(null);

  useEffect(() => {
    const user = getUserFromToken();
    if (!user) return;

    if (user.tenantId === PLATFORM_TENANT_ID) {
      setHasStore(false);
    } else {
      setHasStore(true);
      // Fetch tenant info
      fetch(`${API_URL}/tenants/${user.tenantId}`)
        .then((r) => r.json())
        .then((data) => setTenant(data))
        .catch(() => {});
    }
  }, []);

  if (hasStore === null) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!hasStore) {
    return <PanelOnboarding />;
  }

  // In dev: use path-based preview; in production: use real domain
  const getStoreUrl = () => {
    if (!tenant) return null;
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      // Local dev: use /_store/[slug] path
      return `/_store/${tenant.slug}/en`;
    }
    // Production: use custom domain
    return tenant.domain ? `https://${tenant.domain}` : `/_store/${tenant.slug}/en`;
  };
  const storeUrl = getStoreUrl();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('controlPanel.title')}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {t('controlPanel.subtitle')}
          </p>
        </div>
      </div>

      {/* Store info card */}
      {tenant && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 p-6 text-white shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                <Store className="h-7 w-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{tenant.name}</h2>
                <div className="mt-1 flex items-center gap-3 text-sm text-indigo-300">
                  <span>{tenant.plan?.name || 'Free'}</span>
                  <span className="h-1 w-1 rounded-full bg-indigo-400" />
                  <span className="flex items-center gap-1">
                    <div className={`h-2 w-2 rounded-full ${tenant.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    {tenant.status === 'active' ? t('controlPanel.storeActive') : t('controlPanel.storePending')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {storeUrl && (
                <a
                  href={storeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t('controlPanel.viewStore')}
                </a>
              )}
              <Link
                href="panel/settings"
                className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <Settings className="h-4 w-4" />
                {t('controlPanel.storeSettings')}
              </Link>
            </div>
          </div>

          {tenant.domain && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm text-indigo-300">
              <Globe className="h-4 w-4" />
              <span>{tenant.domain}</span>
            </div>
          )}
        </div>
      )}

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: 'panel/ecommerce', label: t('controlPanel.ecommerceDashboard'), icon: <Store className="h-5 w-5 text-violet-500" /> },
          { href: 'panel/products', label: t('controlPanel.manageProducts'), icon: <Store className="h-5 w-5 text-blue-500" /> },
          { href: 'panel/orders', label: t('controlPanel.viewOrders'), icon: <Store className="h-5 w-5 text-emerald-500" /> },
          { href: 'panel/customers', label: t('controlPanel.viewCustomers'), icon: <Store className="h-5 w-5 text-amber-500" /> },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
                {item.icon}
              </div>
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:text-violet-500 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
