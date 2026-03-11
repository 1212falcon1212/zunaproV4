# 5. Wizard & Provisioning Otomasyonu

> Projenin en kritik bolumu. Wizard tamamlaninca otomatik site kurulumu.

## Wizard Adimlari (Frontend - apps/web)

| Adim | Baslik | Durum |
|------|--------|-------|
| 1 | Paket Secimi (Baslangic/Profesyonel/Kurumsal, fiyat, modul listesi) | TAMAM |
| 2 | Magaza Bilgileri (slug, sektor, iletisim, benzersizlik kontrolu) | TAMAM |
| 3 | Domain Ayari (subdomain veya ozel domain, DNS talimat) | TAMAM |
| 4 | Gorsel Kimlik (logo yukleme/AI olusturma, renk paleti, tema secimi) | TAMAM |
| 5 | Odeme (Stripe checkout, dev mode provisioning trigger) | TAMAM |
| 6 | Kurulum Ekrani (real-time progress bar, WebSocket ile canli guncelleme) | TAMAM |

## Provisioning Pipeline (Go Engine - services/provisioner)

| Job | Islem | Kod | Gercek Entegrasyon |
|-----|-------|-----|-------------------|
| 1 | CreateTenantDatabase (PostgreSQL DB + migration) | TAMAM | TAMAM |
| 2 | ConfigureTenant (master DB kayit, modul atama, tema config) | TAMAM | TAMAM |
| 3 | SetupDomain (Nginx config, SSL sertifika, DNS) | TAMAM | TAMAM |
| 4 | SeedInitialData (varsayilan kategoriler, ornek urunler, sayfalar) | TAMAM | TAMAM |
| 5 | ProcessBranding (logo boyutlandirma, renk paleti uygulama) | TAMAM | TAMAM |
| 6 | HealthCheck (DB + site erisilebilirlik + SSL kontrolu) | TAMAM | TAMAM |
| 7 | FinalizeAndNotify (status=active, e-posta, WebSocket sinyal) | TAMAM | TAMAM |

> Hedef Sure: 30-60 Saniye (DB + migration + seed Go ile cok hizli)

## Yapilanlar

- [x] Go provisioner cmd/main.go (entry point, graceful shutdown)
- [x] 7 job dosyasi olusturuldu (iskelet implementasyon)
- [x] Pipeline orchestrator (3 retry, exponential backoff: 1s, 5s, 15s)
- [x] NATS client (connect, subscribe, publish)
- [x] PostgreSQL client (CreateDatabase, DatabaseExists)
- [x] MinIO client (CreateBucket, Upload)
- [x] Nginx config template generator
- [x] NestJS provisioning WebSocket gateway (iskelet)
- [x] NestJS provisioning service (NATS publisher iskelet)
- [x] Wizard sayfasi placeholder (apps/web)

## Yapilacaklar

### Wizard UI — TAMAM (Hafta 7-8)
- [x] Paket secim ekrani (plan listesi API'den, fiyat kartlari)
- [x] Magaza bilgileri formu (slug validation, sektor dropdown, react-hook-form + Zod)
- [x] Domain ayar ekrani (subdomain/ozel domain secimi)
- [x] Gorsel kimlik ekrani (logo upload, renk picker, canli onizleme)
- [x] Odeme entegrasyonu (Stripe checkout, dev-mode provisioning trigger)
- [x] Kurulum progress ekrani (WebSocket baglantisi, adim adim animasyon)
- [x] Form state yonetimi (useReducer multi-step wizard state)
- [x] Plans API endpoint (GET /plans)
- [x] 5 dil ceviri (en, tr, de, fr, es — 70+ anahtar)
- [x] 7 yeni shadcn/ui component (Label, Select, Badge, Progress, RadioGroup, Separator, Tabs)

### Go Provisioner — TAMAM (Hafta 5-6)
- [x] NATS JetStream gercek subscribe (tenant.provision)
- [x] CreateDatabase: gercek PostgreSQL DB olusturma + go-migrate
- [x] ConfigureTenant: master DB'ye gercek kayit
- [x] SetupDomain: Nginx config yazma + subdomain/custom domain
- [x] SeedInitialData: sektore ozel varsayilan veri yukleme (6 sektor x 5 dil)
- [x] ProcessBranding: MinIO bucket + branding config
- [x] HealthCheck: DB + tablo sayisi + MinIO + master DB dogrulama
- [x] FinalizeAndNotify: status=active, NATS completion event
- [x] Migration dosyalari (tenant DB tablolari)

### Hata Yonetimi (Kalan)
- [x] 3 retry sonrasi provisioning_failed status (pipeline.go'da mevcut)
- [ ] Admin panelde basarisiz job alert
- [ ] Belirli job'i tekrar tetikleme (tum pipeline degil)
