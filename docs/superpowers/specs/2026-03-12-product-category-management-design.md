# Alt Proje 1: Ürün & Kategori Yönetimi — Design Spec

## Goal

Tenant sahiplerinin ürün ve kategorilerini yönetebileceği tam CRUD API + panel UI + Meilisearch arama entegrasyonu.

## Architecture

Tenant DB'de zaten `products`, `categories`, `media` tabloları mevcut (tenant.prisma). Bu spec:
1. NestJS API modülleri (products, categories, media/upload, search)
2. Tenant panel UI (apps/web içinde `/[locale]/panel/...` route'ları)
3. Meilisearch tenant-izolasyonlu arama

Tüm API endpoint'leri tenant context gerektirir (TenantResolverMiddleware). Panel sayfaları JWT auth + ModuleGuard ile korunur.

## Tech Stack

- NestJS (API modules, DTOs with class-validator + Zod)
- Prisma (tenant DB client — getTenantClient)
- MinIO (görsel upload — S3 uyumlu)
- Meilisearch (full-text search, faceted filtering)
- Next.js 15 App Router (panel UI — apps/web)
- React Hook Form + Zod (form validation)
- shadcn/ui (UI components)

---

## API Modules

### 1. Products Module (`apps/api/src/modules/products/`)

**Endpoints:**
| Method | Path | Description |
|--------|------|-------------|
| GET | /products | List (paginated, filterable by status/category/search) |
| GET | /products/:id | Get single product |
| POST | /products | Create product |
| PATCH | /products/:id | Update product |
| DELETE | /products/:id | Soft delete (status→archived) |
| POST | /products/bulk-import | CSV/JSON bulk import |
| GET | /products/export | CSV export |

**Product DTO:**
- name (Json — multi-language), slug (auto-generated from name), description (Json)
- price (Decimal), compareAtPrice (optional Decimal), sku (optional)
- stock (Int), categoryId (optional UUID)
- variants (JSONB array: `{name, sku, price, stock, attributes: {color, size, etc}}`)
- images (string[] — MinIO URLs), seoMeta (Json), status (draft/active/archived)

**Key Logic:**
- Slug auto-generation from default locale name, uniqueness check
- Stock validation (>= 0)
- Plan limit check: maxProducts from tenant's plan features
- On create/update/delete → Meilisearch index sync (async via event)

### 2. Categories Module (`apps/api/src/modules/categories/`)

**Endpoints:**
| Method | Path | Description |
|--------|------|-------------|
| GET | /categories | List all (tree structure) |
| GET | /categories/:id | Get single with children |
| POST | /categories | Create category |
| PATCH | /categories/:id | Update category |
| DELETE | /categories/:id | Delete (fail if has products) |
| PATCH | /categories/reorder | Bulk reorder (sort_order update) |

**Category DTO:**
- name (Json — multi-language), slug (auto from name), image (optional URL)
- parentId (optional UUID — for hierarchy), sortOrder (Int)
- seoMeta (Json)

**Key Logic:**
- Max depth: 3 levels (parent → child → grandchild)
- Delete guard: cannot delete category with associated products
- Tree response: nested children array

### 3. Media/Upload Module (`apps/api/src/modules/media/`)

**Endpoints:**
| Method | Path | Description |
|--------|------|-------------|
| POST | /media/upload | Upload single file to MinIO |
| POST | /media/upload-multiple | Upload multiple files |
| GET | /media | List media (paginated) |
| DELETE | /media/:id | Delete from MinIO + DB |

**Key Logic:**
- Tenant-isolated bucket: `tenant-{slug}`
- File validation: max 5MB, allowed types (jpeg, png, webp, gif, svg)
- Auto thumbnail generation (optional — resize to 200x200)
- Returns MinIO URL after upload
- Plan limit check: maxStorage from plan features

### 4. Search Module (`apps/api/src/modules/search/`)

**Endpoints:**
| Method | Path | Description |
|--------|------|-------------|
| GET | /search?q=...&category=...&minPrice=...&maxPrice=... | Search products |
| POST | /search/reindex | Force reindex all products |

**Key Logic:**
- Meilisearch index per tenant: `tenant_{slug}_products`
- Index fields: name (all locales), description, category name, sku, price, status
- Filterable attributes: categoryId, status, price
- Sortable attributes: price, createdAt, name
- Auto-sync: on product create/update/delete, update Meilisearch index
- Typo tolerance enabled by default

---

## Panel UI (apps/web)

### Route Structure

```
apps/web/src/app/[locale]/panel/
├── layout.tsx          ← Panel layout (sidebar + topbar, auth check)
├── page.tsx            ← Panel dashboard (redirect to /products for now)
├── products/
│   ├── page.tsx        ← Product list (table, search, filters, status tabs)
│   ├── new/page.tsx    ← Create product form
│   └── [id]/page.tsx   ← Edit product form
├── categories/
│   ├── page.tsx        ← Category list (tree view)
│   └── [id]/page.tsx   ← Edit category
└── media/
    └── page.tsx        ← Media library (grid view, upload)
```

### Panel Layout
- Left sidebar: Products, Categories, Media, Settings links
- Top bar: tenant name, locale switcher, user menu
- Auth: JWT token check, redirect to login if not authenticated
- Module guard: check `activeModules` includes 'products'

### Product List Page
- Table with columns: image thumbnail, name, price, stock, status, actions
- Status tabs: All / Active / Draft / Archived
- Search bar (Meilisearch powered)
- Bulk actions: delete, change status
- Pagination

### Product Form (Create/Edit)
- Multi-language tabs for name/description (based on tenant locales)
- Price + compare-at-price
- SKU + stock
- Category dropdown (hierarchical)
- Image upload (drag & drop, multiple, reorder)
- Variant builder (dynamic rows: name, sku, price, stock, attributes)
- SEO meta fields (title, description per locale)
- Status toggle (draft/active)
- Live preview card

### Category List
- Tree view with drag-drop reorder
- Inline add/edit
- Product count per category

### Media Library
- Grid view with thumbnails
- Drag & drop upload zone
- File info (size, type, dimensions)
- Copy URL action
- Delete with confirmation

---

## Meilisearch Strategy

- **Index naming:** `tenant_{slug}_products`
- **Index creation:** on first product create or via /search/reindex
- **Sync strategy:** synchronous update on product CRUD (simple for now, queue-based later)
- **Tenant isolation:** each tenant gets separate index, queries scoped to tenant
- **Search features:** typo tolerance, faceted filtering (category, price range), sortable (price, date)

---

## Data Flow

```
Panel UI → API (with JWT + tenant context) → Tenant Prisma Client → Tenant DB
                                           → MinIO (images)
                                           → Meilisearch (search index)
```

---

## Plan Limits Enforcement

- `maxProducts`: checked on product create, returns 403 if exceeded
- `maxStorage`: checked on media upload, returns 403 if exceeded
- Enforced at API level, shown as warning in panel UI
