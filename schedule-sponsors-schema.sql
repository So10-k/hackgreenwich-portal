-- Schedule Events Table
CREATE TABLE IF NOT EXISTS public.schedule_events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(50) NOT NULL, -- 'workshop', 'meal', 'deadline', 'ceremony', 'other'
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location VARCHAR(255),
  is_important BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sponsors Table
CREATE TABLE IF NOT EXISTS public.sponsors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  tier VARCHAR(50) NOT NULL DEFAULT 'bronze', -- 'gold', 'silver', 'bronze', 'partner'
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_schedule_events_start_time ON public.schedule_events(start_time);
CREATE INDEX IF NOT EXISTS idx_schedule_events_event_type ON public.schedule_events(event_type);
CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON public.sponsors(tier);
CREATE INDEX IF NOT EXISTS idx_sponsors_display_order ON public.sponsors(display_order);

-- Enable Row Level Security
ALTER TABLE public.schedule_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for schedule_events (everyone can read, only admins can modify)
CREATE POLICY "Anyone can view schedule events"
  ON public.schedule_events
  FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert schedule events"
  ON public.schedule_events
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update schedule events"
  ON public.schedule_events
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete schedule events"
  ON public.schedule_events
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for sponsors (everyone can read, only admins can modify)
CREATE POLICY "Anyone can view active sponsors"
  ON public.sponsors
  FOR SELECT
  USING (is_active = true OR EXISTS (
    SELECT 1 FROM public.users
    WHERE users.auth_id = auth.uid()
    AND users.role = 'admin'
  ));

CREATE POLICY "Only admins can insert sponsors"
  ON public.sponsors
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update sponsors"
  ON public.sponsors
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete sponsors"
  ON public.sponsors
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );
