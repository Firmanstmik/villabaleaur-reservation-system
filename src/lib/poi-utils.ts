/**
 * POI utility functions
 * Distance calculations and formatting
 */

/**
 * Validates geographic coordinates
 * @param latitude - Latitude (-90 to 90)
 * @param longitude - Longitude (-180 to 180)
 * @returns true if valid
 */
export function isValidCoordinates(
  latitude: number,
  longitude: number
): boolean {
  return (
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !isNaN(latitude) &&
    !isNaN(longitude)
  );
}

/**
 * Calculate distance between two geographic points using Haversine formula
 * @param lat1 - First latitude
 * @param lon1 - First longitude
 * @param lat2 - Second latitude
 * @param lon2 - Second longitude
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) *
      Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // rounded to nearest meter
}

/**
 * Format distance for display
 * @param meters - Distance in meters
 * @returns Formatted string like "450m" or "1.2km"
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }

  const km = meters / 1000;
  return km % 1 === 0 ? `${km}km` : `${km.toFixed(1)}km`;
}

/**
 * Build Overpass QL query for POI categories
 * @param latitude - Center latitude
 * @param longitude - Center longitude
 * @returns OverpassQL query string
 */
export function buildOverpassQuery(latitude: number, longitude: number): string {
  const categories = [
    { osmTag: 'amenity=school', radius: 3000 },
    { osmTag: 'amenity=hospital', radius: 5000 },
    { osmTag: 'amenity=clinic', radius: 5000 },
    { osmTag: 'shop=supermarket', radius: 2000 },
    { osmTag: 'highway=bus_stop', radius: 1000 },
    { osmTag: 'amenity=ferry_terminal', radius: 1000 },
    { osmTag: 'railway=station', radius: 1000 },
    { osmTag: 'aeroway=aerodrome', radius: 50000 },
    { osmTag: 'amenity=restaurant', radius: 2000 },
    { osmTag: 'shop=mall', radius: 5000 },
    { osmTag: 'amenity=bank', radius: 2000 },
    { osmTag: 'amenity=atm', radius: 2000 },
    { osmTag: 'amenity=pharmacy', radius: 2000 },
    { osmTag: 'amenity=parking', radius: 1000 },
    { osmTag: 'leisure=fitness_centre', radius: 3000 },
    { osmTag: 'amenity=cafe', radius: 1500 },
    { osmTag: 'leisure=park', radius: 2000 },
    { osmTag: 'natural=beach', radius: 10000 },
    { osmTag: 'natural=water', radius: 10000 },
    { osmTag: 'amenity=place_of_worship', radius: 2000 },
    { osmTag: 'amenity=university', radius: 5000 },
    { osmTag: 'amenity=college', radius: 5000 },
    { osmTag: 'amenity=cinema', radius: 5000 },
    { osmTag: 'amenity=theatre', radius: 5000 },
  ];

  // Build queries with proper Overpass syntax for each tag
  const queries = categories
    .map(({ osmTag, radius }) => {
      const [key, value] = osmTag.split('=');
      // Handle pipe-separated values (e.g., "hospital|clinic")
      if (value.includes('|')) {
        const values = value.split('|');
        return values
          .map(v => `node["${key}"="${v}"](around:${radius},${latitude},${longitude});`)
          .join('\n');
      }
      return `node["${key}"="${value}"](around:${radius},${latitude},${longitude});`;
    })
    .join('\n');

  return `[out:json][timeout:15];
(
${queries}
);
out body;`;
}

/**
 * Deduplicate POIs by OSM ID or name+category combination
 * @param pois - Array of POI objects (only needs osm_id, name, category, distance_meters)
 * @returns Deduplicated array
 */
export function deduplicatePOIs(
  pois: Array<any>
): Array<any> {
  const seen = new Set<string>();

  return pois.filter((poi) => {
    const key =
      poi.osm_id ||
      `${poi.name}_${poi.category}_${Math.round(poi.distance_meters / 100)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Group POIs by category
 * @param pois - Array of POI objects
 * @returns Object with categories as keys
 */
export function groupPOIsByCategory(
  pois: Array<{ category: string }>
): Record<string, typeof pois> {
  return pois.reduce(
    (acc, poi) => {
      if (!acc[poi.category]) {
        acc[poi.category] = [];
      }
      acc[poi.category].push(poi);
      return acc;
    },
    {} as Record<string, typeof pois>
  );
}

/**
 * Detect POI category from OSM tags
 * @param tags - OSM element tags
 * @returns Category name or null
 */
export function detectPOICategory(
  tags: Record<string, string>
): string | null {
  if (tags.amenity === 'school') return 'school';
  if (tags.amenity === 'hospital') return 'hospital';
  if (tags.amenity === 'clinic') return 'hospital';
  if (tags.shop === 'supermarket') return 'supermarket';
  if (tags.highway === 'bus_stop') return 'transport';
  if (tags.amenity === 'ferry_terminal') return 'transport';
  if (tags.railway === 'station') return 'transport';
  if (tags.aeroway === 'aerodrome') return 'airport';
  if (tags.amenity === 'restaurant') return 'restaurant';
  if (tags.shop === 'mall') return 'shopping';
  if (tags.amenity === 'bank') return 'bank';
  if (tags.amenity === 'atm') return 'bank';
  if (tags.amenity === 'pharmacy') return 'pharmacy';
  if (tags.amenity === 'parking') return 'parking';
  if (tags.leisure === 'fitness_centre') return 'gym';
  if (tags.amenity === 'cafe') return 'cafe';
  if (tags.leisure === 'park') return 'park';
  if (tags.natural === 'beach') return 'beach';
  if (tags.natural === 'water') return 'beach';
  if (tags.amenity === 'place_of_worship') return 'worship';
  if (tags.amenity === 'university') return 'university';
  if (tags.amenity === 'college') return 'university';
  if (tags.amenity === 'cinema') return 'cinema';
  if (tags.amenity === 'theatre') return 'cinema';
  return null;
}
