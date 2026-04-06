'use client';

import { use, useCallback, useEffect, useState } from 'react';
import { SendWizard } from './_components/send-wizard';

function locName(name: unknown, locale = 'tr'): string {
  if (typeof name === 'string') return name;
  if (name && typeof name === 'object') {
    const obj = name as Record<string, string>;
    return obj[locale] || obj.en || obj.tr || Object.values(obj)[0] || '';
  }
  return '';
}
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
  X,
  ShoppingBag,
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
  productMainId?: string;
  brand?: string;
  brandName?: string;
  categoryName?: string;
  quantity: number;
  salePrice: number;
  listPrice?: number;
  stockCode?: string;
  description?: string;
  images?: { url: string }[];
  attributes?: { attributeName?: string; attributeValue?: string }[];
  approved?: boolean;
  onSale?: boolean;
}

interface ProductGroup {
  mainId: string;
  mainProduct: MarketplaceProduct;
  variants: MarketplaceProduct[];
  totalStock: number;
  lowestPrice: number;
  allImages: string[];
}

interface MarketplaceProductResponse {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  content?: MarketplaceProduct[];
  products?: MarketplaceProduct[];
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
  marketplaceCategoryId?: string;
  categoryName?: string;
  name: string;
  path?: string;
}

interface CategoryMapping {
  localCategoryId: string;
  marketplaceCategoryId: string | null;
  marketplaceCategoryName?: string;
  marketplaceCategoryPath?: string;
  localCategoryPath?: string;
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

interface MpFieldConfig {
  key: string;
  label: string;
  placeholder: string;
  type?: string;
}

interface MpConfig {
  name: string;
  icon: string;
  color: string;
  needsSupplierId: boolean;
  fields: MpFieldConfig[];
}

const MP_CONFIG: Record<string, MpConfig> = {
  trendyol: {
    name: 'Trendyol',
    icon: '🟠',
    color: 'orange',
    needsSupplierId: true,
    fields: [
      { key: 'supplierId', label: 'Supplier ID (Satici ID)', placeholder: '123456' },
      { key: 'apiKey', label: 'API Key', placeholder: 'API anahtariniz', type: 'password' },
      { key: 'apiSecret', label: 'API Secret', placeholder: 'API sifreniz', type: 'password' },
    ],
  },
  hepsiburada: {
    name: 'Hepsiburada',
    icon: '🟣',
    color: 'purple',
    needsSupplierId: false,
    fields: [
      { key: 'apiKey', label: 'Merchant ID (Magaza ID)', placeholder: 'Entegrator bilgileri → Magaza ID', type: 'password' },
      { key: 'apiSecret', label: 'Merchant Key (Servis Anahtari)', placeholder: 'Entegrator bilgileri → Servis Anahtari', type: 'password' },
    ],
  },
  ciceksepeti: {
    name: 'Ciceksepeti',
    icon: '🌸',
    color: 'pink',
    needsSupplierId: false,
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'Ciceksepeti API anahtariniz', type: 'password' },
    ],
  },
};

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  pending: { label: 'Beklemede', className: 'bg-slate-100 text-slate-500' },
  sent: { label: 'Gonderildi', className: 'bg-violet-50 text-violet-700' },
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

  /* Credentials — dynamic based on marketplace */
  const [creds, setCreds] = useState<Record<string, string>>({});

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
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number; errors: string[]; totalVariants?: number; groupedInto?: number } | null>(null);
  const [detailGroup, setDetailGroup] = useState<ProductGroup | null>(null);

  const [localProducts, setLocalProducts] = useState<LocalProduct[]>([]);
  const [localProductsMeta, setLocalProductsMeta] = useState({ total: 0, totalPages: 0, page: 0 });
  const [localProductsLoading, setLocalProductsLoading] = useState(false);
  const [selectedExportIds, setSelectedExportIds] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);

  /* ---------- Brands state (Trendyol only) ---------- */
  const [brandMappings, setBrandMappings] = useState<Array<{ localBrand: string; marketplaceBrand: { id: string; name: string } | null; mapped: boolean }>>([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [syncingBrands, setSyncingBrands] = useState(false);
  const [autoMatchingBrands, setAutoMatchingBrands] = useState(false);
  const [brandSearchInputs, setBrandSearchInputs] = useState<Record<string, string>>({});
  const [brandSearchResults, setBrandSearchResults] = useState<Record<string, Array<{ id: string; marketplaceBrandId: string; brandName: string }>>>({});
  const [savingBrandMapping, setSavingBrandMapping] = useState<Record<string, boolean>>({});
  const [syncingStock, setSyncingStock] = useState(false);
  const [showSendWizard, setShowSendWizard] = useState(false);

  /* ---------- Orders state ---------- */
  const [mpOrders, setMpOrders] = useState<Array<{
    id: string; orderNumber: string; status: string; paymentStatus: string;
    totalAmount: string; currency: string; createdAt: string; source: string;
    marketplaceOrderId?: string; trackingNumber?: string; shippingMethod?: string;
    customer?: { id: string; email: string; firstName: string; lastName: string };
  }>>([]);
  const [mpOrdersMeta, setMpOrdersMeta] = useState({ total: 0, page: 0, limit: 50, totalPages: 0 });
  const [mpOrdersLoading, setMpOrdersLoading] = useState(false);
  const [syncingOrders, setSyncingOrders] = useState(false);

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
      const res = await panelApi.post<{ success: boolean; message: string }>(
        `/marketplace/${mp}/connect`,
        creds,
      );
      if (res.success) {
        setSuccess(res.message);
        setStatus({ connected: true, supplierId: creds.supplierId || undefined });
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
      const res = await panelApi.get<{ categories: Array<{ id: string; marketplaceCategoryId: string; categoryName: string; path: string }> }>(
        `/marketplace/${mp}/categories`,
        { search: query, limit: 20 },
      );
      const cats: MarketplaceCategory[] = (res.categories ?? []).map(c => ({
        id: c.marketplaceCategoryId,
        marketplaceCategoryId: c.marketplaceCategoryId,
        categoryName: c.categoryName,
        name: c.categoryName,
        path: c.path,
      }));
      setCategoryResults((prev) => ({ ...prev, [localCatId]: cats }));
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

  /* Products — Import filters */
  const [filterBarcode, setFilterBarcode] = useState('');
  const [filterOnSale, setFilterOnSale] = useState('');
  const [filterApproved, setFilterApproved] = useState('');
  const [filterPageSize, setFilterPageSize] = useState(50);

  const fetchMpProducts = useCallback(async (page = 0) => {
    setMpProductsLoading(true);
    try {
      const params: Record<string, string | number> = { page, size: filterPageSize };
      if (filterBarcode) params.barcode = filterBarcode;
      if (filterOnSale) params.onSale = filterOnSale;
      if (filterApproved) params.approved = filterApproved;

      const res = await panelApi.get<MarketplaceProductResponse>(
        `/marketplace/${mp}/products`,
        params,
      );
      // Trendyol returns "content", HB returns "products"
      const raw = (res.content || res.products || []) as unknown as Record<string, unknown>[];
      // Normalize to common MarketplaceProduct interface
      const normalized: MarketplaceProduct[] = raw.map((p) => {
        const matched = (p.matchedHbProductInfo as Array<Record<string, unknown>>)?.[0];
        const hbImages = (matched?.images as string[]) ?? [];
        return {
          id: (p.id ?? p.merchantSku ?? p.hbSku ?? '') as string | number,
          barcode: String(p.barcode ?? ''),
          title: String(p.title ?? p.productName ?? ''),
          productMainId: String(p.productMainId ?? p.variantGroupId ?? ''),
          brand: String(p.brand ?? p.brandName ?? matched?.brand ?? ''),
          categoryName: String(p.categoryName ?? ''),
          quantity: Number(p.quantity ?? p.stock ?? 0),
          salePrice: Number(p.salePrice ?? p.price ?? 0),
          listPrice: Number(p.listPrice ?? p.salePrice ?? p.price ?? 0),
          stockCode: String(p.stockCode ?? p.merchantSku ?? ''),
          description: String(p.description ?? ''),
          images: Array.isArray(p.images) ? (p.images as { url: string }[]) : hbImages.map((url) => ({ url: url.replace('{size}', '500') })),
          attributes: (p.attributes as MarketplaceProduct['attributes']) ?? [],
          approved: Boolean(p.approved ?? (p.productStatus === 'Satışa Hazır')),
          onSale: Boolean(p.onSale ?? (p.productStatus === 'Satışa Hazır')),
        };
      });
      setMpProducts(normalized);
      setMpProductsMeta({
        totalElements: res.totalElements,
        totalPages: res.totalPages,
        page: res.page,
      });
      setSelectedImportIds(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Urunler yuklenemedi');
    } finally {
      setMpProductsLoading(false);
    }
  }, [mp, filterBarcode, filterOnSale, filterApproved, filterPageSize]);

  // Group products by productMainId for variant display
  const productGroups: ProductGroup[] = (() => {
    const map = new Map<string, MarketplaceProduct[]>();
    for (const p of mpProducts) {
      const key = p.productMainId || String(p.id);
      const arr = map.get(key) ?? [];
      arr.push(p);
      map.set(key, arr);
    }
    return Array.from(map.entries()).map(([mainId, variants]) => ({
      mainId,
      mainProduct: variants[0],
      variants,
      totalStock: variants.reduce((sum, v) => sum + v.quantity, 0),
      lowestPrice: Math.min(...variants.map((v) => v.salePrice)),
      allImages: [...new Set(variants.flatMap((v) => (v.images ?? []).map((img) => img.url)))],
    }));
  })();

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

  const handleSendProducts = () => {
    if (selectedExportIds.size === 0) return;
    setShowSendWizard(true);
  };

  const handleSendProductsDirect = async () => {
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

  /* Brands */
  const fetchBrandMappings = useCallback(async () => {
    setBrandsLoading(true);
    try {
      const res = await panelApi.get<typeof brandMappings>(`/marketplace/${mp}/brand-mappings`);
      setBrandMappings(Array.isArray(res) ? res : []);
    } catch {
      setBrandMappings([]);
    } finally {
      setBrandsLoading(false);
    }
  }, [mp]);

  const handleSyncBrands = async () => {
    setSyncingBrands(true);
    setError('');
    try {
      const res = await panelApi.post<{ synced: number }>(`/marketplace/${mp}/sync-brands`);
      setSuccess(`${res.synced} marka senkronize edildi.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Marka senkronizasyonu basarisiz');
    } finally {
      setSyncingBrands(false);
    }
  };

  const handleAutoMatchBrands = async () => {
    setAutoMatchingBrands(true);
    setError('');
    try {
      const res = await panelApi.post<{ matched: number; total: number }>(`/marketplace/${mp}/auto-match-brands`);
      setSuccess(`${res.matched}/${res.total} marka otomatik eslestirildi.`);
      fetchBrandMappings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Otomatik eslestirme basarisiz');
    } finally {
      setAutoMatchingBrands(false);
    }
  };

  const searchTrendyolBrands = async (localBrand: string, query: string) => {
    setBrandSearchInputs(p => ({ ...p, [localBrand]: query }));
    if (query.length < 2) { setBrandSearchResults(p => ({ ...p, [localBrand]: [] })); return; }
    try {
      const res = await panelApi.get<{ brands: Array<{ id: string; marketplaceBrandId: string; brandName: string }> }>(
        `/marketplace/${mp}/brands`, { q: query, limit: 20 },
      );
      setBrandSearchResults(p => ({ ...p, [localBrand]: res.brands ?? [] }));
    } catch { setBrandSearchResults(p => ({ ...p, [localBrand]: [] })); }
  };

  const saveBrandMapping = async (localBrand: string, marketplaceBrandId: string) => {
    setSavingBrandMapping(p => ({ ...p, [localBrand]: true }));
    try {
      await panelApi.post(`/marketplace/${mp}/brand-mappings`, { localBrand, marketplaceBrandId });
      setBrandSearchInputs(p => ({ ...p, [localBrand]: '' }));
      setBrandSearchResults(p => ({ ...p, [localBrand]: [] }));
      fetchBrandMappings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Marka eslestirme kaydedilemedi');
    } finally {
      setSavingBrandMapping(p => ({ ...p, [localBrand]: false }));
    }
  };

  /* Orders */
  const fetchMpOrders = useCallback(async (page = 0) => {
    setMpOrdersLoading(true);
    try {
      const res = await panelApi.get<{ data: typeof mpOrders; meta: typeof mpOrdersMeta }>(`/marketplace/${mp}/orders`, { page, limit: 50 });
      setMpOrders(res.data ?? []);
      setMpOrdersMeta(res.meta ?? { total: 0, page: 0, limit: 50, totalPages: 0 });
    } catch { setMpOrders([]); }
    finally { setMpOrdersLoading(false); }
  }, [mp]);

  const handleSyncOrders = async () => {
    setSyncingOrders(true);
    try {
      await panelApi.post(`/marketplace/${mp}/sync-orders`, {});
      await fetchMpOrders(0);
    } catch (err) {
      // silent — error shown via sync logs
    } finally {
      setSyncingOrders(false);
    }
  };

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
          if (val === 'orders' && mpOrders.length === 0) fetchMpOrders();
          if (val === 'brands' && brandMappings.length === 0) fetchBrandMappings();
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
          <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
            Siparisler
          </TabsTrigger>
          {mp === 'trendyol' && (
            <TabsTrigger value="brands" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Package className="mr-1.5 h-3.5 w-3.5" />
              Markalar
            </TabsTrigger>
          )}
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
                  {config.fields.map((field) => (
                    <div key={field.key}>
                      <Label className="text-xs font-medium text-slate-500">{field.label}</Label>
                      <Input
                        type={field.type || 'text'}
                        value={creds[field.key] || ''}
                        onChange={(e) => setCreds((p) => ({ ...p, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        required
                        className="mt-1.5"
                      />
                    </div>
                  ))}
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
                      ID: <span className="font-mono font-medium text-slate-700">{status.supplierId}</span>
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
                            {mapping?.localCategoryPath || locName(cat.name, locale)}
                          </td>
                          <td className="px-5 py-3">
                            {isMapped ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-700">
                                  {mapping?.marketplaceCategoryPath || mapping?.marketplaceCategoryName || mapping?.marketplaceCategoryId}
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
                                  <div className="absolute z-[80] mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                                    <div className="border-b border-slate-100 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                      Arama Sonuclari (sadece yaprak kategoriler)
                                    </div>
                                    {results.map((rc) => (
                                      <button
                                        key={rc.id}
                                        onClick={() => saveMapping(cat.id, rc.id)}
                                        disabled={saving}
                                        className="block w-full border-b border-slate-50 px-3 py-2 text-left text-sm transition-colors hover:bg-violet-50"
                                      >
                                        <span className="text-slate-400">{rc.path?.split(' > ').slice(0, -1).join(' > ')}{rc.path?.includes(' > ') ? ' > ' : ''}</span>
                                        <span className="font-medium text-slate-800">{rc.path?.split(' > ').pop() || rc.name}</span>
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

                {/* Filters */}
                <div className="flex flex-wrap items-end gap-3 border-b border-slate-100 bg-white px-6 py-3">
                  <div className="flex-1 min-w-[140px]">
                    <label className="mb-1 block text-[10px] font-medium uppercase text-slate-400">Barkod / SKU</label>
                    <Input
                      value={filterBarcode}
                      onChange={(e) => setFilterBarcode(e.target.value)}
                      placeholder="Barkod ara..."
                      className="h-8 text-xs"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-medium uppercase text-slate-400">Satis Durumu</label>
                    <select
                      value={filterOnSale}
                      onChange={(e) => setFilterOnSale(e.target.value)}
                      className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-violet-400"
                    >
                      <option value="">Tumunu</option>
                      <option value="true">Satista</option>
                      <option value="false">Satista Degil</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-medium uppercase text-slate-400">Onay</label>
                    <select
                      value={filterApproved}
                      onChange={(e) => setFilterApproved(e.target.value)}
                      className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-violet-400"
                    >
                      <option value="">Tumunu</option>
                      <option value="true">Onayli</option>
                      <option value="false">Onaysiz</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-medium uppercase text-slate-400">Sayfa Boyutu</label>
                    <select
                      value={filterPageSize}
                      onChange={(e) => setFilterPageSize(Number(e.target.value))}
                      className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-violet-400"
                    >
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                      <option value={200}>200</option>
                    </select>
                  </div>
                  <Button onClick={() => fetchMpProducts(0)} size="sm" variant="outline" className="h-8 text-xs">
                    Filtrele
                  </Button>
                </div>

                {/* Action bar */}
                {mpProducts.length > 0 && (
                  <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/30 px-6 py-2">
                    {selectedImportIds.size > 0 ? (
                      <Button
                        onClick={handleImport}
                        disabled={importing}
                        size="sm"
                        className="bg-violet-600 hover:bg-violet-700"
                      >
                        {importing ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Download className="mr-1.5 h-3.5 w-3.5" />}
                        Secilenleri Ice Aktar ({selectedImportIds.size})
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setSelectedImportIds(new Set(mpProducts.map((p) => p.id)));
                        }}
                        size="sm"
                        variant="outline"
                        className="text-xs"
                      >
                        Tumunu Sec ({mpProducts.length})
                      </Button>
                    )}
                    <Button
                      onClick={async () => {
                        setImporting(true);
                        setImportResult(null);
                        setError('');
                        try {
                          const res = await panelApi.post<{ imported: number; skipped: number; errors: string[] }>(
                            `/marketplace/${mp}/import`,
                            { page: mpProductsMeta.page, size: filterPageSize },
                          );
                          setImportResult(res);
                        } catch (err) {
                          setError(err instanceof Error ? err.message : 'Ice aktarma basarisiz');
                        } finally {
                          setImporting(false);
                        }
                      }}
                      disabled={importing}
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {importing ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Download className="mr-1.5 h-3.5 w-3.5" />}
                      Tumunu Ice Aktar ({mpProductsMeta.totalElements})
                    </Button>
                    {selectedImportIds.size > 0 && (
                      <button onClick={() => setSelectedImportIds(new Set())} className="text-xs text-slate-400 hover:text-slate-600">
                        Secimi Temizle
                      </button>
                    )}
                  </div>
                )}

                {/* Import result */}
                {importResult && (
                  <div className="border-b border-emerald-200 bg-emerald-50 px-6 py-3">
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="font-medium text-emerald-700">
                        <CheckCircle className="mr-1 inline h-4 w-4" />
                        {importResult.imported} urun aktarildi
                      </span>
                      {importResult.totalVariants && (
                        <span className="text-slate-500">
                          {importResult.totalVariants} varyasyon &rarr; {importResult.groupedInto} urun grubu
                        </span>
                      )}
                      {importResult.skipped > 0 && (
                        <span className="text-amber-600">{importResult.skipped} zaten mevcut</span>
                      )}
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
                    {/* Select All */}
                    <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/40 px-5 py-3">
                      <input
                        type="checkbox"
                        checked={selectedImportIds.size === mpProducts.length && mpProducts.length > 0}
                        onChange={toggleAllImport}
                        className="rounded border-slate-300"
                      />
                      <span className="text-xs font-medium text-slate-500">
                        {productGroups.length} urun grubu ({mpProducts.length} varyasyon)
                        {selectedImportIds.size > 0 && ` — ${selectedImportIds.size} secili`}
                      </span>
                    </div>

                    {/* Product Group Cards */}
                    <div className="divide-y divide-slate-100">
                      {productGroups.map((group) => {
                        const p = group.mainProduct;
                        const hasDiscount = p.listPrice && p.listPrice > group.lowestPrice;
                        const allSelected = group.variants.every((v) => selectedImportIds.has(v.id));

                        return (
                          <div
                            key={group.mainId}
                            onClick={() => setDetailGroup(group)}
                            className={`flex gap-4 p-4 transition-colors hover:bg-slate-50/50 cursor-pointer ${allSelected ? 'bg-violet-50/30' : ''}`}
                          >
                            {/* Checkbox */}
                            <div className="flex items-start pt-1" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={allSelected}
                                onChange={() => {
                                  setSelectedImportIds((prev) => {
                                    const next = new Set(prev);
                                    if (allSelected) {
                                      group.variants.forEach((v) => next.delete(v.id));
                                    } else {
                                      group.variants.forEach((v) => next.add(v.id));
                                    }
                                    return next;
                                  });
                                }}
                                className="rounded border-slate-300"
                              />
                            </div>

                            {/* Image */}
                            <div className="shrink-0">
                              {group.allImages.length > 0 ? (
                                <img
                                  src={group.allImages[0]}
                                  alt={p.title}
                                  className="h-20 w-20 rounded-lg border border-slate-200 object-cover"
                                />
                              ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                                  <Package className="h-6 w-6 text-slate-300" />
                                </div>
                              )}
                              {group.allImages.length > 1 && (
                                <p className="mt-1 text-center text-[10px] text-slate-400">+{group.allImages.length - 1} gorsel</p>
                              )}
                            </div>

                            {/* Details */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-slate-800 line-clamp-2">{p.title}</p>
                                  <div className="mt-1 flex flex-wrap items-center gap-2">
                                    {(p.brand || p.brandName) && (
                                      <Badge className="bg-violet-50 text-violet-700 text-[10px]">{(p.brand || p.brandName)}</Badge>
                                    )}
                                    {p.categoryName && (
                                      <Badge className="bg-amber-50 text-amber-700 text-[10px]">{p.categoryName}</Badge>
                                    )}
                                    {group.variants.length > 1 && (
                                      <Badge className="bg-violet-50 text-violet-700 text-[10px]">
                                        {group.variants.length} Varyasyon
                                      </Badge>
                                    )}
                                    {p.onSale ? (
                                      <Badge className="bg-emerald-50 text-emerald-700 text-[10px]">Satista</Badge>
                                    ) : (
                                      <Badge className="bg-slate-100 text-slate-500 text-[10px]">Pasif</Badge>
                                    )}
                                  </div>
                                </div>

                                {/* Price */}
                                <div className="text-right shrink-0">
                                  <p className="text-base font-bold text-slate-900">
                                    {group.lowestPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                  </p>
                                  {hasDiscount && (
                                    <p className="text-xs text-slate-400 line-through">
                                      {p.listPrice?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Variant summary */}
                              {group.variants.length > 1 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {group.variants.map((v) => {
                                    const sizeAttr = v.attributes?.find((a) => a.attributeName?.toLowerCase().includes('beden') || a.attributeName?.toLowerCase().includes('numara'));
                                    const colorAttr = v.attributes?.find((a) => a.attributeName?.toLowerCase().includes('renk') || a.attributeName?.toLowerCase().includes('color'));
                                    const label = [colorAttr?.attributeValue, sizeAttr?.attributeValue].filter(Boolean).join(' / ') || v.barcode || '?';
                                    return (
                                      <span key={v.id} className={`rounded-md border px-1.5 py-0.5 text-[10px] ${v.quantity > 0 ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-400'}`}>
                                        {label} <span className="font-semibold">({v.quantity})</span>
                                      </span>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Meta */}
                              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                                <span>Toplam Stok: <span className={`font-semibold ${group.totalStock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{group.totalStock}</span></span>
                                {p.stockCode && <span>SKU: <span className="font-mono text-slate-700">{p.productMainId || p.stockCode}</span></span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
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
                                  <p className="truncate text-sm font-medium text-slate-800">{locName(p.name, locale)}</p>
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

        {/* ============================================================ */}
        {/*  TAB 5: Brands (Trendyol only)                               */}
        {/* ============================================================ */}
        {mp === 'trendyol' && (
          <TabsContent value="brands" className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={handleAutoMatchBrands} disabled={autoMatchingBrands} className="bg-violet-600 hover:bg-violet-700">
                {autoMatchingBrands ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                Otomatik Eslestir
              </Button>
              <Button onClick={handleSyncBrands} disabled={syncingBrands} variant="outline">
                {syncingBrands ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Trendyol Markalarini Senkronize Et
              </Button>
            </div>

            <Card className="overflow-hidden border border-slate-200 shadow-sm">
              <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-semibold text-slate-800">Marka Eslestirme</h2>
                  <Badge className="bg-emerald-50 text-emerald-700 text-[10px]">
                    {brandMappings.filter(m => m.mapped).length} eslestirilmis
                  </Badge>
                  {brandMappings.filter(m => !m.mapped).length > 0 && (
                    <Badge className="bg-amber-50 text-amber-700 text-[10px]">
                      {brandMappings.filter(m => !m.mapped).length} bekliyor
                    </Badge>
                  )}
                </div>
              </div>

              {brandsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
                </div>
              ) : brandMappings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Package className="h-10 w-10 text-slate-300" />
                  <p className="mt-3 text-sm text-slate-500">Henuz urunlerde marka bilgisi yok</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/40 text-left">
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Yerel Marka</th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                          <ArrowLeftRight className="mr-1 inline h-3.5 w-3.5" />
                          Trendyol Markasi
                        </th>
                        <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {brandMappings.map((bm) => {
                        const searchVal = brandSearchInputs[bm.localBrand] || '';
                        const results = brandSearchResults[bm.localBrand] || [];
                        const saving = savingBrandMapping[bm.localBrand] || false;

                        return (
                          <tr key={bm.localBrand} className="transition-colors hover:bg-slate-50/50">
                            <td className="px-5 py-3 text-sm font-medium text-slate-800">{bm.localBrand}</td>
                            <td className="px-5 py-3">
                              {bm.mapped ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-slate-700">{bm.marketplaceBrand!.name}</span>
                                  <span className="font-mono text-[10px] text-slate-400">({bm.marketplaceBrand!.id})</span>
                                </div>
                              ) : (
                                <div className="relative">
                                  <Input
                                    value={searchVal}
                                    onChange={(e) => searchTrendyolBrands(bm.localBrand, e.target.value)}
                                    placeholder="Trendyol markasi ara..."
                                    className="h-8 text-sm"
                                  />
                                  {results.length > 0 && (
                                    <div className="absolute z-[80] mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                                      {results.map((r) => (
                                        <button
                                          key={r.marketplaceBrandId}
                                          onClick={() => saveBrandMapping(bm.localBrand, r.marketplaceBrandId)}
                                          disabled={saving}
                                          className="block w-full border-b border-slate-50 px-3 py-2 text-left text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                                        >
                                          {r.brandName}
                                          <span className="ml-2 font-mono text-[10px] text-slate-400">({r.marketplaceBrandId})</span>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>
                            <td className="px-5 py-3">
                              {bm.mapped ? (
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
        )}

        {/* ============================================================ */}
        {/*  TAB 6: Orders                                               */}
        {/* ============================================================ */}
        <TabsContent value="orders" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Pazaryeri Siparisleri</h2>
            <Button onClick={handleSyncOrders} disabled={syncingOrders} className="bg-violet-600 hover:bg-violet-700">
              <RefreshCw className={`mr-2 h-4 w-4 ${syncingOrders ? 'animate-spin' : ''}`} />
              Senkronize Et
            </Button>
          </div>

          {mpOrdersLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
            </div>
          ) : mpOrders.length === 0 ? (
            <Card className="overflow-hidden border border-slate-200 shadow-sm">
              <div className="flex flex-col items-center justify-center py-12">
                <ShoppingBag className="h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm text-slate-500">Henuz pazaryeri siparisi bulunamadi</p>
                <p className="mt-1 text-xs text-slate-400">Siparisleri cekip senkronize etmek icin butona tiklayin</p>
              </div>
            </Card>
          ) : (
            <Card className="overflow-hidden border border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/40 text-left">
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Siparis No</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Marketplace ID</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Durum</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Musteri</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 text-right">Toplam</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Kargo</th>
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Tarih</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mpOrders.map((order) => {
                      const statusColors: Record<string, string> = {
                        pending: 'bg-yellow-50 text-yellow-700',
                        preparing: 'bg-violet-50 text-violet-700',
                        shipped: 'bg-blue-50 text-blue-700',
                        delivered: 'bg-emerald-50 text-emerald-700',
                        completed: 'bg-green-50 text-green-700',
                        cancelled: 'bg-rose-50 text-rose-700',
                        refunded: 'bg-slate-100 text-slate-600',
                      };
                      const statusLabels: Record<string, string> = {
                        pending: 'Beklemede',
                        preparing: 'Hazirlaniyor',
                        shipped: 'Kargoda',
                        delivered: 'Teslim Edildi',
                        completed: 'Tamamlandi',
                        cancelled: 'Iptal',
                        refunded: 'Iade',
                      };
                      const badgeClass = statusColors[order.status] ?? 'bg-slate-100 text-slate-500';
                      const badgeLabel = statusLabels[order.status] ?? order.status;

                      return (
                        <tr key={order.id} className="transition-colors hover:bg-slate-50/50">
                          <td className="px-5 py-3 text-sm font-medium text-slate-800">{order.orderNumber}</td>
                          <td className="px-5 py-3 font-mono text-xs text-slate-500">{order.marketplaceOrderId || '-'}</td>
                          <td className="px-5 py-3">
                            <Badge className={badgeClass}>{badgeLabel}</Badge>
                          </td>
                          <td className="px-5 py-3 text-sm text-slate-600">
                            {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : '-'}
                          </td>
                          <td className="px-5 py-3 text-right text-sm font-semibold text-slate-800">
                            {Number(order.totalAmount).toLocaleString('tr-TR', { style: 'currency', currency: order.currency || 'TRY' })}
                          </td>
                          <td className="px-5 py-3 text-xs text-slate-500">
                            {order.trackingNumber ? (
                              <span className="font-mono">{order.trackingNumber}</span>
                            ) : order.shippingMethod ? (
                              <span>{order.shippingMethod}</span>
                            ) : '-'}
                          </td>
                          <td className="px-5 py-3 text-xs text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {mpOrdersMeta.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
                  <p className="text-xs text-slate-500">
                    Toplam {mpOrdersMeta.total} siparis — Sayfa {mpOrdersMeta.page + 1} / {mpOrdersMeta.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={mpOrdersMeta.page === 0}
                      onClick={() => fetchMpOrders(mpOrdersMeta.page - 1)}
                    >
                      Onceki
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={mpOrdersMeta.page >= mpOrdersMeta.totalPages - 1}
                      onClick={() => fetchMpOrders(mpOrdersMeta.page + 1)}
                    >
                      Sonraki
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* ─── Product Group Detail Modal ─── */}
      {detailGroup && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={() => setDetailGroup(null)}
          />
          <div className="fixed inset-y-0 right-0 z-[70] w-full max-w-2xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Urun Detayi</h2>
                {detailGroup.variants.length > 1 && (
                  <p className="text-xs text-slate-500">{detailGroup.variants.length} varyasyon</p>
                )}
              </div>
              <button
                onClick={() => setDetailGroup(null)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              {/* Images Gallery */}
              {detailGroup.allImages.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-800">Gorseller ({detailGroup.allImages.length})</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {detailGroup.allImages.map((url, i) => (
                      <img key={i} src={url} alt={`${detailGroup.mainProduct.title} - ${i + 1}`} className="aspect-square w-full rounded-lg border border-slate-200 object-cover" />
                    ))}
                  </div>
                </div>
              )}

              {/* Title & Badges */}
              <div>
                <h3 className="text-base font-bold text-slate-900">{detailGroup.mainProduct.title}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(detailGroup.mainProduct.brand || detailGroup.mainProduct.brandName) && <Badge className="bg-violet-50 text-violet-700">{(detailGroup.mainProduct.brand || detailGroup.mainProduct.brandName)}</Badge>}
                  {detailGroup.mainProduct.categoryName && <Badge className="bg-amber-50 text-amber-700">{detailGroup.mainProduct.categoryName}</Badge>}
                  {detailGroup.variants.length > 1 && <Badge className="bg-violet-50 text-violet-700">{detailGroup.variants.length} Varyasyon</Badge>}
                </div>
              </div>

              {/* Price & Stock Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-medium text-slate-500">En Dusuk Fiyat</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {detailGroup.lowestPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-medium text-slate-500">Toplam Stok</p>
                  <p className={`mt-1 text-xl font-bold ${detailGroup.totalStock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {detailGroup.totalStock}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <p className="text-xs font-medium text-slate-500">Ana ID</p>
                  <p className="mt-1 text-xs font-mono font-bold text-slate-700 break-all">{detailGroup.mainId}</p>
                </div>
              </div>

              {/* Variants Table */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-800">
                  Varyasyonlar ({detailGroup.variants.length})
                </h3>
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600">Ozellikler</th>
                        <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-600">Barkod</th>
                        <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600">Fiyat</th>
                        <th className="px-3 py-2.5 text-right text-xs font-semibold text-slate-600">Stok</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {detailGroup.variants.map((v) => {
                        const attrs = v.attributes ?? [];
                        return (
                          <tr key={v.id} className="hover:bg-slate-50/50">
                            <td className="px-3 py-2">
                              <div className="flex flex-wrap gap-1">
                                {attrs.length > 0 ? attrs.map((a, i) => (
                                  <span key={i} className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px]">
                                    <span className="text-slate-400">{a.attributeName}: </span>
                                    <span className="font-medium text-slate-700">{a.attributeValue}</span>
                                  </span>
                                )) : (
                                  <span className="text-xs text-slate-400">-</span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2 font-mono text-xs text-slate-600">{v.barcode || '-'}</td>
                            <td className="px-3 py-2 text-right text-sm font-semibold text-slate-800">
                              {v.salePrice?.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                            </td>
                            <td className={`px-3 py-2 text-right text-sm font-bold ${v.quantity > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                              {v.quantity}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Shared Attributes (from main product) */}
              {(detailGroup.mainProduct.attributes?.length ?? 0) > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-800">Ortak Ozellikler</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {detailGroup.mainProduct.attributes!.map((attr, i) => (
                      <span key={i} className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600">
                        <span className="font-medium text-slate-400 mr-1">{attr.attributeName}:</span>
                        {attr.attributeValue}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Import */}
              <div className="flex gap-3 border-t border-slate-200 pt-4">
                <Button
                  onClick={() => {
                    setSelectedImportIds((prev) => {
                      const next = new Set(prev);
                      detailGroup.variants.forEach((v) => next.add(v.id));
                      return next;
                    });
                    setDetailGroup(null);
                  }}
                  className="flex-1 bg-violet-600 hover:bg-violet-700"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Tum Varyasyonlari Sec ({detailGroup.variants.length})
                </Button>
                <Button variant="outline" onClick={() => setDetailGroup(null)}>Kapat</Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── Send Wizard ─── */}
      {showSendWizard && (
        <SendWizard
          marketplace={mp}
          marketplaceName={config.name}
          productIds={Array.from(selectedExportIds)}
          locale={locale}
          onClose={() => setShowSendWizard(false)}
          onComplete={() => {
            setShowSendWizard(false);
            setSelectedExportIds(new Set());
            fetchLocalProducts(0);
          }}
        />
      )}
    </div>
  );
}
