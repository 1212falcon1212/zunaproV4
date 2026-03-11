# 2. Mimari Genel Bakis — Hybrid Model

> 3 katmanli hybrid mimari: Frontend (Next.js) + Application (NestJS) + Infrastructure (Go)

## Katmanlar

| Katman | Teknoloji | Durum |
|--------|-----------|-------|
| Frontend Layer | Next.js 15 (Wizard UI, Storefront, Admin Panel) | ISKELET HAZIR |
| Application Layer | NestJS (Multi-tenant API, Modul Sistemi, Odeme, CRUD) | ISKELET HAZIR |
| Infrastructure Layer | Go (Provisioning Engine, DB Yonetimi, DNS/SSL) | ISKELET HAZIR |
| Message Queue | NATS JetStream (NestJS <-> Go arasi iletisim) | YAPILANDIRILDI |

## Yapilanlar

- [x] Monorepo yapisi (apps/web, apps/admin, apps/api, services/provisioner)
- [x] Turborepo pipeline config (build, dev, lint, typecheck, test)
- [x] pnpm workspace tanimi (apps/*, packages/*, services/*)
- [x] Docker Compose (PostgreSQL, Redis, NATS, MinIO, Meilisearch)
- [x] GitHub Actions CI/CD pipeline
- [x] Paylasimli paketler (packages/config, packages/types, packages/ui, packages/db)
- [x] NestJS modular yapi (auth, tenants, payments, provisioning, health)
- [x] Go provisioner 7-job pipeline iskelet
- [x] Next.js web app i18n destegi (en, tr, de, fr, es)
- [x] Next.js admin app iskelet

## Yapilacaklar

- [ ] NATS JetStream entegrasyonu (NestJS publisher + Go subscriber) gercek baglanti
- [ ] WebSocket gateway gercek entegrasyon (provisioning progress)
- [ ] Katmanlar arasi end-to-end test
- [ ] PM2 cluster mode yapilandirmasi
- [ ] Health monitoring cross-layer
