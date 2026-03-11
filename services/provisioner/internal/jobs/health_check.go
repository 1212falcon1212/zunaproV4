package jobs

import (
	"context"
	"fmt"

	"github.com/zunapro/provisioner/internal/config"
	"github.com/zunapro/provisioner/internal/database"
)

type HealthCheck struct {
	db  *database.PostgresClient
	cfg *config.Config
}

func NewHealthCheck(db *database.PostgresClient, cfg *config.Config) *HealthCheck {
	return &HealthCheck{db: db, cfg: cfg}
}

func (j *HealthCheck) Name() string { return "HealthCheck" }

func (j *HealthCheck) Execute(ctx context.Context, req *ProvisionRequest) error {
	dbName := fmt.Sprintf("tenant_%s", req.Slug)
	exists, err := j.db.DatabaseExists(dbName)
	if err != nil {
		return fmt.Errorf("health check - database verification: %w", err)
	}
	if !exists {
		return fmt.Errorf("health check failed: database %s does not exist", dbName)
	}

	return nil
}
