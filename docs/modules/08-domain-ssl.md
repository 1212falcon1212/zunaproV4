# 8. Domain & SSL Otomasyon

> Subdomain ve ozel domain destegi. SSL sertifikasi otomatik.

## Subdomain Modu

| Ozellik | Aciklama | Durum |
|---------|----------|-------|
| Wildcard DNS | *.platform.com tum subdomain'leri yakalir | YAPILACAK (infra) |
| Wildcard SSL | Tek sertifika ile tum subdomain'ler guvenli | YAPILACAK (infra) |
| Tenant Resolution | Subdomain'den slug cikarma | TAMAM |
| Otomatik Aktiflesme | Yeni tenant = aninda erisim (DNS/Nginx islem yok) | YAPILACAK |

## Ozel Domain Modu

| Adim | Islem | Durum |
|------|-------|-------|
| 1 | Kullanici domain'ini wizard'a girer | YAPILACAK |
| 2 | CNAME/A kaydi talimati gosterilir | YAPILACAK |
| 3 | Go engine DNS propagation kontrolu yapar | ISKELET |
| 4 | DNS dogrulandiginda Nginx server block olusturulur | ISKELET |
| 5 | Let's Encrypt ile SSL sertifikasi alinir (acme.sh) | ISKELET |
| 6 | Nginx reload, site aktif | ISKELET |

## Yapilanlar

- [x] Master DB'de custom_domains tablosu (domain, ssl_status, dns_verified, verified_at)
- [x] Tenant resolver middleware'de custom domain destegi (domain lookup → tenant_id)
- [x] Cache invalidation for custom domains
- [x] Go provisioner: setup_domain.go (Nginx config template, certbot placeholder)
- [x] Go provisioner: nginx/config.go (reverse proxy template generation)
- [x] Tenant tipi: custom_domain alani

## Yapilacaklar

### DNS Yonetimi (Faz 1 Hafta 9-10)
- [ ] DNS propagation checker (Go engine periyodik kontrol)
- [ ] CNAME/A kaydi dogrulama API endpoint
- [ ] DNS durum bildirim sistemi (webhook/polling)

### SSL Otomasyon (Faz 1 Hafta 9-10)
- [ ] Let's Encrypt / acme.sh entegrasyonu
- [ ] Otomatik SSL sertifika alma
- [ ] SSL yenileme cron job (30 gun onceden)
- [ ] Basarisiz yenileme admin alert
- [ ] SSL durum izleme dashboard'u

### Nginx Yonetimi
- [ ] Nginx server block otomatik olusturma
- [ ] Nginx reload/test otomasyonu
- [ ] Reverse proxy yapilandirmasi (tenant → app)
- [ ] Rate limiting per domain

### UI
- [ ] Wizard domain ayar ekrani
- [ ] DNS kaydi talimat sayfasi (CNAME deger gosterimi)
- [ ] Domain dogrulama durum sayfasi
- [ ] Admin panelde domain yonetim sayfasi
