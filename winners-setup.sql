-- ============================================
-- HackGreenwich Winners Setup
-- ============================================
-- Run this SQL in your Supabase SQL Editor to set up the winners feature

-- Step 1: Create winners table
CREATE TABLE IF NOT EXISTS public.winners (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  team_name VARCHAR(255) NOT NULL,
  project_title VARCHAR(255) NOT NULL,
  project_description TEXT NOT NULL,
  prize_category VARCHAR(100) NOT NULL, -- '1st Place', '2nd Place', '3rd Place', 'Best Design', etc.
  prize_amount VARCHAR(50), -- e.g., '$5,000', '$2,500', 'iPad Pro'
  project_image_url VARCHAR(500),
  devpost_url VARCHAR(500),
  github_url VARCHAR(500),
  team_members TEXT[], -- Array of team member names
  display_order INT NOT NULL DEFAULT 0, -- For controlling display order
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Step 2: Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_winners_display_order ON public.winners(display_order ASC);
CREATE INDEX IF NOT EXISTS idx_winners_prize_category ON public.winners(prize_category);

-- Step 3: Enable Row Level Security
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies for winners
-- Everyone can view winners (public page)
CREATE POLICY "Anyone can view winners"
  ON public.winners
  FOR SELECT
  USING (true);

-- Admins can create winners
CREATE POLICY "Admins can create winners"
  ON public.winners
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Admins can update winners
CREATE POLICY "Admins can update winners"
  ON public.winners
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Admins can delete winners
CREATE POLICY "Admins can delete winners"
  ON public.winners
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Step 5: Grant permissions
GRANT ALL ON public.winners TO authenticated;
GRANT SELECT ON public.winners TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.winners_id_seq TO authenticated;

-- ============================================
-- Sample Data (Optional)
-- ============================================
-- Uncomment to add sample winners for testing:
/*
INSERT INTO public.winners (team_name, project_title, project_description, prize_category, prize_amount, team_members, display_order)
VALUES 
  ('Team Alpha', 'EcoTracker', 'A mobile app that helps users track their carbon footprint and suggests eco-friendly alternatives.', '1st Place', '$5,000', ARRAY['Alice Johnson', 'Bob Smith', 'Carol White'], 1),
  ('Team Beta', 'HealthHub', 'An AI-powered health assistant that provides personalized wellness recommendations.', '2nd Place', '$2,500', ARRAY['David Lee', 'Emma Davis'], 2),
  ('Team Gamma', 'CodeMentor', 'A peer-to-peer coding education platform connecting learners with mentors.', '3rd Place', '$1,000', ARRAY['Frank Miller', 'Grace Chen', 'Henry Wilson'], 3);
*/
