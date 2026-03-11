package jobs

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

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
	// 1. Set tenant status to active
	_, err := j.db.DB().ExecContext(ctx,
		`UPDATE tenants SET status = 'active', updated_at = NOW() WHERE id = $1`,
		req.TenantID,
	)
	if err != nil {
		return fmt.Errorf("updating tenant status to active: %w", err)
	}
	log.Printf("[Finalize] Tenant %s status set to active", req.Slug)

	// 2. Log provisioning completion
	_, err = j.db.DB().ExecContext(ctx,
		`INSERT INTO provisioning_logs (tenant_id, job_name, status, started_at, completed_at)
		 VALUES ($1, 'pipeline_complete', 'completed', NOW(), NOW())`,
		req.TenantID,
	)
	if err != nil {
		log.Printf("[Finalize] WARNING: Could not log completion: %v", err)
		// Non-fatal
	}

	// 3. Determine panel URL
	domain, _ := req.Config["domain"].(string)
	if domain == "" {
		domain = fmt.Sprintf("%s.zunapro.com", req.Slug)
	}

	// 4. Publish completion event to NATS for WebSocket gateway
	event := map[string]interface{}{
		"type":       "provisioning_complete",
		"tenantId":   req.TenantID,
		"slug":       req.Slug,
		"domain":     domain,
		"panelUrl":   fmt.Sprintf("https://%s/panel", domain),
		"storefrontUrl": fmt.Sprintf("https://%s", domain),
		"status":     "active",
	}
	data, err := json.Marshal(event)
	if err != nil {
		return fmt.Errorf("marshaling completion event: %w", err)
	}

	// Publish to tenant-specific progress channel
	subject := fmt.Sprintf("provisioning.progress.%s", req.TenantID)
	if err := natsClient.Publish(j.nc, subject, data); err != nil {
		return fmt.Errorf("publishing completion event: %w", err)
	}

	// Also publish to general provisioning complete channel (for admin panel)
	if err := natsClient.Publish(j.nc, "provisioning.complete", data); err != nil {
		log.Printf("[Finalize] WARNING: Could not publish to provisioning.complete: %v", err)
	}

	log.Printf("[Finalize] Tenant %s provisioning complete. URL: https://%s", req.Slug, domain)
	return nil
}
