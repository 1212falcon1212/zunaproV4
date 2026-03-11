package jobs

import (
	"context"
	"fmt"

	"github.com/zunapro/provisioner/internal/database"
)

type ConfigureTenant struct {
	db *database.PostgresClient
}

func NewConfigureTenant(db *database.PostgresClient) *ConfigureTenant {
	return &ConfigureTenant{db: db}
}

func (j *ConfigureTenant) Name() string { return "ConfigureTenant" }

func (j *ConfigureTenant) Execute(ctx context.Context, req *ProvisionRequest) error {
	_, err := j.db.DB().ExecContext(ctx,
		`UPDATE tenants SET status = 'provisioning' WHERE id = $1`,
		req.TenantID,
	)
	if err != nil {
		return fmt.Errorf("updating tenant status: %w", err)
	}
	return nil
}
