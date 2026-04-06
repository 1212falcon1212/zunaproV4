'use client';

import { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@zunapro/ui';
import {
  Handshake,
  ShoppingCart,
  Layers,
  CheckCircle,
  XCircle,
  Loader2,
  TrendingUp,
  Package,
  ChevronRight,
  DollarSign,
} from 'lucide-react';
import { panelApi } from '@/lib/panel-api';

interface MarketplaceStatus {
  connected: boolean;
  supplierId?: string;
}

interface MarketplaceConfig {
  key: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const MARKETPLACES: MarketplaceConfig[] = [
  {
    key: 'trendyol',
    name: 'Trendyol',
    icon: '🟠',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  {
    key: 'hepsiburada',
    name: 'Hepsiburada',
    icon: '🟣',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  {
    key: 'ciceksepeti',
    name: 'Ciceksepeti',
    icon: '🌸',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
  },
];

export default function MarketplaceDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  const [statuses, setStatuses] = useState<Record<string, MarketplaceStatus>>({});
  const [loading, setLoading] = useState(true);
  const [orderStats, setOrderStats] = useState<Array<{
    marketplace: string;
    totalOrders: number;
    totalRevenue: number;
    byStatus: Record<string, number>;
  }>>([]);

  const fetchStatuses = useCallback(async () => {
    setLoading(true);
    const results: Record<string, MarketplaceStatus> = {};

    const promises = MARKETPLACES.map(async (mp) => {
      try {
        const res = await panelApi.get<MarketplaceStatus>(
          `/marketplace/${mp.key}/status`,
        );
        results[mp.key] = res;
      } catch {
        results[mp.key] = { connected: false };
      }
    });

    await Promise.all(promises);
    setStatuses(results);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStatuses();
    panelApi.get<Array<{ marketplace: string; totalOrders: number; totalRevenue: number; byStatus: Record<string, number> }>>('/marketplace/stats/orders')
      .then(setOrderStats).catch(() => {});
  }, [fetchStatuses]);

  const connectedCount = Object.values(statuses).filter((s) => s.connected).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pazaryeri</h1>
          <p className="mt-1 text-sm text-slate-500">
            Pazaryeri entegrasyonlarinizi yonetin
          </p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 via-violet-500 to-indigo-600 p-6 text-white shadow-sm">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
            <Handshake className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">Pazaryeri Entegrasyonu</h2>
            <p className="mt-1 text-sm text-violet-200">
              Trendyol, Hepsiburada ve Ciceksepeti entegrasyonlariyla urunlerinizi
              tek panelden yonetin.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      {(() => {
        const mpOnly = orderStats.filter((s) => s.marketplace !== 'web');
        const totalOrders = mpOnly.reduce((s, st) => s + st.totalOrders, 0);
        const totalRevenue = mpOnly.reduce((s, st) => s + st.totalRevenue, 0);
        return (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                <Layers className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">
                {loading ? <Loader2 className="h-6 w-6 animate-spin text-slate-300" /> : connectedCount}
              </p>
              <p className="mt-0.5 text-sm text-slate-500">Bagli Pazaryeri</p>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                <Package className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">{totalOrders}</p>
              <p className="mt-0.5 text-sm text-slate-500">Toplam Siparis</p>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                <DollarSign className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-bold text-emerald-600">
                {totalRevenue > 0 ? totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '0'}
                <span className="ml-1 text-sm font-medium text-slate-400">TRY</span>
              </p>
              <p className="mt-0.5 text-sm text-slate-500">Toplam Gelir</p>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">
                {totalOrders > 0 ? Math.round(totalRevenue / totalOrders).toLocaleString('tr-TR') : '0'}
                <span className="ml-1 text-sm font-medium text-slate-400">TRY</span>
              </p>
              <p className="mt-0.5 text-sm text-slate-500">Ort. Siparis</p>
            </div>
          </div>
        );
      })()}

      {/* Marketplace Cards */}
      <div>
        <h3 className="mb-4 text-base font-semibold text-slate-900">
          Pazaryerleri
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MARKETPLACES.map((mp) => {
              const status = statuses[mp.key];
              const connected = status?.connected ?? false;

              return (
                <div
                  key={mp.key}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div
                        className={cn(
                          'flex h-12 w-12 items-center justify-center rounded-xl text-2xl',
                          mp.bgColor,
                        )}
                      >
                        {mp.icon}
                      </div>
                      {connected ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                          <CheckCircle className="h-3 w-3" />
                          Bagli
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                          <XCircle className="h-3 w-3" />
                          Bagli Degil
                        </span>
                      )}
                    </div>

                    <h4 className="mt-3 text-sm font-semibold text-slate-900">
                      {mp.name}
                    </h4>
                    {connected && status?.supplierId && (
                      <p className="mt-0.5 text-xs text-slate-400">
                        ID: {status.supplierId}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-slate-100 px-5 py-3">
                    <Link
                      href={`/${locale}/panel/marketplace/${mp.key}`}
                      className="block w-full rounded-lg bg-violet-600 py-2 text-center text-xs font-semibold text-white transition hover:bg-violet-700"
                    >
                      Yonet
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Dashboard per Marketplace */}
      {(() => {
        const mpOnly = orderStats.filter((s) => s.marketplace !== 'web' && s.totalOrders > 0);
        if (mpOnly.length === 0) return null;

        const statusColors: Record<string, { bar: string; text: string }> = {
          pending: { bar: 'bg-amber-400', text: 'text-amber-700' },
          preparing: { bar: 'bg-violet-500', text: 'text-violet-700' },
          shipped: { bar: 'bg-sky-500', text: 'text-sky-700' },
          delivered: { bar: 'bg-emerald-500', text: 'text-emerald-700' },
          completed: { bar: 'bg-green-500', text: 'text-green-700' },
          cancelled: { bar: 'bg-rose-400', text: 'text-rose-600' },
          refunded: { bar: 'bg-slate-400', text: 'text-slate-600' },
        };
        const statusLabels: Record<string, string> = {
          pending: 'Beklemede', preparing: 'Hazirlaniyor', shipped: 'Kargoda',
          delivered: 'Teslim Edildi', completed: 'Tamamlandi', cancelled: 'Iptal', refunded: 'Iade',
        };
        const mpGradients: Record<string, string> = {
          trendyol: 'from-orange-500 to-amber-500',
          hepsiburada: 'from-purple-500 to-violet-500',
          ciceksepeti: 'from-pink-500 to-rose-400',
        };
        const mpAccents: Record<string, string> = {
          trendyol: 'text-orange-600', hepsiburada: 'text-purple-600', ciceksepeti: 'text-pink-600',
        };

        return (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Siparis Raporu</h3>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {mpOnly.map((stat) => {
                const gradient = mpGradients[stat.marketplace] ?? 'from-slate-500 to-slate-400';
                const accent = mpAccents[stat.marketplace] ?? 'text-slate-600';
                const allStatuses = Object.entries(stat.byStatus).sort(([, a], [, b]) => b - a);
                const maxCount = Math.max(...allStatuses.map(([, c]) => c), 1);

                return (
                  <div key={stat.marketplace} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className={`bg-gradient-to-r ${gradient} px-5 py-4`}>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-white/90">{stat.marketplace}</h4>
                        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white">{stat.totalOrders} siparis</span>
                      </div>
                      <p className="mt-2 text-2xl font-extrabold text-white">
                        {stat.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        <span className="ml-1 text-sm font-medium text-white/70">TRY</span>
                      </p>
                    </div>
                    <div className="px-5 py-4 space-y-2.5">
                      {allStatuses.map(([status, count]) => {
                        const sc = statusColors[status] ?? { bar: 'bg-slate-400', text: 'text-slate-600' };
                        const pct = (count / maxCount) * 100;
                        return (
                          <div key={status}>
                            <div className="mb-1 flex items-center justify-between">
                              <span className={`text-xs font-medium ${sc.text}`}>{statusLabels[status] ?? status}</span>
                              <span className="text-xs font-bold text-slate-700">{count}</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                              <div className={`h-full rounded-full ${sc.bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t border-slate-100 px-5 py-3">
                      <Link href={`/${locale}/panel/marketplace/${stat.marketplace}`} className={`flex items-center gap-1 text-xs font-medium ${accent} hover:underline`}>
                        Detaylari Gor <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
