# Tenant Seed Data & Homepage Page Builder — Design Spec

**Date:** 2026-03-16
**Status:** Approved
**Scope:** Default page/product seeding during provisioning + homepage via page builder

---

## Problem

When a tenant is created, the storefront is empty — no pages, no products, no header/footer. The homepage falls back to hardcoded React components. Users expect a fully functional, professional-looking store out of the box that they can customize.

## Goals

1. Every new tenant gets a complete, sector-specific e-commerce site on provisioning
2. Homepage is managed entirely through the page builder (no hardcoded fallback)
3. All seeded content (pages, products, header, footer) is editable and deletable by the user
4. Content is available in 5 languages: en, tr, de, fr, es

---

## Architecture

### Seed Data Location

All seed data lives in `packages/themes/src/seeds/`:

```
packages/themes/src/seeds/
├── index.ts              ← getSeedData(sector), getCommonSeedData()
├── types.ts              ← SectorSeedData, SeedProduct, SeedPage interfaces
├── common.ts             ← Shared pages (privacy, terms), header/footer skeleton
├── genel.ts              ← Default/generic sector (fallback)
├── mobilya.ts
├── teknoloji.ts
├── giyim.ts
├── kozmetik.ts
├── gida.ts
└── ev-yasam.ts
```

Export path added to `packages/themes/package.json`: `"./seeds"`

### Sector Alignment

The existing `ThemeSector` type defines: `'genel' | 'mobilya' | 'teknoloji' | 'giyim' | 'gida' | 'kozmetik'`.

Changes needed:
- Add `'ev-yasam'` to `ThemeSector` union type
- Create `genel.ts` seed file as the default fallback (used when sector is unknown or generic)
- `getSeedData(sector)` falls back to `genel` if sector not found

### Data Interfaces

```typescript
interface SectorSeedData {
  products: SeedProduct[];
  pages: SeedPage[];
  header: PageContent;
  footer: PageContent;
  settings: SeedSetting[];
}

interface SeedProduct {
  name: Record<string, string>;        // 5 languages
  description: Record<string, string>;
  slug: string;                        // URL-safe slug (from English name)
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  images: string[];                    // Unsplash source URLs with ?w=800 dimensions
  categorySlug: string;                // Resolved to categoryId during seeding
  status: 'active';                    // Always active so products appear on storefront
  seoMeta?: Record<string, string>;    // Locale-keyed meta descriptions
}

interface SeedPage {
  title: Record<string, string>;
  slug: string;
  content: PageContent;                // { version: 1, blocks: Block[] } — NOT locale-keyed HTML
  isPublished: true;
  seoMeta: Record<string, string>;     // Locale-keyed meta descriptions
}

type SeedSettingValue = string | number | boolean | string[] | Record<string, string>;

interface SeedSetting {
  key: string;
  value: SeedSettingValue;
  group: string;
}
```

### Unsplash Image Strategy

All product images use Unsplash source URLs with explicit dimensions:
`https://images.unsplash.com/photo-{id}?w=800&h=600&fit=crop`

This avoids serving massive images and provides stable URLs. Acknowledged as technical debt — a follow-up phase should download images to MinIO during provisioning for full self-hosting.

---

## New Block Types

Two new block types added to the existing 19:

### `product-listing`

Full product listing page with filtering and pagination. **Client component** (`'use client'`) since it handles interactive filters and pagination.

Fetches data from existing `GET /storefront/products` endpoint (no new API needed).

```typescript
Props:
  title: Record<string, string>        // { en: "All Products", tr: "Tum Urunler" }
  columns: 3 | 4                       // Grid columns
  productsPerPage: 12 | 24 | 48        // Items per page
  showFilters: boolean                  // Category, price range, sort
  showSearch: boolean                   // Search bar within listing
```

### `category-listing`

All categories displayed as a grid with product counts. **Client component** for interactivity.

Fetches data from existing `GET /storefront/categories` endpoint (no new API needed).

```typescript
Props:
  title: Record<string, string>        // { en: "Categories", tr: "Kategoriler" }
  columns: 3 | 4
  showProductCount: boolean
  layout: "grid" | "list"
```

### Integration Points

- **Types:** Add `'product-listing' | 'category-listing'` to `BlockType` union in `packages/types/src/page-builder.ts`
- **Storefront:** New `'use client'` components in `apps/web/src/app/store/[locale]/_components/blocks/`
- **Editor:** Add to block sidebar catalog (Commerce group), block preview, block settings panel
- **Default props:** Add to `getDefaultPropsForType()` in editor canvas
- **Block renderer:** Add mapping in `BLOCK_COMPONENTS` record

---

## Seeded Pages (9 per tenant)

| Slug | Description | Key Blocks |
|------|-------------|------------|
| `home` | Homepage | hero, product-showcase, category-showcase, banner, newsletter |
| `about` | About us | hero, text, columns (values) |
| `contact` | Contact | hero, columns (info + hours) |
| `faq` | FAQ | hero, accordion (sector-specific questions) |
| `shop` | Shop / store | hero (small), product-listing (filters + pagination) |
| `categories` | All categories | hero (small), category-listing (grid) |
| `products` | All products | hero (small), product-listing (no filters variant) |
| `privacy` | Privacy policy | text (legal content) — from common.ts |
| `terms` | Terms of service | text (legal content) — from common.ts |

All pages are `isPublished: true` by default. Page `content` field stores `PageContent` format (`{ version: 1, blocks: Block[] }`), NOT locale-keyed HTML. The outdated comment in `tenant.prisma` will be updated.

### Global Sections

**Header blocks:** logo, navigation-menu, search-bar, cart-icon
**Footer blocks:** columns (links + contact), social-links, newsletter, text (copyright)

