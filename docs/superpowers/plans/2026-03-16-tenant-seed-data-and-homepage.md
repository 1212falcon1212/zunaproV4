# Tenant Seed Data & Homepage Page Builder — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every new tenant gets a fully functional, sector-specific e-commerce site with products, pages, header/footer seeded during provisioning — homepage driven entirely by the page builder.

**Architecture:** Seed data defined in `packages/themes/src/seeds/` as TypeScript objects (per sector). `TenantSeederService` in NestJS reads seed data, applies branding, inserts into tenant DB inside a transaction. Two new block types (`product-listing`, `category-listing`) enable full storefront pages. Homepage fallback removed — always renders from page builder.

**Tech Stack:** TypeScript, NestJS, Prisma, Next.js 15, React, Zustand, shadcn/ui, Unsplash images

**Spec:** `docs/superpowers/specs/2026-03-16-tenant-seed-data-and-homepage-design.md`

---

## Chunk 1: Types, Block Types & Theme Updates

### Task 1: Add new block types to type system

**Files:**
- Modify: `packages/types/src/page-builder.ts`

- [ ] **Step 1: Add `product-listing` and `category-listing` to BlockType union**

In `packages/types/src/page-builder.ts`, add to the `BlockType` union (after `'newsletter'`):

```typescript
  | 'product-listing'
  | 'category-listing';
```

- [ ] **Step 2: Verify types compile**

Run: `pnpm --filter=@zunapro/types exec tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add packages/types/src/page-builder.ts
git commit -m "feat: add product-listing and category-listing block types"
```

---

### Task 2: Update ThemeSector type and add seeds export

**Files:**
- Modify: `packages/themes/src/types.ts`
- Modify: `packages/themes/package.json`

- [ ] **Step 1: Add `ev-yasam` to ThemeSector**

In `packages/themes/src/types.ts`, change line 1:

```typescript
export type ThemeSector = 'genel' | 'mobilya' | 'teknoloji' | 'giyim' | 'gida' | 'kozmetik' | 'ev-yasam';
```

- [ ] **Step 2: Add seeds export path to package.json**

In `packages/themes/package.json`, add to `"exports"`:

```json
"./seeds": {
  "types": "./src/seeds/index.ts",
  "default": "./src/seeds/index.ts"
}
```

- [ ] **Step 3: Commit**

```bash
git add packages/themes/src/types.ts packages/themes/package.json
git commit -m "feat: add ev-yasam sector and seeds export path"
```

---

### Task 3: Create seed data type definitions

**Files:**
- Create: `packages/themes/src/seeds/types.ts`

- [ ] **Step 1: Create types file**

```typescript
import type { PageContent } from '@zunapro/types';

export interface SeedProduct {
  name: Record<string, string>;
  description: Record<string, string>;
  slug: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  images: string[];
  categorySlug: string;
  status: 'active';
  seoMeta?: Record<string, string>;
}

export interface SeedCategory {
  name: Record<string, string>;
  slug: string;
  image?: string;
  sortOrder: number;
}

export interface SeedPage {
  title: Record<string, string>;
  slug: string;
  content: PageContent;
  isPublished: true;
  seoMeta: Record<string, string>;
}

export type SeedSettingValue = string | number | boolean | string[] | Record<string, string>;

export interface SeedSetting {
  key: string;
  value: SeedSettingValue;
  group: string;
}

export interface SectorSeedData {
  categories: SeedCategory[];
  products: SeedProduct[];
  pages: SeedPage[];
  header: PageContent;
  footer: PageContent;
  settings: SeedSetting[];
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/themes/src/seeds/types.ts
git commit -m "feat: add seed data type definitions"
```

---

### Task 4: Update tenant.prisma content field comment

**Files:**
- Modify: `packages/db/prisma/tenant.prisma`

- [ ] **Step 1: Update the Page model content field comment**

Change the content field comment from locale-keyed HTML reference to:

```prisma
content   Json?    // PageContent format: { version: 1, blocks: Block[] }
```

- [ ] **Step 2: Commit**

```bash
git add packages/db/prisma/tenant.prisma
git commit -m "docs: update Page content field comment to reflect PageContent format"
```

---

## Chunk 2: Seed Data Files (7 sectors + common)

