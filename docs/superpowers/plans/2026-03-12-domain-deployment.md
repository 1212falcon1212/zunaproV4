# Domain & Deployment Implementation Plan (Hafta 9-10)

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Production-ready Dockerfiles, Nginx reverse proxy with wildcard SSL, admin panel dashboard foundation, CI/CD deploy pipeline, and VPS deployment readiness.

**Architecture:** Multi-container Docker setup behind Nginx reverse proxy. Nginx handles SSL termination, wildcard subdomain routing (`*.zunapro.com`), and custom domain support. Certbot handles Let's Encrypt certificates. All apps run as Docker containers orchestrated by docker-compose. CI/CD pushes images to GitHub Container Registry (ghcr.io) and deploys via SSH.

**Tech Stack:** Docker, Nginx, Certbot/Let's Encrypt, GitHub Actions, GitHub Container Registry, Docker Compose (production)

---

## File Structure

### New Files — Dockerfiles
- `apps/web/Dockerfile` — Next.js web app (multi-stage build)
- `apps/admin/Dockerfile` — Next.js admin app (multi-stage build)
- `apps/api/Dockerfile` — NestJS API (multi-stage build)
- `services/provisioner/Dockerfile` — Go provisioner (multi-stage build)

### New Files — Nginx
- `docker/nginx/nginx.conf` — Main Nginx config
- `docker/nginx/conf.d/default.conf` — Platform routing (zunapro.com, admin, api)
- `docker/nginx/conf.d/tenant.conf.template` — Template for tenant custom domains
- `docker/nginx/ssl-renew.sh` — Certbot renewal cron script

### New Files — Production Config
- `docker-compose.prod.yml` — Production Docker Compose (extends base)
- `docker/scripts/deploy.sh` — VPS deployment script
- `docker/scripts/init-ssl.sh` — Initial SSL certificate setup
- `.github/workflows/deploy.yml` — CI/CD deployment pipeline

### New Files — Admin Dashboard
- `apps/admin/src/app/tenants/page.tsx` — Tenant list page
- `apps/admin/src/app/tenants/[id]/page.tsx` — Tenant detail page
- `apps/admin/src/lib/api.ts` — Admin API client

### Modified Files
- `docker-compose.yml` — Add app service definitions for local dev
- `apps/admin/src/app/page.tsx` — Real dashboard with API data
- `apps/admin/src/app/layout.tsx` — Sidebar navigation
- `apps/admin/package.json` — Add dependencies
- `.env.example` — Add deployment env vars
- `services/provisioner/internal/nginx/config.go` — Update template paths

---

## Chunk 1: Production Dockerfiles

### Task 1: Next.js web Dockerfile

**Files:**
- Create: `apps/web/Dockerfile`
- Create: `apps/web/.dockerignore`

- [ ] **Step 1: Create .dockerignore**

```
node_modules
.next
.env*
```

- [ ] **Step 2: Create multi-stage Dockerfile**

```dockerfile
# apps/web/Dockerfile
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/types/package.json ./packages/types/
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/ ./packages/
COPY . .
RUN pnpm --filter=@zunapro/db generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter=@zunapro/web build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/web/server.js"]
```

- [ ] **Step 3: Update next.config.ts for standalone output**

Add `output: "standalone"` to the Next.js config in `apps/web/next.config.ts`.

- [ ] **Step 4: Commit**

```bash
git add apps/web/Dockerfile apps/web/.dockerignore apps/web/next.config.ts
git commit -m "feat: add production Dockerfile for Next.js web app"
```

---

### Task 2: Next.js admin Dockerfile

**Files:**
- Create: `apps/admin/Dockerfile`
- Create: `apps/admin/.dockerignore`

- [ ] **Step 1: Create .dockerignore and Dockerfile**

Same pattern as web app, but port 3001 and filter `@zunapro/admin`.

```dockerfile
# apps/admin/Dockerfile
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/admin/package.json ./apps/admin/
COPY packages/ui/package.json ./packages/ui/
COPY packages/types/package.json ./packages/types/
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/admin/node_modules ./apps/admin/node_modules
COPY --from=deps /app/packages/ ./packages/
COPY . .
RUN pnpm --filter=@zunapro/db generate
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter=@zunapro/admin build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/apps/admin/public ./apps/admin/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static
USER nextjs
EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/admin/server.js"]
```

