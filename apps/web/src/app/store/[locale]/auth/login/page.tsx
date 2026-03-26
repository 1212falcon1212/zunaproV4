'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { storeApi, setCustomerToken } from '@/lib/store-api';

export default function StoreLoginPage() {
  const t = useTranslations('storefront.auth');
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = params.locale as string;
  const redirect = searchParams.get('redirect') || `/store/${locale}`;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await storeApi.post<{ token: string }>(
        '/storefront/auth/login',
        { email, password },
      );
      setCustomerToken(result.token);
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestCheckout = async () => {
    setLoading(true);
    try {
      const result = await storeApi.post<{ token: string }>(
        '/storefront/auth/guest',
        {},
      );
      setCustomerToken(result.token);
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to continue as guest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-muted)] px-4">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-2xl font-bold">{t('login')}</h1>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              {t('password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-[var(--color-border)] px-3 py-2 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? t('loggingIn') : t('login')}
          </button>
        </form>

        <div className="my-4 flex items-center gap-4">
          <div className="h-px flex-1 bg-[var(--color-border)]" />
          <span className="text-sm text-[var(--color-secondary)]">{t('or')}</span>
          <div className="h-px flex-1 bg-[var(--color-border)]" />
        </div>

        <button
          onClick={handleGuestCheckout}
          disabled={loading}
          className="w-full rounded-lg border border-[var(--color-border)] py-2.5 text-sm font-medium hover:bg-[var(--color-muted)] disabled:opacity-50"
        >
          {t('continueAsGuest')}
        </button>

        <p className="mt-4 text-center text-sm text-[var(--color-secondary)]">
          {t('noAccount')}{' '}
          <Link
            href={`/store/${locale}/auth/register?redirect=${redirect}`}
            className="text-[var(--color-primary)] hover:underline"
          >
            {t('register')}
          </Link>
        </p>
      </div>
    </div>
  );
}
