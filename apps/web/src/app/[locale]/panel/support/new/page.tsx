'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';

export default function NewSupportTicketPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Yeni Destek Talebi</h1>
          <p className="mt-1 text-sm text-slate-500">Sorununuzu detaylandırın, destek ekibimiz en kısa sürede dönüş yapsın.</p>
        </div>
        <Link
          href={`/${locale}/panel/support`}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Listeye Dön
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Kategori</span>
            <select className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400">
              <option>Pazaryeri Entegrasyonu</option>
              <option>E-Ticaret Sitesi</option>
              <option>Ürün / Stok Yönetimi</option>
              <option>Sipariş / Kargo</option>
              <option>Faturalama / Finans</option>
              <option>Diğer</option>
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Öncelik</span>
            <select className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400">
              <option>Düşük</option>
              <option>Orta</option>
              <option>Yüksek</option>
              <option>Kritik</option>
            </select>
          </label>
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-medium text-slate-500">Konu</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              placeholder="Örn: Trendyol siparişleri panelde görünmüyor"
            />
          </label>
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-medium text-slate-500">Mesaj</span>
            <textarea
              className="min-h-[180px] w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              placeholder="Yaşadığınız sorunu, beklenen davranışı ve mümkünse örnek sipariş/ürün kodunu yazın."
            />
          </label>
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-medium text-slate-500">Ek Dosya (Opsiyonel)</span>
            <input type="file" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </label>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <Link
            href={`/${locale}/panel/support`}
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Vazgeç
          </Link>
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">
            <Send className="h-4 w-4" />
            Talebi Gönder
          </button>
        </div>
      </div>
    </div>
  );
}

