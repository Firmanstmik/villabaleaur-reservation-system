/**
 * Zod schemas for POI validation
 */

import { z } from 'zod';

export const poiCategorySchema = z.enum([
  'school',
  'hospital',
  'supermarket',
  'transport',
  'airport',
  'restaurant',
  'shopping',
  'bank',
  'pharmacy',
  'parking',
  'gym',
  'cafe',
  'park',
  'beach',
  'worship',
  'university',
  'cinema',
]);

/**
 * Single nearby POI validation schema
 */
export const nearbyPOISchema = z.object({
  category: poiCategorySchema,
  name: z.string().min(1, 'POI name is required').max(500),
  distance_meters: z.number().int().min(0).max(100000),
  distance_display: z.string(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  osm_id: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  opening_hours: z.string().optional(),
  custom: z.boolean().optional(),
  verified: z.boolean().optional(),
});

/**
 * Array of nearby POIs validation schema
 */
export const nearbyAmenitiesSchema = z
  .array(nearbyPOISchema)
  .max(50, 'Maximum 50 POIs per property');

/**
 * Validate POI data
 */
export function validateNearbyPOI(data: unknown): z.infer<typeof nearbyPOISchema> {
  return nearbyPOISchema.parse(data);
}

/**
 * Validate array of POIs
 */
export function validateNearbyAmenities(
  data: unknown
): z.infer<typeof nearbyAmenitiesSchema> {
  return nearbyAmenitiesSchema.parse(data);
}

/**
 * Safe validation (returns null on error instead of throwing)
 */
export function validateNearbyPOISafe(
  data: unknown
): z.infer<typeof nearbyPOISchema> | null {
  const result = nearbyPOISchema.safeParse(data);
  return result.success ? result.data : null;
}

/**
 * Safe validation for array of POIs
 */
export function validateNearbyAmenitiesSafe(
  data: unknown
): z.infer<typeof nearbyAmenitiesSchema> | null {
  const result = nearbyAmenitiesSchema.safeParse(data);
  return result.success ? result.data : null;
}
