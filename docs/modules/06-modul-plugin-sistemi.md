# 6. Modul & Plugin Sistemi

> Her ozellik bagimsiz bir modul. Paket bazli acilir/kapanir.

## Modul Kategorileri

| Kategori | Moduller | Erisim | Durum |
|----------|----------|--------|-------|
| Temel Moduller | Urun Yonetimi, Siparis Yonetimi, Musteri Yonetimi, Temel SEO, Kargo Entegrasyonu | Tum paketler | YAPILACAK |
| E-Ticaret Gelismis | Varyant Sistemi, Stok Takibi, Indirim/Kupon, Toplu Urun Import/Export | Profesyonel+ | YAPILACAK |
| Pazaryeri Entegr. | Trendyol, Hepsiburada, N11, Amazon TR | Kurumsal | YAPILACAK |
| Tasarim & Marka | AI Logo Olusturucu, Ozel Tema Editoru, Banner Tasarim Araci | Ek modul (ucretli) | YAPILACAK |
| Odeme Sistemleri | PayTR, iyzico, Stripe, Havale/EFT, Kapida Odeme | Temel: 1 gateway | ISKELET |
| Kargo Entegr. | Yurtici, Aras, MNG, Surat, HepsiJet, Sendeo | Temel: 2 kargo | YAPILACAK |
| SEO & Pazarlama | Gelismis SEO, Google Analytics, Meta Pixel, E-posta Pazarlama | Profesyonel+ | YAPILACAK |
| Raporlama | Satis Raporlari, Musteri Analitigi, Stok Raporlari, Dashboard | Profesyonel+ | YAPILACAK |

## Paket Yapisi

| Paket | Fiyat | Icerik | Limitler |
|-------|-------|--------|----------|
| Baslangic | 199 TL/ay | Temel moduller, 1 tema, 1 odeme, 2 kargo, subdomain | 500 urun, 5GB |
| Profesyonel | 499 TL/ay | Gelismis e-ticaret, SEO, raporlama, ozel domain | 5.000 urun, 25GB |
| Kurumsal | 999 TL/ay | Tum moduller, pazaryeri entegr., API erisimi | Sinirsiz urun, 100GB |

## Yapilanlar

- [x] Module tipi tanimlari (packages/types/src/module.ts)
- [x] Plan tipi tanimlari (packages/types/src/plan.ts)
- [x] Master DB'de modules + tenant_modules + plans tablolari
- [x] Seed data: 3 plan + 8 modul (ecommerce, finance, marketplace, export, seo, analytics, design, logistics)
- [x] ModuleGuard (@RequireModule decorator) — JWT payload'daki active_modules kontrolu
- [x] RoleGuard (@RequireRoles decorator) — Rol bazli erisim kontrolu
- [x] Tenant olusturmada otomatik modul atama (plan'a gore)

## Yapilacaklar

### Plugin Altyapisi
- [ ] NestJS plugin registry sistemi (dinamik modul yukleme)
- [ ] Plugin config JSONB kayit/okuma
- [ ] Plugin enable/disable API endpoint
- [ ] Frontend'de sidebar ve sayfalarin active_modules'e gore render edilmesi
- [ ] Plugin marketplace UI

### Urun Yonetimi Modulu (Faz 2 Hafta 1-3)
- [ ] Product CRUD (varyant, stok, gorsel, JSONB variants)
- [ ] Category CRUD (parent/child, sort_order)
- [ ] Meilisearch urun arama entegrasyonu
- [ ] Toplu urun import/export (CSV/Excel)
- [ ] Stok takip sistemi

### Siparis Yonetimi Modulu (Faz 2 Hafta 4-5)
- [ ] Order CRUD (siparis akisi, status gecisleri)
- [ ] Sepet (cart) sistemi
- [ ] Checkout akisi
- [ ] Odeme gateway entegrasyonu (PayTR/iyzico)

### Kargo Entegrasyonu (Faz 2 Hafta 6-7)
- [ ] Yurtici Kargo API entegrasyonu
- [ ] Aras Kargo API entegrasyonu
- [ ] Kargo takip sistemi
- [ ] Otomatik kargo fiyat hesaplama

### Musteri Yonetimi (Faz 2 Hafta 6-7)
- [ ] Customer CRUD
- [ ] Adres yonetimi
- [ ] Siparis gecmisi
- [ ] Musteri segmentasyonu
