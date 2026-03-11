package jobs

import (
	"context"
	"fmt"
	"log"
	"strings"

	"github.com/zunapro/provisioner/internal/config"
	"github.com/zunapro/provisioner/internal/database"
)

type CreateDatabase struct {
	db  *database.PostgresClient
	cfg *config.Config
}

func NewCreateDatabase(db *database.PostgresClient, cfg *config.Config) *CreateDatabase {
	return &CreateDatabase{db: db, cfg: cfg}
}

func (j *CreateDatabase) Name() string { return "CreateTenantDatabase" }

func (j *CreateDatabase) Execute(ctx context.Context, req *ProvisionRequest) error {
	dbName := fmt.Sprintf("tenant_%s", req.Slug)

	// 1. Check if DB already exists (idempotent)
	exists, err := j.db.DatabaseExists(dbName)
	if err != nil {
		return fmt.Errorf("checking database existence: %w", err)
	}

	// 2. Create the database if it doesn't exist
	if !exists {
		log.Printf("[CreateDatabase] Creating database: %s", dbName)
		if err := j.db.CreateDatabase(dbName); err != nil {
			return fmt.Errorf("creating tenant database: %w", err)
		}
		log.Printf("[CreateDatabase] Database created: %s", dbName)
	} else {
		log.Printf("[CreateDatabase] Database already exists: %s (idempotent skip)", dbName)
	}

	// 3. Run migrations against the new tenant database
	tenantURL := strings.Replace(j.cfg.DatabaseTenantTemplate, "{slug}", req.Slug, 1)
	log.Printf("[CreateDatabase] Running migrations on: %s", dbName)

	if err := database.RunMigrations(tenantURL, j.cfg.MigrationsPath); err != nil {
		return fmt.Errorf("running migrations on %s: %w", dbName, err)
	}

	log.Printf("[CreateDatabase] Migrations complete for: %s", dbName)
	return nil
}
