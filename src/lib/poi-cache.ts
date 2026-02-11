/**
 * POI caching layer
 * Handles browser sessionStorage, in-memory, and database caching
 */

import { NearbyPOI } from '@/types/poi';
import { supabase } from './supabase';

// In-memory cache for fast access
const memoryCache = new Map<
  string,
  { result: NearbyPOI[]; timestamp: number }
>();

const MEMORY_CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
const BROWSER_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Generate cache key from coordinates
 */
function getCacheKey(lat: number, lng: number): string {
  return `poi_${lat.toFixed(4)}_${lng.toFixed(4)}`;
}

/**
 * Get POIs from browser sessionStorage
 */
function getFromBrowserCache(lat: number, lng: number): NearbyPOI[] | null {
  try {
    const key = getCacheKey(lat, lng);
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > BROWSER_CACHE_TTL) {
      sessionStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.warn('Error reading from browser cache:', error);
    return null;
  }
}

/**
 * Store POIs in browser sessionStorage
 */
function storeBrowserCache(
  lat: number,
  lng: number,
  pois: NearbyPOI[]
): void {
  try {
    const key = getCacheKey(lat, lng);
    sessionStorage.setItem(
      key,
      JSON.stringify({
        data: pois,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.warn('Error storing to browser cache:', error);
  }
}

/**
 * Get POIs from in-memory cache
 */
function getFromMemoryCache(lat: number, lng: number): NearbyPOI[] | null {
  const key = getCacheKey(lat, lng);
  const cached = memoryCache.get(key);

  if (!cached) return null;

  if (Date.now() - cached.timestamp > MEMORY_CACHE_TTL) {
    memoryCache.delete(key);
    return null;
  }

  return cached.result;
}

/**
 * Store POIs in in-memory cache
 */
function storeMemoryCache(
  lat: number,
  lng: number,
  pois: NearbyPOI[]
): void {
  const key = getCacheKey(lat, lng);
  memoryCache.set(key, {
    result: pois,
    timestamp: Date.now(),
  });
}

/**
 * Get POIs from database cache
 */
export async function getFromDatabaseCache(
  lat: number,
  lng: number
): Promise<NearbyPOI[] | null> {
  try {
    const latRounded = Math.round(lat * 10000) / 10000;
    const lngRounded = Math.round(lng * 10000) / 10000;

    const { data, error } = await supabase
      .from('poi_cache')
      .select('poi_data, expires_at')
      .eq('latitude', latRounded)
      .eq('longitude', lngRounded)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - this is OK
        return null;
      }
      throw error;
    }

    return data?.poi_data || null;
  } catch (error) {
    console.warn('Error reading from database cache:', error);
    return null;
  }
}

/**
 * Store POIs in database cache
 */
export async function storeDatabaseCache(
  lat: number,
  lng: number,
  pois: NearbyPOI[],
  source: 'osm' | 'mapbox' | 'manual' = 'osm'
): Promise<void> {
  try {
    const latRounded = Math.round(lat * 10000) / 10000;
    const lngRounded = Math.round(lng * 10000) / 10000;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Expire in 30 days

    // Upsert: insert or update if exists
    const { error } = await supabase
      .from('poi_cache')
      .upsert(
        {
          latitude: latRounded,
          longitude: lngRounded,
          poi_data: pois,
          fetched_at: new Date().toISOString(),
          expires_at: expiresAt.toISOString(),
          source,
        },
        {
          onConflict: 'latitude,longitude',
        }
      );

    if (error) throw error;
  } catch (error) {
    console.warn('Error storing to database cache:', error);
    // Don't throw - cache failure shouldn't block POI retrieval
  }
}

/**
 * Get POIs from all caches (tries in order: browser → memory → database)
 * @returns Cached POIs or null if not found
 */
export async function getFromAllCaches(
  lat: number,
  lng: number
): Promise<NearbyPOI[] | null> {
  // 1. Try browser cache (fastest)
  const browserCached = getFromBrowserCache(lat, lng);
  if (browserCached) {
    console.debug('POI cache hit (browser)');
    return browserCached;
  }

  // 2. Try memory cache (fast)
  const memoryCached = getFromMemoryCache(lat, lng);
  if (memoryCached) {
    console.debug('POI cache hit (memory)');
    // Also store in browser cache for next time
    storeBrowserCache(lat, lng, memoryCached);
    return memoryCached;
  }

  // 3. Try database cache (slower but persistent)
  const dbCached = await getFromDatabaseCache(lat, lng);
  if (dbCached) {
    console.debug('POI cache hit (database)');
    // Also store in browser and memory caches
    storeBrowserCache(lat, lng, dbCached);
    storeMemoryCache(lat, lng, dbCached);
    return dbCached;
  }

  return null;
}

/**
 * Store POIs in all caches
 */
export async function storeInAllCaches(
  lat: number,
  lng: number,
  pois: NearbyPOI[],
  source: 'osm' | 'mapbox' | 'manual' = 'osm'
): Promise<void> {
  // Store in browser cache (fastest)
  storeBrowserCache(lat, lng, pois);

  // Store in memory cache
  storeMemoryCache(lat, lng, pois);

  // Store in database cache (async, don't wait)
  storeDatabaseCache(lat, lng, pois, source).catch((error) => {
    console.error('Failed to store in database cache:', error);
  });
}

/**
 * Clear all caches for a specific location (used when address changes)
 */
export async function clearCache(lat: number, lng: number): Promise<void> {
  try {
    // Clear browser cache
    const key = getCacheKey(lat, lng);
    sessionStorage.removeItem(key);

    // Clear memory cache
    memoryCache.delete(key);

    // Clear database cache
    const latRounded = Math.round(lat * 10000) / 10000;
    const lngRounded = Math.round(lng * 10000) / 10000;

    await supabase
      .from('poi_cache')
      .delete()
      .eq('latitude', latRounded)
      .eq('longitude', lngRounded);
  } catch (error) {
    console.warn('Error clearing cache:', error);
  }
}

/**
 * Get cache statistics (for debugging/monitoring)
 */
export function getCacheStats(): {
  memorySize: number;
  memoryCachedCoordinates: string[];
} {
  return {
    memorySize: memoryCache.size,
    memoryCachedCoordinates: Array.from(memoryCache.keys()),
  };
}
