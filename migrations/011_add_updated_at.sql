-- Migration 011: Add updated_at columns for better sitemap lastmod tracking
-- Using updated_at instead of created_at gives crawlers accurate lastmod dates

ALTER TABLE aircraft ADD COLUMN updated_at TEXT;
ALTER TABLE airlines ADD COLUMN updated_at TEXT;

-- Backfill updated_at from created_at for existing rows
UPDATE aircraft SET updated_at = created_at;
UPDATE airlines SET updated_at = created_at;
