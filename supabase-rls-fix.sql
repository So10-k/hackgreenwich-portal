-- Fix RLS policies to allow users to read their own profile
-- Run this in your Supabase SQL editor

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
ON users
FOR SELECT
USING (auth.uid() = auth_id);

-- If the above fails because policy already exists, drop and recreate:
-- DROP POLICY IF EXISTS "Users can read own profile" ON users;
-- Then run the CREATE POLICY command above again
