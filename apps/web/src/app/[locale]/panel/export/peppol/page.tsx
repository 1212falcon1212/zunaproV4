'use client';

import { FileCheck } from 'lucide-react';

export default function ExportPeppolPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Peppol</h1>
        <p className="mt-1 text-sm text-slate-500">AB uyumlu Peppol fatura süreçleri.</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-44 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
          <div className="text-center">
            <FileCheck className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-2 text-sm text-slate-400">Henüz Peppol verisi yok</p>
          </div>
        </div>
      </div>
    </div>
  );
}

