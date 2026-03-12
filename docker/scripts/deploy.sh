#!/bin/bash
# docker/scripts/deploy.sh
# Deploy ZunaPro to VPS
# Usage: ./deploy.sh [--build]

set -euo pipefail

COMPOSE_FILES="-f docker-compose.yml -f docker-compose.prod.yml"
BUILD_FLAG="${1:-}"

echo "=== ZunaPro Deployment ==="

# Pull latest code
echo "[1/5] Pulling latest code..."
git pull origin main

# Build images if requested
if [ "$BUILD_FLAG" = "--build" ]; then
  echo "[2/5] Building Docker images..."
  docker compose $COMPOSE_FILES build --parallel
else
  echo "[2/5] Skipping build (use --build to rebuild)"
fi

# Run DB migrations
echo "[3/5] Running database migrations..."
docker compose $COMPOSE_FILES run --rm api sh -c "npx prisma db push --schema=packages/db/prisma/master.prisma --skip-generate"

# Start/restart services
echo "[4/5] Starting services..."
docker compose $COMPOSE_FILES up -d --remove-orphans

# Health check
echo "[5/5] Running health checks..."
sleep 5
for service in web admin api; do
  if docker compose $COMPOSE_FILES ps $service | grep -q "Up"; then
    echo "  $service: OK"
  else
    echo "  $service: FAILED"
  fi
done

echo ""
echo "=== Deployment complete ==="
echo "Web:   https://zunapro.com"
echo "Admin: https://admin.zunapro.com"
echo "API:   https://api.zunapro.com"
