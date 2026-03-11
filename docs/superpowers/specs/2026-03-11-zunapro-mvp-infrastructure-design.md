# ZunaPro Platform — Faz 1 MVP Infrastructure Design

## Context

ZunaPro is a SaaS e-commerce platform (similar to Ticimax/IdeSoft) where users create their own e-commerce site via a wizard in minutes. Multi-tenant, database-per-tenant architecture. Single deploy updates all tenants. Multilingual (EN, DE, FR, ES, TR).

## Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| i18n | next-intl | Best Next.js 15 App Router integration, URL-based locale (/en, /de) |
| Payment | Stripe + PayTR | Stripe for global, PayTR for Turkish local cards |
| Hosting | Own VPS | Docker Compose + PM2, scalable architecture |
| Git | GitHub | GitHub Actions CI/CD, MCP integration |
| AI Logo | Deferred to Phase 3 | MVP: upload only |
| Platform Name | ZunaPro | Brand and domain prefix |

## Architecture

### 3-Layer Hybrid Model

```
FRONTEND:        Next.js 15 (TypeScript) — Wizard UI, Storefront, Admin Panel
APPLICATION:     NestJS (TypeScript) — Multi-tenant API, Module System, Payments, CRUD
INFRASTRUCTURE:  Go 1.22+ — Provisioning Engine, DB Management, DNS/SSL, Health Monitor
```

Inter-layer communication: NATS JetStream message queue.

### Monorepo Structure (Turborepo + pnpm)

```
zunaproV4/
├── apps/
│   ├── web/                  ← Next.js 15 (Wizard + Storefront + User Panel)
│   ├── admin/                ← Next.js 15 (Super Admin Panel)
│   └── api/                  ← NestJS (Backend API)
├── services/
│   └── provisioner/          ← Go 1.22+ (Provisioning engine)
├── packages/
│   ├── ui/                   ← Shared shadcn/ui component library
│   ├── db/                   ← Prisma schema + dynamic tenant client
│   ├── config/               ← Shared TS/ESLint/Tailwind configs
│   ├── types/                ← Shared TypeScript types & DTOs
│   └── themes/               ← Sector-specific theme packages
├── docker/                   ← Dockerfiles
├── docker-compose.yml        ← PostgreSQL, Redis, NATS, MinIO, Meilisearch
├── turbo.json
├── pnpm-workspace.yaml
├── .env.example              ← All environment variables documented
└── .github/workflows/        ← CI/CD pipelines
```

### Multi-Tenant Strategy: Database-per-Tenant

- Master DB (`platform_master`): tenants, plans, modules, payments, users, provisioning_logs, custom_domains
- Tenant DB (`tenant_{slug}`): products, categories, orders, customers, pages, settings, media

**Tenant Resolution Flow:**
1. Extract subdomain from hostname OR lookup custom_domains table
2. Check Redis cache (key: `tenant:{domain}`, TTL: 5 minutes)
3. On cache miss: query master DB `tenants` table, populate Redis
4. Create/reuse Prisma client from connection pool (max 5 connections per tenant, idle timeout 60s)
5. Attach tenant context to request (`req.tenant = { id, slug, dbUrl, config }`)

**Cache Invalidation:** On tenant config update, delete Redis key `tenant:{domain}`. Next request repopulates.

### Auth & Authorization

- JWT access token (15min expiry) + refresh token (7d expiry, stored in httpOnly cookie)
- Token payload: `{ user_id, tenant_id, plan_id, role, active_modules[] }`
- 3-layer guards: AuthGuard → ModuleGuard → RoleGuard
- Roles: owner, admin, editor, viewer, accountant
- Refresh flow: POST /auth/refresh with httpOnly cookie → new access token

### MVP Module System

Modules available in MVP Phase 1:

| Module | Slug | Baslangic | Profesyonel | Kurumsal |
|--------|------|-----------|-------------|----------|
| Product Management | `products` | Yes | Yes | Yes |
| Order Management | `orders` | Yes | Yes | Yes |
| Customer Management | `customers` | Yes | Yes | Yes |
| Basic SEO | `seo-basic` | Yes | Yes | Yes |
| Store Settings | `settings` | Yes | Yes | Yes |
| Advanced SEO | `seo-advanced` | No | Yes | Yes |
| Reports & Analytics | `reports` | No | Yes | Yes |
| API Access | `api-access` | No | No | Yes |

Modules stored in master DB `modules` table. Tenant's active modules in `tenant_modules` with `is_active` flag. ModuleGuard checks `active_modules[]` from JWT before allowing access to module endpoints.

### Provisioning Pipeline (Go Engine — 7 Jobs)

Each job is independently retriable. Retry strategy: exponential backoff (1s, 5s, 15s). Per-job timeout: 60 seconds. Total pipeline deadline: 5 minutes. After 3 failures → tenant status = `provisioning_failed`, admin alert created.