- [ ] **Step 2: Update admin next.config.ts for standalone output**

- [ ] **Step 3: Commit**

```bash
git add apps/admin/Dockerfile apps/admin/.dockerignore apps/admin/next.config.ts
git commit -m "feat: add production Dockerfile for Next.js admin app"
```

---

### Task 3: NestJS API Dockerfile

**Files:**
- Create: `apps/api/Dockerfile`
- Create: `apps/api/.dockerignore`

- [ ] **Step 1: Create Dockerfile**

```dockerfile
# apps/api/Dockerfile
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile --prod=false

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/ ./packages/
COPY . .
RUN pnpm --filter=@zunapro/db generate
RUN pnpm --filter=@zunapro/api build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages/db/prisma ./packages/db/prisma
COPY --from=builder /app/packages/db/src ./packages/db/src
COPY --from=builder /app/packages/db/package.json ./packages/db/
COPY --from=builder /app/node_modules/.pnpm/@prisma+client*/node_modules/.prisma ./node_modules/.prisma
EXPOSE 4000
CMD ["node", "apps/api/dist/main.js"]
```

- [ ] **Step 2: Commit**

```bash
git add apps/api/Dockerfile apps/api/.dockerignore
git commit -m "feat: add production Dockerfile for NestJS API"
```

---

### Task 4: Go provisioner Dockerfile

**Files:**
- Create: `services/provisioner/Dockerfile`

- [ ] **Step 1: Create Dockerfile**

```dockerfile
# services/provisioner/Dockerfile
FROM golang:1.24-alpine AS builder
RUN apk add --no-cache git
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /provisioner ./cmd/main.go

FROM alpine:3.20 AS runner
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=builder /provisioner .
COPY migrations/ ./migrations/
EXPOSE 8080
CMD ["./provisioner"]
```

- [ ] **Step 2: Create .dockerignore**

```
*.test
.git
README.md
```

- [ ] **Step 3: Commit**

```bash
git add services/provisioner/Dockerfile services/provisioner/.dockerignore
git commit -m "feat: add production Dockerfile for Go provisioner"
```

---

## Chunk 2: Nginx + SSL + Production Docker Compose

### Task 5: Nginx configuration

**Files:**
- Create: `docker/nginx/nginx.conf`
- Create: `docker/nginx/conf.d/default.conf`

- [ ] **Step 1: Create main nginx.conf**

```nginx
# docker/nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    keepalive_timeout 65;
    client_max_body_size 50M;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/s;
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;

    # Upstream servers
    upstream web_app {
        server web:3000;
    }
    upstream admin_app {
        server admin:3001;
    }
    upstream api_server {
        server api:4000;
    }

    include /etc/nginx/conf.d/*.conf;
}
```

- [ ] **Step 2: Create default.conf for platform routing**

