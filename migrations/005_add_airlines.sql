-- Migration 005: Add airlines and fleet tracking
-- Created: 2026-01-25

-- Airlines table
CREATE TABLE IF NOT EXISTS airlines (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  iata_code TEXT NOT NULL,
  icao_code TEXT,
  headquarters TEXT,
  founded INTEGER,
  fleet_size INTEGER,
  destinations INTEGER,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Airline fleet junction table (which aircraft each airline operates)
CREATE TABLE IF NOT EXISTS airline_fleet (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  airline_slug TEXT NOT NULL,
  aircraft_slug TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  in_service INTEGER DEFAULT 0,
  on_order INTEGER DEFAULT 0,
  cabin_config TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(airline_slug, aircraft_slug),
  FOREIGN KEY (airline_slug) REFERENCES airlines(slug),
  FOREIGN KEY (aircraft_slug) REFERENCES aircraft(slug)
);

-- Add safety fields to aircraft table
ALTER TABLE aircraft ADD COLUMN safety_summary TEXT;
ALTER TABLE aircraft ADD COLUMN incident_count INTEGER DEFAULT 0;
ALTER TABLE aircraft ADD COLUMN last_major_incident TEXT;
ALTER TABLE aircraft ADD COLUMN safety_notes TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_airline_fleet_airline ON airline_fleet(airline_slug);
CREATE INDEX IF NOT EXISTS idx_airline_fleet_aircraft ON airline_fleet(aircraft_slug);
CREATE INDEX IF NOT EXISTS idx_airlines_iata ON airlines(iata_code);
