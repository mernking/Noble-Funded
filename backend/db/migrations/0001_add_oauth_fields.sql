-- Migration: Add OAuth fields to users table
-- Date: 2026-03-19

-- Add provider field (email | google)
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(20) DEFAULT 'email';

-- Add supabase_user_id field for linking OAuth users
ALTER TABLE users ADD COLUMN IF NOT EXISTS supabase_user_id VARCHAR(255);

-- Make password_hash nullable (for OAuth users)
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Create index on supabase_user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_supabase_user_id ON users(supabase_user_id);

-- Create index on provider
CREATE INDEX IF NOT EXISTS idx_users_provider ON users(provider);