**Partial failure handling:** Each job records its status in `provisioning_logs`. On retry of a failed pipeline, already-completed jobs are skipped (idempotent check via status).

1. **CreateTenantDatabase**
   - Create PostgreSQL database `tenant_{slug}`
   - Run all migrations via go-migrate (products, categories, orders, customers, pages, settings, media tables)
   - Verify connection

2. **ConfigureTenant**
   - Insert record into master `tenants` table (status: `provisioning`)
   - Write `tenant_modules` entries based on selected plan
   - Store theme config (sector, color palette, layout preferences) as JSONB

3. **SetupDomain**
   - Subdomain mode: no action needed (wildcard DNS *.zunapro.com already configured)
   - Custom domain mode:
     1. Verify CNAME: DNS lookup `{domain}` must return CNAME pointing to `proxy.zunapro.com`. Poll every 10s, timeout after 5 minutes → fail with "DNS not configured" message.
     2. Generate Nginx server block → write to `/etc/nginx/sites-enabled/{domain}.conf`
     3. Run certbot for Let's Encrypt SSL → nginx reload
   - Store domain + SSL status + dns_verified timestamp in `custom_domains` table

4. **SeedInitialData**
   - Insert sector-specific default categories (5-8 categories per sector)
   - Create default pages: Home, About Us, Contact, Terms of Service, Privacy Policy (with template content)
   - Insert default settings: currency, timezone, shipping defaults, payment config skeleton
   - No sample products in MVP (empty store, user adds own products)

5. **ProcessBranding**
   - Input: uploaded logo (accepted formats: PNG, JPG, SVG, max 5MB)
   - Generate variants: favicon (32x32 PNG), header logo (max 200x60 PNG), og:image (1200x630 PNG with logo centered on brand color background)
   - Upload all to MinIO bucket: `tenant-{slug}/branding/`
   - Apply color palette to tenant config: `{ primary: "#hex", secondary: "#hex", accent: "#hex", background: "#hex" }` stored as CSS custom properties format

6. **HealthCheck**
   - Verify tenant DB connection (simple SELECT 1)
   - Verify MinIO bucket accessible
   - Verify site responds on subdomain (HTTP 200)
   - If custom domain: verify SSL certificate valid

7. **FinalizeAndNotify**
   - Update tenant status to `active` in master DB
   - Send welcome email (store name, panel URL, login credentials)
   - Publish WebSocket event `{ type: "provisioning_complete", tenantId, panelUrl }`

**Progress WebSocket Protocol:**
- Go engine publishes to NATS subject `provisioning.progress.{tenant_id}`
- NestJS WebSocket gateway subscribes and forwards to connected client
- Message format: `{ jobName: string, status: "running" | "completed" | "failed", step: number, totalSteps: 7, message: string }`
- Client reconnection: on disconnect, client reconnects and requests current status via REST endpoint `GET /provisioning/{tenant_id}/status` (authenticated: requires valid session token from wizard flow, not public)

### Wizard Flow (6 Steps)

1. **Package Selection** — Display 3 plans with feature comparison. User selects plan.
2. **Store Info** — Form: store name, slug (auto-generated, editable, uniqueness check via API), sector dropdown (Mobilya/Teknoloji/Giyim/Kozmetik/Gida/Ev&Yasam), email, phone.
3. **Domain Setup** — Default: `{slug}.zunapro.com`. Optional: enter custom domain → show CNAME instructions.
4. **Visual Identity** — Logo upload (PNG/JPG/SVG, max 5MB) with preview. Color palette picker (primary, secondary, accent — defaults from sector). Sector theme auto-selected.
5. **Payment** — Gateway selection: Stripe (international cards) or PayTR (Turkish cards). Stripe: redirect to Checkout Session. PayTR: iframe embed. On success: webhook confirms → NATS message triggers provisioning.
6. **Setup Screen** — Real-time progress bar (7 steps). WebSocket connection shows each job status. On complete: "Your store is ready!" with link to panel.

### Payment Flow (Detailed)

**Stripe Flow:**
1. Frontend calls `POST /api/payments/create-checkout` with `{ planId, tenantSlug }`
2. NestJS creates Stripe Checkout Session (mode: subscription, success_url, cancel_url)
3. User completes payment on Stripe hosted page
4. Stripe webhook `checkout.session.completed` → NestJS handler:
   - Verify webhook signature
   - Create `payments` record in master DB (status: `active`)
   - Publish NATS message `tenant.provision` with full tenant config
5. Redirect user to wizard step 6 (setup screen)

