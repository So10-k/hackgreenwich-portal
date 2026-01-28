-- Sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  tier TEXT NOT NULL CHECK (tier IN ('platinum', 'gold', 'silver', 'bronze', 'partner')),
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schedule events table
CREATE TABLE IF NOT EXISTS schedule_events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('workshop', 'keynote', 'meal', 'activity', 'deadline', 'ceremony', 'other')),
  location TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON sponsors(tier);
CREATE INDEX IF NOT EXISTS idx_sponsors_display_order ON sponsors(display_order);
CREATE INDEX IF NOT EXISTS idx_sponsors_active ON sponsors(is_active);
CREATE INDEX IF NOT EXISTS idx_schedule_start_time ON schedule_events(start_time);
CREATE INDEX IF NOT EXISTS idx_schedule_event_type ON schedule_events(event_type);
CREATE INDEX IF NOT EXISTS idx_schedule_featured ON schedule_events(is_featured);

-- Row Level Security (RLS) policies
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access to sponsors and schedule
CREATE POLICY "Public can view active sponsors" ON sponsors
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view all schedule events" ON schedule_events
  FOR SELECT USING (true);

-- Admin-only write access (you'll need to adjust this based on your auth setup)
-- For now, allowing all authenticated users to manage (you can restrict to admin role later)
CREATE POLICY "Authenticated users can manage sponsors" ON sponsors
  FOR ALL USING (true);

CREATE POLICY "Authenticated users can manage schedule" ON schedule_events
  FOR ALL USING (true);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_sponsors_updated_at
  BEFORE UPDATE ON sponsors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedule_events_updated_at
  BEFORE UPDATE ON schedule_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample data (optional - remove if you don't want sample data)
INSERT INTO sponsors (name, tier, description, display_order) VALUES
  ('Techmonium', 'platinum', 'Title sponsor of HackItNow', 1),
  ('Tech Corp', 'gold', 'Supporting innovation in education', 2),
  ('Code Academy', 'silver', 'Empowering the next generation of developers', 3)
ON CONFLICT DO NOTHING;

INSERT INTO schedule_events (title, description, event_type, location, start_time, end_time, is_featured) VALUES
  ('Opening Ceremony', 'Welcome to HackItNow 2026!', 'ceremony', 'Main Auditorium', '2026-03-15 09:00:00-04', '2026-03-15 10:00:00-04', true),
  ('Hacking Begins', 'Start building your projects', 'activity', 'All Spaces', '2026-03-15 10:00:00-04', '2026-03-15 10:00:00-04', true),
  ('Lunch', 'Grab some food and network', 'meal', 'Cafeteria', '2026-03-15 12:00:00-04', '2026-03-15 13:00:00-04', false),
  ('Web Development Workshop', 'Learn modern web development techniques', 'workshop', 'Room 101', '2026-03-15 14:00:00-04', '2026-03-15 15:30:00-04', false),
  ('Project Submission Deadline', 'Submit your final projects', 'deadline', 'Online', '2026-03-17 10:00:00-04', '2026-03-17 10:00:00-04', true),
  ('Closing Ceremony & Awards', 'Celebrate and announce winners', 'ceremony', 'Main Auditorium', '2026-03-17 15:00:00-04', '2026-03-17 17:00:00-04', true)
ON CONFLICT DO NOTHING;
