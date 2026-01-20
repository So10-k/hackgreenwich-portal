-- ============================================
-- HackGreenwich Judges Portal Setup
-- ============================================
-- Run this SQL in your Supabase SQL Editor to set up the judges portal

-- Step 1: Add 'judge' role option (if not already exists)
-- Note: The users table already has a role column, so we just need to ensure 'judge' is a valid value
-- No schema change needed, just document that valid roles are: 'user', 'admin', 'judge'

-- Step 2: Create judge_announcements table
CREATE TABLE IF NOT EXISTS public.judge_announcements (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  posted_by_id BIGINT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Step 3: Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_judge_announcements_created_at ON public.judge_announcements(created_at DESC);

-- Step 4: Enable Row Level Security
ALTER TABLE public.judge_announcements ENABLE ROW LEVEL SECURITY;

-- Step 5: Create RLS policies for judge_announcements
-- Judges can read all judge announcements
CREATE POLICY "Judges can view judge announcements"
  ON public.judge_announcements
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'judge'
    )
  );

-- Admins can create judge announcements
CREATE POLICY "Admins can create judge announcements"
  ON public.judge_announcements
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Admins can update judge announcements
CREATE POLICY "Admins can update judge announcements"
  ON public.judge_announcements
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Admins can delete judge announcements
CREATE POLICY "Admins can delete judge announcements"
  ON public.judge_announcements
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Step 6: Grant permissions
GRANT ALL ON public.judge_announcements TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.judge_announcements_id_seq TO authenticated;

-- ============================================
-- How to create a judge account:
-- ============================================
-- After a user registers normally, run this SQL to promote them to judge:
-- 
-- UPDATE public.users
-- SET role = 'judge'
-- WHERE email = 'judge@example.com';
--
-- ============================================
