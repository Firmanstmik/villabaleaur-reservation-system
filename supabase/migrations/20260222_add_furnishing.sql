-- Migration: Add furnishing column to properties table
-- Date: 2026-02-22
-- Description: Adds furnishing status (unfurnished, semi-furnished, fully-furnished)

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS furnishing VARCHAR(50) DEFAULT 'unfurnished';
