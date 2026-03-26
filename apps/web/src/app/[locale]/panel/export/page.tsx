'use client';

import {
  Plane,
  Globe,
  FileCheck,
  DollarSign,
  Ship,
  Package,
  TrendingUp,
  BarChart3,
  MapPin,
  Building2,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@zunapro/ui';

const STATS = [
  { label: 'Toplam İhracat', value: '0', change: '-', icon: Plane, color: 'emerald' },
  { label: 'İhracat Geliri', value: '€0', change: '-', icon: DollarSign, color: 'blue' },
  { label: 'Aktif Ülke', value: '0', change: '-', icon: Globe, color: 'violet' },
  { label: 'Peppol Fatura', value: '0', change: '-', icon: FileCheck, color: 'amber' },
];

const EU_COUNTRIES = [
  { code: 'DE', name: 'Almanya', flag: '🇩🇪', active: false },
  { code: 'FR', name: 'Fransa', flag: '🇫🇷', active: false },
  { code: 'IT', name: 'İtalya', flag: '🇮🇹', active: false },
  { code: 'ES', name: 'İspanya', flag: '🇪🇸', active: false },
  { code: 'NL', name: 'Hollanda', flag: '🇳🇱', active: false },
  { code: 'BE', name: 'Belçika', flag: '🇧🇪', active: false },
];

const COLOR_MAP: Record<string, string> = {
  violet: 'bg-violet-100 text-violet-600',
  emerald: 'bg-emerald-100 text-emerald-600',
  blue: 'bg-blue-100 text-blue-600',
  amber: 'bg-amber-100 text-amber-600',
};

export default function ExportDashboardPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">E-İhracat</h1>
          <p className="mt-1 text-sm text-slate-500">AB ülkelerine Peppol ile satış yapın</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 p-6 text-white shadow-sm">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
            <Plane className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold">E-İhracat Modülü</h2>
            <p className="mt-1 text-sm text-emerald-100">
              Avrupa Birliği ülkelerine Peppol standardında e-fatura kesin ve uluslararası satış yapın.
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50">
            <Building2 className="h-4 w-4" />
            Peppol Kaydı Başlat
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

      {/* Countries Grid */}
      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-4">Hedef Ülkeler</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EU_COUNTRIES.map((country) => (
            <div key={country.code} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{country.name}</h4>
                    <p className="text-xs text-slate-500">{country.code}</p>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                  Pasif
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>0 sipariş</span>
                <span>€0 gelir</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty Chart Placeholder */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-slate-900">İhracat Grafiği</h3>
        </div>
        <div className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
          <div className="text-center">
            <BarChart3 className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-2 text-sm text-slate-400">Henüz veri bulunmuyor</p>
            <p className="text-xs text-slate-400">E-İhracat modülü aktif olduğunda veriler görünecek</p>
          </div>
        </div>
      </div>

      {/* Sipariş ve Fatura Akışı */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Ülke Bazlı Siparişler</h3>
          <div className="mt-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-4 py-12 text-center">
            <p className="text-sm text-slate-400">Henüz ihracat siparişi bulunmuyor</p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">Peppol Fatura Durumu</h3>
          <div className="mt-4 space-y-3">
            {[
              ['Hazır Taslak', '0'],
              ['Gönderildi', '0'],
              ['Başarılı', '0'],
              ['Hatalı', '0'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5">
                <span className="text-sm text-slate-500">{label}</span>
                <span className="text-sm font-semibold text-slate-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-3">
            <FileCheck className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900">Peppol E-Fatura</h4>
          <p className="mt-1 text-xs text-slate-500">AB standardında elektronik fatura oluşturun ve gönderin.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 mb-3">
            <DollarSign className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900">Döviz Yönetimi</h4>
          <p className="mt-1 text-xs text-slate-500">Euro ve diğer döviz kurlarını otomatik güncelleyin.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 mb-3">
            <Ship className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-semibold text-slate-900">Uluslararası Kargo</h4>
          <p className="mt-1 text-xs text-slate-500">AB ülkelerine uygun kargo seçeneklerini entegre edin.</p>
        </div>
      </div>
    </div>
  );
}
