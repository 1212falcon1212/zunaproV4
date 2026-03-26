'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@zunapro/ui';
import { proxyImageUrl } from '@/lib/media-url';

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: string | number;
  compareAtPrice?: string | number | null;
  stock: number;
  status: string;
  images: string[];
  category: { id: string; name: Record<string, string>; slug: string } | null;
}

interface ProductTableProps {
  products: Product[];
  locale: string;
  onDelete: (id: string) => void;
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const colorMap: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    draft: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    archived: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  };
  const colors = colorMap[status] ?? colorMap.draft;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${colors}`}
    >
      {label}
    </span>
  );
}

export function ProductTable({ products, locale, onDelete }: ProductTableProps) {
  const t = useTranslations('panel.products');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleAll = () => {
    if (selectedIds.size === products.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(products.map((p) => p.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-medium text-muted-foreground">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            <th className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={selectedIds.size === products.length && products.length > 0}
                onChange={toggleAll}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('table.image')}
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('table.name')}
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('table.price')}
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('table.stock')}
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('table.status')}
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t('table.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.map((product) => {
            const name =
              (product.name as Record<string, string>)[locale] ||
              (product.name as Record<string, string>).en ||
              Object.values(product.name)[0] ||
              '';
            const rawImageUrl =
              Array.isArray(product.images) && product.images.length > 0
                ? product.images[0]
                : null;
            const imageUrl = rawImageUrl ? proxyImageUrl(rawImageUrl) : null;
            const price = Number(product.price);
            const compareAtPrice = product.compareAtPrice
              ? Number(product.compareAtPrice)
              : null;
            const categoryName = product.category
              ? (product.category.name as Record<string, string>)[locale] ||
                (product.category.name as Record<string, string>).en
              : null;

            return (
              <tr
                key={product.id}
                className="transition-colors hover:bg-muted/50"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(product.id)}
                    onChange={() => toggleOne(product.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-4 py-3">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name}
                      className="h-14 w-14 rounded-lg object-cover ring-1 ring-border"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-foreground">{name}</div>
                  {categoryName && (
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {categoryName}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-foreground">
                    ${price.toFixed(2)}
                  </div>
                  {compareAtPrice !== null && compareAtPrice > 0 && (
                    <div className="mt-0.5 text-xs text-muted-foreground line-through">
                      ${compareAtPrice.toFixed(2)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {product.stock > 0 ? (
                    <span className="font-medium text-emerald-600">
                      {product.stock} {t('table.inStock')}
                    </span>
                  ) : (
                    <span className="font-medium text-red-600">
                      {t('table.outOfStock')}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge
                    status={product.status}
                    label={t(`status.${product.status}`)}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/${locale}/panel/products/${product.id}`}>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        {t('edit')}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(product.id)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