### Task 5: Create common seed data (privacy, terms, header, footer)

**Files:**
- Create: `packages/themes/src/seeds/common.ts`

- [ ] **Step 1: Create common.ts with shared pages and global sections**

This file contains:
- `privacy` page — text block with generic privacy policy in 5 languages
- `terms` page — text block with generic terms of service in 5 languages
- Default `header` — logo + navigation-menu + search-bar + cart-icon blocks
- Default `footer` — columns (links + contact), social-links, newsletter, text (copyright) blocks
- Common settings (contact_email placeholder)

All block IDs prefixed with `seed_common_`.

Content must be substantial, realistic legal text (2-3 paragraphs per language for privacy/terms).

Header navigation-menu block props should include links to: home (/), shop (/pages/shop), categories (/pages/categories), about (/pages/about), contact (/pages/contact).

Footer should include columns with Quick Links, Customer Service links, and contact info.

- [ ] **Step 2: Commit**

```bash
git add packages/themes/src/seeds/common.ts
git commit -m "feat: add common seed data — privacy, terms, header, footer"
```

---

### Task 6: Create genel (default) sector seed data

**Files:**
- Create: `packages/themes/src/seeds/genel.ts`

- [ ] **Step 1: Create genel.ts**

Contains:
- 5 categories: Populer, Yeni Gelenler, Indirimli, Ozel Koleksiyon, Hediye
- 6 products: Generic products with Unsplash images (`?w=800&h=600&fit=crop`), status: 'active', realistic descriptions in 5 languages
- 7 pages (home, about, contact, faq, shop, categories, products) with page-builder block trees
- Homepage blocks: hero, spacer, product-showcase (limit: 8), spacer, category-showcase (limit: 5), spacer, banner, spacer, newsletter
- Shop page: hero (small), product-listing (showFilters: true, productsPerPage: 12, columns: 4)
- Categories page: hero (small), category-listing (columns: 4, showProductCount: true)
- Products page: hero (small), product-listing (showFilters: false, productsPerPage: 24, columns: 4)
- About/Contact/FAQ: sector-appropriate content
- Settings: site_name, default_locale, locales, default_currency, currencies, sector

All block IDs prefixed with `seed_genel_`.
All Unsplash images use specific photo IDs with `?w=800&h=600&fit=crop`.

- [ ] **Step 2: Commit**

```bash
git add packages/themes/src/seeds/genel.ts
git commit -m "feat: add genel (default) sector seed data"
```

---

### Task 7: Create mobilya sector seed data

**Files:**
- Create: `packages/themes/src/seeds/mobilya.ts`

- [ ] **Step 1: Create mobilya.ts**

Contains:
- 5 categories: Salon Takimlari, Yatak Odasi, Yemek Odasi, Calisma Odasi, Bahce Mobilyasi (matching Go seeder slugs)
- 6 products: Modern Koltuk Takimi, Yemek Masasi, Kitaplik, Yatak Basi, Sehpa, TV Unitesi — with furniture Unsplash images, prices in 2800-12500 range
- 7 pages with furniture-themed content (hero: "Evinizi Yeniden Tasarlayin")
- FAQ: furniture-specific questions (delivery, assembly, warranty, materials)
- Settings with sector: 'mobilya'

- [ ] **Step 2: Commit**

```bash
git add packages/themes/src/seeds/mobilya.ts
git commit -m "feat: add mobilya sector seed data"
```

---

### Task 8: Create teknoloji sector seed data

**Files:**
- Create: `packages/themes/src/seeds/teknoloji.ts`

- [ ] **Step 1: Create teknoloji.ts**

Contains:
- 5 categories: Bilgisayarlar, Telefonlar, Aksesuarlar, Yazilim, Oyun (matching Go seeder)
- 6 products: Laptop, Smartphone, Wireless Headphones, Keyboard, Tablet, Smartwatch — with tech Unsplash images, prices in 500-15000 range
- 7 pages with tech-themed content (hero: "Teknolojiyle Tanisin")
- FAQ: tech-specific questions (warranty, returns, specs, compatibility)

- [ ] **Step 2: Commit**

```bash
git add packages/themes/src/seeds/teknoloji.ts
git commit -m "feat: add teknoloji sector seed data"
```

