'use client';

import { useTranslations } from 'next-intl';
import {
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Eye,
  Clock,
  Globe,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@zunapro/ui';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  gradient: string;
}

function StatCard({ title, value, change, trend, icon, gradient }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          <div className="flex items-center gap-1.5">
            {trend === 'up' ? (
              <div className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                {change}
              </div>
            ) : (
              <div className="flex items-center gap-0.5 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-600">
                <TrendingDown className="h-3 w-3" />
                {change}
              </div>
            )}
            <span className="text-xs text-slate-400">vs last month</span>
          </div>
        </div>
        <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', gradient)}>
          {icon}
        </div>
      </div>
    </div>
  );
}

interface RecentOrder {
  id: string;
  customer: string;
  amount: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  time: string;
}

const MOCK_ORDERS: RecentOrder[] = [
  { id: '#2401', customer: 'Emma Schmidt', amount: '€249.00', status: 'delivered', time: '2h ago' },
  { id: '#2400', customer: 'Hans Mueller', amount: '€89.50', status: 'shipped', time: '4h ago' },
  { id: '#2399', customer: 'Marie Dubois', amount: '€430.00', status: 'processing', time: '5h ago' },
  { id: '#2398', customer: 'John Smith', amount: '€156.00', status: 'pending', time: '6h ago' },
  { id: '#2397', customer: 'Ana Garcia', amount: '€312.75', status: 'delivered', time: '8h ago' },
];

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-violet-50 text-violet-700 border-violet-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

interface TrafficSource {
  name: string;
  value: number;
  percentage: string;
  color: string;
}

const MOCK_TRAFFIC: TrafficSource[] = [
  { name: 'Google Search', value: 12400, percentage: '43%', color: 'bg-blue-500' },
  { name: 'Direct', value: 8200, percentage: '29%', color: 'bg-emerald-500' },
  { name: 'Social Media', value: 4100, percentage: '14%', color: 'bg-violet-500' },
  { name: 'Email Campaigns', value: 2300, percentage: '8%', color: 'bg-amber-500' },
  { name: 'Referrals', value: 1700, percentage: '6%', color: 'bg-rose-500' },
];

interface TopProduct {
  name: string;
  sold: number;
  revenue: string;
  trend: 'up' | 'down';
}

const MOCK_PRODUCTS: TopProduct[] = [
  { name: 'Premium Wireless Headphones', sold: 234, revenue: '€23,400', trend: 'up' },
  { name: 'Ergonomic Office Chair', sold: 189, revenue: '€18,900', trend: 'up' },
  { name: 'Smart Watch Pro', sold: 156, revenue: '€15,600', trend: 'down' },
  { name: 'Leather Messenger Bag', sold: 143, revenue: '€14,300', trend: 'up' },
  { name: 'Bluetooth Speaker Mini', sold: 128, revenue: '€6,400', trend: 'up' },
];

