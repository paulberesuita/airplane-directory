-- Aircraft history table for timeline, stories, and facts
CREATE TABLE IF NOT EXISTS aircraft_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  aircraft_slug TEXT NOT NULL,
  content_type TEXT NOT NULL,  -- 'milestone', 'development', 'story', 'fact', 'record', 'incident', 'legacy'
  year INTEGER,                -- optional, for timeline ordering (NULL for general facts/stories)
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT,
  source_name TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (aircraft_slug) REFERENCES aircraft(slug)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_history_aircraft ON aircraft_history(aircraft_slug);
CREATE INDEX IF NOT EXISTS idx_history_type ON aircraft_history(content_type);
CREATE INDEX IF NOT EXISTS idx_history_year ON aircraft_history(year);
