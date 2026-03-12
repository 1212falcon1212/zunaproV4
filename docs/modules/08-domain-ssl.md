# 8. Domain & SSL Otomasyon

> Subdomain ve ozel domain destegi. SSL sertifikasi otomatik.

## Subdomain Modu

| Ozellik | Aciklama | Durum |
|---------|----------|-------|
| Wildcard DNS | *.zunapro.com tum subdomain'leri yakalir | TAMAM |
| Wildcard SSL | Tek sertifika ile tum subdomain'ler guvenli | TAMAM |
| Tenant Resolution | Subdomain'den slug cikarma | TAMAM |
| Otomatik Aktiflesme | Yeni tenant = aninda erisim (DNS/Nginx islem yok) | TAMAM |

## Ozel Domain Modu

| Adim | Islem | Durum |
|------|-------|-------|
| 1 | Kullanici domain'ini wizard'a girer | TAMAM |
| 2 | CNAME/A kaydi talimati gosterilir | TAMAM |
| 3 | Go engine DNS propagation kontrolu yapar | TAMAM |
| 4 | DNS dogrulandiginda Nginx server block olusturulur | TAMAM |
| 5 | Let's Encrypt ile SSL sertifikasi alinir (Certbot) | TAMAM |
| 6 | Nginx reload, site aktif | TAMAM |

## Yapilanlar

- [x] Master DB'de custom_domains tablosu (domain, ssl_status, dns_verified, verified_at)
- [x] Tenant resolver middleware'de custom domain destegi (domain lookup → tenant_id)
- [x] Cache invalidation for custom domains
- [x] Go provisioner: setup_domain.go (Nginx config template, certbot placeholder)
- [x] Go provisioner: nginx/config.go (reverse proxy template generation)
- [x] Tenant tipi: custom_domain alani

## Yapilacaklar (Tamamlandi — Hafta 9-10)

### DNS Yonetimi — TAMAM
- [x] DNS propagation checker (Go engine periyodik kontrol)
- [x] CNAME/A kaydi dogrulama (Go provisioner setup_domain.go)
- [x] Wizard'da DNS talimat gosterimi

### SSL Otomasyon — TAMAM
- [x] Let's Encrypt / Certbot entegrasyonu
- [x] Otomatik SSL sertifika alma (init-ssl.sh)
- [x] SSL yenileme cron job (ssl-renew.sh)
- [ ] Basarisiz yenileme admin alert (Faz 6)
- [ ] SSL durum izleme dashboard'u (Faz 6)

### Nginx Yonetimi — TAMAM
- [x] Nginx server block otomatik olusturma (tenant.conf.template)
- [x] Nginx wildcard config (*.zunapro.com)
- [x] Reverse proxy yapilandirmasi (web, admin, api upstream)
- [x] Rate limiting per domain (api: 30r/s, general: 10r/s)

### UI — TAMAM
- [x] Wizard domain ayar ekrani (step-domain.tsx)
- [x] DNS kaydi talimat sayfasi (CNAME deger gosterimi)
- [x] Subdomain/custom domain secimi
- [ ] Admin panelde domain yonetim sayfasi (Faz 6)
