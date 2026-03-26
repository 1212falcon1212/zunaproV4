'use client';

import { use, useEffect, useState } from 'react';
import { getUserFromToken } from '@/lib/auth';
import { PanelOnboarding } from './_components/panel-onboarding';
import { PanelDashboard } from './_components/panel-dashboard';

const PLATFORM_TENANT_ID = '00000000-0000-0000-0000-000000000000';

export default function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const [hasStore, setHasStore] = useState<boolean | null>(null);

  useEffect(() => {
    const user = getUserFromToken();
    if (!user) return;
    setHasStore(user.tenantId !== PLATFORM_TENANT_ID);
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

  return <PanelDashboard locale={locale} />;
}
