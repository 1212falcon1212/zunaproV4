'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button, Card, Badge, Input, Label } from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';
import { CategoryAttributeForm } from './category-attribute-form';
import {
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  Loader2,
  Send,
  AlertTriangle,
  Package,
  FolderTree,
  Check,
} from 'lucide-react';

/* ─── Types ─── */

interface VariantData {
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  stock: number;
  attributes?: Record<string, string>;
}

interface ProductForSend {
  id: string;
  name: unknown;
  sku?: string;
  barcode?: string;
  price: number;
  stock: number;
  variants: VariantData[];
  images: string[];
  existingAttributes: Array<{
    attributeId: string;
    attributeName: string;
    value: string;
    valueId?: string | null;
  }>;
  listingStatus?: string | null;
  seoMeta?: Record<string, unknown>;
}

interface CategoryGroup {
  localCategory: { id: string; name: unknown };
  marketplaceCategory: { id: string; name: string } | null;
  mapped: boolean;
  categoryAttributes: unknown[];
  variantAttributeNames: string[];
  products: ProductForSend[];
}

interface PrepareSendResponse {
  categoryGroups: CategoryGroup[];
  noCategoryCount: number;
  zeroStockProductIds: string[];
}

interface SendResult {
  batchId?: string;
  batchIds?: string[];
  sentCount?: number;
  errors?: string[];
}

interface BatchCheckResult {
  batchStatus: Record<string, unknown>;
  updatedListings: number;
}

interface GroupState {
  categoryValues: Record<string, { value: string; valueId?: string }>;
  perProductValues: Record<
    string,
    Record<string, { value: string; valueId?: string }>
  >;
}

interface SendWizardProps {
  marketplace: string;
  marketplaceName: string;
  productIds: string[];
  locale: string;
  onClose: () => void;
  onComplete: () => void;
}

/* ─── Helpers ─── */

function locName(name: unknown, locale = 'tr'): string {
  if (typeof name === 'string') return name;
  if (name && typeof name === 'object') {
    const o = name as Record<string, string>;
    return o[locale] || o.en || o.tr || Object.values(o)[0] || '';
  }
  return '';
}

const STEPS = ['Urun Kontrolu', 'Ozellik Eslestirme', 'Onayla & Gonder'];

/* ─── Component ─── */