function MiniBarChart() {
  const bars = [35, 58, 42, 68, 45, 72, 55, 80, 62, 90, 70, 85];
  return (
    <div className="flex items-end gap-[2px] h-8">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-gradient-to-t from-violet-500 to-blue-400 opacity-70"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

export function PanelDashboard() {
  const t = useTranslations('panel');

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('dashboard.title')}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          <Clock className="h-4 w-4 text-slate-400" />
          <span>{t('dashboard.last30Days')}</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={t('dashboard.totalOrders')}
          value="1,284"
          change="+12.5%"
          trend="up"
          icon={<ShoppingCart className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-br from-violet-500 to-violet-600"
        />
        <StatCard
          title={t('dashboard.revenue')}
          value="€48,290"
          change="+8.2%"
          trend="up"
          icon={<DollarSign className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title={t('dashboard.totalProducts')}
          value="456"
          change="+24"
          trend="up"
          icon={<Package className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <StatCard
          title={t('dashboard.totalCustomers')}
          value="3,842"
          change="-2.4%"
          trend="down"
          icon={<Users className="h-6 w-6 text-white" />}
          gradient="bg-gradient-to-br from-amber-500 to-orange-500"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 xl:grid-cols-5">
        {/* Analytics overview card */}
        <div className="xl:col-span-3 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 p-6 text-white shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">{t('dashboard.siteAnalytics')}</h3>
              <p className="mt-0.5 text-sm text-indigo-300">
                {t('dashboard.conversionRate', { rate: '28.5' })}
              </p>
            </div>
            <button className="rounded-lg p-1.5 text-indigo-300 transition hover:bg-white/10">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Direct', value: '268' },
              { label: 'Organic', value: '890' },
              { label: 'Referral', value: '62' },
              { label: 'Campaign', value: '1.2k' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-white/10 px-3 py-2.5 backdrop-blur-sm">
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-indigo-300">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-end justify-between">
            <div className="flex items-end gap-[2px] h-20 flex-1">
              {[30, 45, 35, 55, 40, 65, 50, 75, 60, 85, 55, 80, 65, 90, 70, 85, 75, 95, 80, 70, 85, 90, 75, 88].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-violet-400/60 to-blue-400/40"
                    style={{ height: `${h}%` }}
                  />
                ),
              )}
            </div>
          </div>
        </div>

        {/* Content stats */}
        <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{t('dashboard.contentStats')}</h3>
            <span className="text-xs text-slate-400">{t('dashboard.lastUpdated')}</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { icon: <Clock className="h-5 w-5 text-violet-500" />, value: '156', label: t('dashboard.pages'), change: '+12' },
              { icon: <Users className="h-5 w-5 text-blue-500" />, value: '892', label: t('dashboard.blogPosts'), change: '+24' },
              { icon: <Package className="h-5 w-5 text-emerald-500" />, value: '234', label: t('dashboard.activeProducts'), change: '+5' },
              { icon: <Eye className="h-5 w-5 text-amber-500" />, value: '1,458', label: t('dashboard.pageViews'), change: '+38' },
            ].map((item) => (
              <div key={item.label} className="space-y-2 rounded-xl border border-slate-100 p-3 overflow-hidden">
                <div className="flex items-center justify-between gap-2">
                  <div className="shrink-0">{item.icon}</div>
                  <MiniBarChart />
                </div>
                <p className="text-xl font-bold text-slate-900">{item.value}</p>
                <div className="flex items-center justify-between gap-1">
                  <p className="truncate text-xs text-slate-500">{item.label}</p>
                  <span className="shrink-0 text-xs font-semibold text-emerald-600">
                    <ArrowUpRight className="inline h-3 w-3" />
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{t('dashboard.recentOrders')}</h3>
            <button className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {MOCK_ORDERS.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5 transition hover:bg-slate-50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                    {order.customer.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{order.customer}</p>
                    <p className="text-xs text-slate-400">{order.id} · {order.time}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right ml-3">
                  <p className="text-sm font-semibold text-slate-900">{order.amount}</p>
                  <span className={cn('inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium', STATUS_STYLES[order.status])}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{t('dashboard.trafficSources')}</h3>
            <Globe className="h-5 w-5 text-slate-400" />
          </div>

          <div className="mt-4 space-y-4">
            {MOCK_TRAFFIC.map((source) => (
              <div key={source.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{source.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      {source.value.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">{source.percentage}</span>
                  </div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn('h-full rounded-full transition-all', source.color)}
                    style={{ width: source.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">{t('dashboard.topProducts')}</h3>
            <button className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {MOCK_PRODUCTS.map((product, i) => (
              <div key={product.name} className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5 transition hover:bg-slate-50">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{product.name}</p>
                  <p className="text-xs text-slate-400">{product.sold} sold</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-slate-900">{product.revenue}</p>
                  {product.trend === 'up' ? (
                    <TrendingUp className="ml-auto h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <TrendingDown className="ml-auto h-3.5 w-3.5 text-rose-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
