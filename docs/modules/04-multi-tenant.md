# 4. Multi-Tenant Mimari Detaylari

> Database-per-Tenant stratejisi. Her musterinin verisi tamamen izole.

## Tenant Resolution Akisi

| Adim | Islem | Durum |
|------|-------|-------|
| 1 | Domain Analizi (subdomain'den tenant slug cikarilir) | TAMAM |
| 2 | Ozel Domain Kontrolu (custom_domains tablosundan tenant_id bulunur) | TAMAM |
| 3 | Tenant Dogrulama (Redis cache'den tenant config cekilir, 5dk TTL) | TAMAM |
| 4 | DB Baglantisi (Prisma ile tenant'a ozel DB'ye baglanir) | TAMAM |
| 5 | Request Context (Tenant bilgisi request context'e eklenir) | TAMAM |

## Yapilanlar

- [x] TenantResolverMiddleware (subdomain + custom domain destegi)
- [x] Redis cache ile tenant config (5dk TTL)
- [x] Tenant status kontrolleri (suspended=403, payment_overdue=402, provisioning=503)
- [x] Cache invalidation servisi (tenant, custom domain, all)
- [x] Prisma dynamic tenant client factory (connection pool + 60s idle timeout)
- [x] Master DB Prisma schema (tenants, plans, modules, users, payments, provisioning_logs, custom_domains)
- [x] Tenant DB Prisma schema (products, categories, orders, customers, pages, settings, media)
- [x] Seed data: 3 plan (Baslangic/Profesyonel/Kurumsal) + 8 modul
- [x] Tenant CRUD API endpoints (paginated list, create, update, suspend)
- [x] Slug benzersizlik kontrolu

## Yapilacaklar

- [ ] Tenant DB otomatik olusturma (Go provisioner uzerinden)
- [ ] Tenant DB migration sistemi (go-migrate)
- [ ] Connection pool monitoring ve metrikleri
- [ ] Tenant veri export/import
- [ ] Tenant silme (DB drop + cleanup)
- [ ] Tenant baglantisi icin connection string sifreleme