---

### Task 9: Create giyim sector seed data

**Files:**
- Create: `packages/themes/src/seeds/giyim.ts`

- [ ] **Step 1: Create giyim.ts**

Contains:
- 5 categories: Kadin, Erkek, Cocuk, Ayakkabi, Aksesuar (matching Go seeder)
- 6 products: clothing items with fashion Unsplash images, prices in 150-2500 range
- 7 pages with fashion-themed content (hero: "Tarzinizi Yansitan Koleksiyonlar")
- FAQ: fashion-specific questions (sizing, returns, care, shipping)

- [ ] **Step 2: Commit**

```bash
git add packages/themes/src/seeds/giyim.ts
git commit -m "feat: add giyim sector seed data"
```

---

### Task 10: Create kozmetik sector seed data

**Files:**
- Create: `packages/themes/src/seeds/kozmetik.ts`

- [ ] **Step 1: Create kozmetik.ts**

Contains:
- 4 categories: Cilt Bakimi, Makyaj, Sac Bakimi, Parfum (matching Go seeder)
- 6 products: skincare/cosmetic items with beauty Unsplash images, prices in 100-1500 range
- 7 pages with beauty-themed content (hero: "Guzelliginize Deger Katin")
- FAQ: cosmetic-specific questions (ingredients, skin types, returns, authenticity)

- [ ] **Step 2: Commit**

```bash
git add packages/themes/src/seeds/kozmetik.ts
git commit -m "feat: add kozmetik sector seed data"
```

---

### Task 11: Create gida sector seed data

**Files:**
- Create: `packages/themes/src/seeds/gida.ts`

- [ ] **Step 1: Create gida.ts**

Contains:
- 4 categories: Organik, Atistirmalik, Icecek, Baharatlar (matching Go seeder)
- 6 products: food items with food Unsplash images, prices in 30-500 range
- 7 pages with food-themed content (hero: "Dogal ve Taze Lezzetler")
- FAQ: food-specific questions (freshness, delivery, allergens, storage)

- [ ] **Step 2: Commit**

```bash
git add packages/themes/src/seeds/gida.ts
git commit -m "feat: add gida sector seed data"
```

---

### Task 12: Create ev-yasam sector seed data

**Files:**
- Create: `packages/themes/src/seeds/ev-yasam.ts`

- [ ] **Step 1: Create ev-yasam.ts**

Contains:
- 5 categories: Dekorasyon, Mutfak Gerecleri, Banyo, Bahce, Aydinlatma (matching Go seeder)
- 6 products: home/lifestyle items with home Unsplash images, prices in 80-3000 range
- 7 pages with home-themed content (hero: "Eviniz Icin Ilham Veren Tasarimlar")
- FAQ: home-specific questions (delivery, dimensions, care, returns)

- [ ] **Step 2: Commit**

```bash
git add packages/themes/src/seeds/ev-yasam.ts
git commit -m "feat: add ev-yasam sector seed data"
```

---

### Task 13: Create seed data index with getSeedData

**Files:**
- Create: `packages/themes/src/seeds/index.ts`

- [ ] **Step 1: Create index.ts**

```typescript
import type { SectorSeedData, SeedPage, SeedSetting } from './types';
import type { PageContent } from '@zunapro/types';
import { genelSeedData } from './genel';
import { mobilyaSeedData } from './mobilya';
import { teknolojiSeedData } from './teknoloji';
import { giyimSeedData } from './giyim';
import { kozmetikSeedData } from './kozmetik';
import { gidaSeedData } from './gida';
import { evYasamSeedData } from './ev-yasam';
import { commonPages, commonSettings, defaultHeader, defaultFooter } from './common';

export type { SectorSeedData, SeedProduct, SeedCategory, SeedPage, SeedSetting, SeedSettingValue } from './types';

const SECTOR_MAP: Record<string, SectorSeedData> = {
  genel: genelSeedData,
  mobilya: mobilyaSeedData,
  teknoloji: teknolojiSeedData,
  giyim: giyimSeedData,
  kozmetik: kozmetikSeedData,
  gida: gidaSeedData,
  'ev-yasam': evYasamSeedData,
};

export function getSeedData(sector: string): SectorSeedData {
  return SECTOR_MAP[sector] ?? SECTOR_MAP.genel;
}

export function getCommonSeedData(): {
  pages: SeedPage[];
  settings: SeedSetting[];
  header: PageContent;
  footer: PageContent;
} {
  return {
    pages: commonPages,
    settings: commonSettings,
    header: defaultHeader,
    footer: defaultFooter,
  };
}
```

