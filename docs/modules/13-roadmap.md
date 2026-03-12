# 13. Roadmap & Fazlar

> 6 ana faz. Her faz sonunda calisan ve deploy edilebilir urun.
> 4 Ana Modul: E-Ticaret, Finans, Pazaryeri, E-Ihracat
> Toplam Tahmini Sure: 40-52 Hafta (10-13 Ay) — MVP 10 haftada calisir durumda.

---

## Faz 1 — MVP Altyapi (Hafta 1-10)

> Temel: Monorepo, multi-tenant, provisioning, wizard, admin iskelet

| Hafta | Kapsam | Detay | Durum |
|-------|--------|-------|-------|
| 1-2 | Proje Iskeleti | Monorepo (Turborepo + pnpm), NestJS + Next.js + Go iskelet, Docker Compose (PG, Redis, NATS, MinIO, Meilisearch), CI/CD, paylasimli paketler (config, types, ui, db) | TAMAM |
| 3-4 | Multi-Tenant Altyapi | Tenant resolver middleware (subdomain + custom domain), Redis cache (5dk TTL), JWT auth (access+refresh), Guard sistemi (Auth→Module→Role), tenant CRUD, rate limiting, CORS/Helmet/CSRF, seed data | TAMAM |
| 5-6 | Go Provisioning Engine | NATS JetStream gercek subscribe, CreateDB + go-migrate, ConfigureTenant (master DB kayit), SeedInitialData (sektore ozel), ProcessBranding (logo resize), HealthCheck, FinalizeAndNotify, migration dosyalari | TAMAM |
| 7-8 | Wizard UI | 6-adim wizard (plan secimi, magaza bilgileri, domain, gorsel kimlik, odeme, provisioning progress), react-hook-form + Zod, WebSocket canli progress, Stripe checkout, Plans API, 5 dil ceviri | TAMAM |
| 9-10 | Domain & Deployment | Wildcard DNS + SSL, custom domain (CNAME dogrulama, Let's Encrypt), Nginx otomasyon, admin panel dashboard temeli, production Dockerfile'lar, ilk VPS deployment | TAMAM |

### Faz 1 Ciktisi:
- Kullanici wizard ile site kurabiliyor
- Otomatik DB + subdomain + SSL
- Admin panelden tenant yonetimi
- Calisir MVP deploy edilmis

### Faz 1 Ilerleme:
- **Tamamlanan:** Hafta 1-10 (%100)
- **Siradaki:** Faz 2 — E-Ticaret Core (Hafta 11-20)

---

## Faz 2 — E-Ticaret Core (Hafta 11-20)

> Modul 1: E-Ticaret — Urun, siparis, odeme, kargo, musteri, tema
> 3 Alt Proje olarak yurutuluyor:

### Alt Proje 1: Urun & Kategori Yonetimi (Hafta 11-13)

| Hafta | Kapsam | Detay | Durum |
|-------|--------|-------|-------|
| 11-12 | Urun Yonetimi | Product CRUD (varyant, stok, gorsel, JSONB variants, SKU), Category CRUD (parent/child, sort_order, seo_meta), MinIO gorsel yukleme, bulk import/export (CSV/Excel) | YAPILACAK |
| 13 | Arama Sistemi | Meilisearch entegrasyonu, tenant izolasyonlu index, typo-tolerant arama, faceted search (fiyat araligi, kategori, marka), otomatik index sync | YAPILACAK |

### Alt Proje 2: Siparis & Odeme Akisi (Hafta 14-17)

| Hafta | Kapsam | Detay | Durum |
|-------|--------|-------|-------|
| 14-15 | Siparis & Odeme | Sepet (cart) sistemi, checkout akisi (adres, kargo secimi, odeme), siparis status akisi (pending→confirmed→shipped→delivered), PayTR entegrasyonu, iyzico entegrasyonu, Stripe entegrasyonu, fatura olusturma | YAPILACAK |
| 16-17 | Kargo & Musteri | Yurtici Kargo API, Aras Kargo API, MNG Kargo API, otomatik kargo fiyat hesaplama, kargo takip, musteri CRUD, adres yonetimi, siparis gecmisi, musteri segmentasyonu | YAPILACAK |

### Alt Proje 3: Storefront & Tema Sistemi (Hafta 18-20)

| Hafta | Kapsam | Detay | Durum |
|-------|--------|-------|-------|
| 18 | Storefront UI | Tenant storefront sayfalari (ana sayfa, kategori, urun detay, sepet, checkout), responsive tasarim, SEO meta tags, Open Graph | YAPILACAK |
| 19 | Tema Altyapisi | packages/themes/ base class, CSS custom properties (tenant config'den), Google Fonts, tema preview, renk/font/layout ozellestirme | YAPILACAK |
| 20 | Ilk 2 Tema | Mobilya temasi (oda navigasyonu, 3D goruntuleme, malzeme filtresi), Teknoloji temasi (ozellik tablosu, marka filtresi, benchmark) | YAPILACAK |

### Faz 2 Ciktisi:
- Tenant sahibi urun ekleyip satabilir
- Musteri siparis verebilir, odeme yapabilir
- Kargo entegrasyonu ile gonderim
- 2 sektorel tema hazir

---

## Faz 3 — Finans Modulu (Hafta 21-28)

> Modul 2: Finans — E-fatura, e-arsiv, gelir-gider, muhasebe raporlari

| Hafta | Kapsam | Detay | Durum |
|-------|--------|-------|-------|
| 21-22 | E-Fatura Altyapisi | GIB (Gelir Idaresi Baskanligi) entegrasyonu, e-fatura olusturma/gonderme, e-arsiv fatura, UBL-TR XML format, fatura sablonlari (A4 PDF cikti) | YAPILACAK |
| 23 | Fatura Otomasyonu | Siparis onayinda otomatik e-fatura/e-arsiv, iade faturasi, fatura numaralama serisi, fatura durumu takip (gonderildi/onaylandi/reddedildi) | YAPILACAK |
| 24-25 | Gelir-Gider Yonetimi | Gelir kaydi (satis, diger gelirler), gider kaydi (kategorili: kargo, reklam, malzeme, personel), banka hesaplari tanimi, otomatik banka eslestirme (CSV import), KDV hesaplama (%1, %10, %20) | YAPILACAK |
| 26 | Muhasebe Raporlari | Kar-zarar tablosu (aylik/yillik), KDV raporu (1-2 beyannamesine uygun), gelir-gider ozet, nakit akis raporu, vergi takvimi hatirlatmalari | YAPILACAK |
| 27 | Cari Hesap | Tedarikci/musteri cari hesap takibi, vade takibi, bakiye raporu, otomatik hatirlatma e-postalari, cari hesap mutabakati | YAPILACAK |
| 28 | Finans Dashboard | Aylik gelir grafigi, gider dagilimi (pasta grafik), kar trend'i, vadesi gelen odemeler widget'i, KDV ozeti, yillik karsilastirma | YAPILACAK |

### Faz 3 Ciktisi:
- E-fatura/e-arsiv otomatik kesilir
- Gelir-gider takibi yapilabilir
- Muhasebe raporlari cikarilir
- Cari hesap takibi

---

## Faz 4 — Pazaryeri Entegrasyonlari (Hafta 29-36)

> Modul 3: Pazaryeri — Trendyol, Hepsiburada, N11, Amazon TR cift yonlu entegrasyon

| Hafta | Kapsam | Detay | Durum |
|-------|--------|-------|-------|
| 29-30 | Trendyol Entegrasyonu | Trendyol Seller API, urun listeleme (kategori eslestirme, marka basvurusu), stok/fiyat senkronizasyonu (cift yonlu), siparis cekme + otomatik durum guncelleme, kargo entegrasyonu (Trendyol Express), komisyon hesaplama | YAPILACAK |
| 31-32 | Hepsiburada Entegrasyonu | Hepsiburada Merchant API, urun listeleme (listing + content API), stok/fiyat senkronizasyonu, siparis yonetimi, kargo bilgi gonderimi, iade/iptal yonetimi | YAPILACAK |
| 33 | N11 Entegrasyonu | N11 SOAP/REST API, urun listeleme, stok/fiyat sync, siparis cekme, kargo bilgi, iade yonetimi | YAPILACAK |
| 34 | Amazon TR Entegrasyonu | Amazon SP-API (Selling Partner), urun listeleme (ASIN eslestirme), stok/fiyat sync, FBA/FBM siparis, kargo entegrasyonu | YAPILACAK |
| 35 | Senkronizasyon Motoru | Merkezi stok yonetimi (tek stok → tum kanallar), fiyat kurallari (pazaryeri bazli kar marji), otomatik senkronizasyon (cron: 5dk stok, 15dk siparis), catisma cozumleme (hangi kanal oncelikli), queue-based islem (BullMQ) | YAPILACAK |
| 36 | Pazaryeri Dashboard | Kanal bazli satis raporu, komisyon analizi, en cok satan urunler (kanal bazli), stok uyari sistemi, siparis durumu ozet, entegrasyon sagligi (API hata oranlari) | YAPILACAK |

### Faz 4 Ciktisi:
- 4 pazaryerinden urun/siparis senkronizasyonu
- Merkezi stok yonetimi
- Pazaryeri bazli raporlar

---

## Faz 5 — E-Ihracat & Gelismis Ozellikler (Hafta 37-44)

> Modul 4: E-Ihracat — Peppol, coklu doviz, uluslararasi odeme/kargo

| Hafta | Kapsam | Detay | Durum |
|-------|--------|-------|-------|
| 37-38 | Coklu Doviz & Vergi | Multi-currency destegi (EUR, USD, GBP, vb.), canli doviz kuru entegrasyonu (TCMB/ECB API), doviz bazli fiyatlandirma (urun bazli veya otomatik cevrim), ulke bazli vergi hesaplama (VAT, GST), IOSS/OSS AB vergi uyumu | YAPILACAK |
| 39 | Peppol Entegrasyonu | Peppol e-fatura (UBL 2.1 format), Peppol Access Point baglantisi, otomatik ulke bazli fatura formati, cross-border fatura gonderimi, Peppol SMP/SML kayit | YAPILACAK |
| 40 | Uluslararasi Kargo | DHL Express API, FedEx API, UPS API, otomatik guvenli beyanname (ETGB), kargo maliyet hesaplama (ulke + agirlik + boyut), tracking entegrasyonu, iade yonetimi (uluslararasi) | YAPILACAK |
| 41 | Uluslararasi Odeme | Stripe (global), PayPal entegrasyonu, Wire transfer destegi, ulke bazli odeme yontemleri (iDEAL, SEPA, Klarna), PSD2/SCA uyumu (3D Secure) | YAPILACAK |
| 42 | SEO & Pazarlama | Gelismis SEO (hreflang, structured data, sitemap), Google Analytics 4, Meta Pixel, Google Merchant Center feed, e-posta pazarlama (Mailchimp/SendGrid), kupon/indirim sistemi, terk edilmis sepet hatirlatma | YAPILACAK |
| 43-44 | 4 Yeni Tema & AI | Giyim temasi (beden matrisi, model gorselleri), Kozmetik temasi (icerik listesi, cilt tipi), Gida temasi (alerjen, besin degeri), Ev&Yasam temasi (mekan filtreleme), AI logo olusturucu (DALL-E/Stable Diffusion API) | YAPILACAK |

### Faz 5 Ciktisi:
- Yurt disi satis yapilabilir (multi-currency)
- Peppol e-fatura ile AB'ye fatura
- DHL/FedEx/UPS ile uluslararasi gonderim
- 6 sektorel tema toplam
- SEO & pazarlama araclari

---

## Faz 6 — Olceklendirme & Polish (Hafta 45-52)

> Production-ready: performans, guvenlik, monitoring, dokumantasyon

| Hafta | Kapsam | Detay | Durum |
|-------|--------|-------|-------|
| 45-46 | Performans | CDN entegrasyonu (CloudFlare/BunnyCDN), Redis cache stratejisi genisletme, Next.js ISR/SSG, gorsel optimizasyonu (WebP/AVIF), lazy loading, DB query optimizasyonu, load testing (k6 ile 1000 concurrent) | YAPILACAK |
| 47-48 | API & Webhook | Tenant bazli API key sistemi, REST API (rate limited, versioned), webhook sistemi (siparis, stok, odeme event'leri), API dokumantasyonu (Swagger/OpenAPI), SDK (JavaScript/PHP) | YAPILACAK |
| 49-50 | Admin Panel Gelismis | Tenant analytics dashboard (satis, trafik, urun performansi), gelismis raporlama (pivot tablolar, export), toplu operasyonlar UI (migration, e-posta, backup), sistem sagligi monitoring (Prometheus + Grafana) | YAPILACAK |
| 51-52 | Guvenlik & Recovery | Otomatik backup sistemi (tenant bazli + toplu, S3), disaster recovery plani, point-in-time recovery, penetration testing, KVKK/GDPR uyumluluk, audit log sistemi, 2FA (admin + tenant owner) | YAPILACAK |

### Faz 6 Ciktisi:
- Production-ready performans
- API erisimi + dokumantasyon
- Gelismis admin panel
- Backup & disaster recovery
- Guvenlik sertifikasyonu

---

## Modul — Faz Eslemesi

| Modul | Paket Erisimi | Faz | Hafta |
|-------|---------------|-----|-------|
| **E-Ticaret (Temel)** | Baslangic, Profesyonel, Kurumsal | Faz 2 | 11-20 |
| **E-Ticaret (Gelismis)** | Profesyonel, Kurumsal | Faz 2 | 11-20 |
| **Finans** | Profesyonel, Kurumsal | Faz 3 | 21-28 |
| **Pazaryeri** | Kurumsal | Faz 4 | 29-36 |
| **E-Ihracat** | Kurumsal (Enterprise ek modul) | Faz 5 | 37-44 |
| **SEO & Pazarlama** | Profesyonel, Kurumsal | Faz 5 | 42 |
| **Raporlama (Gelismis)** | Profesyonel, Kurumsal | Faz 5 | 42-44 |
| **Tasarim & Marka** | Ek modul (ucretli) | Faz 5 | 43-44 |

---

## Paket — Modul Matrisi

| Ozellik | Baslangic (199TL) | Profesyonel (499TL) | Kurumsal (999TL) |
|---------|-------------------|---------------------|-------------------|
| Urun Yonetimi | 500 urun | 5.000 urun | Sinirsiz |
| Siparis & Sepet | ✓ | ✓ | ✓ |
| Odeme Gateway | 1 gateway | Sinirsiz | Sinirsiz |
| Kargo Entegr. | 2 kargo | Sinirsiz | Sinirsiz |
| Depolama | 5GB | 25GB | 100GB |
| Tema | 1 tema | Tum temalar | Tum temalar |
| Domain | Subdomain | Ozel domain | Ozel domain |
| Varyant/Stok Takibi | - | ✓ | ✓ |
| Indirim/Kupon | - | ✓ | ✓ |
| SEO & Analytics | Temel | Gelismis | Gelismis |
| E-Fatura/E-Arsiv | - | ✓ | ✓ |
| Gelir-Gider Takip | - | ✓ | ✓ |
| Muhasebe Raporlari | - | ✓ | ✓ |
| Pazaryeri Entegr. | - | - | ✓ (4 pazaryeri) |
| E-Ihracat | - | - | Ek modul |
| Raporlama | Temel | Gelismis | Gelismis + Pivot |
| API Erisimi | - | - | ✓ |
| Oncelikli Destek | - | - | ✓ |

---

## Genel Ilerleme

```
Faz 1 — MVP Altyapi:         [==================] %100 (Hafta 1-10 tamam)
Faz 2 — E-Ticaret Core:      [------------------] %0
Faz 3 — Finans:               [------------------] %0
Faz 4 — Pazaryeri:            [------------------] %0
Faz 5 — E-Ihracat & Gelismis: [------------------] %0
Faz 6 — Olceklendirme:       [------------------] %0

Toplam: [====--------------] ~%17
```

---

## Kritik Yol (Critical Path)

```
Faz 1 Hafta 5-6  →  Go Provisioning (site kurulabilmesi icin SART)
         ↓
Faz 1 Hafta 7-8  →  Wizard UI (kullanicinin site kurmasi icin SART)
         ↓
Faz 1 Hafta 9-10 →  Domain + Deploy (canli ortam icin SART)
         ↓
Faz 2 Hafta 11-15 → Urun + Siparis + Odeme (satis yapilabilmesi icin SART)
         ↓
Faz 2 Hafta 16-17 → Kargo (gonderim icin SART)
         ↓
MVP KULLANIMA HAZIR (Hafta 17 sonunda minimum viable product)
         ↓
Faz 3-6 paralel gelistirilebilir (bagimsiz moduller)
```
