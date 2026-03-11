package jobs

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/zunapro/provisioner/internal/config"
	"github.com/zunapro/provisioner/internal/database"
	"github.com/zunapro/provisioner/internal/storage"
)

type ProcessBranding struct {
	minio *storage.MinioClient
	cfg   *config.Config
}

func NewProcessBranding(minio *storage.MinioClient, cfg *config.Config) *ProcessBranding {
	return &ProcessBranding{minio: minio, cfg: cfg}
}

func (j *ProcessBranding) Name() string { return "ProcessBranding" }

func (j *ProcessBranding) Execute(ctx context.Context, req *ProvisionRequest) error {
	// 1. Create MinIO bucket for tenant assets
	bucketName := fmt.Sprintf("tenant-%s", req.Slug)
	if err := j.minio.CreateBucket(ctx, bucketName); err != nil {
		return fmt.Errorf("creating branding bucket: %w", err)
	}
	log.Printf("[ProcessBranding] MinIO bucket created: %s", bucketName)

	// 2. Store theme/branding config in tenant DB settings
	db, err := database.ConnectTenant(j.cfg.DatabaseTenantTemplate, req.Slug)
	if err != nil {
		return fmt.Errorf("connecting to tenant db: %w", err)
	}
	defer db.Close()

	brandingConfig := map[string]interface{}{
		"theme": map[string]interface{}{
			"primary":    getConfigString(req.Config, "themePrimary", "#2563eb"),
			"secondary":  getConfigString(req.Config, "themeSecondary", "#475569"),
			"accent":     getConfigString(req.Config, "themeAccent", "#f59e0b"),
			"background": getConfigString(req.Config, "themeBackground", "#ffffff"),
		},
		"logo":         req.Config["logoUrl"],
		"favicon":      nil, // Will be generated from logo
		"storageBucket": bucketName,
	}

	brandingJSON, _ := json.Marshal(brandingConfig)
	_, err = db.ExecContext(ctx,
		`INSERT INTO settings (key, value, "group") VALUES ('branding', $1::jsonb, 'branding') ON CONFLICT (key) DO UPDATE SET value = $1::jsonb`,
		string(brandingJSON),
	)
	if err != nil {
		return fmt.Errorf("saving branding config: %w", err)
	}

	// Logo processing (resize to favicon, header, og:image) will be done
	// when a logo is actually uploaded. For now we store the config.
	log.Printf("[ProcessBranding] Branding config saved for tenant: %s", req.Slug)
	return nil
}
