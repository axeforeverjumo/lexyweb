-- Migration: Add real-time collaboration fields to contract_collaborators
-- Description: Adds last_seen_at and cursor_position for collaborative editing
-- Date: 2026-01-28

-- Add last_seen_at field for presence tracking
ALTER TABLE contract_collaborators
ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ;

-- Add cursor_position field for real-time cursor tracking
ALTER TABLE contract_collaborators
ADD COLUMN IF NOT EXISTS cursor_position JSONB DEFAULT '{"line": 0, "column": 0}'::jsonb;

-- Create index for last_seen_at for efficient presence queries
CREATE INDEX IF NOT EXISTS idx_contract_collaborators_last_seen_at
ON contract_collaborators(last_seen_at DESC)
WHERE status = 'accepted';

-- Add comment
COMMENT ON COLUMN contract_collaborators.last_seen_at IS 'Timestamp of last activity for presence tracking';
COMMENT ON COLUMN contract_collaborators.cursor_position IS 'Real-time cursor position {line, column} for collaborative editing';
