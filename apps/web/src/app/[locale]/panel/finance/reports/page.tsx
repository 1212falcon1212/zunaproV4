'use client';

import { FileText } from 'lucide-react';

export default function FinanceReportsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Muhasebe Raporları</h1>
        <p className="mt-1 text-sm text-slate-500">Finansal rapor özetleri.</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-44 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
          <div className="text-center">
            <FileText className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-2 text-sm text-slate-400">Henüz rapor verisi yok</p>
          </div>
        </div>
      </div>
    </div>
  );
}

