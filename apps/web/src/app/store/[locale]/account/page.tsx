'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { storeApi, isCustomerAuthenticated, clearCustomerToken } from '@/lib/store-api';

interface CustomerProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  locale: string;
  isGuest: boolean;
  createdAt: string;
}

export default function AccountPage() {
  const t = useTranslations('storefront.account');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isCustomerAuthenticated()) {
      router.push(`/store/${locale}/auth/login`);
      return;
    }

    storeApi
      .authGet<CustomerProfile>('/storefront/auth/me')
      .then(setProfile)
      .catch(() => {
        clearCustomerToken();
        router.push(`/store/${locale}/auth/login`);
      })
      .finally(() => setLoading(false));
  }, [locale, router]);

  const handleLogout = () => {
    clearCustomerToken();
    router.push(`/store/${locale}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">{t('title')}</h1>

      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 p-6">
          <h2 className="mb-4 text-lg font-medium">{t('profile')}</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-500">{t('name')}:</span>{' '}
              {profile.firstName} {profile.lastName}
            </p>
            <p>
              <span className="text-gray-500">{t('email')}:</span>{' '}
              {profile.email}
            </p>
            {profile.phone && (
              <p>
                <span className="text-gray-500">{t('phone')}:</span>{' '}
                {profile.phone}
              </p>
            )}
            <p>
              <span className="text-gray-500">{t('memberSince')}:</span>{' '}
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href={`/store/${locale}/account/orders`}
            className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
          >
            <span className="font-medium">{t('orderHistory')}</span>
            <span className="text-gray-400">&rarr;</span>
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="w-full rounded-lg border border-red-200 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          {t('logout')}
        </button>
      </div>
    </div>
  );
}