- [ ] **Step 2: Verify themes package compiles**

Run: `pnpm --filter=@zunapro/themes exec tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add packages/themes/src/seeds/
git commit -m "feat: add seed data index with getSeedData and getCommonSeedData"
```

---

## Chunk 3: New Block Components (Storefront + Editor)

### Task 14: Create product-listing storefront block

**Files:**
- Create: `apps/web/src/app/store/[locale]/_components/blocks/product-listing-block.tsx`

- [ ] **Step 1: Create the client component**

`'use client'` component that:
- Accepts `{ block: Block; locale: string }` props
- Fetches products from `/storefront/products` with query params (limit, offset, categoryId, search, sort)
- Renders filter sidebar (category dropdown, price range, sort select) when `showFilters` prop is true
- Renders search input when `showSearch` prop is true
- Renders product grid with configurable columns (3 or 4)
- Handles pagination (page state, prev/next buttons)
- Uses `useEffect` + `useState` for data fetching
- Displays loading skeleton during fetch
- Shows empty state when no products found
- Product cards link to `/store/{locale}/products/{slug}`

API URL from `process.env.NEXT_PUBLIC_API_URL`.

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/store/[locale]/_components/blocks/product-listing-block.tsx
git commit -m "feat: add product-listing storefront block component"
```

---

### Task 15: Create category-listing storefront block

**Files:**
- Create: `apps/web/src/app/store/[locale]/_components/blocks/category-listing-block.tsx`

- [ ] **Step 1: Create the client component**

`'use client'` component that:
- Accepts `{ block: Block; locale: string }` props
- Fetches categories from `/storefront/categories`
- Renders grid of category cards with configurable columns and layout (grid/list)
- Shows product count per category when `showProductCount` is true
- Category cards link to `/store/{locale}/categories/{slug}`
- Uses category images or gradient placeholder
- Displays loading skeleton during fetch

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/store/[locale]/_components/blocks/category-listing-block.tsx
git commit -m "feat: add category-listing storefront block component"
```

---

### Task 16: Register new blocks in block renderer

**Files:**
- Modify: `apps/web/src/app/store/[locale]/_components/blocks/block-renderer.tsx`

- [ ] **Step 1: Add imports and register in BLOCK_COMPONENTS**

Add imports:
```typescript
import { ProductListingBlock } from './product-listing-block';
import { CategoryListingBlock } from './category-listing-block';
```

Add to `BLOCK_COMPONENTS` record:
```typescript
  'product-listing': ProductListingBlock,
  'category-listing': CategoryListingBlock,
```

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/store/[locale]/_components/blocks/block-renderer.tsx
git commit -m "feat: register product-listing and category-listing in block renderer"
```

---

### Task 17: Add new blocks to editor sidebar, canvas defaults, and preview

**Files:**
- Modify: `apps/web/src/app/[locale]/panel/pages/[id]/edit/_components/block-sidebar.tsx`
- Modify: `apps/web/src/app/[locale]/panel/pages/[id]/edit/_components/editor-canvas.tsx`
- Modify: `apps/web/src/app/[locale]/panel/pages/[id]/edit/_components/block-wrapper.tsx`

- [ ] **Step 1: Add to block sidebar Commerce group**

In `block-sidebar.tsx`, add `List` and `LayoutGrid` to lucide imports. Add to the Commerce group items:

```typescript
{ type: 'product-listing', label: 'Product Listing', icon: <List className="h-5 w-5" /> },
{ type: 'category-listing', label: 'Category Grid', icon: <LayoutGrid className="h-5 w-5" /> },
```

- [ ] **Step 2: Add to BLOCK_TYPE_LABELS and default props in editor canvas**

In `editor-canvas.tsx`, add to the `BLOCK_TYPE_LABELS` record (typed as `Record<BlockType, string>` — missing entries cause compile errors):

```typescript
'product-listing': 'Product Listing',
'category-listing': 'Category Grid',
```

Then add cases to `getDefaultPropsForType()`:

```typescript
case 'product-listing':
  return {
    title: { en: 'All Products' },
    columns: 4,
    productsPerPage: 12,
    showFilters: true,
    showSearch: true,
  };