**PayTR Flow:**
1. Frontend calls `POST /api/payments/paytr-token` with `{ planId, tenantSlug }`
2. NestJS generates PayTR iframe token (merchant_id, merchant_key, merchant_salt)
3. PayTR iframe rendered in wizard step 5
4. PayTR callback POST to `/api/payments/paytr-callback`:
   - Verify hash
   - Create `payments` record
   - Publish NATS `tenant.provision`
5. Frontend polls or WebSocket detects payment confirmed → auto-advance to step 6

**Subscription Lifecycle (MVP):**
- Stripe manages recurring billing automatically
- Webhook `invoice.payment_failed` → tenant status = `payment_overdue`, 7-day grace period
- Webhook `customer.subscription.deleted` → tenant status = `suspended` (site shows "subscription expired" page)
- PayTR: manual renewal reminders via email (no auto-recurring in MVP)

### i18n Strategy (next-intl)

- **Locale detection:** URL prefix is source of truth (`/en/wizard`, `/tr/wizard`). Default locale: `en`. Middleware redirects `/wizard` → `/en/wizard`.
- **Translation files:** JSON files in `apps/web/messages/{locale}.json` and `apps/admin/messages/{locale}.json`
- **MVP languages:** EN (primary), TR, DE, FR, ES — all wizard steps translated. Storefront translations are tenant-managed (Phase 2).
- **Backend:** NestJS responses are locale-aware for error messages and email templates. Locale passed via `Accept-Language` header.

### Security

- **CORS:** Whitelist `*.zunapro.com` + registered custom domains (loaded from Redis)
- **Rate Limiting:** Redis-based, per-IP: 100 req/min general, 10 req/min for auth endpoints
- **CSRF:** Double-submit cookie pattern for state-changing operations
- **Input Validation:** Zod schemas on frontend, class-validator DTOs on NestJS. All user input sanitized.
- **Helmet:** NestJS helmet middleware for security headers

### Database Credentials Strategy

All tenant databases share a single PostgreSQL superuser in MVP. Tenant isolation is at database level (separate DBs), not credential level. Connection string uses the template pattern with slug substitution. Credential rotation and per-tenant users deferred to Phase 4 (security hardening).

### Environment Variables

```env
# Database
DATABASE_MASTER_URL=postgresql://user:pass@localhost:5432/platform_master
DATABASE_TENANT_URL_TEMPLATE=postgresql://user:pass@localhost:5432/tenant_{slug}
# Note: same credentials for all tenant DBs in MVP. Isolation is DB-level.

# Redis
REDIS_URL=redis://localhost:6379

# NATS (token auth enabled — prevents unauthorized publish)
NATS_URL=nats://localhost:4222
NATS_AUTH_TOKEN=xxx

# Auth
JWT_ACCESS_SECRET=xxx
JWT_REFRESH_SECRET=xxx

# Stripe (use sk_test_/pk_test_ for dev, sk_live_/pk_live_ for prod)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# PayTR (test mode: PAYTR_TEST_MODE=1)
PAYTR_MERCHANT_ID=xxx
PAYTR_MERCHANT_KEY=xxx
PAYTR_MERCHANT_SALT=xxx
PAYTR_TEST_MODE=1

# MinIO
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=xxx
MINIO_SECRET_KEY=xxx

# Meilisearch
MEILISEARCH_URL=http://localhost:7700
MEILISEARCH_API_KEY=xxx

# App
APP_URL=https://zunapro.com
ADMIN_URL=https://admin.zunapro.com
```

### Infrastructure Services

| Service | Technology | Purpose |
|---------|-----------|---------|
| Database | PostgreSQL 16 | Multi-DB tenant, JSONB fields |
| Cache | Redis 7 | Tenant config (TTL 5min), session, rate limiting |
| Queue | NATS JetStream | NestJS ↔ Go async communication |
| Search | Meilisearch | Tenant-isolated search indexes |
| Storage | MinIO (S3) | Tenant-scoped buckets: `tenant-{slug}/` |
| Monitoring | Prometheus + Grafana | Tenant-level metrics, provisioning dashboard |
| WebSocket | NestJS Gateway | Wizard progress, real-time notifications |

## Phase 1 Scope (Sprints)

### Sprint 1-2: Project Skeleton
- Turborepo monorepo setup with pnpm workspaces
- Next.js 15 apps (web + admin) boilerplate with App Router
- NestJS API boilerplate with modular structure
- Go provisioner project skeleton
- Docker Compose for all infrastructure services
- Shared packages (ui, db, config, types)
- ESLint + Prettier + TypeScript strict configuration
- GitHub repository + CI pipeline (lint, typecheck, test)
- `.env.example` with all variables documented

