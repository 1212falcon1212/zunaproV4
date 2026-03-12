#!/bin/bash
set -euo pipefail
EMAIL="${1:?Usage: ./init-ssl.sh <email> [--staging]}"
STAGING="${2:-}"
DOMAIN="zunapro.com"
STAGING_FLAG=""
if [ "$STAGING" = "--staging" ]; then
  STAGING_FLAG="--staging"
  echo "Using Let's Encrypt staging environment"
fi
echo "Obtaining SSL certificate for ${DOMAIN}"
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  --email "$EMAIL" --agree-tos --no-eff-email \
  $STAGING_FLAG \
  -d "$DOMAIN" -d "www.$DOMAIN" -d "admin.$DOMAIN" -d "api.$DOMAIN"
echo "For wildcard (*.zunapro.com), use DNS challenge:"
echo "  certbot certonly --manual --preferred-challenges dns -d '*.${DOMAIN}' -d '${DOMAIN}'"
echo "Reloading Nginx..."
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
echo "Done!"