case 'category-listing':
  return {
    title: { en: 'Categories' },
    columns: 4,
    showProductCount: true,
    layout: 'grid',
  };
```

- [ ] **Step 3: Add editor preview in block-wrapper.tsx**

In `block-wrapper.tsx`, add to `BLOCK_TYPE_LABELS`:
```typescript
'product-listing': 'Product Listing',
'category-listing': 'Category Grid',
```

Add preview cases in `BlockPreview` switch:

```typescript
case 'product-listing':
  return (
    <div className="p-6">
      <h3 className="mb-3 text-lg font-semibold text-slate-800">
        {getLocalizedText(props.title) || 'Products'}
      </h3>
      <div className="mb-3 flex items-center gap-2">
        {(props.showFilters as boolean) && (
          <div className="h-8 w-32 rounded bg-slate-100 text-center text-xs leading-8 text-slate-400">Filters</div>
        )}
        {(props.showSearch as boolean) && (
          <div className="h-8 flex-1 rounded bg-slate-100 text-center text-xs leading-8 text-slate-400">Search...</div>
        )}
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${(props.columns as number) || 4}, 1fr)` }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 h-20 w-full rounded bg-slate-200" />
            <div className="h-2 w-16 rounded bg-slate-200" />
            <div className="mt-1 h-2 w-10 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );

case 'category-listing':
  return (
    <div className="p-6">
      <h3 className="mb-3 text-lg font-semibold text-slate-800">
        {getLocalizedText(props.title) || 'Categories'}
      </h3>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${(props.columns as number) || 4}, 1fr)` }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex h-24 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 text-xs text-slate-400">
            <div className="mb-1 text-sm font-medium">Category {i + 1}</div>
            {(props.showProductCount as boolean) && <span className="text-[10px]">12 products</span>}
          </div>
        ))}
      </div>
    </div>
  );
```

- [ ] **Step 4: Add settings forms in block-settings-panel.tsx**

In `block-settings-panel.tsx`, add settings forms for the new block types in the content tab switch. Product-listing needs: title (localized), columns (select 3/4), productsPerPage (select 12/24/48), showFilters (checkbox), showSearch (checkbox). Category-listing needs: title (localized), columns (select 3/4), showProductCount (checkbox), layout (select grid/list).

- [ ] **Step 5: Verify web compiles**

Run: `pnpm --filter=@zunapro/web exec tsc --noEmit`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/app/[locale]/panel/pages/[id]/edit/_components/block-sidebar.tsx
git add apps/web/src/app/[locale]/panel/pages/[id]/edit/_components/editor-canvas.tsx
git add apps/web/src/app/[locale]/panel/pages/[id]/edit/_components/block-wrapper.tsx
git add apps/web/src/app/[locale]/panel/pages/[id]/edit/_components/block-settings-panel.tsx
git commit -m "feat: add product-listing and category-listing to page builder editor"
```

---

## Chunk 4: TenantSeederService & Provisioning Integration

### Task 18: Create TenantSeederService

**Files:**
- Create: `apps/api/src/modules/provisioning/tenant-seeder.service.ts`

- [ ] **Step 1: Create the service**

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { getTenantClient } from '@zunapro/db';
import { getSeedData, getCommonSeedData } from '@zunapro/themes/seeds';
import type { SeedProduct, SeedCategory, SeedPage, SeedSetting } from '@zunapro/themes/seeds';
import type { PageContent } from '@zunapro/types';

// Prisma transaction client type — avoids using `any`
type TenantTx = Parameters<Parameters<ReturnType<typeof getTenantClient>['$transaction']>[0]>[0];

interface BrandingConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

@Injectable()
export class TenantSeederService {
  private readonly logger = new Logger(TenantSeederService.name);

