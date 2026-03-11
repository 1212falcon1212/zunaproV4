package jobs

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/nats-io/nats.go"
	"github.com/zunapro/provisioner/internal/config"
	"github.com/zunapro/provisioner/internal/database"
	natsClient "github.com/zunapro/provisioner/internal/nats"
	"github.com/zunapro/provisioner/internal/storage"
)

type ProvisionRequest struct {
	TenantID string                 `json:"tenantId"`
	Slug     string                 `json:"slug"`
	PlanID   string                 `json:"planId"`
	Sector   string                 `json:"sector"`
	Config   map[string]interface{} `json:"config"`
}

type Job interface {
	Name() string
	Execute(ctx context.Context, req *ProvisionRequest) error
}

type Pipeline struct {
	jobs   []Job
	db     *database.PostgresClient
	nc     *nats.Conn
	minio  *storage.MinioClient
	config *config.Config
}

func NewPipeline(db *database.PostgresClient, nc *nats.Conn, minio *storage.MinioClient, cfg *config.Config) *Pipeline {
	p := &Pipeline{
		db:     db,
		nc:     nc,
		minio:  minio,
		config: cfg,
	}

	p.jobs = []Job{
		NewCreateDatabase(db, cfg),
		NewConfigureTenant(db),
		NewSetupDomain(),
		NewSeedData(cfg),
		NewProcessBranding(minio),
		NewHealthCheck(db, cfg),
		NewFinalize(db, nc),
	}

	return p
}

func (p *Pipeline) Execute(ctx context.Context, data []byte) error {
	var req ProvisionRequest
	if err := json.Unmarshal(data, &req); err != nil {
		return fmt.Errorf("unmarshaling provision request: %w", err)
	}

	totalSteps := len(p.jobs)
	log.Printf("Starting provisioning pipeline for tenant %s (%d steps)", req.Slug, totalSteps)

	for i, job := range p.jobs {
		select {
		case <-ctx.Done():
			return fmt.Errorf("pipeline cancelled: %w", ctx.Err())
		default:
		}

		step := i + 1
		log.Printf("[%d/%d] Running job: %s", step, totalSteps, job.Name())

		p.publishProgress(req.TenantID, job.Name(), "running", step, totalSteps)

		var lastErr error
		for attempt := 1; attempt <= 3; attempt++ {
			if err := job.Execute(ctx, &req); err != nil {
				lastErr = err
				log.Printf("[%d/%d] Job %s failed (attempt %d/3): %v", step, totalSteps, job.Name(), attempt, err)
				if attempt < 3 {
					backoff := time.Duration([]int{1, 5, 15}[attempt-1]) * time.Second
					time.Sleep(backoff)
				}
				continue
			}
			lastErr = nil
			break
		}

		if lastErr != nil {
			p.publishProgress(req.TenantID, job.Name(), "failed", step, totalSteps)
			return fmt.Errorf("job %s failed after 3 attempts: %w", job.Name(), lastErr)
		}

		p.publishProgress(req.TenantID, job.Name(), "completed", step, totalSteps)
	}

	log.Printf("Provisioning pipeline completed for tenant %s", req.Slug)
	return nil
}

func (p *Pipeline) publishProgress(tenantID, jobName, status string, step, totalSteps int) {
	event := map[string]interface{}{
		"jobName":    jobName,
		"status":     status,
		"step":       step,
		"totalSteps": totalSteps,
		"message":    fmt.Sprintf("Job %s: %s", jobName, status),
	}
	data, err := json.Marshal(event)
	if err != nil {
		log.Printf("Failed to marshal progress event: %v", err)
		return
	}
	subject := fmt.Sprintf("provisioning.progress.%s", tenantID)
	if err := natsClient.Publish(p.nc, subject, data); err != nil {
		log.Printf("Failed to publish progress: %v", err)
	}
}
