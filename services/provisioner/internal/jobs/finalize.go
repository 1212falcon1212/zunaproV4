package jobs

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/nats-io/nats.go"
	"github.com/zunapro/provisioner/internal/database"
	natsClient "github.com/zunapro/provisioner/internal/nats"
)

type Finalize struct {
	db *database.PostgresClient
	nc *nats.Conn
}

func NewFinalize(db *database.PostgresClient, nc *nats.Conn) *Finalize {
	return &Finalize{db: db, nc: nc}
}

func (j *Finalize) Name() string { return "FinalizeAndNotify" }

func (j *Finalize) Execute(ctx context.Context, req *ProvisionRequest) error {
	_, err := j.db.DB().ExecContext(ctx,
		`UPDATE tenants SET status = 'active' WHERE id = $1`,
		req.TenantID,
	)
	if err != nil {
		return fmt.Errorf("updating tenant status to active: %w", err)
	}

	event := map[string]interface{}{
		"type":     "provisioning_complete",
		"tenantId": req.TenantID,
		"panelUrl": fmt.Sprintf("https://%s.zunapro.com/panel", req.Slug),
	}
	data, err := json.Marshal(event)
	if err != nil {
		return fmt.Errorf("marshaling completion event: %w", err)
	}

	subject := fmt.Sprintf("provisioning.progress.%s", req.TenantID)
	if err := natsClient.Publish(j.nc, subject, data); err != nil {
		return fmt.Errorf("publishing completion event: %w", err)
	}

	return nil
}