```nginx
# docker/nginx/conf.d/default.conf

# --- Platform: zunapro.com ---
server {
    listen 80;
    server_name zunapro.com www.zunapro.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name zunapro.com www.zunapro.com;

    ssl_certificate /etc/letsencrypt/live/zunapro.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zunapro.com/privkey.pem;
    include /etc/nginx/ssl-params.conf;

    location / {
        proxy_pass http://web_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# --- Admin: admin.zunapro.com ---
server {
    listen 80;
    server_name admin.zunapro.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name admin.zunapro.com;

    ssl_certificate /etc/letsencrypt/live/zunapro.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zunapro.com/privkey.pem;
    include /etc/nginx/ssl-params.conf;

    location / {
        proxy_pass http://admin_app;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# --- API: api.zunapro.com ---
server {
    listen 80;
    server_name api.zunapro.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name api.zunapro.com;

    ssl_certificate /etc/letsencrypt/live/zunapro.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zunapro.com/privkey.pem;
    include /etc/nginx/ssl-params.conf;

    location / {
        limit_req zone=api burst=50 nodelay;
        proxy_pass http://api_server;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# --- Wildcard: *.zunapro.com (tenant subdomains) ---
server {
    listen 80;
    server_name *.zunapro.com;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name *.zunapro.com;

    ssl_certificate /etc/letsencrypt/live/zunapro.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zunapro.com/privkey.pem;
    include /etc/nginx/ssl-params.conf;

    location / {
        proxy_pass http://web_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- [ ] **Step 3: Create SSL params include**

```nginx
# docker/nginx/ssl-params.conf
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
add_header Strict-Transport-Security "max-age=63072000" always;
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
```

- [ ] **Step 4: Create tenant custom domain template**

```nginx
# docker/nginx/conf.d/tenant.conf.template
# This file is used by the Go provisioner to generate per-tenant configs.
# Copy and replace TENANT_DOMAIN, TENANT_SLUG.
#
# server {
#     listen 80;
#     server_name TENANT_DOMAIN;
#     location /.well-known/acme-challenge/ { root /var/www/certbot; }
#     location / { return 301 https://$host$request_uri; }
# }
# server {
#     listen 443 ssl http2;
#     server_name TENANT_DOMAIN;
#     ssl_certificate /etc/letsencrypt/live/TENANT_DOMAIN/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/TENANT_DOMAIN/privkey.pem;
#     include /etc/nginx/ssl-params.conf;
#     location / {
#         proxy_pass http://web_app;
#         proxy_http_version 1.1;
#         proxy_set_header Host $host;
#         proxy_set_header X-Real-IP $remote_addr;
#         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#         proxy_set_header X-Forwarded-Proto $scheme;
#     }
# }
```

- [ ] **Step 5: Commit**

```bash
git add docker/nginx/
git commit -m "feat: add Nginx config with wildcard SSL, platform routing, and tenant support"
```

---

### Task 6: SSL initialization script

**Files:**
- Create: `docker/scripts/init-ssl.sh`
- Create: `docker/scripts/ssl-renew.sh`

- [ ] **Step 1: Create init-ssl.sh**

Script that uses certbot to obtain initial wildcard SSL for `*.zunapro.com` via DNS challenge.

```bash
#!/bin/bash
# docker/scripts/init-ssl.sh
# Initial SSL certificate setup for zunapro.com
# Usage: ./init-ssl.sh <email> [--staging]

set -euo pipefail

EMAIL="${1:?Usage: ./init-ssl.sh <email> [--staging]}"
STAGING="${2:-}"
DOMAIN="zunapro.com"

STAGING_FLAG=""
if [ "$STAGING" = "--staging" ]; then
  STAGING_FLAG="--staging"
  echo "Using Let's Encrypt staging environment"
fi

echo "Obtaining SSL certificate for ${DOMAIN} and *.${DOMAIN}"

docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  $STAGING_FLAG \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  -d "admin.$DOMAIN" \
  -d "api.$DOMAIN"

echo "Certificate obtained. For wildcard (*.zunapro.com), use DNS challenge:"
echo "  certbot certonly --manual --preferred-challenges dns -d '*.${DOMAIN}' -d '${DOMAIN}'"

echo "Reloading Nginx..."
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo "Done!"
```

- [ ] **Step 2: Create ssl-renew.sh**

```bash
#!/bin/bash
# docker/scripts/ssl-renew.sh
# Add to crontab: 0 3 * * 1 /path/to/ssl-renew.sh

set -euo pipefail

cd "$(dirname "$0")/../.."

docker compose -f docker-compose.prod.yml run --rm certbot renew --quiet
docker compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

- [ ] **Step 3: Make scripts executable and commit**

```bash
chmod +x docker/scripts/init-ssl.sh docker/scripts/ssl-renew.sh
git add docker/scripts/
git commit -m "feat: add SSL initialization and renewal scripts"
```

---

### Task 7: Production Docker Compose

**Files:**
- Create: `docker-compose.prod.yml`

- [ ] **Step 1: Create production compose file**

