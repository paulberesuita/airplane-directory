-- Expanded aircraft specifications and per-field source tracking
-- Migration 008: Add detailed specs, family grouping, and sources table

-- Performance columns
ALTER TABLE aircraft ADD COLUMN max_takeoff_weight_kg INTEGER;
ALTER TABLE aircraft ADD COLUMN fuel_capacity_liters INTEGER;
ALTER TABLE aircraft ADD COLUMN service_ceiling_m INTEGER;
ALTER TABLE aircraft ADD COLUMN takeoff_distance_m INTEGER;
ALTER TABLE aircraft ADD COLUMN landing_distance_m INTEGER;
ALTER TABLE aircraft ADD COLUMN climb_rate_fpm INTEGER;

-- Cargo columns
ALTER TABLE aircraft ADD COLUMN cargo_capacity_m3 REAL;
ALTER TABLE aircraft ADD COLUMN max_payload_kg INTEGER;

-- Engine columns
ALTER TABLE aircraft ADD COLUMN engine_thrust_kn REAL;
ALTER TABLE aircraft ADD COLUMN engine_manufacturer TEXT;

-- Commercial columns
ALTER TABLE aircraft ADD COLUMN total_orders INTEGER;
ALTER TABLE aircraft ADD COLUMN total_delivered INTEGER;
ALTER TABLE aircraft ADD COLUMN list_price_usd INTEGER;

-- Family grouping columns
ALTER TABLE aircraft ADD COLUMN family_slug TEXT;
ALTER TABLE aircraft ADD COLUMN variant_order INTEGER;

-- Per-field source tracking table
CREATE TABLE IF NOT EXISTS aircraft_sources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  aircraft_slug TEXT NOT NULL,
  field_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL, -- 'manufacturer', 'aviation_db', 'news', 'regulatory'
  accessed_at TEXT NOT NULL,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (aircraft_slug) REFERENCES aircraft(slug)
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_aircraft_family ON aircraft(family_slug);
CREATE INDEX IF NOT EXISTS idx_sources_aircraft ON aircraft_sources(aircraft_slug);
CREATE INDEX IF NOT EXISTS idx_sources_field ON aircraft_sources(field_name);