  async seedTenant(slug: string, sector: string, branding: BrandingConfig): Promise<void> {
    const prisma = getTenantClient(slug);
    const seedData = getSeedData(sector);
    const commonData = getCommonSeedData();

    await prisma.$transaction(async (tx) => {
      // 1. Categories
      const categoryMap = await this.seedCategories(tx, seedData.categories);
      this.logger.log(`Seeded ${seedData.categories.length} categories (tenant: ${slug})`);

      // 2. Products
      await this.seedProducts(tx, seedData.products, categoryMap);
      this.logger.log(`Seeded ${seedData.products.length} products (tenant: ${slug})`);

      // 3. Pages (sector + common, apply branding)
      const allPages = [...seedData.pages, ...commonData.pages];
      await this.seedPages(tx, allPages, branding);
      this.logger.log(`Seeded ${allPages.length} pages (tenant: ${slug})`);

      // 4. Header & Footer (merge sector with common defaults)
      const header = seedData.header.blocks.length > 0 ? seedData.header : commonData.header;
      const footer = seedData.footer.blocks.length > 0 ? seedData.footer : commonData.footer;
      await this.seedGlobalSections(tx, header, footer);
      this.logger.log(`Seeded header + footer (tenant: ${slug})`);

      // 5. Settings
      const allSettings = [...seedData.settings, ...commonData.settings];
      await this.seedSettings(tx, allSettings);
      this.logger.log(`Seeded ${allSettings.length} settings (tenant: ${slug})`);
    });

    this.logger.log(`Tenant seed complete: ${slug} (sector: ${sector})`);
  }

  private async seedCategories(
    tx: TenantTx,
    categories: SeedCategory[],
  ): Promise<Map<string, string>> {
    const map = new Map<string, string>();

    for (const cat of categories) {
      const created = await tx.category.upsert({
        where: { slug: cat.slug },
        create: {
          name: JSON.parse(JSON.stringify(cat.name)),
          slug: cat.slug,
          image: cat.image ?? null,
          sortOrder: cat.sortOrder,
        },
        update: {},
      });
      map.set(cat.slug, created.id);
    }

    return map;
  }

  private async seedProducts(
    tx: TenantTx,
    products: SeedProduct[],
    categoryMap: Map<string, string>,
  ): Promise<void> {
    for (const product of products) {
      const categoryId = categoryMap.get(product.categorySlug);
      if (!categoryId) {
        this.logger.warn(`Category slug "${product.categorySlug}" not found, creating product without category`);
      }

      await tx.product.upsert({
        where: { slug: product.slug },
        create: {
          name: JSON.parse(JSON.stringify(product.name)),
          slug: product.slug,
          description: JSON.parse(JSON.stringify(product.description)),
          price: product.price,
          compareAtPrice: product.compareAtPrice ?? null,
          sku: product.sku,
          stock: product.stock,
          images: JSON.parse(JSON.stringify(product.images)),
          categoryId: categoryId ?? null,
          status: 'active',
          seoMeta: product.seoMeta ? JSON.parse(JSON.stringify(product.seoMeta)) : null,
        },
        update: {},
      });
    }
  }

  private async seedPages(
    tx: TenantTx,
    pages: SeedPage[],
    branding: BrandingConfig,
  ): Promise<void> {
    for (const page of pages) {
      const content = this.applyBranding(page.content, branding);

      await tx.page.upsert({
        where: { slug: page.slug },
        create: {
          title: JSON.parse(JSON.stringify(page.title)),
          slug: page.slug,
          content: JSON.parse(JSON.stringify(content)),
          isPublished: true,
          seoMeta: page.seoMeta ? JSON.parse(JSON.stringify(page.seoMeta)) : null,
          template: 'default',
          sortOrder: 0,
        },
        update: {},
      });
    }
  }

  private async seedGlobalSections(
    tx: TenantTx,
    header: PageContent,
    footer: PageContent,
  ): Promise<void> {
    await tx.globalSection.upsert({
      where: { type: 'header' },
      create: { type: 'header', content: JSON.parse(JSON.stringify(header)) },
      update: {},
    });

    await tx.globalSection.upsert({
      where: { type: 'footer' },
      create: { type: 'footer', content: JSON.parse(JSON.stringify(footer)) },
      update: {},
    });
  }