export function SendWizard({
  marketplace,
  marketplaceName,
  productIds,
  locale,
  onClose,
  onComplete,
}: SendWizardProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 data
  const [prepareData, setPrepareData] = useState<PrepareSendResponse | null>(
    null,
  );
  const [minStock, setMinStock] = useState(0);

  // Step 2 data — per-group attribute state
  const [groupStates, setGroupStates] = useState<Record<string, GroupState>>(
    {},
  );
  const [savingAttrs, setSavingAttrs] = useState(false);

  // Step 3 data
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<SendResult | null>(null);
  const [batchChecking, setBatchChecking] = useState(false);
  const [batchResults, setBatchResults] = useState<
    Array<{
      batchId: string;
      status: string;
      details?: Record<string, unknown>;
    }>
  >([]);
  const [batchPolling, setBatchPolling] = useState(false);

  // ─── Step 1: Prepare ───
  const handlePrepare = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await panelApi.post<PrepareSendResponse>(
        `/marketplace/${marketplace}/products/prepare-send`,
        { productIds },
      );
      setPrepareData(res);

      // Initialize groupStates from existing product attributes
      const initial: Record<string, GroupState> = {};
      for (const group of res.categoryGroups) {
        const catId = group.localCategory.id;
        const categoryValues: GroupState['categoryValues'] = {};
        const perProductValues: GroupState['perProductValues'] = {};

        for (const product of group.products) {
          if (product.existingAttributes.length > 0) {
            if (!perProductValues[product.id]) {
              perProductValues[product.id] = {};
            }
            for (const attr of product.existingAttributes) {
              // Set first encountered value as category default
              if (!categoryValues[attr.attributeId]) {
                categoryValues[attr.attributeId] = {
                  value: attr.value,
                  valueId: attr.valueId ?? undefined,
                };
              }
              // Track per-product values
              perProductValues[product.id][attr.attributeId] = {
                value: attr.value,
                valueId: attr.valueId ?? undefined,
              };
            }
          }
        }

        initial[catId] = { categoryValues, perProductValues };
      }
      setGroupStates(initial);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hazirlik basarisiz');
    } finally {
      setLoading(false);
    }
  }, [marketplace, productIds]);

  // Auto-prepare on mount + lock body scroll
  useEffect(() => {
    handlePrepare();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [handlePrepare]);

  // ─── Step 2: Save Attributes ───
  const handleSaveAttributes = async () => {
    setSavingAttrs(true);
    setError('');
    try {
      for (const [groupId, gs] of Object.entries(groupStates)) {
        const group = prepareData?.categoryGroups.find(
          (g) => g.localCategory.id === groupId,
        );
        if (!group) continue;

        for (const product of group.products) {
          const attributes: Array<{
            attributeId: string;
            attributeName: string;
            value: string;
            valueId?: string;
            variantIndex: number;
          }> = [];

          // Category-level values applied to all products with variantIndex=-1
          for (const [attrKey, val] of Object.entries(gs.categoryValues)) {
            if (val.value) {
              attributes.push({
                attributeId: attrKey,
                attributeName: attrKey,
                value: val.value,
                valueId: val.valueId,
                variantIndex: -1,
              });
            }
          }

          // Per-product overrides with variantIndex=-1
          const perProduct = gs.perProductValues[product.id];
          if (perProduct) {
            for (const [attrKey, val] of Object.entries(perProduct)) {
              if (val.value) {
                const existingIdx = attributes.findIndex(
                  (a) => a.attributeId === attrKey,
                );
                if (existingIdx >= 0) {
                  attributes[existingIdx] = {
                    ...attributes[existingIdx],
                    value: val.value,
                    valueId: val.valueId,
                  };
                } else {
                  attributes.push({
                    attributeId: attrKey,
                    attributeName: attrKey,
                    value: val.value,
                    valueId: val.valueId,
                    variantIndex: -1,
                  });
                }
              }
            }
          }

          if (attributes.length > 0) {
            await panelApi.post(
              `/marketplace/${marketplace}/products/save-attributes`,
              { productId: product.id, attributes },
            );
          }
        }
      }
      setStep(2);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Attribute kaydetme basarisiz',
      );
    } finally {
      setSavingAttrs(false);
    }
  };

  // ─── Step 3: Send ───
  const handleSend = async () => {
    setSending(true);
    setError('');
    try {
      const idsToSend = (prepareData?.categoryGroups ?? [])
        .filter((g) => g.mapped)
        .flatMap((g) => g.products)
        .filter((p) => p.stock >= minStock)
        .map((p) => p.id);

      const res = await panelApi.post<SendResult>(
        `/marketplace/${marketplace}/products/send`,
        { productIds: idsToSend },
      );
      setSendResult(res);

      const ids = res.batchIds ?? (res.batchId ? [res.batchId] : []);
      if (ids.length > 0) {
        startBatchPolling(ids);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gonderim basarisiz');
    } finally {
      setSending(false);
    }
  };

  // ─── Batch Polling ───
  const checkBatchOnce = async (batchId: string) => {
    try {
      const res = await panelApi.get<BatchCheckResult>(
        `/marketplace/${marketplace}/batch/${batchId}/check`,
      );
      return {
        batchId,
        status:
          ((res.batchStatus as Record<string, unknown>)?.status as string) ??
          'checking',
        details: res.batchStatus,
        updatedListings: res.updatedListings,
      };
    } catch {
      return { batchId, status: 'error', details: {}, updatedListings: 0 };
    }
  };

  const startBatchPolling = async (batchIds: string[]) => {
    setBatchPolling(true);
    setBatchChecking(true);

    let attempts = 0;
    const maxAttempts = 12;

    const poll = async () => {
      attempts++;
      const results = [];
      for (const id of batchIds) {
        const result = await checkBatchOnce(id);
        results.push(result);
      }
      setBatchResults(results);

      const allDone = results.every(
        (r) =>
          r.status === 'approved' ||
          r.status === 'completed' ||
          r.status === 'error' ||
          r.status === 'failed',
      );

      if (allDone || attempts >= maxAttempts) {
        setBatchChecking(false);
        setBatchPolling(false);
        return;
      }

      setTimeout(poll, 5000);
    };

    setTimeout(poll, 3000);
  };

  // ─── Stable handlers for CategoryAttributeForm ───
  const handleCatValueChange = useCallback((groupId: string, attrKey: string, value: string, valueId?: string) => {
    setGroupStates((prev) => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        categoryValues: {
          ...(prev[groupId]?.categoryValues ?? {}),
          [attrKey]: { value, valueId },
        },
      },
    }));
  }, []);

  const handleProdValueChange = useCallback((groupId: string, productId: string, attrKey: string, value: string, valueId?: string) => {
    setGroupStates((prev) => ({
      ...prev,
      [groupId]: {
        ...prev[groupId],
        perProductValues: {
          ...(prev[groupId]?.perProductValues ?? {}),
          [productId]: {
            ...((prev[groupId]?.perProductValues ?? {})[productId] ?? {}),
            [attrKey]: { value, valueId },
          },
        },
      },
    }));
  }, []);

  // ─── Stats ───
  const mappedGroups =
    prepareData?.categoryGroups.filter((g) => g.mapped) ?? [];
  const unmappedGroups =
    prepareData?.categoryGroups.filter((g) => !g.mapped) ?? [];
  const totalProducts = mappedGroups.reduce(
    (s, g) => s + g.products.length,
    0,
  );
  const readyProducts = mappedGroups
    .flatMap((g) => g.products)
    .filter((p) => p.stock >= minStock).length;

  return (
    <>
      {/* Backdrop + Centered Modal */}
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <div
          className="flex w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl"
          style={{ maxHeight: 'calc(100vh - 2rem)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {marketplaceName}&apos;a Urun Gonder
              </h2>
              <p className="text-xs text-slate-500">
                {productIds.length} urun secili
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Step Indicator — horizontal stepper with numbered circles and connector lines */}
          <div className="flex items-center justify-center gap-0 border-b border-slate-100 bg-slate-50/50 px-6 py-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      i < step
                        ? 'bg-emerald-500 text-white'
                        : i === step
                          ? 'bg-violet-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {i < step ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span
                    className={`mt-1.5 text-[11px] font-medium ${
                      i === step
                        ? 'text-violet-700'
                        : i < step
                          ? 'text-emerald-600'
                          : 'text-slate-400'
                    }`}
                  >
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`mx-3 mt-[-18px] h-0.5 w-20 ${
                      i < step ? 'bg-emerald-400' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="border-b border-rose-200 bg-rose-50 px-6 py-3 text-sm text-rose-700">
              <XCircle className="mr-1 inline h-4 w-4" /> {error}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* ─── STEP 0: Product Check ─── */}
            {step === 0 &&
              (loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                  <p className="mt-3 text-sm text-slate-500">
                    Urunler kontrol ediliyor...
                  </p>
                </div>
              ) : prepareData ? (
                <div className="space-y-6">
                  {/* Summary cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg border border-slate-200 p-4 text-center">
                      <p className="text-2xl font-bold text-slate-900">
                        {totalProducts}
                      </p>
                      <p className="text-xs text-slate-500">Gonderilebilir</p>
                    </div>
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center">
                      <p className="text-2xl font-bold text-emerald-700">
                        {mappedGroups.length}
                      </p>
                      <p className="text-xs text-emerald-600">
                        Eslestirilmis Kategori
                      </p>
                    </div>
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center">
                      <p className="text-2xl font-bold text-amber-700">
                        {unmappedGroups.length}
                      </p>
                      <p className="text-xs text-amber-600">
                        Eslesmemis Kategori
                      </p>
                    </div>
                  </div>

                  {/* Min stock filter */}
                  <div className="flex items-center gap-3">
                    <Label className="text-xs font-medium text-slate-500">
                      Min. Stok:
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={minStock}
                      onChange={(e) =>
                        setMinStock(parseInt(e.target.value) || 0)
                      }
                      className="h-8 w-24 text-xs"
                    />
                    <span className="text-xs text-slate-400">
                      {readyProducts} urun gonderilecek
                    </span>
                  </div>

                  {/* Unmapped warning */}
                  {unmappedGroups.length > 0 && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                        <AlertTriangle className="h-4 w-4" />
                        Eslesmemis Kategoriler (
                        {unmappedGroups.reduce(
                          (s, g) => s + g.products.length,
                          0,
                        )}{' '}
                        urun gonderilemeyecek)
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {unmappedGroups.map((g) => (
                          <Badge
                            key={g.localCategory.id}
                            className="bg-amber-100 text-[10px] text-amber-700"
                          >
                            <FolderTree className="mr-1 h-3 w-3" />
                            {locName(g.localCategory.name, locale)} (
                            {g.products.length})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mapped category groups */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-800">
                      Kategori Gruplari
                    </h3>
                    {mappedGroups.map((g) => (
                      <div
                        key={g.localCategory.id}
                        className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50">
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {locName(g.localCategory.name, locale)}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              &rarr; {g.marketplaceCategory?.id}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-800">
                            {g.products.length} urun
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {(g.categoryAttributes as unknown[]).length} ozellik
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Zero stock products */}
                  {prepareData.zeroStockProductIds.length > 0 && (
                    <p className="text-xs text-slate-400">
                      {prepareData.zeroStockProductIds.length} urun sifir
                      stoklu (min stok filtresine gore haric tutulabilir)
                    </p>
                  )}
                </div>
              ) : null)}

            {/* ─── STEP 1: Attribute Mapping ─── */}
            {step === 1 && prepareData && (
              <div className="space-y-4">
                {mappedGroups.map((group) => (
                  <CategoryAttributeForm
                    key={group.localCategory.id}
                    categoryName={locName(group.localCategory.name, locale)}
                    marketplaceCategoryId={
                      group.marketplaceCategory?.id ?? ''
                    }
                    categoryAttributes={
                      (group.categoryAttributes ?? []) as Array<{
                        allowCustom: boolean;
                        required: boolean;
                        varianter: boolean;
                        slicer: boolean;
                        attribute: { id: number; name: string };
                        attributeValues: Array<{ id: number; name: string }>;
                      }>
                    }
                    products={group.products}
                    variantAttributeNames={group.variantAttributeNames}
                    categoryValues={
                      groupStates[group.localCategory.id]?.categoryValues ?? {}
                    }
                    perProductValues={
                      groupStates[group.localCategory.id]?.perProductValues ??
                      {}
                    }
                    onCategoryValueChange={(attrKey, value, valueId) =>
                      handleCatValueChange(group.localCategory.id, attrKey, value, valueId)
                    }
                    onProductValueChange={(productId, attrKey, value, valueId) =>
                      handleProdValueChange(group.localCategory.id, productId, attrKey, value, valueId)
                    }
                    locale={locale}
                  />
                ))}
              </div>
            )}

            {/* ─── STEP 2: Confirm & Send ─── */}
            {step === 2 && (
              <div className="space-y-6">
                {!sendResult ? (
                  <>
                    <div className="rounded-lg border border-violet-200 bg-violet-50 p-6 text-center">
                      <Send className="mx-auto h-10 w-10 text-violet-500" />
                      <h3 className="mt-3 text-lg font-semibold text-slate-900">
                        Gonderime Hazir
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {readyProducts} urun {marketplaceName}&apos;a
                        gonderilecek
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-slate-200 p-4">
                        <p className="text-xs text-slate-500">Urun Sayisi</p>
                        <p className="text-xl font-bold text-slate-900">
                          {readyProducts}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 p-4">
                        <p className="text-xs text-slate-500">Batch Sayisi</p>
                        <p className="text-xl font-bold text-slate-900">
                          {Math.ceil(readyProducts / 100)}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center">
                      <CheckCircle className="mx-auto h-10 w-10 text-emerald-500" />
                      <h3 className="mt-3 text-lg font-semibold text-slate-900">
                        Gonderim Tamamlandi
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {sendResult.sentCount ?? 0} urun gonderildi
                      </p>
                    </div>

                    {/* Batch Status Tracking */}
                    {(sendResult.batchIds?.length || sendResult.batchId) && (
                      <div className="rounded-lg border border-slate-200 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-600">
                            Batch Durumu
                          </p>
                          {batchChecking && (
                            <div className="flex items-center gap-1.5 text-xs text-violet-600">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Kontrol ediliyor...
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          {(
                            sendResult.batchIds ??
                            (sendResult.batchId ? [sendResult.batchId] : [])
                          ).map((bid) => {
                            const result = batchResults.find(
                              (r) => r.batchId === bid,
                            );
                            const statusLabel =
                              result?.status ?? 'beklemede';
                            const isOk =
                              statusLabel === 'approved' ||
                              statusLabel === 'completed';
                            const isFail =
                              statusLabel === 'error' ||
                              statusLabel === 'failed';

                            return (
                              <div
                                key={bid}
                                className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"
                              >
                                <div>
                                  <p className="font-mono text-xs text-slate-700">
                                    {bid}
                                  </p>
                                </div>
                                <Badge
                                  className={
                                    isOk
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : isFail
                                        ? 'bg-rose-50 text-rose-700'
                                        : 'bg-amber-50 text-amber-700'
                                  }
                                >
                                  {isOk && (
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                  )}
                                  {isFail && (
                                    <XCircle className="mr-1 h-3 w-3" />
                                  )}
                                  {!isOk && !isFail && (
                                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                  )}
                                  {statusLabel}
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                        {!batchPolling && batchResults.length === 0 && (
                          <button
                            onClick={() => {
                              const ids =
                                sendResult.batchIds ??
                                (sendResult.batchId
                                  ? [sendResult.batchId]
                                  : []);
                              if (ids.length > 0) startBatchPolling(ids);
                            }}
                            className="mt-2 text-xs font-medium text-violet-600 hover:underline"
                          >
                            Durumu Kontrol Et
                          </button>
                        )}
                      </div>
                    )}

                    {(sendResult.errors?.length ?? 0) > 0 && (
                      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
                        <p className="text-sm font-medium text-rose-700">
                          <XCircle className="mr-1 inline h-4 w-4" />
                          {sendResult.errors!.length} hata
                        </p>
                        <ul className="mt-2 space-y-1 text-xs text-rose-600">
                          {sendResult.errors!.slice(0, 10).map((e, i) => (
                            <li key={i}>- {e}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer — border-t with left/right buttons */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
            <Button
              variant="outline"
              onClick={() => (step > 0 ? setStep(step - 1) : onClose())}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              {step > 0 ? 'Geri' : 'Iptal'}
            </Button>

            <div>
              {step === 0 && (
                <Button
                  onClick={() => setStep(1)}
                  disabled={!prepareData || readyProducts === 0}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  Devam <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
              {step === 1 && (
                <Button
                  onClick={handleSaveAttributes}
                  disabled={savingAttrs}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  {savingAttrs && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Kaydet & Devam <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
              {step === 2 && !sendResult && (
                <Button
                  onClick={handleSend}
                  disabled={sending || readyProducts === 0}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  {sending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gonderiliyor...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Gonder
                    </>
                  )}
                </Button>
              )}
              {step === 2 && sendResult && (
                <Button
                  onClick={onComplete}
                  className="bg-violet-600 hover:bg-violet-700"
                >
                  Kapat
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
