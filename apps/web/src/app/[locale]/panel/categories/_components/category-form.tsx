// @ts-nocheck — zod v4 + @hookform/resolvers version mismatch
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
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
  TabsList,
  TabsTrigger,
  TabsContent,
  Separator,
} from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';
import { ImageIcon, X } from 'lucide-react';

const LOCALES = ['en', 'tr', 'de', 'fr', 'es'] as const;

const categorySchema = z.object({
  name: z.record(z.string(), z.string()).refine(
    (val) => Object.values(val).some((v) => v.trim().length > 0),
    { message: 'At least one language name is required' },
  ),
  description: z.record(z.string(), z.string()).optional(),
  slug: z.string().optional(),
  parentId: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface Category {
  id: string;
  name: Record<string, string>;
  slug: string;
  children?: Category[];
}

interface CategoryFormProps {
  locale: string;
  initialData?: CategoryFormData & { id?: string; image?: string; isFeatured?: boolean; description?: Record<string, string> };
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({
  locale,
  initialData,
  categories,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const t = useTranslations('panel.categories');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState(initialData?.image ?? '');
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as never,
    defaultValues: {
      name: initialData?.name ?? { en: '', tr: '', de: '', fr: '', es: '' },
      description: initialData?.description ?? { en: '', tr: '', de: '', fr: '', es: '' },
      slug: initialData?.slug ?? '',
      parentId: initialData?.parentId ?? null,
      sortOrder: initialData?.sortOrder ?? 0,
    },
  });

  const parentId = watch('parentId');

  const flattenCategories = (
    cats: Category[],
    prefix = '',
    excludeId?: string,
  ): { id: string; label: string }[] => {
    const result: { id: string; label: string }[] = [];
    for (const cat of cats) {
      if (cat.id === excludeId) continue;
      const catName =
        (cat.name as Record<string, string>)[locale] ||
        (cat.name as Record<string, string>).en ||
        cat.slug;
      result.push({ id: cat.id, label: prefix + catName });
      if (cat.children) {
        result.push(
          ...flattenCategories(cat.children, prefix + '\u2014 ', excludeId),
        );
      }
    }
    return result;
  };

  const onSubmit = async (data: CategoryFormData) => {
    setSubmitting(true);
    setError('');
    try {
      const payload = { ...data, image: image || null, isFeatured, description: data.description };
      if (initialData?.id) {
        await panelApi.patch(`/categories/${initialData.id}`, payload);
      } else {
        await panelApi.post('/categories', payload);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* Basic Information */}
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-slate-800">
            {t('basicInfo')}
          </legend>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <Tabs defaultValue="en">
              <TabsList className="mb-3 w-full justify-start gap-0 bg-slate-100 p-0.5">
                {LOCALES.map((loc) => (
                  <TabsTrigger
                    key={loc}
                    value={loc}
                    className="px-3 py-1.5 text-xs font-medium uppercase data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    {loc}
                  </TabsTrigger>
                ))}
              </TabsList>
              {LOCALES.map((loc) => (
                <TabsContent key={loc} value={loc} className="mt-0 space-y-3">
                  <div>
                    <Label className="text-xs text-slate-500">
                      {t('name')} ({loc.toUpperCase()})
                    </Label>
                    <Input
                      {...register(`name.${loc}`)}
                      placeholder={t('namePlaceholder')}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">
                      {t('description')} ({loc.toUpperCase()})
                    </Label>
                    <textarea
                      {...register(`description.${loc}`)}
                      placeholder={`${t('description')} (${loc.toUpperCase()})`}
                      rows={3}
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            {errors.name && (
              <p className="mt-2 text-sm text-rose-600">{String(errors.name.message)}</p>
            )}
            <p className="mt-2 text-xs text-slate-400">{t('htmlHint')}</p>
          </div>
        </fieldset>

        {/* Organization */}
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-slate-800">
            {t('organization')}
          </legend>
          <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
            <div>
              <Label className="text-xs text-slate-500">{t('parent')}</Label>
              <Select
                value={parentId ?? 'none'}
                onValueChange={(val) =>
                  setValue('parentId', val === 'none' ? null : val)
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t('noParent')} />
                </SelectTrigger>
                <SelectContent className="z-[80]">
                  <SelectItem value="none">{t('noParent')}</SelectItem>
                  {flattenCategories(categories, '', initialData?.id).map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs text-slate-500">{t('sortOrder')}</Label>
              <Input
                type="number"
                min="0"
                {...register('sortOrder', { valueAsNumber: true })}
                className="mt-1 w-32"
              />
            </div>

            <Separator />

            {/* Featured Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">{t('featured')}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isFeatured}
                onClick={() => setIsFeatured(!isFeatured)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  isFeatured ? 'bg-violet-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                    isFeatured ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </fieldset>

        {/* Media */}
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-slate-800">
            {t('media')}
          </legend>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <Label className="text-xs text-slate-500">{t('image')}</Label>
            <Input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
              className="mt-1"
            />
            {image && (
              <div className="mt-3 flex items-start gap-3">
                <img
                  src={image}
                  alt="Preview"
                  className="h-24 w-24 rounded-lg border border-slate-200 object-cover"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  onClick={() => setImage('')}
                >
                  <X className="mr-1 h-3.5 w-3.5" />
                  {t('removeImage')}
                </Button>
              </div>
            )}
            {!image && (
              <div className="mt-3 flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50">
                <ImageIcon className="h-8 w-8 text-slate-300" />
              </div>
            )}
          </div>
        </fieldset>
      </div>

      {/* Sticky Footer */}
      <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-6 py-4">
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('cancel')}
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-violet-600 hover:bg-violet-700"
          >
            {submitting
              ? t('saving')
              : initialData?.id
                ? t('update')
                : t('create')}
          </Button>
        </div>
      </div>
    </form>
  );
}
