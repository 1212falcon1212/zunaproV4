'use client';

import {
  Landmark,
  Receipt,
  ArrowLeftRight,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Wallet,
  CreditCard,
  Calculator,
  Plus,
} from 'lucide-react';
import { cn } from '@zunapro/ui';

const STATS = [
  { label: 'Toplam Gelir', value: '₺0', change: '-', icon: TrendingUp, color: 'emerald' },
  { label: 'Toplam Gider', value: '₺0', change: '-', icon: TrendingDown, color: 'rose' },
  { label: 'E-Fatura', value: '0', change: '-', icon: Receipt, color: 'violet' },
  { label: 'Kontör Bakiye', value: '0', change: '-', icon: Wallet, color: 'amber' },
];

const INVOICE_TYPES = [
  { type: 'E-Fatura', count: 0, icon: Receipt, color: 'violet' },
  { type: 'E-Arşiv', count: 0, icon: FileText, color: 'blue' },
  { type: 'E-İrsaliye', count: 0, icon: FileText, color: 'emerald' },
];

const COLOR_MAP: Record<string, string> = {
  violet: 'bg-violet-100 text-violet-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-blue-100 text-blue-600',
  amber: 'bg-amber-100 text-amber-600',
  rose: 'bg-rose-100 text-rose-600',
};

export default function FinanceDashboardPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finans</h1>
          <p className="mt-1 text-sm text-slate-500">E-Fatura, gelir-gider ve muhasebe işlemleri</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 p-6 text-white shadow-sm">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
            <Landmark className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">Finans Modülü</h2>
            <p className="mt-1 text-sm text-blue-100">
              E-Fatura, E-Arşiv fatura oluşturun. Gelir-gider takibi yapın ve muhasebe raporlarınızı görüntüleyin.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50">
            <Plus className="h-4 w-4" />
            Kontör Satın Al
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

      {/* Two Column Layout */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Invoice Types */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Fatura Türleri</h3>
          <div className="space-y-3">
            {INVOICE_TYPES.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.type} className="flex items-center justify-between rounded-xl border border-slate-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', COLOR_MAP[item.color])}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.type}</p>
                      <p className="text-xs text-slate-500">Bu ay: {item.count} adet</p>
                    </div>
                  </div>
                  <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
                    Oluştur
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Income/Expense */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Gelir / Gider</h3>
          <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
            <div className="text-center">
              <PieChart className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-2 text-sm text-slate-400">Henüz veri bulunmuyor</p>
              <p className="text-xs text-slate-400">Gelir-gider kaydı yapıldığında görünecek</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">Aylık Özet</h3>
        </div>
        <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
          <div className="text-center">
            <BarChart3 className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-2 text-sm text-slate-400">Henüz veri bulunmuyor</p>
            <p className="text-xs text-slate-400">Finans modülü aktif olduğunda veriler görünecek</p>
          </div>
        </div>
      </div>

      {/* Son Finans Hareketleri */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Son Finans Hareketleri</h3>
          <span className="text-xs text-slate-400">Henüz kayıt yok</span>
        </div>
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
          <p className="text-sm text-slate-400">Gelir-gider kayıtları burada listelenecek</p>
        </div>
      </div>

      {/* Features */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 mb-3">
            <Receipt className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900">E-Fatura & E-Arşiv</h4>
          <p className="mt-1 text-xs text-slate-500">GİB onaylı e-fatura ve e-arşiv fatura oluşturun.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-3">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900">Gelir-Gider Takibi</h4>
          <p className="mt-1 text-xs text-slate-500">Tüm finansal hareketlerinizi kaydedin ve takip edin.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-3">
            <Calculator className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900">Muhasebe Raporları</h4>
          <p className="mt-1 text-xs text-slate-500">Detaylı finansal raporlar ve analizler oluşturun.</p>
        </div>
      </div>
    </div>
  );
}
