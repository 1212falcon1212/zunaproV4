package jobs

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/zunapro/provisioner/internal/config"
	"github.com/zunapro/provisioner/internal/database"
)

type SeedData struct {
	cfg *config.Config
}

func NewSeedData(cfg *config.Config) *SeedData {
	return &SeedData{cfg: cfg}
}

func (j *SeedData) Name() string { return "SeedInitialData" }

func (j *SeedData) Execute(ctx context.Context, req *ProvisionRequest) error {
	db, err := database.ConnectTenant(j.cfg.DatabaseTenantTemplate, req.Slug)
	if err != nil {
		return fmt.Errorf("connecting to tenant db: %w", err)
	}
	defer db.Close()

	// 1. Seed categories based on sector
	categories := getSectorCategories(req.Sector)
	for _, cat := range categories {
		nameJSON, _ := json.Marshal(cat.name)
		_, err := db.ExecContext(ctx,
			`INSERT INTO categories (name, slug, sort_order) VALUES ($1::jsonb, $2, $3) ON CONFLICT (slug) DO NOTHING`,
			string(nameJSON), cat.slug, cat.sortOrder,
		)
		if err != nil {
			return fmt.Errorf("seeding category %s: %w", cat.slug, err)
		}
	}
	log.Printf("[SeedData] Seeded %d categories for sector: %s", len(categories), req.Sector)

	// 2. Seed default pages
	pages := getDefaultPages()
	for _, page := range pages {
		titleJSON, _ := json.Marshal(page.title)
		contentJSON, _ := json.Marshal(page.content)
		_, err := db.ExecContext(ctx,
			`INSERT INTO pages (title, slug, content, template, is_published, sort_order) VALUES ($1::jsonb, $2, $3::jsonb, $4, true, $5) ON CONFLICT (slug) DO NOTHING`,
			string(titleJSON), page.slug, string(contentJSON), page.template, page.sortOrder,
		)
		if err != nil {
			return fmt.Errorf("seeding page %s: %w", page.slug, err)
		}
	}
	log.Printf("[SeedData] Seeded %d default pages", len(pages))

	// 3. Seed default settings
	settings := map[string]interface{}{
		"site_name":        req.Config["storeName"],
		"default_locale":   getConfigString(req.Config, "defaultLocale", "tr"),
		"locales":          getConfigSlice(req.Config, "locales", []string{"tr", "en"}),
		"default_currency": getConfigString(req.Config, "defaultCurrency", "TRY"),
		"currencies":       getConfigSlice(req.Config, "currencies", []string{"TRY"}),
		"sector":           req.Sector,
	}
	settingsJSON, _ := json.Marshal(settings)
	_, err = db.ExecContext(ctx,
		`INSERT INTO settings (key, value, "group") VALUES ('general', $1::jsonb, 'general') ON CONFLICT (key) DO NOTHING`,
		string(settingsJSON),
	)
	if err != nil {
		return fmt.Errorf("seeding settings: %w", err)
	}

	log.Printf("[SeedData] Seeded default settings for tenant: %s", req.Slug)
	return nil
}

type seedCategory struct {
	name      map[string]string
	slug      string
	sortOrder int
}

type seedPage struct {
	title     map[string]string
	slug      string
	content   map[string]string
	template  string
	sortOrder int
}

