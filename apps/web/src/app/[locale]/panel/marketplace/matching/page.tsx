'use client';

import { use, useCallback, useEffect, useState } from 'react';
import { Button, Card, Badge, Input } from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';
import { SendWizard } from '../[marketplace]/_components/send-wizard';
import {
  Send,
  Search,
  Package,
  Loader2,
  CheckCircle,
  XCircle,
  ChevronRight,
  Filter,
  History,
} from 'lucide-react';
import Link from 'next/link';

interface LocalProduct {
  id: string;
  name: unknown;
  sku?: string;
  barcode?: string;
  price: number;
  stock: number;
  images?: string[];
  listingStatus?: string | null;
  marketplaceProductId?: string | null;
  seoMeta?: Record<string, unknown> | null;
}

interface LocalProductsResponse {
  products: LocalProduct[];
  total: number;
  page: number;
  limit: number;
}

const MARKETPLACES = [
  { key: 'trendyol', name: 'Trendyol', icon: '🟠', color: 'orange' },
  { key: 'hepsiburada', name: 'Hepsiburada', icon: '🟣', color: 'purple' },
  { key: 'ciceksepeti', name: 'Ciceksepeti', icon: '🌸', color: 'pink' },
];

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Beklemede', cls: 'bg-slate-100 text-slate-500' },
  sent: { label: 'Gonderildi', cls: 'bg-violet-50 text-violet-700' },
  approved: { label: 'Onayli', cls: 'bg-emerald-50 text-emerald-700' },
  rejected: { label: 'Reddedildi', cls: 'bg-rose-50 text-rose-700' },
  error: { label: 'Hata', cls: 'bg-rose-50 text-rose-700' },
};

function locName(name: unknown, locale = 'tr'): string {
  if (typeof name === 'string') return name;
  if (name && typeof name === 'object') {
    const o = name as Record<string, string>;
    return o[locale] || o.en || o.tr || Object.values(o)[0] || '';
  }
  return '';
}

