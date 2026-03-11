-- Tenant database initial schema
-- Multi-language fields use JSONB: {"en": "...", "tr": "...", "de": "..."}

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name JSONB NOT NULL DEFAULT '{}',
    slug VARCHAR(255) UNIQUE NOT NULL,
    image VARCHAR(500),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INT NOT NULL DEFAULT 0,
    seo_meta JSONB
);

CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name JSONB NOT NULL DEFAULT '{}',
    slug VARCHAR(255) UNIQUE NOT NULL,
    description JSONB,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    compare_at_price DECIMAL(10, 2),
    sku VARCHAR(100),
    stock INT NOT NULL DEFAULT 0,
    images JSONB NOT NULL DEFAULT '[]',
    variants JSONB NOT NULL DEFAULT '[]',
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    seo_meta JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_sku ON products(sku);

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    locale VARCHAR(10) NOT NULL DEFAULT 'tr',
    addresses JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_email ON customers(email);

-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'TRY',
    exchange_rate DECIMAL(10, 6),
    items JSONB NOT NULL DEFAULT '[]',
    shipping_address JSONB,
    billing_address JSONB,
    locale VARCHAR(10) NOT NULL DEFAULT 'tr',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Pages
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title JSONB NOT NULL DEFAULT '{}',
    slug VARCHAR(255) UNIQUE NOT NULL,
    content JSONB,
    template VARCHAR(50) NOT NULL DEFAULT 'default',
    is_published BOOLEAN NOT NULL DEFAULT false,
    seo_meta JSONB,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_is_published ON pages(is_published);

-- Settings
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL DEFAULT '{}',
    "group" VARCHAR(50) NOT NULL DEFAULT 'general'
);

CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_group ON settings("group");

-- Media
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(500) NOT NULL,
    url VARCHAR(1000) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INT NOT NULL DEFAULT 0,
    alt JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
