package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/zunapro/provisioner/internal/config"
	"github.com/zunapro/provisioner/internal/database"
	"github.com/zunapro/provisioner/internal/jobs"
	"github.com/zunapro/provisioner/internal/nats"
	"github.com/zunapro/provisioner/internal/storage"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	nc, err := nats.Connect(cfg.NatsURL, cfg.NatsAuthToken)
	if err != nil {
		log.Fatalf("failed to connect to NATS: %v", err)
	}
	defer nc.Close()

	db, err := database.NewPostgresClient(cfg.DatabaseMasterURL)
	if err != nil {
		log.Fatalf("failed to connect to PostgreSQL: %v", err)
	}
	defer db.Close()

	minioClient, err := storage.NewMinioClient(cfg.MinioEndpoint, cfg.MinioAccessKey, cfg.MinioSecretKey)
	if err != nil {
		log.Fatalf("failed to connect to MinIO: %v", err)
	}

	pipeline := jobs.NewPipeline(db, nc, minioClient, cfg)

	if err := nats.Subscribe(nc, "tenant.provision", func(data []byte) {
		if err := pipeline.Execute(ctx, data); err != nil {
			log.Printf("provisioning pipeline failed: %v", err)
		}
	}); err != nil {
		log.Fatalf("failed to subscribe to NATS: %v", err)
	}

	log.Println("Provisioner started, waiting for jobs...")

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	<-sigCh

	log.Println("Shutting down provisioner...")
	cancel()
}
