'use client';

import { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  Input,
  Label,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';
import {
  ChevronRight,
  Link2,
  Unplug,
  Download,
  Upload,
  Search,
  Package,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  ArrowLeftRight,
  History,
  Zap,
  FolderTree,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ConnectionStatus {
  connected: boolean;
  supplierId?: string;
}

interface MarketplaceProduct {
  id: number | string;
  barcode?: string;
  title: string;
  brandName?: string;
  categoryName?: string;
  quantity: number;
  salePrice: number;
  listPrice?: number;
  stockCode?: string;
  images?: { url: string }[];
  approved?: boolean;
  onSale?: boolean;
}

interface MarketplaceProductResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content: MarketplaceProduct[];
}

interface LocalProduct {
  id: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  listingStatus?: 'pending' | 'sent' | 'approved' | 'rejected' | 'error';
  image?: string;
}

interface LocalProductResponse {
  data: LocalProduct[];
  total: number;
  page: number;
  totalPages: number;
}

interface LocalCategory {
  id: string;
  name: string;
}

interface MarketplaceCategory {
  id: string;
  name: string;
}

interface CategoryMapping {
  localCategoryId: string;
  marketplaceCategoryId: string | null;
  marketplaceCategoryName?: string;
}

interface SyncLog {
  id: string;
  date: string;
  action: string;
  status: 'success' | 'error' | 'partial';
  itemCount: number;
  errorCount: number;
  message?: string;
}

/* ------------------------------------------------------------------ */
/*  Marketplace config                                                 */
/* ------------------------------------------------------------------ */

const MP_CONFIG: Record<string, { name: string; icon: string; color: string; needsSupplierId: boolean }> = {
  trendyol: { name: 'Trendyol', icon: '🟠', color: 'orange', needsSupplierId: true },
  hepsiburada: { name: 'Hepsiburada', icon: '🟣', color: 'purple', needsSupplierId: true },
  ciceksepeti: { name: 'Ciceksepeti', icon: '🌸', color: 'pink', needsSupplierId: false },
};

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  pending: { label: 'Beklemede', className: 'bg-slate-100 text-slate-500' },
  sent: { label: 'Gonderildi', className: 'bg-blue-50 text-blue-700' },
  approved: { label: 'Onaylandi', className: 'bg-emerald-50 text-emerald-700' },
  rejected: { label: 'Reddedildi', className: 'bg-rose-50 text-rose-700' },
  error: { label: 'Hata', className: 'bg-rose-50 text-rose-700' },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MarketplaceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; marketplace: string }>;
}) {
  const { locale, marketplace: mp } = use(params);
  const config = MP_CONFIG[mp] ?? { name: mp, icon: '📦', color: 'slate', needsSupplierId: true };

  /* ---------- Connection state ---------- */
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /* Credentials */
  const [supplierId, setSupplierId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');

  /* ---------- Categories state ---------- */
  const [localCategories, setLocalCategories] = useState<LocalCategory[]>([]);
  const [categoryMappings, setCategoryMappings] = useState<CategoryMapping[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [syncingCategories, setSyncingCategories] = useState(false);
  const [autoMatching, setAutoMatching] = useState(false);
  const [categorySearch, setCategorySearch] = useState<Record<string, string>>({});
  const [categoryResults, setCategoryResults] = useState<Record<string, MarketplaceCategory[]>>({});
  const [savingMapping, setSavingMapping] = useState<Record<string, boolean>>({});

  /* ---------- Products state ---------- */
  const [mpProducts, setMpProducts] = useState<MarketplaceProduct[]>([]);
  const [mpProductsMeta, setMpProductsMeta] = useState({ totalElements: 0, totalPages: 0, page: 0 });
  const [mpProductsLoading, setMpProductsLoading] = useState(false);
  const [selectedImportIds, setSelectedImportIds] = useState<Set<number | string>>(new Set());
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number; errors: string[] } | null>(null);

  const [localProducts, setLocalProducts] = useState<LocalProduct[]>([]);
  const [localProductsMeta, setLocalProductsMeta] = useState({ total: 0, totalPages: 0, page: 0 });
  const [localProductsLoading, setLocalProductsLoading] = useState(false);
  const [selectedExportIds, setSelectedExportIds] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [syncingStock, setSyncingStock] = useState(false);

  /* ---------- Sync logs state ---------- */
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [syncLogsLoading, setSyncLogsLoading] = useState(false);

  /* ---------------------------------------------------------------- */
  /*  Fetchers                                                         */
  /* ---------------------------------------------------------------- */

  const fetchStatus = useCallback(async () => {
    setStatusLoading(true);
    try {
      const res = await panelApi.get<ConnectionStatus>(`/marketplace/${mp}/status`);
      setStatus(res);
    } catch {
      setStatus({ connected: false });
    } finally {
      setStatusLoading(false);
    }
  }, [mp]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  /* Connection */
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnecting(true);
    setError('');
    setSuccess('');
    try {
      const body: Record<string, string> = { apiKey, apiSecret };
      if (config.needsSupplierId) body.supplierId = supplierId;

      const res = await panelApi.post<{ success: boolean; message: string }>(
        `/marketplace/${mp}/connect`,
        body,
      );
      if (res.success) {
        setSuccess(res.message);
        setStatus({ connected: true, supplierId: supplierId || undefined });
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Baglanti basarisiz');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm(`${config.name} baglantisini kesmek istediginize emin misiniz?`)) return;
    try {
      await panelApi.delete(`/marketplace/${mp}/disconnect`);
      setStatus({ connected: false });
      setMpProducts([]);
      setSuccess(`${config.name} baglantisi kesildi.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Baglanti kesilemedi');
    }
  };

  /* Categories */
  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const [locals, mappings] = await Promise.all([
        panelApi.get<LocalCategory[]>('/categories'),
        panelApi.get<CategoryMapping[]>(`/marketplace/${mp}/category-mappings`),
      ]);
      setLocalCategories(Array.isArray(locals) ? locals : []);
      setCategoryMappings(Array.isArray(mappings) ? mappings : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kategoriler yuklenemedi');
    } finally {
      setCategoriesLoading(false);
    }
  }, [mp]);

  const handleSyncCategories = async () => {
    setSyncingCategories(true);
    setError('');
    try {
      await panelApi.post(`/marketplace/${mp}/sync-categories`);
      setSuccess('Kategoriler senkronize edildi.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kategori senkronizasyonu basarisiz');
    } finally {
      setSyncingCategories(false);
    }
  };

  const handleAutoMatch = async () => {
    setAutoMatching(true);
    setError('');
    try {
      await panelApi.post(`/marketplace/${mp}/auto-match-categories`);
      setSuccess('Otomatik eslestirme tamamlandi.');
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Otomatik eslestirme basarisiz');
    } finally {
      setAutoMatching(false);
    }
  };

  const searchMarketplaceCategories = async (localCatId: string, query: string) => {
    setCategorySearch((prev) => ({ ...prev, [localCatId]: query }));
    if (query.length < 2) {
      setCategoryResults((prev) => ({ ...prev, [localCatId]: [] }));
      return;
    }
    try {
      const res = await panelApi.get<MarketplaceCategory[]>(
        `/marketplace/${mp}/categories`,
        { search: query },
      );
      setCategoryResults((prev) => ({ ...prev, [localCatId]: Array.isArray(res) ? res : [] }));
    } catch {
      setCategoryResults((prev) => ({ ...prev, [localCatId]: [] }));
    }
  };

  const saveMapping = async (localCategoryId: string, marketplaceCategoryId: string) => {
    setSavingMapping((prev) => ({ ...prev, [localCategoryId]: true }));
    try {
      await panelApi.put(`/marketplace/${mp}/category-mappings`, {
        localCategoryId,
        marketplaceCategoryId,
      });
      setCategoryMappings((prev) => {
        const existing = prev.findIndex((m) => m.localCategoryId === localCategoryId);
        const updated = [...prev];
        if (existing >= 0) {
          updated[existing] = { ...updated[existing], marketplaceCategoryId };
        } else {
          updated.push({ localCategoryId, marketplaceCategoryId });
        }
        return updated;
      });
      setCategoryResults((prev) => ({ ...prev, [localCategoryId]: [] }));
      setCategorySearch((prev) => ({ ...prev, [localCategoryId]: '' }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eslestirme kaydedilemedi');
    } finally {
      setSavingMapping((prev) => ({ ...prev, [localCategoryId]: false }));
    }
  };

  /* Products — Import */
  const fetchMpProducts = useCallback(async (page = 0) => {
    setMpProductsLoading(true);
    try {
      const res = await panelApi.get<MarketplaceProductResponse>(
        `/marketplace/${mp}/products`,
        { page, size: 20 },
      );
      setMpProducts(res.content || []);
      setMpProductsMeta({
        totalElements: res.totalElements,
        totalPages: res.totalPages,
        page: res.page,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Urunler yuklenemedi');
    } finally {
      setMpProductsLoading(false);
    }
  }, [mp]);

  const handleImport = async () => {
    if (selectedImportIds.size === 0) return;
    setImporting(true);
    setImportResult(null);
    setError('');
    try {
      const res = await panelApi.post<{ imported: number; skipped: number; errors: string[] }>(
        `/marketplace/${mp}/import`,
        { productIds: Array.from(selectedImportIds) },
      );
      setImportResult(res);
      setSelectedImportIds(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ice aktarma basarisiz');
    } finally {
      setImporting(false);
    }
  };

  /* Products — Export */
  const fetchLocalProducts = useCallback(async (page = 0) => {
    setLocalProductsLoading(true);
    try {
      const res = await panelApi.get<LocalProductResponse>(
        `/marketplace/${mp}/local-products`,
        { page, size: 20 },
      );
      setLocalProducts(res.data || []);
      setLocalProductsMeta({ total: res.total, totalPages: res.totalPages, page: res.page });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yerel urunler yuklenemedi');
    } finally {
      setLocalProductsLoading(false);
    }
  }, [mp]);

  const handleSendProducts = async () => {
    if (selectedExportIds.size === 0) return;
    setSending(true);
    setError('');
    try {
      await panelApi.post(`/marketplace/${mp}/products/send`, {
        productIds: Array.from(selectedExportIds),
      });
      setSuccess('Secilen urunler gonderildi.');
      setSelectedExportIds(new Set());
      fetchLocalProducts(localProductsMeta.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Urun gonderimi basarisiz');
    } finally {
      setSending(false);
    }
  };

  const handleSyncStock = async () => {
    setSyncingStock(true);
    setError('');
    try {
      await panelApi.post(`/marketplace/${mp}/sync-stock`);
      setSuccess('Stok/fiyat senkronizasyonu baslatildi.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stok senkronizasyonu basarisiz');
    } finally {
      setSyncingStock(false);
    }
  };

  /* Sync Logs */
  const fetchSyncLogs = useCallback(async () => {
    setSyncLogsLoading(true);
    try {
      const res = await panelApi.get<SyncLog[]>(`/marketplace/${mp}/sync-logs`);
      setSyncLogs(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gecmis yuklenemedi');
    } finally {
      setSyncLogsLoading(false);
    }
  }, [mp]);

  /* ---------------------------------------------------------------- */
  /*  Helpers                                                          */
  /* ---------------------------------------------------------------- */

  const toggleImportId = (id: number | string) => {
    setSelectedImportIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllImport = () => {
    if (selectedImportIds.size === mpProducts.length) {
      setSelectedImportIds(new Set());
    } else {
      setSelectedImportIds(new Set(mpProducts.map((p) => p.id)));
    }
  };

  const toggleExportId = (id: string) => {
    setSelectedExportIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllExport = () => {
    if (selectedExportIds.size === localProducts.length) {
      setSelectedExportIds(new Set());
    } else {
      setSelectedExportIds(new Set(localProducts.map((p) => p.id)));
    }
  };

  const getMappingForLocal = (localCatId: string) =>
    categoryMappings.find((m) => m.localCategoryId === localCatId);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
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
        <span className="font-medium text-slate-800">{config.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${config.color}-100 text-2xl`}>
            {config.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {config.name} Entegrasyonu
            </h1>
            <p className="text-sm text-slate-500">
              {config.name} magazanizi yonetin
            </p>
          </div>
        </div>
        {status?.connected && (
          <Badge className="gap-1.5 bg-emerald-50 text-emerald-700">
            <CheckCircle className="h-3.5 w-3.5" />
            Bagli
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

      {/* Tabs */}
      <Tabs
        defaultValue="connection"
        onValueChange={(val) => {
          if (val === 'categories' && localCategories.length === 0) fetchCategories();
          if (val === 'products' && mpProducts.length === 0 && localProducts.length === 0) {
            if (status?.connected) {
              fetchMpProducts(0);
              fetchLocalProducts(0);
            }
          }
          if (val === 'logs' && syncLogs.length === 0) fetchSyncLogs();
        }}
      >
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="connection" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Link2 className="mr-1.5 h-3.5 w-3.5" />
            Baglanti
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <FolderTree className="mr-1.5 h-3.5 w-3.5" />
            Kategoriler
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Package className="mr-1.5 h-3.5 w-3.5" />
            Urunler
          </TabsTrigger>
          <TabsTrigger value="logs" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <History className="mr-1.5 h-3.5 w-3.5" />
            Gecmis
          </TabsTrigger>
        </TabsList>

        {/* ============================================================ */}
        {/*  TAB 1: Connection                                           */}
        {/* ============================================================ */}
        <TabsContent value="connection" className="mt-6 space-y-4">
          {!status?.connected ? (
            <Card className="overflow-hidden border border-slate-200 shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                <h2 className="text-sm font-semibold text-slate-800">
                  {config.name} API Baglantisi
                </h2>
              </div>
              <div className="p-6">
                <p className="mb-6 text-sm text-slate-500">
                  {config.name} Satici Paneli &rarr; Entegrasyon Bilgileri
                  sayfasindan API bilgilerinizi alabilirsiniz.
                </p>
                <form onSubmit={handleConnect} className="space-y-4">
                  {config.needsSupplierId && (
                    <div>
                      <Label className="text-xs font-medium text-slate-500">
                        Supplier ID (Satici ID)
                      </Label>
                      <Input
                        value={supplierId}
                        onChange={(e) => setSupplierId(e.target.value)}
                        placeholder="123456"
                        required
                        className="mt-1.5"
                      />
                    </div>
                  )}
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
                      placeholder="••••••••••••••••"
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
                        Baglaniyor...
                      </>
                    ) : (
                      <>
                        <Link2 className="mr-2 h-4 w-4" />
                        Baglan
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          ) : (
            <Card className="overflow-hidden border border-slate-200 shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                <h2 className="text-sm font-semibold text-slate-800">Baglanti Durumu</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <Badge className="gap-1.5 bg-emerald-50 text-emerald-700">
                    <CheckCircle className="h-3.5 w-3.5" />
                    Bagli
                  </Badge>
                  {status.supplierId && (
                    <span className="text-sm text-slate-500">
                      Supplier ID: <span className="font-mono font-medium text-slate-700">{status.supplierId}</span>
                    </span>
                  )}
                </div>
                <div className="mt-6">
                  <Button
                    onClick={handleDisconnect}
                    variant="outline"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    <Unplug className="mr-2 h-4 w-4" />
                    Baglantiyi Kes
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* ============================================================ */}
        {/*  TAB 2: Categories                                           */}
        {/* ============================================================ */}
        <TabsContent value="categories" className="mt-6 space-y-4">
          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={handleSyncCategories}
              disabled={syncingCategories}
              className="bg-violet-600 hover:bg-violet-700"
            >
              {syncingCategories ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Kategorileri Senkronize Et
            </Button>
            <Button
              onClick={handleAutoMatch}
              disabled={autoMatching}
              variant="outline"
            >
              {autoMatching ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Zap className="mr-2 h-4 w-4" />
              )}
              Otomatik Eslestir
            </Button>
          </div>

          {/* Mapping Table */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Kategori Eslestirme
              </h2>
            </div>
            {categoriesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
              </div>
            ) : localCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FolderTree className="h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">Henuz yerel kategori bulunamadi</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/40 text-left">
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Yerel Kategori
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        <ArrowLeftRight className="mr-1 inline h-3.5 w-3.5" />
                        {config.name} Kategorisi
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Durum
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {localCategories.map((cat) => {
                      const mapping = getMappingForLocal(cat.id);
                      const isMapped = !!mapping?.marketplaceCategoryId;
                      const search = categorySearch[cat.id] || '';
                      const results = categoryResults[cat.id] || [];
                      const saving = savingMapping[cat.id] || false;

                      return (
                        <tr key={cat.id} className="transition-colors hover:bg-slate-50/50">
                          <td className="px-5 py-3 text-sm font-medium text-slate-800">
                            {cat.name}
                          </td>
                          <td className="px-5 py-3">
                            {isMapped ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-700">
                                  {mapping?.marketplaceCategoryName || mapping?.marketplaceCategoryId}
                                </span>
                                <button
                                  onClick={() =>
                                    setCategoryMappings((prev) =>
                                      prev.map((m) =>
                                        m.localCategoryId === cat.id
                                          ? { ...m, marketplaceCategoryId: null, marketplaceCategoryName: undefined }
                                          : m,
                                      ),
                                    )
                                  }
                                  className="text-xs text-slate-400 hover:text-rose-500"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="relative">
                                <Input
                                  value={search}
                                  onChange={(e) => searchMarketplaceCategories(cat.id, e.target.value)}
                                  placeholder={`${config.name} kategorisi ara...`}
                                  className="h-8 text-sm"
                                />
                                {results.length > 0 && (
                                  <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                                    {results.map((rc) => (
                                      <button
                                        key={rc.id}
                                        onClick={() => saveMapping(cat.id, rc.id)}
                                        disabled={saving}
                                        className="block w-full px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-violet-50 hover:text-violet-700"
                                      >
                                        {rc.name}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            {isMapped ? (
                              <Badge className="bg-emerald-50 text-emerald-700">Eslesti</Badge>
                            ) : (
                              <Badge className="bg-slate-100 text-slate-500">Eslesmedi</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* ============================================================ */}
        {/*  TAB 3: Products                                             */}
        {/* ============================================================ */}
        <TabsContent value="products" className="mt-6 space-y-6">
          {!status?.connected ? (
            <Card className="overflow-hidden border border-slate-200 shadow-sm">
              <div className="flex flex-col items-center justify-center py-16">
                <Link2 className="h-10 w-10 text-slate-300" />
                <p className="mt-4 text-sm font-medium text-slate-600">
                  Urun islemleri icin once {config.name} baglantisi kurun.
                </p>
              </div>
            </Card>
          ) : (
            <>
              {/* ---- Import Section ---- */}
              <Card className="overflow-hidden border border-slate-200 shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-800">
                      <Download className="mr-1.5 inline h-4 w-4" />
                      Ice Aktar ({config.name} &rarr; Yerel)
                    </h2>
                    <div className="flex items-center gap-2">
                      {selectedImportIds.size > 0 && (
                        <Button
                          onClick={handleImport}
                          disabled={importing}
                          size="sm"
                          className="bg-violet-600 hover:bg-violet-700"
                        >
                          {importing ? (
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Download className="mr-1.5 h-3.5 w-3.5" />
                          )}
                          Secilenleri Ice Aktar ({selectedImportIds.size})
                        </Button>
                      )}
                      <Button
                        onClick={() => fetchMpProducts(0)}
                        disabled={mpProductsLoading}
                        variant="outline"
                        size="sm"
                      >
                        {mpProductsLoading ? (
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Search className="mr-1.5 h-3.5 w-3.5" />
                        )}
                        Urunleri Getir
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Import result */}
                {importResult && (
                  <div className="border-b border-emerald-200 bg-emerald-50 px-6 py-3">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium text-emerald-700">
                        <CheckCircle className="mr-1 inline h-4 w-4" />
                        {importResult.imported} aktarildi
                      </span>
                      <span className="text-slate-500">{importResult.skipped} atlandi</span>
                      {importResult.errors.length > 0 && (
                        <span className="text-rose-600">
                          <XCircle className="mr-1 inline h-4 w-4" />
                          {importResult.errors.length} hata
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {mpProducts.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/40 text-left">
                            <th className="px-5 py-3">
                              <input
                                type="checkbox"
                                checked={selectedImportIds.size === mpProducts.length && mpProducts.length > 0}
                                onChange={toggleAllImport}
                                className="rounded border-slate-300"
                              />
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                              Urun
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
                          {mpProducts.map((p) => (
                            <tr key={p.id} className="transition-colors hover:bg-slate-50/50">
                              <td className="px-5 py-3">
                                <input
                                  type="checkbox"
                                  checked={selectedImportIds.has(p.id)}
                                  onChange={() => toggleImportId(p.id)}
                                  className="rounded border-slate-300"
                                />
                              </td>
                              <td className="max-w-xs px-5 py-3">
                                <p className="truncate text-sm font-medium text-slate-800">{p.title}</p>
                                <p className="text-xs text-slate-400">{p.stockCode || p.barcode}</p>
                              </td>
                              <td className="px-5 py-3 text-sm text-slate-600">{p.brandName}</td>
                              <td className="px-5 py-3 text-sm font-semibold text-slate-800">
                                {p.salePrice?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                              </td>
                              <td className="px-5 py-3 text-sm text-slate-600">{p.quantity}</td>
                              <td className="px-5 py-3">
                                {p.onSale ? (
                                  <Badge className="bg-emerald-50 text-emerald-700">Satista</Badge>
                                ) : (
                                  <Badge className="bg-slate-100 text-slate-500">Pasif</Badge>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {mpProductsMeta.totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 border-t border-slate-100 p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={mpProductsMeta.page <= 0}
                          onClick={() => fetchMpProducts(mpProductsMeta.page - 1)}
                        >
                          Onceki
                        </Button>
                        <span className="text-sm text-slate-500">
                          {mpProductsMeta.page + 1} / {mpProductsMeta.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={mpProductsMeta.page >= mpProductsMeta.totalPages - 1}
                          onClick={() => fetchMpProducts(mpProductsMeta.page + 1)}
                        >
                          Sonraki
                        </Button>
                      </div>
                    )}
                  </>
                ) : mpProductsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Package className="h-10 w-10 text-slate-300" />
                    <p className="mt-3 text-sm text-slate-500">
                      &quot;Urunleri Getir&quot; butonuna tiklayarak {config.name} urunlerini goruntuleyebilirsiniz
                    </p>
                  </div>
                )}
              </Card>

              {/* ---- Export Section ---- */}
              <Card className="overflow-hidden border border-slate-200 shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-800">
                      <Upload className="mr-1.5 inline h-4 w-4" />
                      Disa Aktar (Yerel &rarr; {config.name})
                    </h2>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleSyncStock}
                        disabled={syncingStock}
                        variant="outline"
                        size="sm"
                      >
                        {syncingStock ? (
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                        )}
                        Stok/Fiyat Senkronize
                      </Button>
                      {selectedExportIds.size > 0 && (
                        <Button
                          onClick={handleSendProducts}
                          disabled={sending}
                          size="sm"
                          className="bg-violet-600 hover:bg-violet-700"
                        >
                          {sending ? (
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Upload className="mr-1.5 h-3.5 w-3.5" />
                          )}
                          Secilenleri Gonder ({selectedExportIds.size})
                        </Button>
                      )}
                      <Button
                        onClick={() => fetchLocalProducts(0)}
                        disabled={localProductsLoading}
                        variant="outline"
                        size="sm"
                      >
                        {localProductsLoading ? (
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                        )}
                        Yenile
                      </Button>
                    </div>
                  </div>
                </div>

                {localProducts.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50/40 text-left">
                            <th className="px-5 py-3">
                              <input
                                type="checkbox"
                                checked={selectedExportIds.size === localProducts.length && localProducts.length > 0}
                                onChange={toggleAllExport}
                                className="rounded border-slate-300"
                              />
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                              Urun
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                              SKU
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                              Fiyat
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                              Stok
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                              Listeleme Durumu
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {localProducts.map((p) => {
                            const statusBadge = STATUS_BADGES[p.listingStatus || 'pending'];
                            return (
                              <tr key={p.id} className="transition-colors hover:bg-slate-50/50">
                                <td className="px-5 py-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedExportIds.has(p.id)}
                                    onChange={() => toggleExportId(p.id)}
                                    className="rounded border-slate-300"
                                  />
                                </td>
                                <td className="max-w-xs px-5 py-3">
                                  <p className="truncate text-sm font-medium text-slate-800">{p.name}</p>
                                </td>
                                <td className="px-5 py-3 text-sm font-mono text-slate-600">{p.sku || '-'}</td>
                                <td className="px-5 py-3 text-sm font-semibold text-slate-800">
                                  {p.price?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                </td>
                                <td className="px-5 py-3 text-sm text-slate-600">{p.stock}</td>
                                <td className="px-5 py-3">
                                  <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {localProductsMeta.totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 border-t border-slate-100 p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={localProductsMeta.page <= 0}
                          onClick={() => fetchLocalProducts(localProductsMeta.page - 1)}
                        >
                          Onceki
                        </Button>
                        <span className="text-sm text-slate-500">
                          {localProductsMeta.page + 1} / {localProductsMeta.totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={localProductsMeta.page >= localProductsMeta.totalPages - 1}
                          onClick={() => fetchLocalProducts(localProductsMeta.page + 1)}
                        >
                          Sonraki
                        </Button>
                      </div>
                    )}
                  </>
                ) : localProductsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Package className="h-10 w-10 text-slate-300" />
                    <p className="mt-3 text-sm text-slate-500">Henuz gonderilecek urun yok</p>
                  </div>
                )}
              </Card>
            </>
          )}
        </TabsContent>

        {/* ============================================================ */}
        {/*  TAB 4: Sync Logs                                            */}
        {/* ============================================================ */}
        <TabsContent value="logs" className="mt-6 space-y-4">
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-800">Senkronizasyon Gecmisi</h2>
                <Button
                  onClick={fetchSyncLogs}
                  disabled={syncLogsLoading}
                  variant="outline"
                  size="sm"
                >
                  {syncLogsLoading ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Yenile
                </Button>
              </div>
            </div>

            {syncLogsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
              </div>
            ) : syncLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <History className="h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">Henuz senkronizasyon gecmisi yok</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/40 text-left">
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Tarih
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Islem
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Durum
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Oge Sayisi
                      </th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Hata Sayisi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {syncLogs.map((log) => (
                      <tr key={log.id} className="transition-colors hover:bg-slate-50/50">
                        <td className="px-5 py-3 text-sm text-slate-600">
                          {new Date(log.date).toLocaleString('tr-TR')}
                        </td>
                        <td className="px-5 py-3 text-sm font-medium text-slate-800">{log.action}</td>
                        <td className="px-5 py-3">
                          {log.status === 'success' ? (
                            <Badge className="bg-emerald-50 text-emerald-700">Basarili</Badge>
                          ) : log.status === 'error' ? (
                            <Badge className="bg-rose-50 text-rose-700">Hata</Badge>
                          ) : (
                            <Badge className="bg-amber-50 text-amber-700">Kismi</Badge>
                          )}
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-600">{log.itemCount}</td>
                        <td className="px-5 py-3 text-sm text-slate-600">
                          {log.errorCount > 0 ? (
                            <span className="font-medium text-rose-600">{log.errorCount}</span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
