-- Migration: Create user_friends table
-- Description: System for managing friends/contacts for quick contract sharing
-- Date: 2026-01-28

-- Create user_friends table
CREATE TABLE IF NOT EXISTS user_friends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, friend_id),
  -- Prevent self-friendship
  CHECK (user_id != friend_id)
);

-- Create indexes for performance
CREATE INDEX idx_user_friends_user_id ON user_friends(user_id);
CREATE INDEX idx_user_friends_friend_id ON user_friends(friend_id);
CREATE INDEX idx_user_friends_status ON user_friends(status);
CREATE INDEX idx_user_friends_created_at ON user_friends(created_at DESC);

-- Enable RLS
ALTER TABLE user_friends ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own friend requests (sent or received)
CREATE POLICY "Users can view their own friend relationships"
  ON user_friends
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR friend_id = auth.uid()
  );

-- Users can send friend requests
CREATE POLICY "Users can send friend requests"
  ON user_friends
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND status = 'pending'
  );

-- Users can update friend requests they received (accept/reject)
-- or update their own sent requests (to cancel/block)
CREATE POLICY "Users can update friend requests"
  ON user_friends
  FOR UPDATE
  USING (
    friend_id = auth.uid() -- Receiver can accept/reject
    OR user_id = auth.uid() -- Sender can update
  );

-- Users can delete their own friend relationships
CREATE POLICY "Users can delete friend relationships"
  ON user_friends
  FOR DELETE
  USING (
    user_id = auth.uid()
    OR friend_id = auth.uid()
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_friends_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER update_user_friends_timestamp
  BEFORE UPDATE ON user_friends
  FOR EACH ROW
  EXECUTE FUNCTION update_user_friends_updated_at();

-- Function to prevent duplicate friend requests (reverse direction)
CREATE OR REPLACE FUNCTION check_duplicate_friend_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if reverse relationship exists
  IF EXISTS (
    SELECT 1 FROM user_friends
    WHERE user_id = NEW.friend_id
    AND friend_id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'Friend request already exists in reverse direction';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to prevent duplicates
CREATE TRIGGER prevent_duplicate_friend_request
  BEFORE INSERT ON user_friends
  FOR EACH ROW
  EXECUTE FUNCTION check_duplicate_friend_request();

-- Add comments
COMMENT ON TABLE user_friends IS 'Friends/contacts system for quick contract sharing';
COMMENT ON COLUMN user_friends.user_id IS 'User who sent the friend request';
COMMENT ON COLUMN user_friends.friend_id IS 'User who received the friend request';
COMMENT ON COLUMN user_friends.status IS 'pending: awaiting response, accepted: friends, rejected: declined, blocked: user blocked';