export default function ProductSendPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);

  const [selectedMp, setSelectedMp] = useState('trendyol');
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showWizard, setShowWizard] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Notifications / batch tracking
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [syncLogs, setSyncLogs] = useState<Array<{ id: string; marketplace: string; action: string; status: string; itemCount: number; errorCount: number; createdAt: string; details?: any }>>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [checkingBatch, setCheckingBatch] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [batchResult, setBatchResult] = useState<any>(null);

  const mpConfig = MARKETPLACES.find((m) => m.key === selectedMp)!;

  const fetchProducts = useCallback(async (page = 0) => {
    setLoading(true);
    setError('');
    try {
      const res = await panelApi.get<LocalProductsResponse>(
        `/marketplace/${selectedMp}/local-products`,
        { page, limit: 50 },
      );
      setProducts(res.products);
      setMeta({ total: res.total, page: res.page });
      setSelectedIds(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Urunler yuklenemedi');
    } finally {
      setLoading(false);
    }
  }, [selectedMp]);

  useEffect(() => {
    fetchProducts(0);
  }, [fetchProducts]);

  const fetchSyncLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const res = await panelApi.get<{ logs: typeof syncLogs }>(`/marketplace/${selectedMp}/sync-logs`, { limit: 20 });
      setSyncLogs(res.logs ?? []);
    } catch {
      setSyncLogs([]);
    } finally {
      setLogsLoading(false);
    }
  }, [selectedMp]);

  const checkBatch = async (batchId: string) => {
    setCheckingBatch(batchId);
    setBatchResult(null);
    try {
      const res = await panelApi.get<{ batchStatus: Record<string, unknown>; updatedListings: number }>(
        `/marketplace/${selectedMp}/batch/${batchId}/check`,
      );
      setBatchResult(res.batchStatus);
      fetchProducts(meta.page); // Refresh listing statuses
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Batch kontrol basarisiz');
    } finally {
      setCheckingBatch(null);
    }
  };

  // Filter products client-side
  const filtered = products.filter((p) => {
    if (searchQuery) {
      const name = locName(p.name, locale).toLowerCase();
      const sku = (p.sku || '').toLowerCase();
      const q = searchQuery.toLowerCase();
      if (!name.includes(q) && !sku.includes(q)) return false;
    }
    if (statusFilter) {
      if (statusFilter === 'not_sent' && p.listingStatus) return false;
      if (statusFilter !== 'not_sent' && p.listingStatus !== statusFilter) return false;
    }
    return true;
  });

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((p) => p.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const notSentCount = products.filter((p) => !p.listingStatus).length;
  const sentCount = products.filter((p) => p.listingStatus === 'sent' || p.listingStatus === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Urun Gonder</h1>
          <p className="mt-1 text-sm text-slate-500">Urunlerinizi pazaryerlerine gonderin</p>
        </div>
        <Button
          variant="outline"
          onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) fetchSyncLogs(); }}
          className="relative"
        >
          <History className="mr-1.5 h-4 w-4" />
          Bildirimler
        </Button>
      </div>

      {/* Notifications Panel */}
      {showNotifications && (
        <Card className="overflow-hidden border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50/50 px-5 py-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">Gonderim Gecmisi & Batch Durumlari</h2>
              <button onClick={() => setShowNotifications(false)} className="text-xs text-slate-400 hover:text-slate-600">Kapat</button>
            </div>
          </div>

          {logsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-violet-500" />
            </div>
          ) : syncLogs.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">Henuz gonderim gecmisi yok</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {syncLogs.map((log) => {
                const isExport = log.action === 'export';
                const details = (log.details ?? {}) as Record<string, unknown>;
                const allBatchIds: string[] = (
                  (details.batchIds as string[]) ??
                  (details.batchId ? [String(details.batchId)] : [])
                ).filter(Boolean);

                return (
                  <div key={log.id} className="px-5 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={
                          log.status === 'completed' ? 'bg-emerald-50 text-emerald-700 text-[10px]' :
                          log.status === 'failed' ? 'bg-rose-50 text-rose-700 text-[10px]' :
                          'bg-amber-50 text-amber-700 text-[10px]'
                        }>
                          {log.action}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {new Date(log.createdAt).toLocaleString('tr-TR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-slate-600">{log.itemCount} urun</span>
                        {log.errorCount > 0 && (
                          <span className="font-medium text-rose-600">{log.errorCount} hata</span>
                        )}
                      </div>
                    </div>

                    {/* Batch IDs with check buttons */}
                    {Boolean(isExport && allBatchIds.length > 0) && (
                      <div className="mt-2 space-y-1.5">
                        {allBatchIds.map((bid) => (
                          <div key={bid} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-1.5">
                            <span className="font-mono text-[10px] text-slate-600">{bid}</span>
                            <button
                              onClick={() => checkBatch(bid)}
                              disabled={checkingBatch === bid}
                              className="flex items-center gap-1 rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700 hover:bg-violet-200 disabled:opacity-50"
                            >
                              {checkingBatch === bid ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Search className="h-3 w-3" />
                              )}
                              Durumu Kontrol Et
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Batch result — parsed errors */}
                    {batchResult && (batchResult as Record<string, unknown>).items && (
                      <div className="mt-2 space-y-1.5">
                        {(() => {
                          const items = ((batchResult as Record<string, unknown>).items ?? []) as Array<{
                            status?: string;
                            failureReasons?: string[];
                            requestItem?: { product?: { title?: string; barcode?: string } };
                          }>;
                          const failed = items.filter(i => i.status === 'FAILED');
                          const success = items.filter(i => i.status === 'SUCCESS');
                          return (
                            <>
                              <div className="flex gap-3 text-xs">
                                <span className="text-emerald-600 font-medium">{success.length} basarili</span>
                                <span className="text-rose-600 font-medium">{failed.length} basarisiz</span>
                                <span className="text-slate-400">/ {items.length} toplam</span>
                              </div>
                              {failed.length > 0 && (
                                <div className="rounded-md border border-rose-200 bg-rose-50 p-3 space-y-2">
                                  {failed.slice(0, 10).map((f, i) => (
                                    <div key={i} className="text-xs">
                                      <p className="font-medium text-rose-800">
                                        {f.requestItem?.product?.title?.slice(0, 50) || f.requestItem?.product?.barcode || `Urun #${i + 1}`}
                                      </p>
                                      {(f.failureReasons ?? []).map((reason, ri) => (
                                        <p key={ri} className="mt-0.5 text-rose-600">→ {reason}</p>
                                      ))}
                                    </div>
                                  ))}
                                  {failed.length > 10 && (
                                    <p className="text-[10px] text-rose-400">+{failed.length - 10} daha...</p>
                                  )}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* Marketplace Selector */}
      <div className="flex gap-3">
        {MARKETPLACES.map((mp) => (
          <button
            key={mp.key}
            onClick={() => setSelectedMp(mp.key)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-3 transition-all ${
              selectedMp === mp.key
                ? 'border-violet-300 bg-violet-50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span className="text-xl">{mp.icon}</span>
            <span className={`text-sm font-medium ${selectedMp === mp.key ? 'text-violet-700' : 'text-slate-600'}`}>
              {mp.name}
            </span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Toplam Urun</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{meta.total}</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-medium text-emerald-600">Gonderilmis</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">{sentCount}</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-medium text-amber-600">Gonderilmemis</p>
          <p className="mt-1 text-2xl font-bold text-amber-700">{notSentCount}</p>
        </div>
        <div className="rounded-lg border border-violet-200 bg-violet-50 p-4">
          <p className="text-xs font-medium text-violet-600">Secili</p>
          <p className="mt-1 text-2xl font-bold text-violet-700">{selectedIds.size}</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      {/* Filters + Actions */}
      <Card className="overflow-hidden border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-5 py-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Urun adi veya SKU ara..."
              className="h-8 pl-9 text-xs"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700"
          >
            <option value="">Tum Durumlar</option>
            <option value="not_sent">Gonderilmemis</option>
            <option value="sent">Gonderildi</option>
            <option value="approved">Onayli</option>
            <option value="rejected">Reddedildi</option>
            <option value="error">Hata</option>
          </select>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {selectedIds.size > 0 && (
              <Button
                onClick={() => setShowWizard(true)}
                size="sm"
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                {mpConfig.name}&apos;a Gonder ({selectedIds.size})
              </Button>
            )}
            {notSentCount > 0 && selectedIds.size === 0 && (
              <Button
                onClick={() => {
                  const notSentIds = products.filter((p) => !p.listingStatus).map((p) => p.id);
                  setSelectedIds(new Set(notSentIds));
                }}
                size="sm"
                variant="outline"
                className="text-xs"
              >
                Gonderilmemisleri Sec ({notSentCount})
              </Button>
            )}
            {selectedIds.size > 0 && (
              <button onClick={() => setSelectedIds(new Set())} className="text-xs text-slate-400 hover:text-slate-600">
                Temizle
              </button>
            )}
          </div>
        </div>

        {/* Product table */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Package className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">Urun bulunamadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/40 text-left">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filtered.length && filtered.length > 0}
                      onChange={toggleAll}
                      className="rounded border-slate-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Gorsel</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Urun</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">SKU</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 text-right">Fiyat</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 text-right">Stok</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Kaynak</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">{mpConfig.name} Durumu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => {
                  const images = (p.images ?? []) as string[];
                  const status = p.listingStatus ? STATUS_MAP[p.listingStatus] : null;

                  return (
                    <tr key={p.id} className={`transition-colors hover:bg-slate-50/50 ${selectedIds.has(p.id) ? 'bg-violet-50/30' : ''}`}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(p.id)}
                          onChange={() => toggleOne(p.id)}
                          className="rounded border-slate-300"
                        />
                      </td>
                      <td className="px-4 py-3">
                        {images[0] ? (
                          <img src={images[0]} alt="" className="h-10 w-10 rounded-lg border border-slate-200 object-cover" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                            <Package className="h-4 w-4 text-slate-300" />
                          </div>
                        )}
                      </td>
                      <td className="max-w-xs px-4 py-3">
                        <p className="truncate text-sm font-medium text-slate-800">{locName(p.name, locale)}</p>
                        {p.barcode && <p className="text-[10px] text-slate-400">{p.barcode}</p>}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{p.sku || '-'}</td>
                      <td className="px-4 py-3 text-right text-sm font-semibold text-slate-800">
                        {Number(p.price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                      </td>
                      <td className={`px-4 py-3 text-right text-sm font-bold ${p.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {p.stock}
                      </td>
                      <td className="px-4 py-3">
                        {(() => {
                          const source = (p.seoMeta?.source as string) || '';
                          const brand = (p.seoMeta?.trendyolBrand || p.seoMeta?.hepsiburadaBrand || p.seoMeta?.brand || '') as string;
                          if (!source) return <span className="text-xs text-slate-400">Manuel</span>;
                          const srcMap: Record<string, { label: string; cls: string }> = {
                            trendyol: { label: '🟠 Trendyol', cls: 'bg-orange-50 text-orange-700' },
                            hepsiburada: { label: '🟣 HB', cls: 'bg-purple-50 text-purple-700' },
                            ciceksepeti: { label: '🌸 CS', cls: 'bg-pink-50 text-pink-700' },
                          };
                          const s = srcMap[source] ?? { label: source, cls: 'bg-slate-100 text-slate-600' };
                          return (
                            <div>
                              <Badge className={s.cls + ' text-[10px]'}>{s.label}</Badge>
                              {brand && <p className="mt-0.5 text-[9px] text-slate-400">{brand}</p>}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-3">
                        {status ? (
                          <Badge className={status.cls + ' text-[10px]'}>{status.label}</Badge>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta.total > 50 && (
          <div className="flex items-center justify-center gap-2 border-t border-slate-100 p-4">
            <Button variant="outline" size="sm" disabled={meta.page <= 0} onClick={() => fetchProducts(meta.page - 1)}>
              Onceki
            </Button>
            <span className="text-sm text-slate-500">
              {meta.page + 1} / {Math.ceil(meta.total / 50)}
            </span>
            <Button variant="outline" size="sm" disabled={(meta.page + 1) * 50 >= meta.total} onClick={() => fetchProducts(meta.page + 1)}>
              Sonraki
            </Button>
          </div>
        )}
      </Card>

      {/* Send Wizard */}
      {showWizard && (
        <SendWizard
          marketplace={selectedMp}
          marketplaceName={mpConfig.name}
          productIds={Array.from(selectedIds)}
          locale={locale}
          onClose={() => setShowWizard(false)}
          onComplete={() => {
            setShowWizard(false);
            setSelectedIds(new Set());
            fetchProducts(meta.page);
          }}
        />
      )}
    </div>
  );
}
