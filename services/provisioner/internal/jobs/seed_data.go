package jobs

import (
	"context"
	"log"

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
	log.Printf("Seeding initial data for sector: %s", req.Sector)
	return nil
}
