-- Mapbox Location Integration - Database Migration
-- Add latitude, longitude, and formatted_address columns to properties table
-- Run this in Supabase SQL Editor

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 8),
ADD COLUMN IF NOT EXISTS longitude NUMERIC(11, 8),
ADD COLUMN IF NOT EXISTS formatted_address TEXT,
ADD COLUMN IF NOT EXISTS geocoding_provider VARCHAR(50) DEFAULT 'mapbox';

-- Create index for location-based queries (enables future proximity searches)
CREATE INDEX IF NOT EXISTS idx_properties_coordinates
ON properties(latitude, longitude);

-- Add constraint to ensure coordinates exist as a pair
ALTER TABLE properties
ADD CONSTRAINT check_coordinates_pair
CHECK (
    (latitude IS NOT NULL AND longitude IS NOT NULL) OR
    (latitude IS NULL AND longitude IS NULL)
);

-- Verification query (run after migration):
-- SELECT column_name, data_type FROM information_schema.columns
-- WHERE table_name = 'properties'
-- AND column_name IN ('latitude', 'longitude', 'formatted_address', 'geocoding_provider');
