/**
 * Main POI Service
 * Entry point for fetching nearby points of interest
 * Handles caching, API calls, and error handling
 */

import { NearbyPOI } from '@/types/poi';
import { queryOverpassAPI } from './poi-overpass';
import {
  getFromAllCaches,
  storeInAllCaches,
  clearCache,
} from './poi-cache';
import { isValidCoordinates } from './poi-utils';
import {
  trackPOIFetch,
  trackCacheHit,
  trackCacheMiss,
} from './poi-monitoring';

/**
 * Fetch nearby POIs for a given location
 * @param latitude - Location latitude
 * @param longitude - Location longitude
 * @returns Array of NearbyPOI objects
 * @throws Error if coordinates are invalid or API fails after retry
 */
export async function fetchNearbyPOIs(
  latitude: number,
  longitude: number
): Promise<NearbyPOI[]> {
  const startTime = performance.now();

  // Validate coordinates
  if (!isValidCoordinates(latitude, longitude)) {
    const error = `Invalid coordinates: latitude=${latitude}, longitude=${longitude}`;
    trackPOIFetch(false, 0, error);
    throw new Error(error);
  }

  try {
    // Try all caches first
    const cached = await getFromAllCaches(latitude, longitude);
    if (cached) {
      trackCacheHit();
      return cached;
    }

    trackCacheMiss();
    console.debug(`Fetching POIs for ${latitude}, ${longitude}`);

    // Call OpenStreetMap Overpass API
    const pois = await queryOverpassAPI(latitude, longitude);

    // Store in all caches
    await storeInAllCaches(latitude, longitude, pois, 'osm');

    const fetchTime = performance.now() - startTime;
    trackPOIFetch(true, fetchTime);

    return pois;
  } catch (error) {
    const fetchTime = performance.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    trackPOIFetch(false, fetchTime, errorMessage);
    console.error('Error fetching POIs:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to fetch nearby amenities'
    );
  }
}

/**
 * Refresh POI data for a location (bypass cache)
 * @param latitude - Location latitude
 * @param longitude - Location longitude
 * @returns Array of fresh NearbyPOI objects
 */
export async function refreshNearbyPOIs(
  latitude: number,
  longitude: number
): Promise<NearbyPOI[]> {
  // Validate coordinates
  if (!isValidCoordinates(latitude, longitude)) {
    throw new Error(
      `Invalid coordinates: latitude=${latitude}, longitude=${longitude}`
    );
  }

  try {
    // Clear existing cache
    await clearCache(latitude, longitude);

    // Fetch fresh data from API
    const pois = await queryOverpassAPI(latitude, longitude);

    // Store in caches
    await storeInAllCaches(latitude, longitude, pois, 'osm');

    return pois;
  } catch (error) {
    console.error('Error refreshing POIs:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Failed to refresh nearby amenities'
    );
  }
}
