-- Migration: Add all missing columns to properties table
-- Date: 2026-02-22
-- Description: Ensures every column used by the listing form exists.
--              Uses IF NOT EXISTS so already-present columns are safely skipped.

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS formatted_address TEXT,
  ADD COLUMN IF NOT EXISTS latitude NUMERIC(10,8),
  ADD COLUMN IF NOT EXISTS longitude NUMERIC(11,8),
  ADD COLUMN IF NOT EXISTS price_type VARCHAR(20) DEFAULT 'sale',
  ADD COLUMN IF NOT EXISTS ownership VARCHAR(50),
  ADD COLUMN IF NOT EXISTS year_built VARCHAR(10),
  ADD COLUMN IF NOT EXISTS listing_code VARCHAR(50),
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS parking_spaces INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS parking_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS hoa_fees NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS property_tax NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lot_size NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS land_size NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS zoning VARCHAR(50),
  ADD COLUMN IF NOT EXISTS furnishing VARCHAR(50) DEFAULT 'unfurnished',
  ADD COLUMN IF NOT EXISTS is_investment BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS rental_income_estimate NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS roi_percent NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS stories INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_renovated INTEGER,
  ADD COLUMN IF NOT EXISTS lease_years INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS available_date DATE,
  ADD COLUMN IF NOT EXISTS interior_features JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS appliances JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS hvac_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS outdoor_features JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS community_amenities JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS lifestyle_tags JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS energy_rating VARCHAR(10),
  ADD COLUMN IF NOT EXISTS virtual_tour_url TEXT,
  ADD COLUMN IF NOT EXISTS video_url TEXT,
  ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_modified_at TIMESTAMPTZ;

-- Fix status check constraint to match app values
ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_status_check;
ALTER TABLE properties ADD CONSTRAINT properties_status_check
  CHECK (status = ANY (ARRAY['draft', 'active', 'under_offer', 'sold', 'archived']));
