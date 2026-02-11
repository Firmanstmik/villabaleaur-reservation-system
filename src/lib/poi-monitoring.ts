/**
 * POI Monitoring and Analytics
 * Tracks POI fetch success rates, cache performance, and API usage
 */

interface POIAnalytics {
  totalFetches: number;
  successfulFetches: number;
  failedFetches: number;
  cacheHits: number;
  cacheMisses: number;
  averageFetchTime: number;
  lastFetchTime?: Date;
  errors: string[];
}

// In-memory analytics store
const analytics: POIAnalytics = {
  totalFetches: 0,
  successfulFetches: 0,
  failedFetches: 0,
  cacheHits: 0,
  cacheMisses: 0,
  averageFetchTime: 0,
  errors: [],
};

const fetchTimes: number[] = [];

/**
 * Track a POI fetch attempt
 */
export function trackPOIFetch(
  success: boolean,
  fetchTimeMs: number,
  error?: string
): void {
  analytics.totalFetches++;

  if (success) {
    analytics.successfulFetches++;
  } else {
    analytics.failedFetches++;
    if (error) {
      analytics.errors.push(`${new Date().toISOString()}: ${error}`);
      // Keep only last 50 errors
      if (analytics.errors.length > 50) {
        analytics.errors = analytics.errors.slice(-50);
      }
    }
  }

  fetchTimes.push(fetchTimeMs);
  if (fetchTimes.length > 100) {
    fetchTimes.shift();
  }

  // Recalculate average
  analytics.averageFetchTime =
    fetchTimes.reduce((a, b) => a + b, 0) / fetchTimes.length;
  analytics.lastFetchTime = new Date();
}

/**
 * Track a cache hit
 */
export function trackCacheHit(): void {
  analytics.cacheHits++;
}

/**
 * Track a cache miss
 */
export function trackCacheMiss(): void {
  analytics.cacheMisses++;
}

/**
 * Get current analytics
 */
export function getPOIAnalytics(): POIAnalytics {
  return {
    ...analytics,
    // Calculate success rate
  };
}

/**
 * Get analytics as formatted string (for logging)
 */
export function formatPOIAnalytics(): string {
  const total = analytics.totalFetches || 1;
  const successRate = (
    (analytics.successfulFetches / total) *
    100
  ).toFixed(2);
  const cacheHitRate = (
    ((analytics.cacheHits /
      (analytics.cacheHits + analytics.cacheMisses || 1)) *
    100) ||
    0
  ).toFixed(2);

  return `
POI Analytics:
  - Total Fetches: ${analytics.totalFetches}
  - Success Rate: ${successRate}%
  - Cache Hit Rate: ${cacheHitRate}%
  - Avg Fetch Time: ${analytics.averageFetchTime.toFixed(2)}ms
  - Recent Errors: ${analytics.errors.length}
  `;
}

/**
 * Log POI metrics to console (for debugging)
 */
export function logPOIMetrics(): void {
  if (process.env.NODE_ENV === 'development') {
    console.debug(formatPOIAnalytics());
  }
}

/**
 * Reset analytics (for testing)
 */
export function resetPOIAnalytics(): void {
  analytics.totalFetches = 0;
  analytics.successfulFetches = 0;
  analytics.failedFetches = 0;
  analytics.cacheHits = 0;
  analytics.cacheMisses = 0;
  analytics.averageFetchTime = 0;
  analytics.lastFetchTime = undefined;
  analytics.errors = [];
  fetchTimes.length = 0;
}