### Sprint 3-4: Multi-Tenant Infrastructure
- Master DB Prisma schema (all master tables)
- Tenant DB Prisma schema (all tenant tables)
- NestJS tenant resolution middleware (subdomain → Redis → Prisma)
- Dynamic Prisma client per tenant (connection pool: max 5 per tenant, idle 60s)
- Redis-based tenant config caching (TTL 5min, invalidation on update)
- JWT auth (access 15min + refresh 7d httpOnly cookie)
- 3-layer guard system (Auth → Module → Role)
- Tenant CRUD API endpoints
- User registration/login/refresh endpoints
- Rate limiting middleware (Redis-based)
- CORS + Helmet + CSRF setup

### Sprint 5-6: Go Provisioning Engine
- 7-job pipeline implementation (all jobs idempotent)
- NATS JetStream integration (subscribe to `tenant.provision`)
- Retry mechanism (exponential backoff: 1s, 5s, 15s → failed status)
- Provisioning logs (per-job status in `provisioning_logs` table)
- Progress publishing to NATS `provisioning.progress.{tenant_id}`
- go-migrate for tenant DB migrations
- Goroutine pool (max 10 concurrent provisions)
- MinIO bucket creation and logo processing (Sharp-equivalent in Go)
- Nginx config generation for custom domains
- Let's Encrypt SSL via certbot CLI

### Sprint 7-8: Wizard UI & Payments
- 6-step wizard components (React Hook Form + Zod validation)
- Stripe Checkout Session integration (subscription mode)
- PayTR iframe integration with callback handling
- WebSocket client for real-time provisioning progress
- next-intl setup with 5 locales (EN, TR, DE, FR, ES)
- Translation JSON files for all wizard steps
- Responsive wizard design (mobile + desktop)
- Payment webhook handlers (Stripe + PayTR)

### Sprint 9-10: Domain, Admin & Deploy
- Wildcard subdomain configuration (Nginx + DNS)
- Custom domain flow (CNAME verification → Nginx → SSL)
- Admin panel: tenant list with status/plan/created_at
- Admin panel: provisioning logs viewer
- Admin panel: retry failed provisioning jobs
- Docker Compose production configuration
- GitHub Actions: build → test → deploy pipeline
- PM2 ecosystem file for NestJS
- First production deployment

## Package/Pricing Structure

| Package | Price | Modules | Limits |
|---------|-------|---------|--------|
| Baslangic | 199 TL/mo | products, orders, customers, seo-basic, settings | 500 products, 5GB storage |
| Profesyonel | 499 TL/mo | + seo-advanced, reports, custom domain | 5,000 products, 25GB storage |
| Kurumsal | 999 TL/mo | + api-access, priority support | Unlimited products, 100GB storage |

## Data Flow

```
User → Wizard (Next.js) → POST /api/payments/create-checkout → Stripe/PayTR
                                                                    ↓ webhook
                           NestJS webhook handler ← payment confirmed
                                 ↓
                           Create payments record (master DB)
                           Publish NATS "tenant.provision" { slug, plan, sector, config }
                                 ↓
                           Go Engine subscribes, runs 7-job chain
                                 ↓ each job completes
                           Publish NATS "provisioning.progress.{tenant_id}"
                                 ↓
                           NestJS WebSocket Gateway → forwards to client
                                 ↓
                           Wizard UI updates progress bar
                                 ↓ all jobs done
                           Tenant status = active
                           Site ready at {slug}.zunapro.com
```

**Failure handling:** If provisioning fails after payment, tenant status = `provisioning_failed`. Admin is alerted. Admin can retry specific failed jobs from admin panel. User sees "Setup in progress, we'll email you when ready" message.

## Success Criteria

- [ ] `pnpm dev` starts all apps (web on :3000, admin on :3001, api on :4000)
- [ ] `docker compose up` brings up PostgreSQL, Redis, NATS, MinIO, Meilisearch
- [ ] Complete wizard flow: select plan → fill info → pay (test mode) → site provisioned
- [ ] Provisioning completes within 60 seconds (single tenant, no custom domain)
- [ ] All 5 wizard steps display correctly in EN, TR, DE, FR, ES
- [ ] Admin panel lists tenants with status, allows retry of failed provisions
- [ ] Subdomain `test.zunapro.com` resolves to correct tenant storefront
- [ ] Custom domain with SSL auto-provisioned (tested with staging domain)
- [ ] TypeScript strict mode passes: `pnpm typecheck` with zero errors
- [ ] CI pipeline passes: lint + typecheck + unit tests on every push

## Verification Plan

1. **Unit tests:** NestJS services (tenant resolution, auth, payment webhooks), Go jobs (each pipeline step)
2. **Integration tests:** Full provisioning pipeline (NATS → Go → DB → WebSocket)
3. **E2E test:** Complete wizard flow in Playwright (select plan → payment test mode → verify site live)
4. **Manual verification:** Admin panel CRUD, custom domain SSL, multi-language toggle
