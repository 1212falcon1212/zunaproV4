'use client';

import { use, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { getUserFromToken } from '@/lib/auth';
import { PanelOnboarding } from '../_components/panel-onboarding';
import {
  ExternalLink,
  Store,
  Settings,
  Globe,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Eye,
  Clock,
  MoreHorizontal,
  ChevronRight,
  BarChart3,
  Tag,
  Truck,
  CreditCard,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@zunapro/ui';

const PLATFORM_TENANT_ID = '00000000-0000-0000-0000-000000000000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface TenantInfo {
  name: string;
  slug: string;
  domain: string | null;
  status: string;
  plan: { name: string } | null;
}

// Mock data for dashboard
const STATS = [
  { label: 'Toplam Sipariş', value: '1,284', change: '+12.5%', trend: 'up', icon: ShoppingCart, color: 'violet' },
  { label: 'Toplam Gelir', value: '₺84,230', change: '+8.2%', trend: 'up', icon: DollarSign, color: 'emerald' },
  { label: 'Aktif Ürün', value: '342', change: '+24', trend: 'up', icon: Package, color: 'blue' },
  { label: 'Müşteriler', value: '892', change: '+15.3%', trend: 'up', icon: Users, color: 'amber' },
];

const RECENT_ORDERS = [
  { id: '#12847', customer: 'Ahmet Yılmaz', total: '₺1,240', status: 'completed', date: '2 saat önce' },
  { id: '#12846', customer: 'Fatma Demir', total: '₺890', status: 'processing', date: '3 saat önce' },
  { id: '#12845', customer: 'Mehmet Kaya', total: '₺2,150', status: 'shipped', date: '5 saat önce' },
  { id: '#12844', customer: 'Zeynep Çelik', total: '₺560', status: 'pending', date: '6 saat önce' },
  { id: '#12843', customer: 'Ali Öztürk', total: '₺1,890', status: 'completed', date: '8 saat önce' },
];

const TOP_PRODUCTS = [
  { name: 'Premium Kulaklık', sold: 234, revenue: '₺23,400', image: '🎧' },
  { name: 'Ergonomik Sandalye', sold: 189, revenue: '₺18,900', image: '🪑' },
  { name: 'Akıllı Saat Pro', sold: 156, revenue: '₺15,600', image: '⌚' },
  { name: 'Deri Çanta', sold: 143, revenue: '₺14,300', image: '👜' },
];

const SALES_DATA = [
  { month: 'Oca', sales: 4200 },
  { month: 'Şub', sales: 3800 },
  { month: 'Mar', sales: 5100 },
  { month: 'Nis', sales: 4700 },
  { month: 'May', sales: 6200 },
  { month: 'Haz', sales: 7400 },
  { month: 'Tem', sales: 6800 },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  completed: { label: 'Tamamlandı', color: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="h-3 w-3" /> },
  processing: { label: 'Hazırlanıyor', color: 'bg-blue-100 text-blue-700', icon: <RefreshCw className="h-3 w-3" /> },
  shipped: { label: 'Kargoda', color: 'bg-violet-100 text-violet-700', icon: <Truck className="h-3 w-3" /> },
  pending: { label: 'Beklemede', color: 'bg-amber-100 text-amber-700', icon: <Clock className="h-3 w-3" /> },
};

const COLOR_MAP: Record<string, string> = {
  violet: 'bg-violet-100 text-violet-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-blue-100 text-blue-600',
  amber: 'bg-amber-100 text-amber-600',
};

export default function EcommerceDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
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

  const getStoreUrl = () => {
    if (!tenant) return 'https://demo.com';
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      return `/_store/${tenant.slug}/tr`;
    }
    return tenant.domain ? `https://${tenant.domain}` : `/_store/${tenant.slug}/tr`;
  };
  const storeUrl = getStoreUrl();

  const maxSales = Math.max(...SALES_DATA.map(d => d.sales));

  return (
    <div className="space-y-5">
      {/* Header with Store Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">E-Ticaret Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Mağazanızın performansını takip edin</p>
        </div>
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:opacity-90"
        >
          <ExternalLink className="h-4 w-4" />
          Mağazamı Göster
        </a>
      </div>

      {/* Store Info Banner */}
      {tenant && (
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-5 text-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold">{tenant.name}</h2>
                <div className="mt-0.5 flex items-center gap-3 text-sm text-violet-200">
                  <span>{tenant.plan?.name || 'Free'}</span>
                  <span className="h-1 w-1 rounded-full bg-violet-300" />
                  <span className="flex items-center gap-1">
                    <div className={`h-2 w-2 rounded-full ${tenant.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    {tenant.status === 'active' ? 'Aktif' : 'Beklemede'}
                  </span>
                </div>
              </div>
            </div>
            {tenant.domain && (
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm text-violet-200">
                <Globe className="h-4 w-4" />
                <span>{tenant.domain}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', COLOR_MAP[stat.color])}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={cn(
                  'flex items-center gap-0.5 text-xs font-semibold',
                  stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                )}>
                  {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="mt-0.5 text-sm text-slate-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-[1fr_minmax(0,380px)]">
        {/* Sales Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Satış Grafiği</h3>
              <p className="text-sm text-slate-500">Son 7 ay</p>
            </div>
            <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-end gap-3 h-48">
            {SALES_DATA.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-violet-500 to-purple-400 transition-all hover:from-violet-600 hover:to-purple-500"
                  style={{ height: `${(item.sales / maxSales) * 100}%` }}
                />
                <span className="text-xs text-slate-500">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-sm text-slate-500">Toplam Satış</p>
              <p className="text-xl font-bold text-slate-900">₺38,200</p>
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
              <ArrowUpRight className="h-4 w-4" />
              +18.2% geçen aya göre
            </span>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">En Çok Satanlar</h3>
            <Link href={`/${locale}/panel/products`} className="text-xs font-medium text-violet-600 hover:text-violet-700">
              Tümünü Gör
            </Link>
          </div>
          <div className="space-y-3">
            {TOP_PRODUCTS.map((product, i) => (
              <div key={product.name} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xl">
                  {product.image}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                  <p className="text-xs text-slate-500">{product.sold} adet satıldı</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{product.revenue}</p>
                  <p className="text-xs text-slate-400">#{i + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">Son Siparişler</h3>
          <Link href={`/${locale}/panel/orders`} className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700">
            Tümünü Gör <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 text-left text-xs font-semibold text-slate-500">Sipariş No</th>
                <th className="pb-3 text-left text-xs font-semibold text-slate-500">Müşteri</th>
                <th className="pb-3 text-left text-xs font-semibold text-slate-500">Tutar</th>
                <th className="pb-3 text-left text-xs font-semibold text-slate-500">Durum</th>
                <th className="pb-3 text-left text-xs font-semibold text-slate-500">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {RECENT_ORDERS.map((order) => {
                const status = STATUS_CONFIG[order.status];
                return (
                  <tr key={order.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 text-sm font-medium text-violet-600">{order.id}</td>
                    <td className="py-3 text-sm text-slate-900">{order.customer}</td>
                    <td className="py-3 text-sm font-semibold text-slate-900">{order.total}</td>
                    <td className="py-3">
                      <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', status.color)}>
                        {status.icon}
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-slate-500">{order.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: `/${locale}/panel/products/new`, label: 'Yeni Ürün Ekle', icon: Package, color: 'violet' },
          { href: `/${locale}/panel/orders`, label: 'Siparişleri Yönet', icon: ShoppingCart, color: 'blue' },
          { href: `/${locale}/panel/customers`, label: 'Müşteriler', icon: Users, color: 'emerald' },
          { href: `/${locale}/panel/themes`, label: 'Tema Ayarları', icon: Settings, color: 'amber' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', COLOR_MAP[item.color])}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:text-violet-500 group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
