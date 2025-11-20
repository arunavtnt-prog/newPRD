/**
 * API Response Caching Middleware
 */

import { NextRequest, NextResponse } from "next/server";

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  key?: string; // Custom cache key
  tags?: string[]; // Cache tags for invalidation
  revalidate?: number; // ISR revalidation time
}

// In-memory cache (use Redis in production)
const cache = new Map<string, { data: any; expires: number; tags: string[] }>();

/**
 * Generate cache key from request
 */
export function generateCacheKey(request: NextRequest, customKey?: string): string {
  if (customKey) return customKey;

  const url = new URL(request.url);
  return `${request.method}:${url.pathname}${url.search}`;
}

/**
 * Get cached response
 */
export function getCachedResponse(key: string): any | null {
  const cached = cache.get(key);

  if (!cached) return null;

  // Check if expired
  if (Date.now() > cached.expires) {
    cache.delete(key);
    return null;
  }

  return cached.data;
}

/**
 * Set cached response
 */
export function setCachedResponse(
  key: string,
  data: any,
  ttl: number,
  tags: string[] = []
): void {
  cache.set(key, {
    data,
    expires: Date.now() + ttl * 1000,
    tags,
  });
}

/**
 * Invalidate cache by key
 */
export function invalidateCache(key: string): void {
  cache.delete(key);
}

/**
 * Invalidate cache by tag
 */
export function invalidateCacheByTag(tag: string): void {
  for (const [key, value] of cache.entries()) {
    if (value.tags.includes(tag)) {
      cache.delete(key);
    }
  }
}

/**
 * Clear all cache
 */
export function clearAllCache(): void {
  cache.clear();
}

/**
 * Cache middleware wrapper for API routes
 */
export function withCache(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: CacheOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const ttl = options.ttl || 60; // Default 1 minute
    const tags = options.tags || [];

    // Only cache GET requests
    if (request.method !== "GET") {
      return handler(request);
    }

    // Generate cache key
    const cacheKey = generateCacheKey(request, options.key);

    // Check cache
    const cached = getCachedResponse(cacheKey);
    if (cached) {
      return new NextResponse(JSON.stringify(cached), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Cache": "HIT",
          "Cache-Control": `public, max-age=${ttl}, s-maxage=${ttl}`,
        },
      });
    }

    // Execute handler
    const response = await handler(request);

    // Cache successful responses
    if (response.status === 200) {
      const data = await response.json();
      setCachedResponse(cacheKey, data, ttl, tags);

      return new NextResponse(JSON.stringify(data), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Cache": "MISS",
          "Cache-Control": `public, max-age=${ttl}, s-maxage=${ttl}`,
        },
      });
    }

    return response;
  };
}

/**
 * Cache statistics
 */
export function getCacheStats() {
  let hits = 0;
  let total = cache.size;
  let expired = 0;

  const now = Date.now();
  for (const [_, value] of cache.entries()) {
    if (now > value.expires) {
      expired++;
    }
  }

  return {
    total,
    expired,
    active: total - expired,
    hitRate: total > 0 ? (hits / total) * 100 : 0,
  };
}

/**
 * Response compression helper
 */
export function compressResponse(data: any): string {
  const json = JSON.stringify(data);

  // Only compress if data is large enough
  if (json.length < 1024) {
    return json;
  }

  // In production, use actual compression (gzip, brotli)
  return json;
}

/**
 * ETag generation for conditional requests
 */
export function generateETag(data: any): string {
  const json = JSON.stringify(data);
  let hash = 0;

  for (let i = 0; i < json.length; i++) {
    const char = json.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return `"${hash.toString(36)}"`;
}

/**
 * Handle conditional requests (If-None-Match)
 */
export function handleConditionalRequest(
  request: NextRequest,
  data: any
): NextResponse | null {
  const etag = generateETag(data);
  const ifNoneMatch = request.headers.get("if-none-match");

  if (ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etag,
      },
    });
  }

  return null;
}

/**
 * Create cached API response
 */
export function createCachedResponse(
  data: any,
  options: {
    ttl?: number;
    etag?: boolean;
    compress?: boolean;
  } = {}
): NextResponse {
  const ttl = options.ttl || 60;
  const etag = options.etag ? generateETag(data) : undefined;
  const body = options.compress ? compressResponse(data) : JSON.stringify(data);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Cache-Control": `public, max-age=${ttl}, s-maxage=${ttl}`,
  };

  if (etag) {
    headers["ETag"] = etag;
  }

  if (options.compress && body.length >= 1024) {
    headers["Content-Encoding"] = "gzip";
  }

  return new NextResponse(body, {
    status: 200,
    headers,
  });
}
