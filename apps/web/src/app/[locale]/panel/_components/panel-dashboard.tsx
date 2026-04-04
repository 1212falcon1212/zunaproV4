'use client';

import { useTranslations } from 'next-intl';
import { getUserFromToken } from '@/lib/auth';
import { useEffect, useMemo, useState } from 'react';
import {
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Eye,
  Clock,
  Globe,
  MoreHorizontal,
  Package,
  Users,
  Store,
  Receipt,
  Plane,
  ChevronRight,
  Lightbulb,
  Megaphone,
  Tag,
  ShoppingBag,
  MessageCircle,
  BarChart2,
  Mail,
  Handshake,
  BarChart3,
  Zap,
  X,
  Puzzle,
  Play,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@zunapro/ui';

const MODULE_SLUG_MAP: Record<string, string> = {
  products: 'ecommerce', orders: 'ecommerce', customers: 'ecommerce',
  einvoice: 'finance', 'income-expense': 'finance', accounting: 'finance', reports: 'finance',
  'api-access': 'export', peppol: 'export',
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

function MiniBarChart({ color = 'bg-gradient-to-t from-violet-500 to-violet-400' }: { color?: string }) {
  const bars = [35, 58, 42, 68, 45, 72, 55, 80, 62, 90, 70, 85];
  return (
    <div className="flex items-end gap-[2px] h-8">
      {bars.map((h, i) => (
        <div key={i} className={cn('w-1.5 rounded-full opacity-70', color)} style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

interface SuggestionModalProps {
  item: { label: string; pluginName: string } | null;
  onClose: () => void;
}

function SuggestionModal({ item, onClose }: SuggestionModalProps) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
            <Puzzle className="h-5 w-5 text-white" />
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <h3 className="text-base font-semibold text-slate-900">{item.label}</h3>
        <p className="mt-2 text-sm text-slate-500">
          Bu özelliği aktif etmek için{' '}
          <span className="font-semibold text-violet-600">{item.pluginName}</span>{' '}
          eklentisini aktif et.
        </p>
        <div className="mt-5 flex gap-3">
          <button
            className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Eklentiyi Aktif Et
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Vazgeç
          </button>
        </div>
      </div>
    </div>
  );
}

export function PanelDashboard({ locale }: { locale: string }) {
  const t = useTranslations('panel');
  const user = getUserFromToken();
  const [modalItem, setModalItem] = useState<{ label: string; pluginName: string } | null>(null);

  const activeModules = useMemo(() => {
    const slugs = user?.activeModules || [];
    const categories = new Set<string>();
    for (const slug of slugs) {
      if (['ecommerce', 'marketplace', 'export', 'finance'].includes(slug)) {
        categories.add(slug);
      } else if (MODULE_SLUG_MAP[slug]) {
        categories.add(MODULE_SLUG_MAP[slug]);
      }
    }
    return categories.size > 0 ? Array.from(categories) : ['ecommerce'];
  }, [user]);

  const isEcommerceActive = activeModules.includes('ecommerce');
  const isFinanceActive = activeModules.includes('finance');
  const isExportActive = activeModules.includes('export');
  const [promoIndex, setPromoIndex] = useState(0);

  const PROMO_SLIDES = [
    {
      title: 'Avrupa Amazon’da satış yap',
      desc: 'Ürünlerini 27 AB ülkesinde listele, yeni müşterilere hızla ulaş.',
      badge: 'Amazon EU',
      image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: '27 ülkeye ertesi gün kargo',
      desc: 'Güçlü lojistik ağımızla siparişlerini Avrupa’ya hızlı gönder.',
      badge: 'Hızlı Teslimat',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Avrupa depolarında stokla',
      desc: 'En iyi lokasyonlardaki depolarla teslimat süreni kısalt.',
      badge: 'Depolama',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Türkiye ile sınırlı kalma',
      desc: 'E-ihracat modülleri ile satışlarını Avrupa pazarına taşı.',
      badge: 'Büyüme',
      image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=900&q=80',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % PROMO_SLIDES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [PROMO_SLIDES.length]);

  const SUGGESTIONS = [
    { label: 'Google Alışverişi Aktif Et', desc: 'Ürünlerini Google\'da ücretsiz listele', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', icon: <ShoppingBag className="h-4 w-4" />, pluginName: 'Google Shopping' },
    { label: 'WhatsApp Balonu Ekle', desc: 'Müşterilerle anında iletişim kur', iconBg: 'bg-green-100', iconColor: 'text-green-600', icon: <MessageCircle className="h-4 w-4" />, pluginName: 'WhatsApp Chat' },
    { label: 'Ürün Optimizasyon Testi Yap', desc: 'SEO puanını ve görünürlüğünü artır', iconBg: 'bg-violet-100', iconColor: 'text-violet-600', icon: <BarChart2 className="h-4 w-4" />, pluginName: 'SEO Optimizer' },
    { label: 'Reklam Hizmeti Al', desc: 'Hedefli reklamlarla satışları artır', iconBg: 'bg-rose-100', iconColor: 'text-rose-600', icon: <Megaphone className="h-4 w-4" />, pluginName: 'Ads Manager' },
    { label: 'E-Posta Pazarlama Başlat', desc: 'Müşterilerine özel kampanyalar gönder', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', icon: <Mail className="h-4 w-4" />, pluginName: 'Email Marketing' },
  ];

  const SERVICES = [
    {
      icon: <Store className="h-5 w-5 text-white" />,
      title: 'E-Ticaret Sitesi',
      desc: 'Online mağaza kurun ve yönetin',
      active: isEcommerceActive,
      gradient: 'from-violet-500 to-purple-600',
      activeBorder: 'border-violet-200 bg-violet-50',
      activeTextColor: 'text-violet-600',
      ctaHref: `/${locale}/panel/ecommerce`,
      ctaLabel: 'Panele Git',
      pluginName: 'E-Ticaret',
    },
    {
      icon: <Receipt className="h-5 w-5 text-white" />,
      title: 'E-Fatura',
      desc: 'Yasal uyumlu e-fatura & e-arşiv',
      active: isFinanceActive,
      gradient: 'from-blue-500 to-indigo-600',
      activeBorder: 'border-blue-200 bg-blue-50',
      activeTextColor: 'text-blue-600',
      ctaHref: `/${locale}/panel/finance/invoices`,
      ctaLabel: 'Faturalarım',
      pluginName: 'E-Fatura',
    },
    {
      icon: <Plane className="h-5 w-5 text-white" />,
      title: 'E-İhracat',
      desc: 'AB ülkelerine Peppol ile satış',
      active: isExportActive,
      gradient: 'from-emerald-500 to-teal-600',
      activeBorder: 'border-emerald-200 bg-emerald-50',
      activeTextColor: 'text-emerald-600',
      ctaHref: `/${locale}/panel/export`,
      ctaLabel: 'Panele Git',
      pluginName: 'E-İhracat',
    },
    {
      icon: <Handshake className="h-5 w-5 text-white" />,
      title: 'Pazaryeri',
      desc: 'Trendyol, Hepsiburada ve diğerleri',
      active: activeModules.includes('marketplace'),
      gradient: 'from-rose-500 to-pink-600',
      activeBorder: 'border-rose-200 bg-rose-50',
      activeTextColor: 'text-rose-600',
      ctaHref: `/${locale}/panel/marketplace`,
      ctaLabel: 'Panele Git',
      pluginName: 'Pazaryeri',
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-white" />,
      title: 'Gelişmiş Analitik',
      desc: 'Detaylı satış ve trafik raporları',
      active: false,
      gradient: 'from-amber-500 to-orange-500',
      activeBorder: 'border-amber-200 bg-amber-50',
      activeTextColor: 'text-amber-600',
      ctaHref: '#',
      ctaLabel: 'Panele Git',
      pluginName: 'Gelişmiş Analitik',
    },
    {
      icon: <Zap className="h-5 w-5 text-white" />,
      title: 'Muhasebe',
      desc: 'Gelir-gider takibi ve finansal raporlar',
      active: false,
      gradient: 'from-cyan-500 to-sky-600',
      activeBorder: 'border-cyan-200 bg-cyan-50',
      activeTextColor: 'text-cyan-600',
      ctaHref: '#',
      ctaLabel: 'Panele Git',
      pluginName: 'Muhasebe',
    },
  ];

  return (
    <>
      <SuggestionModal item={modalItem} onClose={() => setModalItem(null)} />

      <div className="space-y-5">
        {/* Row 1: Satışlar + Content Stats + Overview */}
        <div className="grid gap-4 xl:grid-cols-[1fr_minmax(0,420px)_minmax(0,380px)]">
          {/* Tavsiyeler */}
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-600 to-indigo-700 p-6 text-white shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">İŞLETMENİZİ BÜYÜTECEK FIRSATLAR</h3>
              </div>
              <button className="rounded-lg p-1.5 text-violet-200 hover:bg-white/10">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            <div className="relative mt-3 overflow-hidden rounded-2xl border border-white/25 bg-gradient-to-r from-fuchsia-200/25 to-violet-200/15 p-5 backdrop-blur-sm">
              <div className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
              <div className="absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-violet-900/30" />
              <div className="relative flex items-center gap-4">
                <div className="relative h-32 w-60 shrink-0 overflow-hidden rounded-2xl border border-white/30 bg-white/10">
                  <img
                    src={PROMO_SLIDES[promoIndex].image}
                    alt={PROMO_SLIDES[promoIndex].title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-100">
                    {PROMO_SLIDES[promoIndex].badge}
                  </span>
                  <h4 className="mt-2 text-2xl font-bold leading-tight">{PROMO_SLIDES[promoIndex].title}</h4>
                  <p className="mt-1 text-sm text-violet-100">{PROMO_SLIDES[promoIndex].desc}</p>
                  <button className="mt-3 rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-400">
                    Hemen İncele
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              {PROMO_SLIDES.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    i === promoIndex ? 'w-6 bg-white' : 'w-2 bg-white/40',
                  )}
                />
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                {
                  title: 'Amazon EU',
                  logo: 'AMAZON',
                  desc: 'Global satış kanalı',
                },
                {
                  title: 'AB Pazarı',
                  logo: 'EU MARKET',
                  desc: '450M+ müşteri',
                },
                {
                  title: 'Hızlı Kargo',
                  logo: 'EXPRESS',
                  desc: 'Ertesi gün teslimat',
                },
                {
                  title: 'Avrupa Depo',
                  logo: 'WAREHOUSE',
                  desc: 'Yerel stok avantajı',
                },
              ].map((card) => (
                <div key={card.title} className="rounded-xl border border-white/15 bg-white/10 p-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-24 items-center justify-center rounded-md bg-white/95 px-2 text-[10px] font-black tracking-wide text-violet-700">
                      {card.logo}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white">{card.title}</p>
                      <p className="text-[10px] text-violet-200">{card.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Stats */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-semibold text-slate-900">Siparişler</h3>
              <span className="text-xs text-slate-400">{t('dashboard.lastUpdated')}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { icon: <Clock className="h-5 w-5 text-violet-500" />, value: '156', label: 'Trendyol', change: '+12', chartColor: 'from-violet-500 to-violet-400' },
                { icon: <Users className="h-5 w-5 text-blue-500" />, value: '892', label: 'Hepsiburada', change: '+24', chartColor: 'from-blue-500 to-blue-400' },
                { icon: <Package className="h-5 w-5 text-emerald-500" />, value: '234', label: 'Diğer Pazaryerleri', change: '+5', chartColor: 'from-emerald-500 to-emerald-400' },
                { icon: <Eye className="h-5 w-5 text-amber-500" />, value: '1,458', label: 'E-Ticaret Sitesi', change: '+38', chartColor: 'from-amber-500 to-amber-400' },
              ].map((item) => (
                <div key={item.label} className="space-y-2 rounded-xl border border-slate-100 p-3 overflow-hidden">
                  <div className="flex items-center justify-between gap-2">
                    <div className="shrink-0">{item.icon}</div>
                    <MiniBarChart color={`bg-gradient-to-t ${item.chartColor} opacity-70`} />
                  </div>
                  <p className="text-xl font-bold text-slate-900">{item.value}</p>
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate text-xs text-slate-500">{item.label}</p>
                    <span className="shrink-0 text-xs font-semibold text-emerald-600">
                      <ArrowUpRight className="inline h-3 w-3" />{item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Genel Bakış */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-500">Genel Bakış</h3>
              <span className="text-xs font-semibold text-emerald-600">+58.2%</span>
            </div>
            <p className="mt-1 text-3xl font-bold text-slate-900">42.5k</p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-violet-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">62.2%</p>
                    <p className="text-xs text-slate-400">Sipariş</p>
                  </div>
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="h-1.5 rounded-full bg-slate-100">
                <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-violet-500 to-violet-400" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">25.5%</p>
                    <p className="text-xs text-slate-400">Ziyaret</p>
                  </div>
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="h-1.5 rounded-full bg-slate-100">
                <div className="h-full w-[25%] rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Hizmetlerimiz + Öneriler */}
        <div className="grid gap-4 xl:grid-cols-[1fr_minmax(0,380px)]">
          {/* Hizmetlerimiz */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Hizmetlerimiz</h3>
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
              {SERVICES.map((svc) => (
                <div
                  key={svc.title}
                  className={cn(
                    'rounded-xl border p-4 flex flex-col gap-3 transition-all',
                    svc.active
                      ? cn(svc.activeBorder)
                      : 'border-slate-200 bg-slate-50 opacity-60',
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br',
                      svc.gradient,
                      !svc.active && 'grayscale',
                    )}>
                      {svc.icon}
                    </div>
                    {svc.active ? (
                      <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Aktif
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        Pasif
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{svc.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{svc.desc}</p>
                  </div>
                  {svc.active ? (
                    <Link
                      href={svc.ctaHref}
                      className={cn('mt-auto flex items-center gap-1 text-xs font-semibold opacity-100', svc.activeTextColor, 'hover:opacity-80')}
                    >
                      {svc.ctaLabel} <ChevronRight className="h-3 w-3" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => setModalItem({ label: `${svc.title} Aktif Et`, pluginName: svc.pluginName })}
                      className="mt-auto self-start rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-1.5 text-xs font-bold text-white transition hover:opacity-90"
                    >
                      Aktif Et
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Öneriler */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-semibold text-slate-900">Öneriler</h3>
            </div>
            <div className="space-y-2.5">
              {SUGGESTIONS.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 px-4 py-3 transition hover:border-slate-200 hover:bg-slate-50"
                >
                  <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', item.iconBg, item.iconColor)}>
                    {item.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                    <p className="truncate text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setModalItem({ label: item.label, pluginName: item.pluginName })}
                    className="flex shrink-0 items-center justify-center rounded-lg bg-orange-500 p-2 text-white transition hover:bg-orange-400"
                  >
                    <Play className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Duyurular + Traffic + Top Products */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {/* Duyurular */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="h-5 w-5 text-violet-500" />
              <h3 className="text-base font-semibold text-slate-900">Duyurular</h3>
            </div>
            <div className="space-y-3">
              {[
                { title: 'İhracat paketlerinde %20 indirim!', desc: 'AB ülkelerine satış için sınırlı süre kampanyası.', color: 'bg-violet-500' },
                { title: 'E-Fatura Kontörlerinde Büyük İndirim!', desc: 'Toplu kontör alımlarında özel fiyatlar.', color: 'bg-blue-500' },
                { title: '2 Yıllık E-Ticaret Paketi Alana 1 Yıl Hediye!', desc: '2 Yıl öde, 3 Yıl Kullan', color: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 rounded-xl border border-slate-100 p-4 hover:bg-slate-50 transition cursor-pointer">
                  <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white', item.color)}>
                    <Tag className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">{t('dashboard.trafficSources')}</h3>
              <Globe className="h-5 w-5 text-slate-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">87%</span>
              <span className="text-sm font-semibold text-emerald-600">↑25.8%</span>
            </div>
            <div className="my-4 flex items-end gap-1.5 h-16">
              {['Jan','Feb','Mar','Apr','May','Jun','Jul'].map((m, i) => (
                <div key={m} className="flex flex-1 flex-col items-center gap-1">
                  <div className="w-full flex gap-0.5 items-end" style={{ height: '100%' }}>
                    <div className="flex-1 rounded-t bg-slate-200" style={{ height: `${[40,55,35,60,45,70,65][i]}%` }} />
                    <div className="flex-1 rounded-t bg-violet-500" style={{ height: `${[25,35,20,40,30,50,45][i]}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-400">{m}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {MOCK_TRAFFIC.map((source) => (
                <div key={source.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{source.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{source.value.toLocaleString()}</span>
                      <span className="text-xs text-slate-400">{source.percentage}</span>
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className={cn('h-full rounded-full', source.color)} style={{ width: source.percentage }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">{t('dashboard.topProducts')}</h3>
              <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {MOCK_PRODUCTS.map((product, i) => (
                <div key={product.name} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold text-slate-400">
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
    </>
  );
}
