'use client';

import { useEffect, useState } from 'react';
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
} from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';

const LOCALES = ['en', 'tr', 'de', 'fr', 'es'] as const;

const categorySchema = z.object({
  name: z.record(z.string(), z.string()).refine(
    (val) => Object.values(val).some((v) => v.trim().length > 0),
    { message: 'At least one language name is required' },
  ),
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
  initialData?: CategoryFormData & { id?: string };
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as never,
    defaultValues: {
      name: initialData?.name ?? { en: '', tr: '' },
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
      const name =
        (cat.name as Record<string, string>)[locale] ||
        (cat.name as Record<string, string>).en ||
        cat.slug;
      result.push({ id: cat.id, label: prefix + name });
      if (cat.children) {
        result.push(
          ...flattenCategories(cat.children, prefix + '— ', excludeId),
        );
      }
    }
    return result;
  };

  const onSubmit = async (data: CategoryFormData) => {
    setSubmitting(true);
    setError('');
    try {
      if (initialData?.id) {
        await panelApi.patch(`/categories/${initialData.id}`, data);
      } else {
        await panelApi.post('/categories', data);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {LOCALES.map((loc) => (
        <div key={loc}>
          <Label>
            {t('name')} ({loc.toUpperCase()})
          </Label>
          <Input
            {...register(`name.${loc}`)}
            placeholder={t('namePlaceholder')}
          />
        </div>
      ))}
      {errors.name && (
        <p className="text-sm text-destructive">{String(errors.name.message)}</p>
      )}

      <div>
        <Label>{t('parent')}</Label>
        <Select
          value={parentId ?? 'none'}
          onValueChange={(val) =>
            setValue('parentId', val === 'none' ? null : val)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={t('noParent')} />
          </SelectTrigger>
          <SelectContent>
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
        <Label>{t('sortOrder')}</Label>
        <Input
          type="number"
          min="0"
          {...register('sortOrder', { valueAsNumber: true })}
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting
            ? t('saving')
            : initialData?.id
              ? t('update')
              : t('create')}
        </Button>
      </div>
    </form>
  );
}
