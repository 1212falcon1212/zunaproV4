package jobs

import (
	"context"
	"fmt"
	"log"

	"github.com/zunapro/provisioner/internal/storage"
)

type ProcessBranding struct {
	minio *storage.MinioClient
}

func NewProcessBranding(minio *storage.MinioClient) *ProcessBranding {
	return &ProcessBranding{minio: minio}
}

func (j *ProcessBranding) Name() string { return "ProcessBranding" }

func (j *ProcessBranding) Execute(ctx context.Context, req *ProvisionRequest) error {
	bucketName := fmt.Sprintf("tenant-%s", req.Slug)
	if err := j.minio.CreateBucket(ctx, bucketName); err != nil {
		return fmt.Errorf("creating branding bucket: %w", err)
	}

	log.Printf("Branding bucket created: %s", bucketName)
	return nil
}
