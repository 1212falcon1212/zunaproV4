package nginx

import (
	"fmt"
	"os"
	"text/template"
)

const nginxTemplate = `server {
    listen 80;
    server_name {{.Domain}};

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
`

type NginxConfig struct {
	Domain string
}

func GenerateConfig(domain, outputPath string) error {
	tmpl, err := template.New("nginx").Parse(nginxTemplate)
	if err != nil {
		return fmt.Errorf("parsing nginx template: %w", err)
	}

	f, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("creating nginx config file %s: %w", outputPath, err)
	}
	defer f.Close()

	if err := tmpl.Execute(f, NginxConfig{Domain: domain}); err != nil {
		return fmt.Errorf("executing nginx template: %w", err)
	}

	return nil
}
