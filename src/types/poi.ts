/**
 * POI (Points of Interest) type definitions
 * Used for storing and managing nearby amenities for property listings
 */

export type POICategory =
  | 'school'
  | 'hospital'
  | 'supermarket'
  | 'transport'
  | 'airport'
  | 'restaurant'
  | 'shopping'
  | 'bank'
  | 'pharmacy'
  | 'parking'
  | 'gym'
  | 'cafe'
  | 'park'
  | 'beach'
  | 'worship'
  | 'university'
  | 'cinema';

export interface POICategoryConfig {
  icon: string;
  label: string;
  osmTag: string;
  priority: number;
  radius: number; // in meters
}

export const POI_CATEGORIES: Record<POICategory, POICategoryConfig> = {
  school: {
    icon: '🏫',
    label: 'Schools',
    osmTag: 'amenity=school',
    priority: 1,
    radius: 3000,
  },
  hospital: {
    icon: '🏥',
    label: 'Hospitals & Clinics',
    osmTag: 'amenity=hospital|amenity=clinic',
    priority: 2,
    radius: 5000,
  },
  supermarket: {
    icon: '🛒',
    label: 'Supermarkets',
    osmTag: 'shop=supermarket',
    priority: 3,
    radius: 2000,
  },
  transport: {
    icon: '🚉',
    label: 'Public Transport',
    osmTag: 'highway=bus_stop|amenity=ferry_terminal|railway=station',
    priority: 4,
    radius: 1000,
  },
  airport: {
    icon: '✈️',
    label: 'Airport',
    osmTag: 'aeroway=aerodrome',
    priority: 5,
    radius: 50000,
  },
  restaurant: {
    icon: '🍽️',
    label: 'Restaurants',
    osmTag: 'amenity=restaurant',
    priority: 6,
    radius: 2000,
  },
  shopping: {
    icon: '🛍️',
    label: 'Shopping Centers',
    osmTag: 'shop=mall',
    priority: 7,
    radius: 5000,
  },
  bank: {
    icon: '🏦',
    label: 'Banks & ATMs',
    osmTag: 'amenity=bank|amenity=atm',
    priority: 8,
    radius: 2000,
  },
  pharmacy: {
    icon: '💊',
    label: 'Pharmacies',
    osmTag: 'amenity=pharmacy',
    priority: 9,
    radius: 2000,
  },
  parking: {
    icon: '🅿️',
    label: 'Parking',
    osmTag: 'amenity=parking',
    priority: 10,
    radius: 1000,
  },
  gym: {
    icon: '💪',
    label: 'Gyms & Fitness',
    osmTag: 'leisure=fitness_centre',
    priority: 11,
    radius: 3000,
  },
  cafe: {
    icon: '☕',
    label: 'Cafes',
    osmTag: 'amenity=cafe',
    priority: 12,
    radius: 1500,
  },
  park: {
    icon: '🌳',
    label: 'Parks',
    osmTag: 'leisure=park',
    priority: 13,
    radius: 2000,
  },
  beach: {
    icon: '🏖️',
    label: 'Beaches & Lakes',
    osmTag: 'natural=beach|natural=water',
    priority: 14,
    radius: 10000,
  },
  worship: {
    icon: '🛐',
    label: 'Places of Worship',
    osmTag: 'amenity=place_of_worship',
    priority: 15,
    radius: 2000,
  },
  university: {
    icon: '🎓',
    label: 'Universities & Colleges',
    osmTag: 'amenity=university|amenity=college',
    priority: 16,
    radius: 5000,
  },
  cinema: {
    icon: '🎭',
    label: 'Cinema & Theatre',
    osmTag: 'amenity=cinema|amenity=theatre',
    priority: 17,
    radius: 5000,
  },
};

/**
 * Nearby POI object stored in the database
 */
export interface NearbyPOI {
  category: POICategory;
  name: string;
  distance_meters: number;
  distance_display: string; // formatted distance like "450m" or "1.2km"
  lat: number;
  lng: number;
  osm_id?: string; // OpenStreetMap element ID (node/123456 or way/789)
  address?: string;
  phone?: string;
  website?: string;
  opening_hours?: string;
  custom?: boolean; // User-added manually
  verified?: boolean; // Admin-verified
}

/**
 * Overpass API element response
 */
export interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags: Record<string, string>;
}

/**
 * Overpass API response
 */
export interface OverpassResponse {
  version: number;
  generator: string;
  osm3s: Record<string, unknown>;
  elements: OverpassElement[];
}

/**
 * POI cache entry in database
 */
export interface POICacheEntry {
  latitude: number;
  longitude: number;
  poi_data: NearbyPOI[];
  fetched_at: string;
  expires_at: string;
  source: 'osm' | 'mapbox' | 'manual';
}
