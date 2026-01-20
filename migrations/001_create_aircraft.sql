-- Aircraft table for commercial airplane directory
CREATE TABLE IF NOT EXISTS aircraft (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  description TEXT NOT NULL,
  first_flight TEXT NOT NULL,
  passengers TEXT NOT NULL,
  range_km INTEGER NOT NULL,
  cruise_speed_kmh INTEGER NOT NULL,
  length_m REAL NOT NULL,
  wingspan_m REAL NOT NULL,
  engines TEXT NOT NULL,
  status TEXT NOT NULL,
  fun_fact TEXT,
  source_url TEXT NOT NULL,
  source_name TEXT NOT NULL,
  researched_at TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_aircraft_manufacturer ON aircraft(manufacturer);
CREATE INDEX IF NOT EXISTS idx_aircraft_slug ON aircraft(slug);