  private async seedSettings(tx: any, settings: SeedSetting[]): Promise<void> {
    for (const setting of settings) {
      await tx.setting.upsert({
        where: { key: setting.key },
        create: {
          key: setting.key,
          value: JSON.parse(JSON.stringify(setting.value)),
          group: setting.group,
        },
        update: {},
      });
    }
  }

  private applyBranding(content: PageContent, branding: BrandingConfig): PageContent {
    const cloned: PageContent = JSON.parse(JSON.stringify(content));

    const walk = (blocks: PageContent['blocks']) => {
      for (const block of blocks) {
        if (block.type === 'hero' || block.type === 'banner') {
          if (!block.style) block.style = {};
          if (!block.style.backgroundColor) {
            block.style.backgroundColor = branding.primaryColor;
          }
        }
        if (block.children) walk(block.children);
      }
    };

    walk(cloned.blocks);
    return cloned;
  }
}
```

- [ ] **Step 2: Add @zunapro/themes dependency to API package.json**

Run: `pnpm add --filter=@zunapro/api "@zunapro/themes@workspace:*"`

- [ ] **Step 3: Verify API compiles**

Run: `pnpm --filter=@zunapro/api exec tsc --noEmit`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/modules/provisioning/tenant-seeder.service.ts apps/api/package.json pnpm-lock.yaml
git commit -m "feat: add TenantSeederService for provisioning seed data"
```

---

### Task 19: Integrate seeder into provisioning flow

**Files:**
- Modify: `apps/api/src/modules/provisioning/provisioning.service.ts`
- Modify: `apps/api/src/modules/provisioning/provisioning.module.ts` (if exists, else the module that registers ProvisioningService)

- [ ] **Step 1: Register TenantSeederService in the provisioning module**

Add `TenantSeederService` to the module's `providers` array.

- [ ] **Step 2: Inject TenantSeederService into ProvisioningService**

Add constructor parameter: `private readonly tenantSeeder: TenantSeederService`

- [ ] **Step 3: Update runDevProvisioning to call seeder**

In the `SeedInitialData` job step (after ConfigureTenant/schema push), replace the existing Go-equivalent seed logic with:

```typescript
// Inside the SeedInitialData job:
const tenant = await masterPrisma.tenant.findUnique({ where: { id: tenantId } });
const config = tenant.config as Record<string, unknown>;
const sector = (config.sector as string) || 'genel';
const theme = (config.theme as Record<string, string>) || {};

await this.tenantSeeder.seedTenant(slug, sector, {
  primaryColor: theme.primary || '#6366f1',
  secondaryColor: theme.secondary || '#475569',
  accentColor: theme.accent || '#f59e0b',
});
```

- [ ] **Step 4: Verify API compiles**

