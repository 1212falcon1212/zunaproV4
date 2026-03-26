'use client';

import {
  Handshake,
  Package,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  BarChart3,
  Layers,
  ArrowLeftRight,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { cn } from '@zunapro/ui';
import Link from 'next/link';

const MARKETPLACES = [
  { name: 'Trendyol', icon: '🟠', connected: false, products: 0, orders: 0 },
  { name: 'Hepsiburada', icon: '🟣', connected: false, products: 0, orders: 0 },
  { name: 'N11', icon: '🔵', connected: false, products: 0, orders: 0 },
  { name: 'Amazon', icon: '🟡', connected: false, products: 0, orders: 0 },
];

const STATS = [
  { label: 'Toplam Sipariş', value: '0', change: '-', icon: ShoppingCart, color: 'violet' },
  { label: 'Toplam Gelir', value: '₺0', change: '-', icon: TrendingUp, color: 'emerald' },
  { label: 'Eşleşen Ürün', value: '0', change: '-', icon: Package, color: 'blue' },
  { label: 'Aktif Entegrasyon', value: '0', change: '-', icon: Layers, color: 'amber' },
];

const COLOR_MAP: Record<string, string> = {
  violet: 'bg-violet-100 text-violet-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-blue-100 text-blue-600',
  amber: 'bg-amber-100 text-amber-600',
};

import { use } from 'react';

const MARKETPLACE_SLUGS: Record<string, string> = {
  Trendyol: 'trendyol',
};

export default function MarketplaceDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pazaryeri</h1>
          <p className="mt-1 text-sm text-slate-500">Pazaryeri entegrasyonlarınızı yönetin</p>
        </div>
      </div>

      {/* Empty State Banner */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 p-6 text-white shadow-sm">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
            <Handshake className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">Pazaryeri Entegrasyonu</h2>
            <p className="mt-1 text-sm text-rose-100">
              Trendyol, Hepsiburada, N11 ve Amazon entegrasyonlarıyla siparişlerinizi tek panelden yönetin.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50">
            <Plus className="h-4 w-4" />
            Entegrasyon Ekle
          </button>
        </div>
      </div>

      {/* Stats Grid - Empty */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', COLOR_MAP[stat.color])}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-slate-400">{stat.change}</span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="mt-0.5 text-sm text-slate-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Marketplaces Grid */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-4">Pazaryerleri</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MARKETPLACES.map((mp) => (
            <div key={mp.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                  {mp.icon}
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                  Bağlı Değil
                </span>
              </div>
              <h4 className="mt-3 text-sm font-semibold text-slate-900">{mp.name}</h4>
              <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                <span>{mp.products} ürün</span>
                <span>{mp.orders} sipariş</span>
              </div>
              {MARKETPLACE_SLUGS[mp.name] ? (
                <Link
                  href={`/${locale}/panel/marketplace/${MARKETPLACE_SLUGS[mp.name]}`}
                  className="mt-4 block w-full rounded-lg border border-violet-200 bg-violet-50 py-2 text-center text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
                >
                  Bağlan / Yönet
                </Link>
              ) : (
                <button
                  disabled
                  className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-400 cursor-not-allowed"
                >
                  Yakında
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Performance */}
      <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,360px)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Satış Performansı</h3>
            <span className="text-xs text-slate-400">Son 7 gün</span>
          </div>
          <div className="flex h-48 items-end gap-3">
            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts', 'Paz'].map((day) => (
              <div key={day} className="flex flex-1 flex-col items-center gap-2">
                <div className="h-full w-full rounded-lg border-2 border-dashed border-slate-200 bg-slate-50" />
                <span className="text-[11px] text-slate-400">{day}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Özet</h3>
          <div className="mt-4 space-y-3">
            {[
              ['Yeni Sipariş', '0'],
              ['İptal', '0'],
              ['İade', '0'],
              ['Komisyon', '₺0'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5">
                <span className="text-sm text-slate-500">{label}</span>
                <span className="text-sm font-semibold text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Empty Chart Placeholder */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">Satış Grafiği</h3>
        </div>
        <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
          <div className="text-center">
            <BarChart3 className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-2 text-sm text-slate-400">Henüz veri bulunmuyor</p>
            <p className="text-xs text-slate-400">Pazaryeri bağlantısı yapıldığında veriler görünecek</p>
          </div>
        </div>
      </div>

      {/* Son İşlemler */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Son İşlemler</h3>
          <span className="text-xs text-slate-400">Henüz kayıt yok</span>
        </div>
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
          <p className="text-sm text-slate-400">Pazaryeri siparişleri burada listelenecek</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 mb-3">
            <Layers className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900">Entegrasyonlar</h4>
          <p className="mt-1 text-xs text-slate-500">Pazaryeri hesaplarınızı bağlayın ve siparişleri senkronize edin.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-3">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900">Ürün Eşleştirme</h4>
          <p className="mt-1 text-xs text-slate-500">Ürünlerinizi pazaryeri kategorileriyle eşleştirin.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-3">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900">Performans</h4>
          <p className="mt-1 text-xs text-slate-500">Tüm pazaryerlerindeki satış performansınızı takip edin.</p>
        </div>
      </div>
    </div>
  );
}
