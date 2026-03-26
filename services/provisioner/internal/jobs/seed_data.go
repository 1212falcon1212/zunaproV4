package jobs

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/zunapro/provisioner/internal/config"
)

type SeedData struct {
	cfg *config.Config
}

func NewSeedData(cfg *config.Config) *SeedData {
	return &SeedData{cfg: cfg}
}

func (j *SeedData) Name() string { return "SeedInitialData" }

func (j *SeedData) Execute(ctx context.Context, req *ProvisionRequest) error {
	// Call NestJS API to seed rich data (products, categories, pages, header/footer, customers, orders)
	// This uses the dev/apply-theme endpoint which runs TenantSeederService
	themeID := "genel" // default theme

	payload := map[string]interface{}{
		"themeId": themeID,
		"reseed":  true, // full seed with all data
	}
	body, _ := json.Marshal(payload)

	url := fmt.Sprintf("%s/storefront/dev/apply-theme", j.cfg.APIBaseURL)

	httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("creating seed request: %w", err)
	}
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("x-tenant-slug", req.Slug)
	httpReq.Header.Set("x-provisioner-internal", "true")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		return fmt.Errorf("calling NestJS seeder: %w", err)
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)

	if resp.StatusCode >= 400 {
		return fmt.Errorf("NestJS seeder returned %d: %s", resp.StatusCode, string(respBody))
	}

	log.Printf("[SeedData] NestJS seeder completed for tenant: %s (response: %s)", req.Slug, string(respBody))
	return nil
}
