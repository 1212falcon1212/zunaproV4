# 10. Guncelleme & Deployment Stratejisi

> Tek deploy ile 100+ tenant guncellenir. Zero-downtime deployment.

## Uygulama Guncellemesi (Kod)

| Ozellik | Aciklama | Durum |
|---------|----------|-------|
| Webhook-based Deploy | Git push → otomatik build → deploy | YAPILACAK |
| Zero-downtime | Blue-green veya rolling deployment | YAPILACAK |
| Tek deploy = tum tenant | NestJS + Next.js tek instance | MIMARI HAZIR |

## Veritabani Guncellemesi (Migration)

| Adim | Katman | Aciklama | Durum |
|------|--------|----------|-------|
| 1 | Admin Panel | Yeni migration dosyasi sisteme yuklenir | YAPILACAK |
| 2 | Go Engine | Tum aktif tenant listesi alinir | ISKELET |
| 3 | Paralel Execution | Goroutine pool ile tum tenant DB'lerine migration (10'ar batch) | YAPILACAK |
| 4 | Progress Tracking | Her tenant'in migration durumu provisioning_logs'a yazilir | YAPILACAK |
| 5 | Hata Yonetimi | Basarisiz tenant'lar raporlanir, digerleri etkilenmez | YAPILACAK |
| 6 | Rollback | Down migration ile geri alinabilir | YAPILACAK |

## Tema Guncellemesi

| Ozellik | Aciklama | Durum |
|---------|----------|-------|
| Kod deploy = tema update | Temalar Next.js build parcasi | MIMARI HAZIR |
| Tenant ozel ayarlar korunur | Renk/logo config'den okunur | TAMAM (schema) |

## Yapilanlar

- [x] GitHub Actions CI pipeline (lint, typecheck, test)
- [x] Turborepo build pipeline (apps arasi dependency)
- [x] Docker Compose development ortami
- [x] Go provisioner pipeline altyapisi (retry, progress tracking)

## Yapilacaklar

### CI/CD Pipeline (Faz 1 Hafta 9-10)
- [ ] Production Dockerfile'lar (web, admin, api)
- [ ] Docker build + push pipeline
- [ ] Webhook-based deploy trigger
- [ ] Blue-green deployment script
- [ ] Rollback mekanizmasi
- [ ] Environment-specific config (staging/production)

### Migration Sistemi
- [ ] Admin panel migration upload UI
- [ ] Go engine toplu migration runner
- [ ] Migration progress dashboard
- [ ] Otomatik rollback on failure

### Monitoring & Alerting
- [ ] Deploy basari/basarisizlik bildirimi
- [ ] Health check sonrasi otomatik rollback
- [ ] Deployment log kaydi
