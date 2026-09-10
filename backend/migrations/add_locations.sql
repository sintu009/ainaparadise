-- Run once: psql -U postgres -d aina_paradise -f backend/migrations/add_locations.sql

CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE rooms ADD COLUMN IF NOT EXISTS location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL;

-- Seed example locations
INSERT INTO locations (name, city, state, description) VALUES
('Naal', 'Bikaner', 'Rajasthan', 'Aina Paradise at Naal, Bikaner — Jaisalmer Road'),
('Belsar', 'Bikaner', 'Rajasthan', 'Aina Paradise at Belsar, Bikaner'),
('Dehradun', 'Dehradun', 'Uttarakhand', 'Aina Paradise at Dehradun')
ON CONFLICT DO NOTHING;
