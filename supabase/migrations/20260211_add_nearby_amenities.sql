-- Migration: Add nearby amenities support
-- Date: 2026-02-11
-- Description: Adds support for storing nearby points of interest (POIs) for property listings

-- Step 1: Add nearby_amenities columns to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS nearby_amenities JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS poi_fetched_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS poi_source VARCHAR(20) DEFAULT 'osm';

-- Step 2: Add check constraint for poi_source
ALTER TABLE properties
ADD CONSTRAINT check_poi_source
CHECK (poi_source IN ('osm', 'mapbox', 'manual') OR poi_source IS NULL);

-- Step 3: Create GIN index for JSONB queries (enables efficient filtering by amenity type)
CREATE INDEX IF NOT EXISTS idx_properties_nearby_amenities
ON properties USING GIN (nearby_amenities);

-- Step 4: Create POI cache table for reducing API calls
CREATE TABLE IF NOT EXISTS poi_cache (
  id BIGSERIAL PRIMARY KEY,
  latitude NUMERIC(10, 8) NOT NULL,
  longitude NUMERIC(11, 8) NOT NULL,
  poi_data JSONB NOT NULL,
  fetched_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  source VARCHAR(20) DEFAULT 'osm',
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_poi_coordinates UNIQUE(latitude, longitude)
);

-- Step 5: Add indexes to poi_cache for efficient queries
CREATE INDEX IF NOT EXISTS idx_poi_cache_coords
ON poi_cache(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_poi_cache_expires
ON poi_cache(expires_at);

-- Step 6: Create index on source for analytics
CREATE INDEX IF NOT EXISTS idx_poi_cache_source
ON poi_cache(source);

-- Step 7: Add comments for documentation
COMMENT ON COLUMN properties.nearby_amenities IS
'Array of nearby points of interest (POI) stored as JSONB. Each POI includes category, name, distance, coordinates, and metadata. Max 50 POIs per property.';

COMMENT ON COLUMN properties.poi_fetched_at IS
'Timestamp when nearby_amenities were last fetched/updated.';

COMMENT ON COLUMN properties.poi_source IS
'Source of the POI data: "osm" (OpenStreetMap), "mapbox" (Mapbox), or "manual" (user-added).';

COMMENT ON TABLE poi_cache IS
'Cache table for POI queries to reduce API calls to OpenStreetMap Overpass API. Entries expire after 30 days.';

COMMENT ON COLUMN poi_cache.poi_data IS
'Cached POI data as JSONB array.';

COMMENT ON COLUMN poi_cache.expires_at IS
'When this cache entry will expire. Entries older than this can be safely deleted.';

-- Step 8: Verification queries (run these to verify the migration)
-- Uncomment to run:
/*
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'properties'
AND column_name IN ('nearby_amenities', 'poi_fetched_at', 'poi_source')
ORDER BY ordinal_position;

-- Check indexes
SELECT indexname FROM pg_indexes WHERE tablename = 'properties' AND indexname LIKE '%nearby%';
SELECT indexname FROM pg_indexes WHERE tablename = 'poi_cache';

-- Check constraints
SELECT constraint_name, constraint_type FROM information_schema.table_constraints
WHERE table_name = 'properties' AND constraint_name LIKE '%poi%';

-- Check table exists
SELECT tablename FROM pg_tables WHERE tablename = 'poi_cache';
*/
