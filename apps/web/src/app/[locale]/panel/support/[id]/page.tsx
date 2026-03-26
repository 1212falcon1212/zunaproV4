'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, Paperclip, Send } from 'lucide-react';

const MESSAGES = [
  {
    by: 'Satıcı',
    at: '23 Mart 13:10',
    text: 'Trendyol siparişlerim son 2 saattir panele düşmüyor. API bağlantısı aktif görünüyor.',
  },
  {
    by: 'Zunapro Destek',
    at: '23 Mart 13:18',
    text: 'Merhaba, entegrasyon kuyruğunuzu kontrol ediyoruz. Son webhook kayıtlarını da incelemeye aldık.',
  },
];

export default function SupportTicketDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = use(params);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ticket Detayı: {id}</h1>
          <p className="mt-1 text-sm text-slate-500">Pazaryeri Entegrasyonu • Açık • Öncelik: Yüksek</p>
        </div>
        <Link
          href={`/${locale}/panel/support`}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Ticket Listesi
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Konu: Trendyol siparişleri panelde görünmüyor</h2>
        <p className="mt-1 text-sm text-slate-500">Talep No: {id} • Oluşturulma: 23 Mart 13:05</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900">Mesajlaşma</h3>
        <div className="mt-4 space-y-3">
          {MESSAGES.map((msg, i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <MessageSquare className="h-4 w-4 text-violet-600" />
                  {msg.by}
                </div>
                <span className="text-xs text-slate-500">{msg.at}</span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 p-3">
          <textarea
            className="min-h-[120px] w-full resize-y text-sm outline-none"
            placeholder="Destek ekibine mesaj yazın..."
          />
          <div className="mt-3 flex items-center justify-between">
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
              <Paperclip className="h-4 w-4" />
              Dosya Ekle
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">
              <Send className="h-4 w-4" />
              Mesaj Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

