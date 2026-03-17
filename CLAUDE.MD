# SaaS E-Ticaret Platformu — Hybrid Mimari

## Proje Nedir?
Ticimax/İdeSoft benzeri bir SaaS e-ticaret platformu. Kullanıcılar wizard ile dakikalar içinde kendi e-ticaret sitesini kurar. Multi-tenant, database-per-tenant mimarisi. Tek deploy ile 100+ tenant güncellenir. Site çok dilli olacak her zaman, öncelik ingilizce, almanca, fransızca, ispanyolca olacak. örnekdomain.com/tr tarzı subdomainler ile desteklenecek.

## 4 Ana Modül
1. **E-Ticaret** — Site kurulumu, ürün/sipariş, tema, WooCommerce benzeri plugin sistemi
2. **Finans** — E-fatura/e-arşiv otomasyon, gelir-gider, muhasebe raporları
3. **Pazaryeri** — Trendyol/Hepsiburada/N11 çift yönlü entegrasyon
4. **E-İhracat** — Peppol, çoklu döviz, yurt dışı 


## Monorepo Yapısı (Turborepo)
```
saas-platform/
├── CLAUDE.md                    ← BU DOSYA
├── apps/
│   ├── web/                     ← Next.js 15 — Kullanıcı paneli + storefront + landing
│   ├── admin/                   ← Next.js 15 — Super admin panel
│   └── api/                     ← NestJS — Tüm backend API
├── services/
│   └── provisioner/             ← Go — Provisioning engine, DB lifecycle, DNS/SSL
├── packages/
│   ├── ui/                      ← Paylaşımlı shadcn/ui component library
│   ├── db/                      ← Prisma schema + client (multi-tenant)
│   ├── config/                  ← Paylaşımlı TypeScript/ESLint/Tailwind config
│   ├── types/                   ← Paylaşımlı TypeScript tipleri, DTO'lar
│   └── themes/                  ← Sektörel tema paketleri (mobilya, teknoloji, giyim vb.)
├── docker-compose.yml
└── turbo.json
```

## Teknoloji Stack
| Katman | Teknoloji | Notlar |
|--------|-----------|--------|
| Frontend | Next.js 15, App Router, TypeScript | shadcn/ui + Tailwind, React Query, React Hook Form + Zod |
| Backend API | NestJS, TypeScript, Prisma | Bull Queue, Guard/Interceptor, Passport JWT |
| Provisioning | Go 1.22+ | go-migrate, goroutine pool, NATS client |
| DB | PostgreSQL 16 | Database-per-tenant, JSONB alanları |
| Cache | Redis 7 | Session, tenant config, rate limit, Bull queue backend |
| Queue | NATS JetStream | NestJS ↔ Go arası iletişim |
| Search | Meilisearch | Tenant izolasyonlu index |
| Storage | MinIO | S3 uyumlu, tenant bazlı bucket |
| Monitoring | Prometheus + Grafana | Tenant bazlı metrikler |

## Kritik Mimari Kurallar

### Multi-Tenant (ÖNEMLİ)
- Her tenant için AYRI PostgreSQL veritabanı (database-per-tenant). Tek DB + tenant_id YAPMA.
- Tenant resolution: domain/subdomain → Redis cache → Prisma dynamic connection.
- `packages/db/` içinde Prisma client tenant bazlı dinamik bağlantı kurar. Her request'te tenant context'i taşınır.
- Master DB (`platform_master`): tenants, plans, modules, payments, users tabloları.
- Tenant DB (`tenant_{slug}`): products, orders, customers, invoices, settings tabloları.

### Auth & Yetkilendirme
- JWT (access + refresh token). Token payload: `{ user_id, tenant_id, plan_id, role, active_modules[] }`.
- 3 katmanlı guard: AuthGuard → ModuleGuard → RoleGuard.
- Roller: owner, admin, editor, viewer, accountant.
- Paket bazlı modül erişimi: Başlangıç (Modül 1), Profesyonel (1+2), Kurumsal (1+2+3), Enterprise (hepsi).
- Panel sidebar ve sayfaları `active_modules` array'ine göre dinamik render edilir.

### Plugin Sistemi
- Her plugin bağımsız bir NestJS module + Next.js component paketidir.
- Plugin registry master DB'de tutulur. Tenant bazlı aktif/pasif `tenant_plugins` tablosunda.
- Plugin config JSONB olarak saklanır. Plugin güncellemesi = kod deploy = tüm tenantlar güncellenir.

### Provisioning (Go)
- NestJS ödeme onayında NATS'a `tenant.provision` mesajı gönderir.
- Go engine job chain çalıştırır: CreateDB → Configure → Domain/SSL → Seed → Branding → Health → Finalize.
- Her job bağımsız retry edilebilir. 3 retry sonrası `provisioning_failed` status.
- WebSocket ile frontend'e her adım real-time bildirilir.

## Komutlar
```bash
# Geliştirme
pnpm dev                    # Tüm apps paralel başlatır (turbo)
pnpm dev --filter=web       # Sadece Next.js web app
pnpm dev --filter=api       # Sadece NestJS API
cd services/provisioner && go run cmd/main.go  # Go provisioner

# Build & Test
pnpm build                  # Tüm apps build
pnpm lint                   # ESLint tüm packages
pnpm typecheck              # TypeScript tüm packages
pnpm test                   # Vitest (frontend) + Jest (NestJS)
cd services/provisioner && go test ./...       # Go testleri

# DB
pnpm db:generate            # Prisma client generate
pnpm db:push                # Master DB schema push (dev)
pnpm db:migrate             # Master DB migration (prod)
pnpm db:studio              # Prisma Studio

# Docker
docker compose up -d        # PostgreSQL, Redis, NATS, MinIO, Meilisearch
docker compose down
```

## Kod Stili & Kurallar
- TypeScript strict mode ZORUNLU. `any` tipi YASAK — `unknown` kullan sonra type guard yap.
- ES modules (import/export), CommonJS (require) KULLANMA.
- NestJS'te her modül kendi dizininde: `modules/{module-name}/{controller,service,module,dto,entity}.ts`
- Next.js'te App Router, server components varsayılan. `"use client"` sadece interaktif componentlerde.
- Tailwind class sıralaması: layout → spacing → sizing → typography → colors → effects.
- Dosya adlandırma: kebab-case (`tenant-resolver.middleware.ts`). React componentleri PascalCase (`ProductCard.tsx`).
- Git commit: conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`). Türkçe commit mesajı YAZMA.
- Her PR için: lint ✓, typecheck ✓, ilgili testler ✓.
- Yeni endpoint eklediğinde DTO + Zod validation ZORUNLU.
- Go tarafında: `golangci-lint`, error wrapping (`fmt.Errorf("...: %w", err)`), context propagation.

## Yapma / Yap
- ❌ `console.log` bırakma → ✅ NestJS Logger veya custom logger kullan
- ❌ Tenant verisi hardcode → ✅ Her zaman request context'ten al
- ❌ Raw SQL query → ✅ Prisma ORM kullan (Go tarafı hariç)- ❌ `npm` veya `yarn` → ✅ `pnpm` (monorepo workspace)
- ❌ CSS-in-JS veya styled-components → ✅ Tailwind CSS + shadcn/ui

## Referans Dosyalar
- Proje detay dokümanı: `docs/architecture.pdf`
- DB şeması: `packages/db/schema.prisma` (master) + `packages/db/tenant.prisma` (tenant)
- API route yapısı: `apps/api/src/modules/`
- Tema yapısı: `packages/themes/`
- Go provisioner: `services/provisioner/`


Her adımda ve fazda task oluşturmak zorunludur. 