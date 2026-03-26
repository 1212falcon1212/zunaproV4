const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/** Converts legacy MinIO direct URLs to API proxy URLs */
export function proxyImageUrl(url: string): string {
  if (!url) return url;

  // Already an API proxy URL
  if (url.includes('/media/file/')) return url;

  // Legacy: http://host:port/tenant-xxx/filename.jpg → API proxy
  const minioPattern = /^https?:\/\/[^/]+:\d+\/(tenant-[^/]+)\/(.+)$/;
  const match = url.match(minioPattern);
  if (match) {
    return `${API_URL}/media/file/${match[1]}/${match[2]}`;
  }

  return url;
}
