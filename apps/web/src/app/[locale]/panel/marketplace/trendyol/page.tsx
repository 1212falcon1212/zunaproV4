'use client';

import { use, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Button,
  Card,
  Input,
  Label,
  Badge,
} from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';
import { proxyImageUrl } from '@/lib/media-url';
import {
  ChevronRight,
  Link2,
  Unplug,
  Download,
  Search,
  Package,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

interface TrendyolProduct {
  id: number;
  barcode: string;
  title: string;
  brandName: string;
  categoryName: string;
  quantity: number;
  salePrice: number;
  listPrice: number;
  stockCode: string;
  images: { url: string }[];
  approved: boolean;
  onSale: boolean;
}

interface TrendyolProductResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: TrendyolProduct[];
}

interface ConnectionStatus {
  connected: boolean;
  supplierId?: string;
}

export default function TrendyolPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const router = useRouter();

  // Connection state
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Credentials form
  const [supplierId, setSupplierId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');

  // Products
  const [products, setProducts] = useState<TrendyolProduct[]>([]);
  const [productsMeta, setProductsMeta] = useState({ totalElements: 0, totalPages: 0, page: 0 });
  const [productsLoading, setProductsLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number; errors: string[] } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Filters
  const [filterBarcode, setFilterBarcode] = useState('');
  const [filterOnSale, setFilterOnSale] = useState<string>('');

  const fetchStatus = useCallback(async () => {
    try {
      const res = await panelApi.get<ConnectionStatus>('/marketplace/trendyol/status');
      setStatus(res);
    } catch {
      setStatus({ connected: false });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnecting(true);
    setError('');
    setSuccess('');
    try {
      const res = await panelApi.post<{ success: boolean; message: string }>(
        '/marketplace/trendyol/connect',
        { supplierId, apiKey, apiSecret },
      );
      if (res.success) {
        setSuccess(res.message);
        setStatus({ connected: true, supplierId });
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Trendyol bağlantısını kesmek istediğinize emin misiniz?')) return;
    try {
      await panelApi.delete('/marketplace/trendyol/disconnect');
      setStatus({ connected: false });
      setProducts([]);
      setSuccess('Trendyol bağlantısı kesildi.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Disconnect failed');
    }
  };

  const fetchProducts = useCallback(async (page = 0) => {
    setProductsLoading(true);
    try {
      const params: Record<string, string | number> = { page, size: 20 };
      if (filterBarcode) params.barcode = filterBarcode;
      if (filterOnSale) params.onSale = filterOnSale;

      const res = await panelApi.get<TrendyolProductResponse>(
        '/marketplace/trendyol/products',
        params,
      );
      setProducts(res.content || []);
      setProductsMeta({
        totalElements: res.totalElements,
        totalPages: res.totalPages,
        page: res.page,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setProductsLoading(false);
    }
  }, [filterBarcode, filterOnSale]);

  const handleImport = async () => {
    setImporting(true);
    setImportResult(null);
    setError('');
    try {
      const res = await panelApi.post<{ imported: number; skipped: number; errors: string[] }>(
        '/marketplace/trendyol/import',
        {
          page: productsMeta.page,
          size: 50,
          onSale: filterOnSale ? filterOnSale === 'true' : undefined,
          barcode: filterBarcode || undefined,
        },
      );
      setImportResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link href={`/${locale}/panel`} className="transition-colors hover:text-slate-700">
          Panel
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/${locale}/panel/marketplace`} className="transition-colors hover:text-slate-700">
          Pazaryeri
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-slate-800">Trendyol</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
            🟠
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Trendyol Entegrasyonu
            </h1>
            <p className="text-sm text-slate-500">
              Trendyol mağazanızdaki ürünleri e-ticaret sitenize aktarın
            </p>
          </div>
        </div>
        {status?.connected && (
          <Badge className="gap-1.5 bg-emerald-50 text-emerald-700">
            <CheckCircle className="h-3.5 w-3.5" />
            Bağlı
          </Badge>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
          <button onClick={() => setError('')} className="float-right font-medium hover:underline">
            Kapat
          </button>
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
          <button onClick={() => setSuccess('')} className="float-right font-medium hover:underline">
            Kapat
          </button>
        </div>
      )}

      {/* Connection Form */}
      {!status?.connected && (
        <Card className="overflow-hidden border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
            <h2 className="text-sm font-semibold text-slate-800">Trendyol API Bağlantısı</h2>
          </div>
          <div className="p-6">
            <p className="mb-6 text-sm text-slate-500">
              Trendyol Satıcı Paneli &rarr; Entegrasyon Bilgileri sayfasından API bilgilerinizi alabilirsiniz.
            </p>
            <form onSubmit={handleConnect} className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-slate-500">Supplier ID (Satıcı ID)</Label>
                <Input
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  placeholder="123456"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-500">API Key</Label>
                <Input
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                  required
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-500">API Secret</Label>
                <Input
                  type="password"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  placeholder="••••••••••••••••••••"
                  required
                  className="mt-1.5"
                />
              </div>
              <Button
                type="submit"
                disabled={connecting}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {connecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Bağlanıyor...
                  </>
                ) : (
                  <>
                    <Link2 className="mr-2 h-4 w-4" />
                    Bağlan
                  </>
                )}
              </Button>
            </form>
          </div>
        </Card>
      )}

      {/* Connected State — Product Browser */}
      {status?.connected && (
        <>
          {/* Actions Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => fetchProducts(0)}
              disabled={productsLoading}
              className="bg-violet-600 hover:bg-violet-700"
            >
              {productsLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Ürünleri Getir
            </Button>
            <Button
              onClick={handleImport}
              disabled={importing || products.length === 0}
              variant="outline"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              {importing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Mağazama Aktar ({products.length} ürün)
            </Button>
            <div className="ml-auto">
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="border-rose-200 text-rose-600 hover:bg-rose-50"
              >
                <Unplug className="mr-2 h-4 w-4" />
                Bağlantıyı Kes
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="flex flex-wrap items-end gap-4 p-4">
              <div className="flex-1">
                <Label className="text-xs font-medium text-slate-500">Barkod</Label>
                <Input
                  value={filterBarcode}
                  onChange={(e) => setFilterBarcode(e.target.value)}
                  placeholder="Barkod ile ara..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-500">Durum</Label>
                <select
                  value={filterOnSale}
                  onChange={(e) => setFilterOnSale(e.target.value)}
                  className="mt-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                >
                  <option value="">Tümü</option>
                  <option value="true">Satışta</option>
                  <option value="false">Satışta Değil</option>
                </select>
              </div>
              <Button onClick={() => fetchProducts(0)} variant="outline" size="sm">
                Filtrele
              </Button>
            </div>
          </Card>

          {/* Import Result */}
          {importResult && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <h3 className="text-sm font-semibold text-emerald-800">İçe Aktarma Tamamlandı</h3>
              <div className="mt-2 flex gap-6 text-sm">
                <span className="text-emerald-700">
                  <CheckCircle className="mr-1 inline h-4 w-4" />
                  {importResult.imported} aktarıldı
                </span>
                <span className="text-slate-500">
                  {importResult.skipped} atlandı (zaten mevcut)
                </span>
                {importResult.errors.length > 0 && (
                  <span className="text-rose-600">
                    <XCircle className="mr-1 inline h-4 w-4" />
                    {importResult.errors.length} hata
                  </span>
                )}
              </div>
              {importResult.imported > 0 && (
                <Link
                  href={`/${locale}/panel/products`}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:underline"
                >
                  Ürünlere Git →
                </Link>
              )}
            </div>
          )}

          {/* Product List */}
          {products.length > 0 && (
            <Card className="overflow-hidden border border-slate-200 shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                <h2 className="text-sm font-semibold text-slate-800">
                  Trendyol Ürünleri ({productsMeta.totalElements} toplam)
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/40 text-left">
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Görsel
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Ürün
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Marka
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Fiyat
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Stok
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Durum
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => (
                      <tr key={p.id} className="transition-colors hover:bg-slate-50/50">
                        <td className="px-5 py-3">
                          {p.images?.[0]?.url ? (
                            <img
                              src={p.images[0].url}
                              alt={p.title}
                              className="h-12 w-12 rounded-lg object-cover ring-1 ring-slate-200"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                              <Package className="h-5 w-5 text-slate-400" />
                            </div>
                          )}
                        </td>
                        <td className="max-w-xs px-5 py-3">
                          <p className="truncate text-sm font-medium text-slate-800">{p.title}</p>
                          <p className="text-xs text-slate-400">{p.stockCode}</p>
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-600">{p.brandName}</td>
                        <td className="px-5 py-3">
                          <p className="text-sm font-semibold text-slate-800">
                            ₺{p.salePrice?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                          </p>
                          {p.listPrice > p.salePrice && (
                            <p className="text-xs text-slate-400 line-through">
                              ₺{p.listPrice?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-600">{p.quantity}</td>
                        <td className="px-5 py-3">
                          {p.onSale ? (
                            <Badge className="bg-emerald-50 text-emerald-700">Satışta</Badge>
                          ) : p.approved ? (
                            <Badge className="bg-amber-50 text-amber-700">Onaylı</Badge>
                          ) : (
                            <Badge className="bg-slate-100 text-slate-500">Beklemede</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {productsMeta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 border-t border-slate-100 p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={productsMeta.page <= 0}
                    onClick={() => fetchProducts(productsMeta.page - 1)}
                  >
                    Önceki
                  </Button>
                  <span className="text-sm text-slate-500">
                    {productsMeta.page + 1} / {productsMeta.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={productsMeta.page >= productsMeta.totalPages - 1}
                    onClick={() => fetchProducts(productsMeta.page + 1)}
                  >
                    Sonraki
                  </Button>
                </div>
              )}
            </Card>
          )}

          {/* Empty state when no products fetched yet */}
          {products.length === 0 && !productsLoading && (
            <Card className="overflow-hidden border border-slate-200 shadow-sm">
              <div className="flex flex-col items-center justify-center py-16">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Package className="h-8 w-8 text-slate-300" />
                </div>
                <p className="mt-4 text-sm font-medium text-slate-600">
                  Trendyol ürünlerinizi görüntülemek için &quot;Ürünleri Getir&quot; butonuna tıklayın
                </p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
