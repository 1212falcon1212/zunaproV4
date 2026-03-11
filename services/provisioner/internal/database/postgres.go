package database

import (
	"database/sql"
	"fmt"
	"strings"

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
	safeName := strings.ReplaceAll(name, "'", "''")
	_, err := c.db.Exec(fmt.Sprintf("CREATE DATABASE %q", safeName))
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