```yaml
# docker-compose.prod.yml
# Production Docker Compose — extends base infrastructure services
# Usage: docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

services:
  # --- Application Services ---
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    restart: unless-stopped
    env_file: .env
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.zunapro.com
    depends_on:
      - api
    networks:
      - zunapro

  admin:
    build:
      context: .
      dockerfile: apps/admin/Dockerfile
    restart: unless-stopped
    env_file: .env
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.zunapro.com
    depends_on:
      - api
    networks:
      - zunapro

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    restart: unless-stopped
    env_file: .env
    environment:
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis
      - nats
    networks:
      - zunapro

  provisioner:
    build:
      context: services/provisioner
      dockerfile: Dockerfile
    restart: unless-stopped
    env_file: .env
    volumes:
      - nginx_tenant_conf:/etc/nginx/tenant.d
    depends_on:
      - postgres
      - nats
      - minio
    networks:
      - zunapro

  # --- Nginx Reverse Proxy ---
  nginx:
    image: nginx:1.27-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./docker/nginx/conf.d:/etc/nginx/conf.d:ro
      - ./docker/nginx/ssl-params.conf:/etc/nginx/ssl-params.conf:ro
      - nginx_tenant_conf:/etc/nginx/tenant.d:ro
      - certbot_www:/var/www/certbot:ro
      - certbot_conf:/etc/letsencrypt:ro
    depends_on:
      - web
      - admin
      - api
    networks:
      - zunapro

  # --- Certbot ---
  certbot:
    image: certbot/certbot:latest
    volumes:
      - certbot_www:/var/www/certbot
      - certbot_conf:/etc/letsencrypt
    networks:
      - zunapro

  # --- Override infrastructure services (no exposed ports in prod) ---
  postgres:
    ports: !override []
  redis:
    ports: !override []
  nats:
    ports: !override []
  minio:
    ports: !override []
  meilisearch:
    ports: !override []

volumes:
  nginx_tenant_conf:
  certbot_www:
  certbot_conf:

networks:
  zunapro:
    driver: bridge
```

- [ ] **Step 2: Commit**

```bash
git add docker-compose.prod.yml
git commit -m "feat: add production Docker Compose with Nginx, Certbot, and app services"
```

---

## Chunk 3: Admin Panel Dashboard

### Task 8: Admin API client

**Files:**
- Create: `apps/admin/src/lib/api.ts`
- Modify: `apps/admin/package.json`

- [ ] **Step 1: Create admin API client**

```typescript
// apps/admin/src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function fetchDashboardStats(): Promise<{
  totalTenants: number;
  activeTenants: number;
  provisioningTenants: number;
  failedTenants: number;
  totalPlans: number;
}> {
  const [tenantsRes, plansRes] = await Promise.all([
    fetch(`${API_URL}/tenants?limit=1`, { cache: "no-store" }),
    fetch(`${API_URL}/plans`, { cache: "no-store" }),
  ]);

  const tenantsData = tenantsRes.ok ? await tenantsRes.json() : { meta: { total: 0 }, data: [] };
  const plansData = plansRes.ok ? await plansRes.json() : [];

  // For now, use basic counts — will be enhanced with dedicated stats endpoint later
  return {
    totalTenants: tenantsData.meta?.total ?? 0,
    activeTenants: 0,
    provisioningTenants: 0,
    failedTenants: 0,
    totalPlans: Array.isArray(plansData) ? plansData.length : 0,
  };
}

export async function fetchTenants(page = 1, limit = 20) {
  const res = await fetch(`${API_URL}/tenants?page=${page}&limit=${limit}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch tenants");
  return res.json();
}

