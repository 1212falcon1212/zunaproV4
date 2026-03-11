package jobs

import (
	"context"
	"fmt"
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

	exists, err := j.db.DatabaseExists(dbName)
	if err != nil {
		return fmt.Errorf("checking database existence: %w", err)
	}
	if exists {
		return nil // idempotent
	}

	if err := j.db.CreateDatabase(dbName); err != nil {
		return fmt.Errorf("creating tenant database: %w", err)
	}

	tenantURL := strings.Replace(j.cfg.DatabaseTenantTemplate, "{slug}", req.Slug, 1)
	_ = tenantURL // Will be used for migrations in full implementation

	return nil
}
