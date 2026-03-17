'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Badge, Button } from '@zunapro/ui';

interface Product {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: string | number;
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

function getStatusVariant(status: string) {
  switch (status) {
    case 'active':
      return 'default' as const;
    case 'draft':
      return 'secondary' as const;
    case 'archived':
      return 'outline' as const;
    default:
      return 'secondary' as const;
  }
}

export function ProductTable({ products, locale, onDelete }: ProductTableProps) {
  const t = useTranslations('panel.products');

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
        <p className="text-sm text-gray-500">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="px-4 py-3 font-medium text-gray-500">{t('table.image')}</th>
            <th className="px-4 py-3 font-medium text-gray-500">{t('table.name')}</th>
            <th className="px-4 py-3 font-medium text-gray-500">{t('table.price')}</th>
            <th className="px-4 py-3 font-medium text-gray-500">{t('table.stock')}</th>
            <th className="px-4 py-3 font-medium text-gray-500">{t('table.status')}</th>
            <th className="px-4 py-3 font-medium text-gray-500">{t('table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const name =
              (product.name as Record<string, string>)[locale] ||
              (product.name as Record<string, string>).en ||
              Object.values(product.name)[0] ||
              '';
            const imageUrl =
              Array.isArray(product.images) && product.images.length > 0
                ? product.images[0]
                : null;

            return (
              <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                      <svg
                        className="h-5 w-5"
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
                  <div className="font-medium text-gray-900">{name}</div>
                  {product.category && (
                    <div className="text-xs text-gray-500">
                      {(product.category.name as Record<string, string>)[locale] ||
                        (product.category.name as Record<string, string>).en}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">
                  {Number(product.price).toFixed(2)}
                </td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  <Badge variant={getStatusVariant(product.status)}>
                    {t(`status.${product.status}`)}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/${locale}/panel/products/${product.id}`}>
                      <Button variant="outline" size="sm">
                        {t('edit')}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      {t('delete')}
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
