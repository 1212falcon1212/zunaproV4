#!/bin/bash
# Re-apply theme to a tenant (build + apply + reseed)
# Usage: ./scripts/reapply-theme.sh [tenant-slug] [theme-id]

TENANT=${1:-"deneme-3-"}
THEME=${2:-"genel"}
API_URL=${API_URL:-"http://localhost:4000"}

echo "=== Theme Re-Apply ==="
echo "Tenant: $TENANT | Theme: $THEME"

pnpm --filter=@zunapro/themes build 2>&1 | tail -1

RESPONSE=$(curl -s -X POST "$API_URL/storefront/dev/apply-theme" \
  -H "Content-Type: application/json" \
  -H "x-tenant-slug: $TENANT" \
  -d "{\"themeId\": \"$THEME\", \"reseed\": true}")

echo "Response: $RESPONSE"
echo "Refresh: http://localhost:3000/_store/$TENANT/en"
