'use client';

import Link from 'next/link';
import { use } from 'react';
import { Plus, Search, MessageSquare, Clock3, CheckCircle2, AlertCircle } from 'lucide-react';

const TICKETS = [
  {
    id: 'DST-1024',
    subject: 'Trendyol siparişleri panelde görünmüyor',
    category: 'Pazaryeri Entegrasyonu',
    status: 'Açık',
    priority: 'Yüksek',
    updatedAt: '5 dk önce',
  },
  {
    id: 'DST-1023',
    subject: 'E-ticaret sitesi tema düzeninde mobil kayma',
    category: 'E-Ticaret Sitesi',
    status: 'İnceleniyor',
    priority: 'Orta',
    updatedAt: '1 saat önce',
  },
  {
    id: 'DST-1022',
    subject: 'XML ürün aktarımında kategori eşleşmesi sorunu',
    category: 'Ürün Yönetimi',
    status: 'Çözüldü',
    priority: 'Düşük',
    updatedAt: 'Dün',
  },
];

function statusBadge(status: string) {
  if (status === 'Açık') return 'bg-rose-100 text-rose-700';
  if (status === 'İnceleniyor') return 'bg-amber-100 text-amber-700';
  return 'bg-emerald-100 text-emerald-700';
}

export default function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Destek Merkezi</h1>
          <p className="mt-1 text-sm text-slate-500">
            E-ticaret sitesi veya pazaryeri entegrasyonu ile ilgili destek taleplerinizi buradan yönetin.
          </p>
        </div>
        <Link
          href={`/${locale}/panel/support/new`}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Destek Talebi Oluştur
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Açık Talep</p>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-slate-900">8</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">İncelenen</p>
            <Clock3 className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-slate-900">3</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Çözülen</p>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-semibold text-slate-900">41</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-900">Destek Talepleriniz</h2>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
            <Search className="h-4 w-4 text-slate-400" />
            <input placeholder="Ticket ID veya konu ara..." className="w-56 text-sm outline-none" />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                <th className="pb-3">Ticket</th>
                <th className="pb-3">Kategori</th>
                <th className="pb-3">Durum</th>
                <th className="pb-3">Öncelik</th>
                <th className="pb-3">Son Güncelleme</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {TICKETS.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50/60">
                  <td className="py-3">
                    <Link href={`/${locale}/panel/support/${ticket.id}`} className="group inline-flex flex-col">
                      <span className="text-xs font-semibold text-violet-600">{ticket.id}</span>
                      <span className="text-sm font-medium text-slate-900 group-hover:text-violet-700">{ticket.subject}</span>
                    </Link>
                  </td>
                  <td className="py-3 text-sm text-slate-600">{ticket.category}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-slate-600">{ticket.priority}</td>
                  <td className="py-3 text-sm text-slate-500">{ticket.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
          <div className="inline-flex items-center gap-2 font-medium text-slate-700">
            <MessageSquare className="h-4 w-4 text-violet-600" />
            Satıcı Destek Hattı
          </div>
          <p className="mt-1">
            Pazaryeri sipariş, entegrasyon, stok senkronizasyonu ve e-ticaret sitesi teknik destek talepleriniz öncelikli olarak işlenir.
          </p>
        </div>
      </div>
    </div>
  );
}

