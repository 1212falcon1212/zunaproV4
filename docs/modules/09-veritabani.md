# 9. Veritabani Mimarisi

> Iki seviye veritabani: Master (platform_master) + Tenant (tenant_xxx) — database-per-tenant.

## Master Database (platform_master)

| Tablo | Onemli Alanlar | Durum |
|-------|---------------|-------|
| tenants | id, slug, name, domain, custom_domain, db_name, status, plan_id | TAMAM |
| plans | id, name, price, features (JSONB), product_limit, storage_limit | TAMAM |
| tenant_modules | tenant_id, module_id, is_active, config (JSONB) | TAMAM |
| modules | id, slug, name, category, description, is_premium | TAMAM |
| users | id, email, password, tenant_id, role, name | TAMAM |
| payments | id, tenant_id, plan_id, amount, provider, status, period_start/end | TAMAM |
| provisioning_logs | id, tenant_id, job_name, status, error_message, started_at, completed_at | TAMAM |
| custom_domains | id, tenant_id, domain, ssl_status, dns_verified, verified_at | TAMAM |

## Tenant Database (tenant_xxx)

| Tablo | Onemli Alanlar | Durum |
|-------|---------------|-------|
| products | id, name, slug, sku, price, compare_price, stock, category_id, images, variants (JSONB), seo_meta | TAMAM (schema) |
| categories | id, name, slug, parent_id, image, sort_order, seo_meta | TAMAM (schema) |
| orders | id, order_number, customer_id, status, total, shipping_address, billing_address, items | TAMAM (schema) |
| customers | id, name, email, phone, addresses, order_count, total_spent | TAMAM (schema) |
| pages | id, title, slug, content, template, is_published, seo_meta | TAMAM (schema) |
| settings | id, key, value (JSONB) — site genel ayarlari, logo, renk, odeme, kargo | TAMAM (schema) |
| media | id, filename, path, size, mime_type, alt_text — MinIO referanslari | TAMAM (schema) |

## Yapilanlar

- [x] Master Prisma schema (prisma/master.prisma) — 8 tablo, iliskiler, enum'lar
- [x] Tenant Prisma schema (prisma/tenant.prisma) — 7 tablo
- [x] Master Prisma client (singleton, global cache)
- [x] Tenant Prisma client factory (dinamik baglanti, connection pool, idle timeout)
- [x] Seed script (3 plan + 8 modul upsert)
- [x] `pnpm db:generate` komutu (her iki schema icin Prisma client generate)

## Yapilacaklar

### Veritabani Guncelleme (Migration)
- [ ] Go engine migration runner (go-migrate)
- [ ] Tum tenant DB'lerine paralel migration (goroutine pool, 10'ar batch)
- [ ] Migration progress tracking (provisioning_logs tablosu)
- [ ] Basarisiz tenant migration raporlama
- [ ] Rollback destegi (down migration)
- [ ] Admin panel'den migration tetikleme

### Performans
- [ ] Connection pool metrikleri
- [ ] Slow query monitoring
- [ ] Index optimizasyonu (tenant DB tablolari)
- [ ] JSONB alan sorgulama optimizasyonu

### Backup & Recovery
- [ ] Tenant bazli backup (pg_dump)
- [ ] Toplu backup sistemi
- [ ] Disaster recovery plani
- [ ] Point-in-time recovery
