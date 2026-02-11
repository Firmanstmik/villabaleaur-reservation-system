/**
 * OpenStreetMap Overpass API client
 * Queries OSM for nearby POIs
 */

import { NearbyPOI, OverpassResponse, OverpassElement } from '@/types/poi';
import {
  calculateDistance,
  formatDistance,
  detectPOICategory,
  deduplicatePOIs,
} from './poi-utils';
import { POI_CATEGORIES } from '@/types/poi';

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';
const REQUEST_TIMEOUT = 10000; // 10 seconds

/**
 * Query OpenStreetMap Overpass API for nearby POIs
 * @param latitude - Center latitude
 * @param longitude - Center longitude
 * @returns Array of NearbyPOI objects
 */
export async function queryOverpassAPI(
  latitude: number,
  longitude: number
): Promise<NearbyPOI[]> {
  const query = buildOverpassQuery(latitude, longitude);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(OVERPASS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status} ${response.statusText}`);
    }

    const data: OverpassResponse = await response.json();
    return parseOverpassResponse(data, latitude, longitude);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Overpass API request timed out after 10 seconds');
      }
      throw error;
    }
    throw new Error('Unknown error querying Overpass API');
  }
}

/**
 * Parse Overpass API response and convert to NearbyPOI array
 */
function parseOverpassResponse(
  data: OverpassResponse,
  refLat: number,
  refLng: number
): NearbyPOI[] {
  const pois: NearbyPOI[] = [];

  for (const element of data.elements || []) {
    // Skip elements without coordinates
    const lat = element.lat || element.center?.lat;
    const lon = element.lon || element.center?.lon;
    if (!lat || !lon) continue;

    // Detect category from tags
    const category = detectPOICategory(element.tags);
    if (!category) continue;

    // Calculate distance
    const distance = calculateDistance(refLat, refLng, lat, lon);

    // Get category config to check radius
    const categoryConfig = POI_CATEGORIES[category as keyof typeof POI_CATEGORIES];
    if (!categoryConfig) continue;

    // Skip if outside radius
    if (distance > categoryConfig.radius) continue;

    // Build POI object
    const name =
      element.tags.name ||
      element.tags['name:en'] ||
      `${category.charAt(0).toUpperCase() + category.slice(1)} (Unnamed)`;

    pois.push({
      category: category as any,
      name,
      distance_meters: distance,
      distance_display: formatDistance(distance),
      lat,
      lng: lon,
      osm_id: `${element.type}/${element.id}`,
      address: element.tags['addr:full'] || element.tags['addr:street'],
      phone: element.tags.phone || element.tags['contact:phone'],
      website: element.tags.website || element.tags['contact:website'],
      opening_hours: element.tags.opening_hours,
      custom: false,
      verified: false,
    });
  }

  // Filter, deduplicate, and sort results
  return filterAndSortPOIs(pois);
}

/**
 * Build Overpass QL query for POI categories
 */
function buildOverpassQuery(latitude: number, longitude: number): string {
  const queries = Object.entries(POI_CATEGORIES)
    .map(([_category, config]) => {
      // Split by pipe for multiple tags in one category
      const tagGroups = config.osmTag.split('|');
      return tagGroups
        .map((tag) => {
          const [key, value] = tag.split('=');
          // Handle pipe-separated values within tags
          if (value.includes('|')) {
            const values = value.split('|');
            return values
              .map(v => `node["${key}"="${v}"](around:${config.radius},${latitude},${longitude});`)
              .join('\n');
          }
          return `node["${key}"="${value}"](around:${config.radius},${latitude},${longitude});`;
        })
        .join('\n');
    })
    .join('\n');

  return `[out:json][timeout:15];
(
${queries}
);
out body;`;
}

/**
 * Filter, deduplicate and sort POIs
 * Keeps top 3 per category, sorted by distance
 */
function filterAndSortPOIs(pois: NearbyPOI[]): NearbyPOI[] {
  // Group by category
  const byCategory = new Map<string, NearbyPOI[]>();
  for (const poi of pois) {
    if (!byCategory.has(poi.category)) {
      byCategory.set(poi.category, []);
    }
    byCategory.get(poi.category)!.push(poi);
  }

  // Take top 3 per category, sorted by distance
  const filtered: NearbyPOI[] = [];
  for (const [_category, categoryPOIs] of byCategory) {
    const sorted = categoryPOIs
      .sort((a, b) => a.distance_meters - b.distance_meters)
      .slice(0, 3);
    filtered.push(...sorted);
  }

  // Deduplicate
  const deduped = deduplicatePOIs(filtered);

  // Sort final result by distance
  return deduped.sort((a, b) => a.distance_meters - b.distance_meters);
}
