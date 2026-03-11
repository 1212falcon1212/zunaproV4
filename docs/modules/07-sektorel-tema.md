# 7. Sektorel Tema Altyapisi

> Her sektor icin optimize edilmis hazir temalar. Tema = gorsel + kategori yapisi + filtreler + sayfa sablonlari.

## Sektor Temalari

| Sektor | Ozel Ozellikler | Varsayilan Kategoriler | Durum |
|--------|-----------------|----------------------|-------|
| Mobilya | Oda bazli navigasyon, 3D urun goruntuleme, renk/malzeme filtreleri | Salon, Yatak Odasi, Mutfak, Ofis, Bahce | YAPILACAK |
| Teknoloji | Teknik ozellik karsilastirma tablosu, marka filtreleri, benchmark alanlari | Bilgisayar, Telefon, Aksesuar, Yazilim, Oyun | YAPILACAK |
| Giyim | Beden tablosu, renk/beden matrisi, model uzerinde goruntuleme | Kadin, Erkek, Cocuk, Ayakkabi, Aksesuar | YAPILACAK |
| Kozmetik | Icerik listesi alani, cilt tipi filtresi, kullanim talimati | Cilt Bakimi, Makyaj, Sac Bakimi, Parfum, Vucut | YAPILACAK |
| Gida | Alerjen bilgisi, besin degerleri tablosu, son kullanma takibi | Organik, Atistirmalik, Icecek, Baharatlik, Gurme | YAPILACAK |
| Ev & Yasam | Mekan bazli filtreleme, set/koleksiyon gruplari, hediye paketleme | Dekorasyon, Mutfak, Banyo, Bahce, Aydinlatma | YAPILACAK |

## Tema Ozellestirme Katmanlari

| Katman | Icerik | Durum |
|--------|--------|-------|
| 1. Renk Paleti | Primary, secondary, accent, background (CSS custom properties) | YAPILACAK |
| 2. Typography | Font ailesi, boyut skalasi, baslik stilleri, Google Fonts | YAPILACAK |
| 3. Layout | Header tipi (sticky/classic), sidebar pozisyonu, urun grid (2/3/4 kolon) | YAPILACAK |
| 4. Componentler | Urun karti tasarimi, buton stilleri, form elementleri, footer | YAPILACAK |
| 5. Sayfa Sablonlari | Ana sayfa blok duzeni, urun detay layout'u, kategori sayfasi tipi | YAPILACAK |

## Yapilanlar

- [x] packages/config/tailwind/base.ts — Brand renk paleti tanimi (primary, secondary, accent)
- [x] packages/ui — shadcn/ui base componentler (Button, Input, Card)
- [x] Tenant config'de tema bilgisi (ThemeConfig tipi: primaryColor, font, layout)
- [x] Tenant DB'de settings tablosu (JSONB — logo, renk, kargo config vb.)

## Yapilacaklar

### Tema Altyapisi (Faz 2 Hafta 8)
- [ ] packages/themes/ dizin yapisi olusturma
- [ ] Tema base class / interface tanimi
- [ ] CSS custom properties sistemi (tenant config'den dinamik yukleme)
- [ ] Google Fonts entegrasyonu
- [ ] Tema preview mekanizmasi

### Ilk 2 Tema (Faz 2 Hafta 8)
- [ ] Mobilya temasi (packages/themes/furniture)
- [ ] Teknoloji temasi (packages/themes/technology)

### Diger Temalar (Faz 3 Hafta 6-8)
- [ ] Giyim temasi
- [ ] Kozmetik temasi
- [ ] Gida temasi
- [ ] Ev & Yasam temasi

### Tema Editoru
- [ ] Renk picker (wizard icinde)
- [ ] Font secici
- [ ] Layout secenekleri (grid kolon sayisi, header tipi)
- [ ] Canli onizleme
