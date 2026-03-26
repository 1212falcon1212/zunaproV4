'use client';

import { ArrowLeftRight } from 'lucide-react';

export default function MarketplaceMatchingPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ürün Eşleştirme</h1>
        <p className="mt-1 text-sm text-slate-500">Ürünlerinizi pazaryeri kategorileriyle eşleştirin.</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-44 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
          <div className="text-center">
            <ArrowLeftRight className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-2 text-sm text-slate-400">Henüz eşleştirme verisi yok</p>
          </div>
        </div>
      </div>
    </div>
  );
}

