# 5. Wizard & Provisioning Otomasyonu

> Projenin en kritik bolumu. Wizard tamamlaninca otomatik site kurulumu.

## Wizard Adimlari (Frontend - apps/web)

| Adim | Baslik | Durum |
|------|--------|-------|
| 1 | Paket Secimi (Baslangic/Profesyonel/Kurumsal, fiyat, modul listesi) | YAPILACAK |
| 2 | Magaza Bilgileri (slug, sektor, iletisim, benzersizlik kontrolu) | YAPILACAK |
| 3 | Domain Ayari (subdomain veya ozel domain, DNS talimat) | YAPILACAK |
| 4 | Gorsel Kimlik (logo yukleme/AI olusturma, renk paleti, tema secimi) | YAPILACAK |
| 5 | Odeme (PayTR/iyzico, odeme onayi provisioning'i tetikler) | YAPILACAK |
| 6 | Kurulum Ekrani (real-time progress bar, WebSocket ile canli guncelleme) | YAPILACAK |

## Provisioning Pipeline (Go Engine - services/provisioner)

| Job | Islem | Kod | Gercek Entegrasyon |
|-----|-------|-----|-------------------|
| 1 | CreateTenantDatabase (PostgreSQL DB + migration) | TAMAM | YAPILACAK |
| 2 | ConfigureTenant (master DB kayit, modul atama, tema config) | TAMAM | YAPILACAK |
| 3 | SetupDomain (Nginx config, SSL sertifika, DNS) | TAMAM | YAPILACAK |
| 4 | SeedInitialData (varsayilan kategoriler, ornek urunler, sayfalar) | TAMAM | YAPILACAK |
| 5 | ProcessBranding (logo boyutlandirma, renk paleti uygulama) | TAMAM | YAPILACAK |
| 6 | HealthCheck (DB + site erisilebilirlik + SSL kontrolu) | TAMAM | YAPILACAK |
| 7 | FinalizeAndNotify (status=active, e-posta, WebSocket sinyal) | TAMAM | YAPILACAK |

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

### Wizard UI (Oncelikli - Faz 1 Hafta 7-8)
- [ ] Paket secim ekrani (plan listesi API'den, fiyat kartlari)
- [ ] Magaza bilgileri formu (slug validation, sektor dropdown)
- [ ] Domain ayar ekrani (subdomain/ozel domain secimi)
- [ ] Gorsel kimlik ekrani (logo upload, renk picker, tema preview)
- [ ] Odeme entegrasyonu (PayTR/iyzico form)
- [ ] Kurulum progress ekrani (WebSocket baglantisi, adim adim animasyon)
- [ ] Form state yonetimi (multi-step wizard state)

### Go Provisioner (Oncelikli - Faz 1 Hafta 5-6)
- [ ] NATS JetStream gercek subscribe (tenant.provision)
- [ ] CreateDatabase: gercek PostgreSQL DB olusturma + go-migrate
- [ ] ConfigureTenant: master DB'ye gercek kayit
- [ ] SetupDomain: Nginx config yazma + certbot/acme.sh SSL
- [ ] SeedInitialData: sektore ozel varsayilan veri yukleme
- [ ] ProcessBranding: Sharp/ImageMagick ile logo boyutlandirma
- [ ] HealthCheck: HTTP + DB + SSL gercek kontrol
- [ ] FinalizeAndNotify: e-posta gonderim entegrasyonu
- [ ] Migration dosyalari (tenant DB tablolari)

### Hata Yonetimi
- [ ] 3 retry sonrasi provisioning_failed status
- [ ] Admin panelde basarisiz job alert
- [ ] Belirli job'i tekrar tetikleme (tum pipeline degil)
