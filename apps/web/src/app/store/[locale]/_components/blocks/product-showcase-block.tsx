'use client';

import { useEffect, useState } from 'react';
import type { Block } from '@zunapro/types';
import { ProductCard } from '../product-card';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ProductShowcaseProps {
  block: Block;
  locale: string;
}

type Product = {
  id: string;
  name: Record<string, string>;
  slug: string;
  price: string | number;
  compareAtPrice?: string | number | null;
  images: string[];
  status: string;
};

export function ProductShowcaseBlock({
  block,
  locale,
}: ProductShowcaseProps) {
  const [products, setProducts] = useState<Product[]>([]);

  const props = block.props as {
    title?: Record<string, string>;
    limit?: number;
    categoryId?: string;
    columns?: number;
    showPrice?: boolean;
  };

  const title = props.title?.[locale] ?? props.title?.en ?? '';
  const limit = props.limit || 4;
  const columns = props.columns || 4;

  useEffect(() => {
    let queryParams = `?limit=${limit}&status=active`;
    if (props.categoryId) {
      queryParams += `&categoryId=${props.categoryId}`;
    }

    fetch(`${API_URL}/storefront/products${queryParams}`)
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((res: { data: Product[] }) => setProducts(res.data || []))
      .catch(() => setProducts([]));
  }, []);

  if (products.length === 0) return null;

  const gridCols =
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === 3
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {title && (
        <h2
          className="mb-6 text-2xl font-bold text-[var(--color-foreground)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {title}
        </h2>
      )}
      <div className={`grid ${gridCols} gap-6`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>
    </section>
  );
}