export async function fetchTenant(id: string) {
  const res = await fetch(`${API_URL}/tenants/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch tenant");
  return res.json();
}

export async function fetchPlans() {
  const res = await fetch(`${API_URL}/plans`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch plans");
  return res.json();
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/admin/src/lib/api.ts
git commit -m "feat: add admin panel API client"
```

---

### Task 9: Admin layout with sidebar navigation

**Files:**
- Modify: `apps/admin/src/app/layout.tsx`

- [ ] **Step 1: Read existing layout and rewrite with sidebar**

Add a sidebar with navigation links: Dashboard, Tenants, Plans. Server component layout.

```tsx
// apps/admin/src/app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "ZunaPro Admin",
  description: "ZunaPro Super Admin Panel",
};

function Sidebar() {
  const links = [
    { href: "/", label: "Dashboard", icon: "□" },
    { href: "/tenants", label: "Tenants", icon: "◇" },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="text-xl font-bold">
          ZunaPro <span className="text-sm font-normal text-muted-foreground">Admin</span>
        </Link>
      </div>
      <nav className="space-y-1 p-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <span>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Sidebar />
        <main className="ml-64 min-h-screen bg-background p-8">{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/admin/src/app/layout.tsx
git commit -m "feat: add admin panel sidebar navigation layout"
```

---

### Task 10: Admin dashboard page with stats

**Files:**
- Modify: `apps/admin/src/app/page.tsx`

- [ ] **Step 1: Rewrite dashboard with API data**

Server component that fetches stats and shows cards.

```tsx
// apps/admin/src/app/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@zunapro/ui";
import { fetchDashboardStats } from "@/lib/api";

export default async function DashboardPage() {
  let stats = {
    totalTenants: 0,
    activeTenants: 0,
    provisioningTenants: 0,
    failedTenants: 0,
    totalPlans: 0,
  };

  try {
    stats = await fetchDashboardStats();
  } catch {
    // Dashboard should still render even if API is down
  }

  const cards = [
    { title: "Total Tenants", value: stats.totalTenants },
    { title: "Active", value: stats.activeTenants },
    { title: "Provisioning", value: stats.provisioningTenants },
    { title: "Failed", value: stats.failedTenants },
    { title: "Plans", value: stats.totalPlans },
  ];

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/admin/src/app/page.tsx
git commit -m "feat: add admin dashboard with API-driven stats cards"
```

---

### Task 11: Admin tenant list page

**Files:**
- Create: `apps/admin/src/app/tenants/page.tsx`

- [ ] **Step 1: Create tenant list page**

Server component with table showing all tenants.

```tsx
// apps/admin/src/app/tenants/page.tsx
import Link from "next/link";
import { Badge } from "@zunapro/ui";
import { fetchTenants } from "@/lib/api";

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  active: "default",
  pending: "secondary",
  provisioning: "secondary",
  suspended: "destructive",
  provisioning_failed: "destructive",
  payment_overdue: "destructive",
};

export default async function TenantsPage() {
  let data = { data: [], meta: { total: 0, page: 1, totalPages: 1 } };

  try {
    data = await fetchTenants(1, 50);
  } catch {
    // Render empty state
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tenants</h1>
        <span className="text-sm text-muted-foreground">{data.meta.total} total</span>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-left font-medium">Plan</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Domain</th>
              <th className="px-4 py-3 text-left font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((tenant: Record<string, unknown>) => (
              <tr key={tenant.id as string} className="border-b hover:bg-muted/30">
                <td className="px-4 py-3">
                  <Link href={`/tenants/${tenant.id}`} className="font-medium hover:underline">
                    {tenant.name as string}
                  </Link>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{tenant.slug as string}</td>
                <td className="px-4 py-3">
                  {(tenant.plan as Record<string, string>)?.name ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_COLORS[tenant.status as string] ?? "outline"}>
                    {tenant.status as string}
                  </Badge>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {(tenant.domain as string) || `${tenant.slug}.zunapro.com`}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(tenant.createdAt as string).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {data.data.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No tenants yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/admin/src/app/tenants/
git commit -m "feat: add admin tenant list page with status badges"
```

---

### Task 12: Admin tenant detail page

**Files:**
- Create: `apps/admin/src/app/tenants/[id]/page.tsx`

- [ ] **Step 1: Create tenant detail page**

```tsx
// apps/admin/src/app/tenants/[id]/page.tsx
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, Badge, Separator } from "@zunapro/ui";
import { fetchTenant } from "@/lib/api";

export default async function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let tenant: Record<string, unknown>;
  try {
    tenant = await fetchTenant(id);
  } catch {
    notFound();
  }

  const config = (tenant.config ?? {}) as Record<string, unknown>;
  const theme = (config.theme ?? {}) as Record<string, string>;
  const plan = (tenant.plan ?? {}) as Record<string, unknown>;
  const modules = (tenant.tenantModules ?? []) as Array<Record<string, unknown>>;

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <h1 className="text-3xl font-bold">{tenant.name as string}</h1>
        <Badge>{tenant.status as string}</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>General</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Slug</span>
              <span className="font-mono">{tenant.slug as string}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Domain</span>
              <span className="font-mono">{(tenant.domain as string) || `${tenant.slug}.zunapro.com`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span>{plan.name as string}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sector</span>
              <span>{(config.sector as string) || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{new Date(tenant.createdAt as string).toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Theme</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {Object.entries(theme).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-muted-foreground">{key}</span>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded border" style={{ backgroundColor: value }} />
                  <span className="font-mono text-xs">{value}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Active Modules ({modules.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {modules.map((tm) => {
                const mod = tm.module as Record<string, string> | undefined;
                return (
                  <Badge key={tm.id as string} variant="secondary">
                    {mod?.name ?? (tm.moduleSlug as string)}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/admin/src/app/tenants/
git commit -m "feat: add admin tenant detail page"
```

---

## Chunk 4: CI/CD Deploy Pipeline + Deploy Script

### Task 13: Deployment script

**Files:**
- Create: `docker/scripts/deploy.sh`

- [ ] **Step 1: Create VPS deployment script**

```bash
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
```

- [ ] **Step 2: Make executable and commit**

```bash
chmod +x docker/scripts/deploy.sh
git add docker/scripts/deploy.sh
git commit -m "feat: add VPS deployment script"
```

---

### Task 14: GitHub Actions deploy pipeline

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create deployment workflow**

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: deploy
  cancel-in-progress: false

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "pnpm"
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo typecheck
      - run: pnpm lint

  build-push:
    name: Build & Push Images
    needs: test
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build and push web
        uses: docker/build-push-action@v6
        with:
          context: .
          file: apps/web/Dockerfile
          push: true
          tags: ghcr.io/${{ github.repository }}/web:latest,ghcr.io/${{ github.repository }}/web:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build and push admin
        uses: docker/build-push-action@v6
        with:
          context: .
          file: apps/admin/Dockerfile
          push: true
          tags: ghcr.io/${{ github.repository }}/admin:latest,ghcr.io/${{ github.repository }}/admin:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build and push api
        uses: docker/build-push-action@v6
        with:
          context: .
          file: apps/api/Dockerfile
          push: true
          tags: ghcr.io/${{ github.repository }}/api:latest,ghcr.io/${{ github.repository }}/api:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build and push provisioner
        uses: docker/build-push-action@v6
        with:
          context: services/provisioner
          file: services/provisioner/Dockerfile
          push: true
          tags: ghcr.io/${{ github.repository }}/provisioner:latest,ghcr.io/${{ github.repository }}/provisioner:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    name: Deploy to VPS
    needs: build-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/zunapro
            git pull origin main
            docker compose -f docker-compose.yml -f docker-compose.prod.yml pull web admin api provisioner
            docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --remove-orphans
            docker image prune -f
            echo "Deploy complete at $(date)"
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions CI/CD deploy pipeline with ghcr.io"
```

---

### Task 15: Update .env.example with deployment vars

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Add deployment-related env vars**

Append these to the existing .env.example:
```env
# --- Deployment ---
APP_DOMAIN=zunapro.com
ADMIN_DOMAIN=admin.zunapro.com
API_DOMAIN=api.zunapro.com
NEXT_PUBLIC_API_URL=https://api.zunapro.com
SSL_EMAIL=admin@zunapro.com
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "feat: add deployment environment variables to .env.example"
```

---

### Task 16: Verification and typecheck

- [ ] **Step 1: Run typecheck on all packages**

```bash
pnpm turbo typecheck
```

Fix any type errors.

- [ ] **Step 2: Verify Dockerfiles build (syntax check)**

```bash
docker build --check -f apps/web/Dockerfile .
docker build --check -f apps/api/Dockerfile .
```

- [ ] **Step 3: Final commit if needed**

```bash
git add -A
git commit -m "fix: resolve typecheck and build issues"
```

---

### Task 17: Update roadmap documentation

**Files:**
- Modify: `docs/modules/13-roadmap.md`
- Modify: `docs/modules/08-domain-ssl.md`

- [ ] **Step 1: Update Hafta 9-10 status to TAMAM in roadmap**
- [ ] **Step 2: Update Faz 1 progress to 100%**
- [ ] **Step 3: Update domain/SSL module doc**
- [ ] **Step 4: Commit**

```bash
git add docs/modules/
git commit -m "docs: update roadmap — Faz 1 MVP Altyapi complete (Hafta 1-10)"
```
