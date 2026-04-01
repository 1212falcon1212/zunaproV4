'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Card,
  Separator,
} from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';
import { ImageUpload } from './image-upload';
import { VariantBuilder, type ProductVariantData } from './variant-builder';
import { AttributeEditor } from './attribute-editor';

const LOCALES = ['en', 'tr', 'de', 'fr', 'es'] as const;

const localeString = z.string().optional().default('');
const productSchema = z.object({
  name: z.object({ en: localeString, tr: localeString, de: localeString, fr: localeString, es: localeString }),
  description: z.object({ en: localeString, tr: localeString, de: localeString, fr: localeString, es: localeString }).optional(),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0).optional().nullable(),
  sku: z.string().optional().nullable(),
  stock: z.coerce.number().int().min(0).default(0),
  categoryId: z.string().optional().nullable(),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  isFeatured: z.boolean().default(false),
  seoMeta: z.object({
    en: z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
    tr: z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
    de: z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
    fr: z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
    es: z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
  }).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Category {
  id: string;
  name: Record<string, string>;
  slug: string;
  children?: Category[];
}

interface ProductFormProps {
  locale: string;
  initialData?: ProductFormData & { id?: string; images?: string[]; variants?: Record<string, unknown>[]; brand?: string; vatRate?: number; productMainId?: string; productAttributes?: Array<{ name: string; value: string }> };
}

export function ProductForm({ locale, initialData }: ProductFormProps) {
  const t = useTranslations('panel.products');
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [variants, setVariants] = useState<ProductVariantData[]>(
    (initialData?.variants as unknown as ProductVariantData[]) ?? [],
  );
  const [brand, setBrand] = useState(initialData?.brand ?? '');
  const [vatRate, setVatRate] = useState(initialData?.vatRate ?? 20);
  const [attributes, setAttributes] = useState<{ name: string; value: string }[]>(initialData?.productAttributes ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as never,
    defaultValues: {
      name: initialData?.name ?? { en: '', tr: '' },
      description: initialData?.description ?? {},
      price: initialData?.price ?? 0,
      compareAtPrice: initialData?.compareAtPrice,
      sku: initialData?.sku ?? '',
      stock: initialData?.stock ?? 0,
      categoryId: initialData?.categoryId ?? null,
      status: initialData?.status ?? 'draft',
      isFeatured: initialData?.isFeatured ?? false,
    },
  });

  const isFeatured = watch('isFeatured');

  useEffect(() => {
    panelApi
      .get<Category[]>('/categories')
      .then(setCategories)
      .catch(() => {});
  }, []);

  const flattenCategories = (cats: Category[], prefix = ''): { id: string; label: string }[] => {
    const result: { id: string; label: string }[] = [];
    for (const cat of cats) {
      const name =
        (cat.name as Record<string, string>)[locale] ||
        (cat.name as Record<string, string>).en ||
        cat.slug;
      result.push({ id: cat.id, label: prefix + name });
      if (cat.children) {
        result.push(...flattenCategories(cat.children, prefix + '— '));
      }
    }
    return result;
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!Object.values(data.name).some((v) => v.trim().length > 0)) {
      setError('At least one language name is required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...data,
        images,
        variants,
        brand,
        vatRate,
        productVariants: variants.map(v => ({
          sku: v.sku,
          barcode: v.barcode,
          price: v.price,
          listPrice: v.listPrice,
          stock: v.stock,
          weight: v.weight,
          images: v.images,
          isActive: v.isActive,
          options: (v.options ?? []).map(o => ({
            variantTypeSlug: o.variantTypeSlug,
            variantOptionSlug: o.variantOptionSlug,
          })),
        })),
        attributes,
      };

      if (initialData?.id) {
        await panelApi.patch(`/products/${initialData.id}`, payload);
      } else {
        await panelApi.post('/products', payload);
      }
      router.push(`/${locale}/panel/products`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main Content — Left Column */}
        <div className="space-y-6 lg:col-span-8">
          {/* Product Information */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">{t('form.basicInfo')}</h2>
            </div>
            <div className="p-6">
              <Tabs defaultValue="en">
                <TabsList className="mb-4 h-9 w-full justify-start rounded-lg bg-slate-100 p-1">
                  {LOCALES.map((loc) => (
                    <TabsTrigger key={loc} value={loc} className="rounded-md px-4 text-xs font-medium uppercase data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      {loc.toUpperCase()}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {LOCALES.map((loc) => (
                  <TabsContent key={loc} value={loc} className="space-y-4 pt-2">
                    <div>
                      <Label className="text-xs font-medium text-slate-500">
                        {t('form.name')} ({loc.toUpperCase()})
                      </Label>
                      <Input
                        {...register(`name.${loc}`)}
                        placeholder={t('form.namePlaceholder')}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-slate-500">
                        {t('form.description')} ({loc.toUpperCase()})
                      </Label>
                      <textarea
                        {...register(`description.${loc}`)}
                        rows={5}
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                        placeholder={t('form.descriptionPlaceholder')}
                      />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
              {(errors.name?.message || errors.name?.root?.message) && (
                <p className="mt-2 text-sm text-rose-600">
                  {String(errors.name.message || errors.name.root?.message)}
                </p>
              )}
            </div>
          </Card>

          {/* Pricing & Inventory */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">{t('form.pricing')}</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-medium text-slate-500">{t('form.price')}</Label>
                  <div className="relative mt-1.5">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      ₺
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register('price', { valueAsNumber: true })}
                      className="pl-7"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-xs text-rose-600">{String(errors.price.message)}</p>
                  )}
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-500">{t('form.compareAtPrice')}</Label>
                  <div className="relative mt-1.5">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      ₺
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register('compareAtPrice', { valueAsNumber: true })}
                      className="pl-7"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-500">{t('form.sku')}</Label>
                  <Input
                    {...register('sku')}
                    placeholder="SKU-001"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-500">{t('form.stock')}</Label>
                  <Input
                    type="number"
                    min="0"
                    {...register('stock', { valueAsNumber: true })}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-500">Marka</Label>
                  <Input
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Marka adı..."
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-500">KDV Oranı</Label>
                  <select
                    value={vatRate}
                    onChange={(e) => setVatRate(Number(e.target.value))}
                    className="mt-1.5 h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700"
                  >
                    <option value={0}>%0</option>
                    <option value={1}>%1</option>
                    <option value={8}>%8</option>
                    <option value={10}>%10</option>
                    <option value={20}>%20</option>
                  </select>
                </div>
              </div>

              {/* Currency prices from seoMeta */}
              {(() => {
                const meta = initialData?.seoMeta as Record<string, unknown> | undefined;
                const prices = meta?.prices as Record<string, number> | undefined;
                const source = meta?.source as string | undefined;
                if (!prices) return null;
                return (
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <h4 className="mb-2 text-xs font-semibold text-slate-600">Diger Kur Fiyatlari</h4>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {Object.entries(prices).map(([cur, val]) => (
                        <div key={cur} className="rounded-md bg-white border border-slate-200 px-3 py-2">
                          <span className="text-[10px] font-medium uppercase text-slate-400">{cur}</span>
                          <p className="text-sm font-bold text-slate-800">
                            {new Intl.NumberFormat(cur === 'TRY' ? 'tr-TR' : cur === 'EUR' ? 'de-DE' : 'en-US', { style: 'currency', currency: cur }).format(val)}
                          </p>
                        </div>
                      ))}
                    </div>
                    {source && (
                      <p className="mt-2 text-[10px] text-slate-400">
                        Kaynak: {source} | Kurlar import aninda hesaplandi
                      </p>
                    )}
                  </div>
                );
              })()}

              {/* Marketplace meta info (brand, category, source) */}
              {(() => {
                const meta = initialData?.seoMeta as Record<string, unknown> | undefined;
                if (!meta?.source) return null;
                const brand = (meta.trendyolBrand || meta.hepsiburadaBrand || meta.brand) as string | undefined;
                const category = (meta.trendyolCategory || meta.hepsiburadaCategory || meta.category) as string | undefined;
                const source = meta.source as string;
                const variantCount = meta.variantCount as number | undefined;
                const productMainId = meta.productMainId as string | undefined;

                return (
                  <div className="mt-4 rounded-lg border border-violet-200 bg-violet-50/50 p-4">
                    <h4 className="mb-2 text-xs font-semibold text-violet-700">Pazaryeri Bilgileri</h4>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {brand && (
                        <div>
                          <span className="text-[10px] font-medium uppercase text-violet-400">Marka</span>
                          <p className="text-sm font-semibold text-slate-800">{brand}</p>
                        </div>
                      )}
                      {category && (
                        <div>
                          <span className="text-[10px] font-medium uppercase text-violet-400">Kategori</span>
                          <p className="text-sm font-semibold text-slate-800">{category}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] font-medium uppercase text-violet-400">Kaynak</span>
                        <p className="text-sm font-semibold capitalize text-slate-800">{source}</p>
                      </div>
                      {variantCount && variantCount > 1 && (
                        <div>
                          <span className="text-[10px] font-medium uppercase text-violet-400">Varyasyon</span>
                          <p className="text-sm font-semibold text-slate-800">{variantCount} adet</p>
                        </div>
                      )}
                      {productMainId && (
                        <div>
                          <span className="text-[10px] font-medium uppercase text-violet-400">Ana Urun ID</span>
                          <p className="text-xs font-mono text-slate-700">{productMainId}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </Card>

          {/* Images */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">{t('form.images')}</h2>
            </div>
            <div className="p-6">
              <ImageUpload images={images} onChange={setImages} />
            </div>
          </Card>

          {/* Variants */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">{t('variants.title')}</h2>
            </div>
            <div className="p-6">
              <VariantBuilder variants={variants} onChange={setVariants} locale={locale} />
            </div>
          </Card>

          {/* Attributes */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">Özellikler</h2>
            </div>
            <div className="p-6">
              <AttributeEditor attributes={attributes} onChange={setAttributes} />
            </div>
          </Card>

          {/* SEO */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">{t('form.seo')}</h2>
            </div>
            <div className="p-6">
              <Tabs defaultValue="en">
                <TabsList className="mb-4 h-9 w-full justify-start rounded-lg bg-slate-100 p-1">
                  {LOCALES.map((loc) => (
                    <TabsTrigger key={loc} value={loc} className="rounded-md px-4 text-xs font-medium uppercase data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      {loc.toUpperCase()}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {LOCALES.map((loc) => (
                  <TabsContent key={loc} value={loc} className="space-y-4 pt-2">
                    <div>
                      <Label className="text-xs font-medium text-slate-500">
                        {t('form.seoTitle')} ({loc.toUpperCase()})
                      </Label>
                      <Input
                        {...register(`seoMeta.${loc}.title` as `seoMeta.${typeof loc}.title`)}
                        placeholder={t('form.seoTitlePlaceholder')}
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-slate-500">
                        {t('form.seoDescription')} ({loc.toUpperCase()})
                      </Label>
                      <textarea
                        {...register(`seoMeta.${loc}.description` as `seoMeta.${typeof loc}.description`)}
                        rows={2}
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                        placeholder={t('form.seoDescriptionPlaceholder')}
                      />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </Card>
        </div>

        {/* Sidebar — Right Column */}
        <div className="space-y-6 lg:col-span-4">
          {/* Status */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">{t('form.status')}</h2>
            </div>
            <div className="p-6">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">{t('status.draft')}</SelectItem>
                      <SelectItem value="active">{t('status.active')}</SelectItem>
                      <SelectItem value="archived">{t('status.archived')}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <Separator className="my-4" />
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={submitting}>
                  {submitting
                    ? t('form.saving')
                    : initialData?.id
                      ? t('form.update')
                      : t('form.create')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/${locale}/panel/products`)}
                >
                  {t('form.cancel')}
                </Button>
              </div>
            </div>
          </Card>

          {/* Category */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">{t('form.category')}</h2>
            </div>
            <div className="p-6">
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ''}
                    onValueChange={(val) => field.onChange(val || null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.selectCategory')} />
                    </SelectTrigger>
                    <SelectContent>
                      {flattenCategories(categories).map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </Card>

          {/* Featured */}
          <Card className="overflow-hidden border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h2 className="text-sm font-semibold text-slate-800">{t('form.featured')}</h2>
            </div>
            <div className="p-6">
              <button
                type="button"
                role="switch"
                aria-checked={isFeatured}
                onClick={() => setValue('isFeatured', !isFeatured)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  isFeatured ? 'bg-violet-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                    isFeatured ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <p className="mt-2 text-xs text-slate-400">
                {t('form.featuredDescription')}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
}