---

## Seeded Products (6-8 per sector)

Each sector gets products with:
- Multi-language name and description (5 languages)
- URL-safe slug (derived from English name)
- `status: 'active'` (visible on storefront immediately)
- Realistic price for the sector
- Real Unsplash stock photos with `?w=800&h=600&fit=crop`
- Linked to seeded categories via `categorySlug` → resolved to `categoryId` at seed time
- SKU, stock (50-200 range)
- SEO meta (locale-keyed descriptions)

### Category slug resolution

During seeding, `seedCategories()` returns a `Map<slug, id>`. `seedProducts()` looks up each product's `categorySlug` in this map. If a slug is not found, the product is logged as a warning and created without a category (categoryId = null) rather than failing the entire seed.

### Example: Mobilya sector

| Product | Category | Price | Image Theme |
|---------|----------|-------|-------------|
| Modern Koltuk Takimi | koltuk-takimlari | 12500 | Living room sofa |
| Yemek Masasi | yemek-odalari | 8900 | Dining table |
| Kitaplik | calisma-odalari | 3200 | Bookshelf |
| Yatak Basi | yatak-odalari | 2800 | Bed headboard |
| Sehpa | koltuk-takimlari | 1500 | Coffee table |
| TV Unitesi | tv-uniteleri | 4200 | TV stand |

Similar product sets for: teknoloji, giyim, kozmetik, gida, ev-yasam, genel.

---

## Provisioning Integration

### TenantSeederService

New NestJS service in `apps/api/src/modules/provisioning/`:

```typescript
@Injectable()
class TenantSeederService {
  async seedTenant(
    slug: string,
    sector: string,
    config: { primaryColor: string; secondaryColor: string; accentColor: string }
  ): Promise<void> {
    const prisma = getTenantClient(slug);
    const seedData = getSeedData(sector);  // Falls back to 'genel' if sector unknown
    const commonData = getCommonSeedData();

    // All operations wrapped in a transaction for atomicity
    await prisma.$transaction(async (tx) => {
      // 1. Seed categories (moved from Go seeder)
      const categoryMap = await this.seedCategories(tx, sector);

      // 2. Seed products with active status
      await this.seedProducts(tx, seedData.products, categoryMap);

      // 3. Seed pages (sector-specific + common)
      const allPages = [...seedData.pages, ...commonData.pages];
      await this.seedPages(tx, allPages);

      // 4. Seed header & footer GlobalSections
      await this.seedGlobalSections(tx, seedData.header, seedData.footer);

      // 5. Seed settings
      await this.seedSettings(tx, [...seedData.settings, ...commonData.settings], config);
    });
  }
}
```

### Transaction guarantee

All seed operations are wrapped in `prisma.$transaction()`. If any step fails, the entire seed rolls back, leaving the tenant DB empty rather than in a partial/broken state. The provisioning flow can then retry the seed step.

### Ordering guarantee

The tenant is NOT marked `active` in master DB until seeding completes successfully. In dev mode, `runDevProvisioning()` runs seed → then finalize (sets status active). This prevents storefront requests from hitting an empty DB and caching "not found" responses in Redis.

### Branding injection

Wizard-provided colors (primaryColor, secondaryColor, accentColor) are injected into the seed data's hero/banner block `style.backgroundColor` properties before insertion. The seeder deep-clones the seed data and applies the branding colors.

### Dev provisioning update

`ProvisioningService.runDevProvisioning()` updated to call `TenantSeederService.seedTenant()` after DB creation and schema push, replacing the Go-based category/page/settings seeding.

### Go provisioner (future)

Go `seed_data.go` remains but is not updated now. When the Go engine is production-ready, it will either:
- Call a NestJS HTTP endpoint to trigger seeding, or
- Implement equivalent seeding in Go reading from a shared JSON format

---

## Storefront Homepage Change

### Before
```
page.tsx → try /storefront/pages/home → fail → hardcoded HeroSection + CategoriesGrid + FeaturedProducts
```

### After
```
page.tsx → GET /storefront/pages/home → BlockRenderer(blocks)
         → if no page found → i18n "Store is being set up" placeholder
```

Hardcoded fallback components removed. Since provisioning seeds the `home` page, it will always exist for active tenants. The placeholder message is added to all 5 locale JSON files (en, tr, de, fr, es) via `next-intl`.

### Existing routes preserved

`/store/[locale]/products/` and `/store/[locale]/categories/` routes remain unchanged. The new page-builder pages (`/pages/shop`, `/pages/categories`, `/pages/products`) coexist. Legacy routes can be deprecated later.

---

## Schema Updates

- Update `tenant.prisma` Page model `content` field comment: change from locale-keyed HTML to `PageContent { version: 1, blocks: Block[] }`
- Add `'ev-yasam'` to `ThemeSector` union type in `packages/themes/src/types.ts`

---

## Scope Exclusions

- Go provisioner update (future phase)
- MinIO image upload (Unsplash URLs for now, tracked as tech debt)
- Server-side pagination API for product-listing (client-side for now)
- Removing legacy `/products`, `/categories` routes
- Product variant support in seed data

---

## Data Volume Per Tenant

| Data | Count |
|------|-------|
| Categories | 4-5 (existing Go seed, moved to TS) |
| Products | 6-8 (with Unsplash images, status: active) |
| Pages | 9 (all published, block tree format) |
| Header | 1 GlobalSection |
| Footer | 1 GlobalSection |
| Settings | 5-6 entries |
| Languages | 5 (en, tr, de, fr, es) |
| Sectors | 7 (genel, mobilya, teknoloji, giyim, kozmetik, gida, ev-yasam) |
