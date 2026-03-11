package config

import (
	"fmt"
	"os"
)

type Config struct {
	DatabaseMasterURL      string
	DatabaseTenantTemplate string
	NatsURL                string
	NatsAuthToken          string
	MinioEndpoint          string
	MinioAccessKey         string
	MinioSecretKey         string
	MigrationsPath         string
}

func Load() (*Config, error) {
	cfg := &Config{
		DatabaseMasterURL:      getEnv("DATABASE_MASTER_URL", ""),
		DatabaseTenantTemplate: getEnv("DATABASE_TENANT_URL_TEMPLATE", ""),
		NatsURL:                getEnv("NATS_URL", "nats://localhost:4222"),
		NatsAuthToken:          getEnv("NATS_AUTH_TOKEN", ""),
		MinioEndpoint:          getEnv("MINIO_ENDPOINT", "localhost:9000"),
		MinioAccessKey:         getEnv("MINIO_ACCESS_KEY", ""),
		MinioSecretKey:         getEnv("MINIO_SECRET_KEY", ""),
		MigrationsPath:         getEnv("MIGRATIONS_PATH", "migrations"),
	}

	if cfg.DatabaseMasterURL == "" {
		return nil, fmt.Errorf("DATABASE_MASTER_URL is required")
	}
	if cfg.DatabaseTenantTemplate == "" {
		return nil, fmt.Errorf("DATABASE_TENANT_URL_TEMPLATE is required")
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
