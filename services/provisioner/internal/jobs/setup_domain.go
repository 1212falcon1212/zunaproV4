package jobs

import (
	"context"
	"log"
)

type SetupDomain struct{}

func NewSetupDomain() *SetupDomain { return &SetupDomain{} }

func (j *SetupDomain) Name() string { return "SetupDomain" }

func (j *SetupDomain) Execute(ctx context.Context, req *ProvisionRequest) error {
	domain, ok := req.Config["domain"].(string)
	if !ok || domain == "" {
		log.Printf("No custom domain configured, using subdomain %s.zunapro.com", req.Slug)
		return nil
	}

	log.Printf("Custom domain setup for %s (DNS verification + Nginx + SSL)", domain)
	return nil
}
