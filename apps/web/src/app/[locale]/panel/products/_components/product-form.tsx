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
  CardContent,
  CardHeader,
  CardTitle,
} from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';
import { ImageUpload } from './image-upload';
import { VariantBuilder } from './variant-builder';

const LOCALES = ['en', 'tr', 'de', 'fr', 'es'] as const;

const productSchema = z.object({
  name: z.record(z.string(), z.string()).refine(
    (val) => Object.values(val).some((v) => v.trim().length > 0),
    { message: 'At least one language name is required' },
  ),
  description: z.record(z.string(), z.string()).optional(),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0).optional().nullable(),
  sku: z.string().optional().nullable(),
  stock: z.coerce.number().int().min(0).default(0),
  categoryId: z.string().optional().nullable(),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  seoMeta: z.record(z.string(), z.unknown()).optional(),
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
  initialData?: ProductFormData & { id?: string; images?: string[]; variants?: Record<string, unknown>[] };
}

export function ProductForm({ locale, initialData }: ProductFormProps) {
  const t = useTranslations('panel.products');
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [variants, setVariants] = useState<{ name: string; sku: string; price: number; stock: number }[]>(
    (initialData?.variants as { name: string; sku: string; price: number; stock: number }[]) ?? [],
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
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
    },
  });

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
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        ...data,
        images,
        variants,
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Name & Description - Multi-language */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('form.basicInfo')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en">
            <TabsList>
              {LOCALES.map((loc) => (
                <TabsTrigger key={loc} value={loc}>
                  {loc.toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>
            {LOCALES.map((loc) => (
              <TabsContent key={loc} value={loc} className="space-y-4">
                <div>
                  <Label>{t('form.name')} ({loc.toUpperCase()})</Label>
                  <Input
                    {...register(`name.${loc}`)}
                    placeholder={t('form.namePlaceholder')}
                  />
                </div>
                <div>
                  <Label>{t('form.description')} ({loc.toUpperCase()})</Label>
                  <textarea
                    {...register(`description.${loc}`)}
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder={t('form.descriptionPlaceholder')}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
          {errors.name && (
            <p className="mt-1 text-sm text-destructive">{String(errors.name.message)}</p>
          )}
        </CardContent>
      </Card>

      {/* Pricing & Inventory */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('form.pricing')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label>{t('form.price')}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-destructive">{String(errors.price.message)}</p>
              )}
            </div>
            <div>
              <Label>{t('form.compareAtPrice')}</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                {...register('compareAtPrice', { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label>{t('form.sku')}</Label>
              <Input {...register('sku')} placeholder="SKU-001" />
            </div>
            <div>
              <Label>{t('form.stock')}</Label>
              <Input
                type="number"
                min="0"
                {...register('stock', { valueAsNumber: true })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category & Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('form.organization')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t('form.category')}</Label>
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
            <div>
              <Label>{t('form.status')}</Label>
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
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('form.images')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload images={images} onChange={setImages} />
        </CardContent>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('variants.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <VariantBuilder variants={variants} onChange={setVariants} />
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('form.seo')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en">
            <TabsList>
              {LOCALES.map((loc) => (
                <TabsTrigger key={loc} value={loc}>
                  {loc.toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>
            {LOCALES.map((loc) => (
              <TabsContent key={loc} value={loc} className="space-y-3">
                <div>
                  <Label>{t('form.seoTitle')} ({loc.toUpperCase()})</Label>
                  <Input
                    {...register(`seoMeta.${loc}.title` as `seoMeta.${string}`)}
                    placeholder={t('form.seoTitlePlaceholder')}
                  />
                </div>
                <div>
                  <Label>{t('form.seoDescription')} ({loc.toUpperCase()})</Label>
                  <textarea
                    {...register(`seoMeta.${loc}.description` as `seoMeta.${string}`)}
                    rows={2}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder={t('form.seoDescriptionPlaceholder')}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${locale}/panel/products`)}
        >
          {t('form.cancel')}
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? t('form.saving') : initialData?.id ? t('form.update') : t('form.create')}
        </Button>
      </div>
    </form>
  );
}
