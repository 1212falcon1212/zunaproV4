export function validateConfig(config: Record<string, unknown>) {
  const requiredKeys = [
    'DATABASE_MASTER_URL',
    'DATABASE_TENANT_URL_TEMPLATE',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
  ];

  for (const key of requiredKeys) {
    if (!config[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return config;
}
