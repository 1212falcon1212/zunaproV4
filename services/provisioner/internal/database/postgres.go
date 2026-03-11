package database

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/lib/pq"
)

type PostgresClient struct {
	db *sql.DB
}

func NewPostgresClient(masterURL string) (*PostgresClient, error) {
	db, err := sql.Open("postgres", masterURL)
	if err != nil {
		return nil, fmt.Errorf("opening database connection: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("pinging database: %w", err)
	}

	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)

	return &PostgresClient{db: db}, nil
}

func (c *PostgresClient) Close() error {
	return c.db.Close()
}

func (c *PostgresClient) DB() *sql.DB {
	return c.db
}

func (c *PostgresClient) CreateDatabase(name string) error {
	// Sanitize: only allow alphanumeric and underscore
	for _, ch := range name {
		if !((ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') || ch == '_') {
			return fmt.Errorf("invalid database name: %s", name)
		}
	}
	_, err := c.db.Exec(fmt.Sprintf(`CREATE DATABASE "%s"`, name))
	if err != nil {
		return fmt.Errorf("creating database %s: %w", name, err)
	}
	return nil
}

func (c *PostgresClient) DatabaseExists(name string) (bool, error) {
	var exists bool
	err := c.db.QueryRow("SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1)", name).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("checking database existence: %w", err)
	}
	return exists, nil
}

// RunMigrations runs all up migrations against a tenant database.
func RunMigrations(tenantDBURL string, migrationsPath string) error {
	db, err := sql.Open("postgres", tenantDBURL)
	if err != nil {
		return fmt.Errorf("opening tenant db for migration: %w", err)
	}
	defer db.Close()

	driver, err := postgres.WithInstance(db, &postgres.Config{})
	if err != nil {
		return fmt.Errorf("creating migration driver: %w", err)
	}

	sourcePath := fmt.Sprintf("file://%s", migrationsPath)
	m, err := migrate.NewWithDatabaseInstance(sourcePath, "postgres", driver)
	if err != nil {
		return fmt.Errorf("creating migrate instance: %w", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("running migrations: %w", err)
	}

	return nil
}

// ConnectTenant opens a connection to a specific tenant database.
func ConnectTenant(tenantURLTemplate string, slug string) (*sql.DB, error) {
	url := strings.Replace(tenantURLTemplate, "{slug}", slug, 1)
	db, err := sql.Open("postgres", url)
	if err != nil {
		return nil, fmt.Errorf("opening tenant database: %w", err)
	}
	if err := db.Ping(); err != nil {
		db.Close()
		return nil, fmt.Errorf("pinging tenant database: %w", err)
	}
	return db, nil
}