Run: `pnpm --filter=@zunapro/api exec tsc --noEmit`
Expected: No errors

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/modules/provisioning/
git commit -m "feat: integrate TenantSeederService into dev provisioning flow"
```

---

## Chunk 5: Storefront Homepage & i18n

### Task 20: Update storefront homepage — remove hardcoded fallback

**Files:**
- Modify: `apps/web/src/app/store/[locale]/page.tsx`

- [ ] **Step 1: Replace fallback with placeholder**

Remove the hardcoded `AnnouncementBar`, `HeroSection`, `CategoriesGrid`, `FeaturedProducts` fallback. Replace with:

```typescript
// If no page-builder home page exists
return (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
    <div className="rounded-2xl bg-slate-50 p-8">
      <h1 className="text-2xl font-bold text-slate-700">{t('storeSetup')}</h1>
      <p className="mt-2 text-slate-500">{t('storeSetupDescription')}</p>
    </div>
  </div>
);
```

Keep the page-builder rendering path (BlockRenderer) as-is.

- [ ] **Step 2: Commit**

```bash
git add apps/web/src/app/store/[locale]/page.tsx
git commit -m "feat: remove hardcoded homepage fallback, use page-builder only"
```

---

### Task 21: Add i18n keys for store setup placeholder

**Files:**
- Modify: `apps/web/messages/en.json`
- Modify: `apps/web/messages/tr.json`
- Modify: `apps/web/messages/de.json`
- Modify: `apps/web/messages/fr.json`
- Modify: `apps/web/messages/es.json`

- [ ] **Step 1: Add storefront.storeSetup and storefront.storeSetupDescription keys**

English:
```json
"storeSetup": "Store is being set up",
"storeSetupDescription": "Your store is being prepared. Please check back shortly."
```

Turkish:
```json
"storeSetup": "Magaza hazirlaniyor",
"storeSetupDescription": "Magazaniz hazirlaniyor. Lutfen kisa bir sure sonra tekrar kontrol edin."
```

German:
```json
"storeSetup": "Shop wird eingerichtet",
"storeSetupDescription": "Ihr Shop wird vorbereitet. Bitte schauen Sie in Kurze wieder vorbei."
```

French:
```json
"storeSetup": "Boutique en cours de configuration",
"storeSetupDescription": "Votre boutique est en cours de preparation. Veuillez revenir dans un instant."
```

Spanish:
```json
"storeSetup": "Tienda en preparacion",
"storeSetupDescription": "Su tienda se esta preparando. Por favor, vuelva a consultar en breve."
```

These go under the `"storefront"` namespace in each locale file.

- [ ] **Step 2: Commit**

```bash
git add apps/web/messages/
git commit -m "feat: add i18n keys for store setup placeholder in 5 languages"
```

---

## Chunk 6: Verification & Manual Test

### Task 22: Full compilation check

**Files:** None (verification only)

- [ ] **Step 1: Check all packages compile**

```bash
pnpm --filter=@zunapro/types exec tsc --noEmit
pnpm --filter=@zunapro/themes exec tsc --noEmit
pnpm --filter=@zunapro/api exec tsc --noEmit
pnpm --filter=@zunapro/web exec tsc --noEmit
```

Expected: All pass with zero errors.

- [ ] **Step 2: Test seed data for each sector loads**

Write a quick verification using tsx:

```bash
cd packages/themes && npx tsx -e "
  import { getSeedData, getCommonSeedData } from './src/seeds/index.ts';
  const sectors = ['genel','mobilya','teknoloji','giyim','kozmetik','gida','ev-yasam'];
  for (const s of sectors) {
    const d = getSeedData(s);
    console.log(s + ': ' + d.products.length + ' products, ' + d.pages.length + ' pages, ' + d.categories.length + ' categories');
  }
  const c = getCommonSeedData();
  console.log('common: ' + c.pages.length + ' pages, ' + c.settings.length + ' settings');
"
```

Expected: Each sector shows 6 products, 7 pages, 4-5 categories. Common shows 2 pages.

---

### Task 23: End-to-end test — create tenant with seeding

**Files:** None (manual test)

- [ ] **Step 1: Drop and recreate test tenant DB**

```bash
PGPASSWORD="zunapro_dev" psql -h localhost -U zunapro -d platform_master -c "DROP DATABASE IF EXISTS tenant_deneme12"
PGPASSWORD="zunapro_dev" psql -h localhost -U zunapro -d platform_master -c "CREATE DATABASE tenant_deneme12"
DATABASE_TENANT_URL="postgresql://zunapro:zunapro_dev@localhost:5432/tenant_deneme12" pnpm prisma db push --schema=packages/db/prisma/tenant.prisma --skip-generate
```

- [ ] **Step 2: Call seeder via API or trigger provisioning**

Either restart API and trigger provisioning for tenant `deneme12`, or add a temporary test endpoint.

- [ ] **Step 3: Verify seeded data via API**

```bash
# Check pages
curl -s -H "x-tenant-slug: deneme12" http://localhost:4000/storefront/pages/home | jq '.content.blocks | length'
# Should return block count > 0

# Check global sections
curl -s -H "x-tenant-slug: deneme12" http://localhost:4000/storefront/global-sections/header | jq '.blocks | length'
# Should return block count > 0

# Check products
curl -s -H "x-tenant-slug: deneme12" http://localhost:4000/storefront/products | jq '.data | length'
# Should return 6-8
```

- [ ] **Step 4: Verify homepage renders in browser**

Open `http://localhost:3000/store/tr` (with store routing for deneme12 tenant).
Expected: Full page-builder homepage with hero, products, categories, banner, newsletter.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete tenant seed data and homepage page builder integration"
```
