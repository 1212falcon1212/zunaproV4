#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/../.."
docker compose -f docker-compose.prod.yml run --rm certbot renew --quiet
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