func getSectorCategories(sector string) []seedCategory {
	sectorMap := map[string][]seedCategory{
		"mobilya": {
			{name: map[string]string{"tr": "Salon", "en": "Living Room", "de": "Wohnzimmer", "fr": "Salon", "es": "Sala"}, slug: "salon", sortOrder: 1},
			{name: map[string]string{"tr": "Yatak Odasi", "en": "Bedroom", "de": "Schlafzimmer", "fr": "Chambre", "es": "Dormitorio"}, slug: "yatak-odasi", sortOrder: 2},
			{name: map[string]string{"tr": "Mutfak", "en": "Kitchen", "de": "Kuche", "fr": "Cuisine", "es": "Cocina"}, slug: "mutfak", sortOrder: 3},
			{name: map[string]string{"tr": "Ofis", "en": "Office", "de": "Buro", "fr": "Bureau", "es": "Oficina"}, slug: "ofis", sortOrder: 4},
			{name: map[string]string{"tr": "Bahce", "en": "Garden", "de": "Garten", "fr": "Jardin", "es": "Jardin"}, slug: "bahce", sortOrder: 5},
		},
		"teknoloji": {
			{name: map[string]string{"tr": "Bilgisayar", "en": "Computers", "de": "Computer", "fr": "Ordinateurs", "es": "Computadoras"}, slug: "bilgisayar", sortOrder: 1},
			{name: map[string]string{"tr": "Telefon", "en": "Phones", "de": "Telefone", "fr": "Telephones", "es": "Telefonos"}, slug: "telefon", sortOrder: 2},
			{name: map[string]string{"tr": "Aksesuar", "en": "Accessories", "de": "Zubehor", "fr": "Accessoires", "es": "Accesorios"}, slug: "aksesuar", sortOrder: 3},
			{name: map[string]string{"tr": "Yazilim", "en": "Software", "de": "Software", "fr": "Logiciel", "es": "Software"}, slug: "yazilim", sortOrder: 4},
			{name: map[string]string{"tr": "Oyun", "en": "Gaming", "de": "Spiele", "fr": "Jeux", "es": "Juegos"}, slug: "oyun", sortOrder: 5},
		},
		"giyim": {
			{name: map[string]string{"tr": "Kadin", "en": "Women", "de": "Damen", "fr": "Femmes", "es": "Mujer"}, slug: "kadin", sortOrder: 1},
			{name: map[string]string{"tr": "Erkek", "en": "Men", "de": "Herren", "fr": "Hommes", "es": "Hombre"}, slug: "erkek", sortOrder: 2},
			{name: map[string]string{"tr": "Cocuk", "en": "Kids", "de": "Kinder", "fr": "Enfants", "es": "Ninos"}, slug: "cocuk", sortOrder: 3},
			{name: map[string]string{"tr": "Ayakkabi", "en": "Shoes", "de": "Schuhe", "fr": "Chaussures", "es": "Zapatos"}, slug: "ayakkabi", sortOrder: 4},
			{name: map[string]string{"tr": "Aksesuar", "en": "Accessories", "de": "Zubehor", "fr": "Accessoires", "es": "Accesorios"}, slug: "aksesuar-giyim", sortOrder: 5},
		},
		"kozmetik": {
			{name: map[string]string{"tr": "Cilt Bakimi", "en": "Skincare", "de": "Hautpflege", "fr": "Soins", "es": "Cuidado"}, slug: "cilt-bakimi", sortOrder: 1},
			{name: map[string]string{"tr": "Makyaj", "en": "Makeup", "de": "Make-up", "fr": "Maquillage", "es": "Maquillaje"}, slug: "makyaj", sortOrder: 2},
			{name: map[string]string{"tr": "Sac Bakimi", "en": "Hair Care", "de": "Haarpflege", "fr": "Cheveux", "es": "Cabello"}, slug: "sac-bakimi", sortOrder: 3},
			{name: map[string]string{"tr": "Parfum", "en": "Perfume", "de": "Parfum", "fr": "Parfum", "es": "Perfume"}, slug: "parfum", sortOrder: 4},
		},
		"gida": {
			{name: map[string]string{"tr": "Organik", "en": "Organic", "de": "Bio", "fr": "Bio", "es": "Organico"}, slug: "organik", sortOrder: 1},
			{name: map[string]string{"tr": "Atistirmalik", "en": "Snacks", "de": "Snacks", "fr": "Snacks", "es": "Snacks"}, slug: "atistirmalik", sortOrder: 2},
			{name: map[string]string{"tr": "Icecek", "en": "Beverages", "de": "Getranke", "fr": "Boissons", "es": "Bebidas"}, slug: "icecek", sortOrder: 3},
			{name: map[string]string{"tr": "Baharatlik", "en": "Spices", "de": "Gewurze", "fr": "Epices", "es": "Especias"}, slug: "baharatlik", sortOrder: 4},
		},
		"ev-yasam": {
			{name: map[string]string{"tr": "Dekorasyon", "en": "Decor", "de": "Dekoration", "fr": "Decoration", "es": "Decoracion"}, slug: "dekorasyon", sortOrder: 1},
			{name: map[string]string{"tr": "Mutfak", "en": "Kitchen", "de": "Kuche", "fr": "Cuisine", "es": "Cocina"}, slug: "mutfak-ev", sortOrder: 2},
			{name: map[string]string{"tr": "Banyo", "en": "Bathroom", "de": "Badezimmer", "fr": "Salle de bain", "es": "Bano"}, slug: "banyo", sortOrder: 3},
			{name: map[string]string{"tr": "Bahce", "en": "Garden", "de": "Garten", "fr": "Jardin", "es": "Jardin"}, slug: "bahce-ev", sortOrder: 4},
			{name: map[string]string{"tr": "Aydinlatma", "en": "Lighting", "de": "Beleuchtung", "fr": "Eclairage", "es": "Iluminacion"}, slug: "aydinlatma", sortOrder: 5},
		},
	}

	if cats, ok := sectorMap[sector]; ok {
		return cats
	}
	return []seedCategory{
		{name: map[string]string{"tr": "Genel", "en": "General", "de": "Allgemein", "fr": "General", "es": "General"}, slug: "genel", sortOrder: 1},
	}
}

func getDefaultPages() []seedPage {
	return []seedPage{
		{
			title:     map[string]string{"tr": "Hakkimizda", "en": "About Us", "de": "Uber uns", "fr": "A propos", "es": "Sobre nosotros"},
			slug:      "hakkimizda",
			content:   map[string]string{"tr": "<p>Hakkimizda sayfasi icerigi.</p>", "en": "<p>About us page content.</p>"},
			template:  "default",
			sortOrder: 1,
		},
		{
			title:     map[string]string{"tr": "Iletisim", "en": "Contact", "de": "Kontakt", "fr": "Contact", "es": "Contacto"},
			slug:      "iletisim",
			content:   map[string]string{"tr": "<p>Iletisim bilgileri.</p>", "en": "<p>Contact information.</p>"},
			template:  "contact",
			sortOrder: 2,
		},
		{
			title:     map[string]string{"tr": "Sikca Sorulan Sorular", "en": "FAQ", "de": "FAQ", "fr": "FAQ", "es": "Preguntas frecuentes"},
			slug:      "sss",
			content:   map[string]string{"tr": "<p>Sikca sorulan sorular.</p>", "en": "<p>Frequently asked questions.</p>"},
			template:  "faq",
			sortOrder: 3,
		},
	}
}
