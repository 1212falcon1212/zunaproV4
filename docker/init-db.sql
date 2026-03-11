-- Initialize platform_master database
-- This script runs automatically when PostgreSQL container starts for the first time

-- The platform_master database is created via POSTGRES_DB env var
-- This script creates any additional setup needed

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Log initialization
DO $$
BEGIN
  RAISE NOTICE 'ZunaPro platform_master database initialized';
END $$;
