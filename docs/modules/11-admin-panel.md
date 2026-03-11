# 11. Admin Panel & Izleme

> Platform yonetim paneli. Tum tenant'larin durumu, provisioning, toplu operasyonlar.

## Dashboard Metrikleri

| Panel | Metrikler | Durum |
|-------|-----------|-------|
| Genel Bakis | Toplam tenant, aktif tenant, deneme sureci, MRR | YAPILACAK |
| Provisioning | Bekleyen/aktif/basarisiz kurulumlar, ortalama sure | YAPILACAK |
| Sistem Sagligi | CPU/RAM/Disk, DB connection pool, NATS queue depth | YAPILACAK |
| Tenant Detay | Son siparis, urun sayisi, trafik, disk kullanimi, plan | YAPILACAK |
| Finansal | Aylik gelir, paket dagilimi, churn rate, odeme basari orani | YAPILACAK |

## Toplu Operasyonlar

| Operasyon | Aciklama | Durum |
|-----------|----------|-------|
| Migration | Tum tenantlara migration calistirma | YAPILACAK |
| Modul Yonetimi | Belirli paketlere yeni modul acma/kapama | YAPILACAK |
| E-posta Bildirimi | Toplu e-posta (bakim, guncelleme, duyuru) | YAPILACAK |
| Backup | Tenant bazli veya toplu backup alma | YAPILACAK |
| Provisioning Retry | Basarisiz job'lari tekrar tetikleme | YAPILACAK |
| Tenant Islemleri | Suspend/activate/delete islemleri | KISMEN |
| Kaynak Limitleri | Disk, urun sayisi limitleri guncelleme | YAPILACAK |

## Yapilanlar

- [x] apps/admin/ Next.js app iskeleti
- [x] Admin layout (src/app/layout.tsx)
- [x] Dashboard placeholder sayfasi (src/app/page.tsx)
- [x] Tenant listesi placeholder sayfasi (src/app/tenants/page.tsx)
- [x] Tailwind + shadcn/ui entegrasyonu
- [x] API tarafinda tenant CRUD endpoints (list, create, update, suspend)

## Yapilacaklar

### Dashboard (Faz 1 Hafta 9-10)
- [ ] Genel bakis dashboard (tenant sayilari, MRR)
- [ ] Provisioning status widget'lari
- [ ] Son aktiviteler feed'i
- [ ] Hizli islem butonlari

### Tenant Yonetimi
- [ ] Tenant listesi (filtreleme, arama, sirulama, pagination)
- [ ] Tenant detay sayfasi (bilgi, plan, moduller, domain, loglar)
- [ ] Tenant olusturma formu (admin tarafindan)
- [ ] Tenant suspend/activate/delete islemleri
- [ ] Tenant plan degistirme

### Sistem Izleme
- [ ] Sistem sagligi dashboard (CPU, RAM, Disk)
- [ ] DB connection pool metrikleri
- [ ] NATS queue monitoring
- [ ] Error log viewer

### Finansal Raporlar
- [ ] MRR (Monthly Recurring Revenue) grafigi
- [ ] Paket dagilim grafigi
- [ ] Churn rate takibi
- [ ] Odeme basari/basarisizlik oranlari

### Toplu Islemler UI
- [ ] Migration calistirma ekrani
- [ ] Toplu e-posta gonderim ekrani
- [ ] Backup yonetim ekrani
