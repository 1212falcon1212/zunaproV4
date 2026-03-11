package jobs

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

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
	// Build tenant config JSONB from provision request
	tenantConfig := map[string]interface{}{
		"sector":          req.Sector,
		"locales":         getConfigSlice(req.Config, "locales", []string{"tr", "en"}),
		"defaultLocale":   getConfigString(req.Config, "defaultLocale", "tr"),
		"currencies":      getConfigSlice(req.Config, "currencies", []string{"TRY"}),
		"defaultCurrency": getConfigString(req.Config, "defaultCurrency", "TRY"),
		"timezone":        getConfigString(req.Config, "timezone", "Europe/Istanbul"),
		"theme": map[string]interface{}{
			"primary":    getConfigString(req.Config, "themePrimary", "#2563eb"),
			"secondary":  getConfigString(req.Config, "themeSecondary", "#475569"),
			"accent":     getConfigString(req.Config, "themeAccent", "#f59e0b"),
			"background": getConfigString(req.Config, "themeBackground", "#ffffff"),
		},
	}

	configJSON, err := json.Marshal(tenantConfig)
	if err != nil {
		return fmt.Errorf("marshalling tenant config: %w", err)
	}

	// Update tenant: set status to provisioning, write config, set db_name
	dbName := fmt.Sprintf("tenant_%s", req.Slug)
	_, err = j.db.DB().ExecContext(ctx,
		`UPDATE tenants SET status = 'provisioning', config = $1::jsonb, updated_at = NOW() WHERE id = $2`,
		string(configJSON), req.TenantID,
	)
	if err != nil {
		return fmt.Errorf("updating tenant config: %w", err)
	}

	log.Printf("[ConfigureTenant] Tenant %s configured (db: %s, sector: %s)", req.Slug, dbName, req.Sector)
	return nil
}

func getConfigString(config map[string]interface{}, key string, fallback string) string {
	if v, ok := config[key]; ok {
		if s, ok := v.(string); ok {
			return s
		}
	}
	return fallback
}

func getConfigSlice(config map[string]interface{}, key string, fallback []string) []string {
	if v, ok := config[key]; ok {
		if arr, ok := v.([]interface{}); ok {
			result := make([]string, 0, len(arr))
			for _, item := range arr {
				if s, ok := item.(string); ok {
					result = append(result, s)
				}
			}
			if len(result) > 0 {
				return result
			}
		}
	}
	return fallback
}
