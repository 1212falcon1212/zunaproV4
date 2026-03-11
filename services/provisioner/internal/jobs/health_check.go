package jobs

import (
	"context"
	"fmt"
	"log"

	"github.com/zunapro/provisioner/internal/config"
	"github.com/zunapro/provisioner/internal/database"
	"github.com/zunapro/provisioner/internal/storage"
)

type HealthCheck struct {
	db    *database.PostgresClient
	minio *storage.MinioClient
	cfg   *config.Config
}

func NewHealthCheck(db *database.PostgresClient, minio *storage.MinioClient, cfg *config.Config) *HealthCheck {
	return &HealthCheck{db: db, minio: minio, cfg: cfg}
}

func (j *HealthCheck) Name() string { return "HealthCheck" }

func (j *HealthCheck) Execute(ctx context.Context, req *ProvisionRequest) error {
	// 1. Verify tenant database exists
	dbName := fmt.Sprintf("tenant_%s", req.Slug)
	exists, err := j.db.DatabaseExists(dbName)
	if err != nil {
		return fmt.Errorf("health check - database verification: %w", err)
	}
	if !exists {
		return fmt.Errorf("health check failed: database %s does not exist", dbName)
	}
	log.Printf("[HealthCheck] Database %s: OK", dbName)

	// 2. Verify tenant database is accessible and has tables
	tenantDB, err := database.ConnectTenant(j.cfg.DatabaseTenantTemplate, req.Slug)
	if err != nil {
		return fmt.Errorf("health check - tenant db connection: %w", err)
	}
	defer tenantDB.Close()

	var tableCount int
	err = tenantDB.QueryRowContext(ctx,
		`SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'`,
	).Scan(&tableCount)
	if err != nil {
		return fmt.Errorf("health check - counting tables: %w", err)
	}
	if tableCount < 7 {
		return fmt.Errorf("health check failed: expected at least 7 tables, found %d", tableCount)
	}
	log.Printf("[HealthCheck] Tenant DB tables: %d (OK)", tableCount)

	// 3. Verify MinIO bucket exists
	bucketName := fmt.Sprintf("tenant-%s", req.Slug)
	bucketExists, err := j.minio.BucketExists(ctx, bucketName)
	if err != nil {
		return fmt.Errorf("health check - MinIO bucket verification: %w", err)
	}
	if !bucketExists {
		return fmt.Errorf("health check failed: MinIO bucket %s does not exist", bucketName)
	}
	log.Printf("[HealthCheck] MinIO bucket %s: OK", bucketName)

	// 4. Verify tenant record in master DB
	var status string
	err = j.db.DB().QueryRowContext(ctx,
		`SELECT status FROM tenants WHERE id = $1`, req.TenantID,
	).Scan(&status)
	if err != nil {
		return fmt.Errorf("health check - master tenant record: %w", err)
	}
	log.Printf("[HealthCheck] Tenant %s status in master: %s (OK)", req.Slug, status)

	log.Printf("[HealthCheck] All checks passed for tenant: %s", req.Slug)
	return nil
}
