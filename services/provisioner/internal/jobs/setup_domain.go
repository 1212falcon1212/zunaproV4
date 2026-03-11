package jobs

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/zunapro/provisioner/internal/database"
	"github.com/zunapro/provisioner/internal/nginx"
)

type SetupDomain struct {
	db *database.PostgresClient
}

func NewSetupDomain(db *database.PostgresClient) *SetupDomain {
	return &SetupDomain{db: db}
}

func (j *SetupDomain) Name() string { return "SetupDomain" }

func (j *SetupDomain) Execute(ctx context.Context, req *ProvisionRequest) error {
	customDomain, _ := req.Config["domain"].(string)

	if customDomain == "" {
		// Subdomain mode: wildcard DNS handles it, nothing to do
		subdomain := fmt.Sprintf("%s.zunapro.com", req.Slug)
		log.Printf("[SetupDomain] Using subdomain: %s (wildcard DNS, no action needed)", subdomain)

		// Record subdomain in master DB
		_, err := j.db.DB().ExecContext(ctx,
			`UPDATE tenants SET domain = $1, updated_at = NOW() WHERE id = $2`,
			subdomain, req.TenantID,
		)
		if err != nil {
			return fmt.Errorf("updating tenant domain: %w", err)
		}
		return nil
	}

	// Custom domain mode: generate Nginx config
	log.Printf("[SetupDomain] Custom domain: %s — generating Nginx config", customDomain)

	// Ensure nginx config directory exists
	nginxDir := "/etc/nginx/sites-available"
	if envDir := os.Getenv("NGINX_SITES_DIR"); envDir != "" {
		nginxDir = envDir
	}

	configPath := filepath.Join(nginxDir, fmt.Sprintf("tenant-%s.conf", req.Slug))
	if err := nginx.GenerateConfig(customDomain, configPath); err != nil {
		// Non-fatal in dev: log warning but don't fail provisioning
		log.Printf("[SetupDomain] WARNING: Could not write Nginx config to %s: %v", configPath, err)
		log.Printf("[SetupDomain] Nginx config generation skipped (manual setup may be needed)")
	} else {
		log.Printf("[SetupDomain] Nginx config written: %s", configPath)
	}

	// Record custom domain in master DB
	_, err := j.db.DB().ExecContext(ctx,
		`INSERT INTO custom_domains (tenant_id, domain, ssl_status, dns_verified)
		 VALUES ($1, $2, 'pending', false)
		 ON CONFLICT (domain) DO UPDATE SET tenant_id = $1`,
		req.TenantID, customDomain,
	)
	if err != nil {
		return fmt.Errorf("recording custom domain: %w", err)
	}

	// Update tenant domain field
	_, err = j.db.DB().ExecContext(ctx,
		`UPDATE tenants SET domain = $1, updated_at = NOW() WHERE id = $2`,
		customDomain, req.TenantID,
	)
	if err != nil {
		return fmt.Errorf("updating tenant domain: %w", err)
	}

	// SSL will be handled by a separate cron job or DNS verification callback
	log.Printf("[SetupDomain] Custom domain %s registered. SSL pending DNS verification.", customDomain)
	return nil
}
