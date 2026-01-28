-- Migration: Create contract_collaborators table
-- Description: Allows sharing contracts for collaborative editing (max 3 collaborators)
-- Date: 2026-01-28

-- Create contract_collaborators table
CREATE TABLE IF NOT EXISTS contract_collaborators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES contract_generations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('editor', 'viewer')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  permissions JSONB DEFAULT '{"can_edit": true, "can_delete": false, "can_share": false}'::jsonb,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(contract_id, user_id)
);

-- Create indexes
CREATE INDEX idx_contract_collaborators_contract_id ON contract_collaborators(contract_id);
CREATE INDEX idx_contract_collaborators_user_id ON contract_collaborators(user_id);
CREATE INDEX idx_contract_collaborators_status ON contract_collaborators(status);
CREATE INDEX idx_contract_collaborators_invited_by ON contract_collaborators(invited_by);

-- Enable RLS
ALTER TABLE contract_collaborators ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view collaborators of their own contracts or contracts where they are collaborators
CREATE POLICY "Users can view contract collaborators"
  ON contract_collaborators
  FOR SELECT
  USING (
    -- Owner can see all collaborators
    contract_id IN (
      SELECT id FROM contract_generations WHERE user_id = auth.uid()
    )
    OR
    -- Collaborator can see other collaborators
    contract_id IN (
      SELECT contract_id FROM contract_collaborators WHERE user_id = auth.uid()
    )
  );

-- Only contract owners can invite collaborators
CREATE POLICY "Contract owners can invite collaborators"
  ON contract_collaborators
  FOR INSERT
  WITH CHECK (
    invited_by = auth.uid()
    AND contract_id IN (
      SELECT id FROM contract_generations WHERE user_id = auth.uid()
    )
  );

-- Users can update their own invitations (accept/reject)
CREATE POLICY "Users can update their own invitations"
  ON contract_collaborators
  FOR UPDATE
  USING (
    user_id = auth.uid()
    OR contract_id IN (
      SELECT id FROM contract_generations WHERE user_id = auth.uid()
    )
  );

-- Only contract owners can delete collaborators
CREATE POLICY "Contract owners can delete collaborators"
  ON contract_collaborators
  FOR DELETE
  USING (
    contract_id IN (
      SELECT id FROM contract_generations WHERE user_id = auth.uid()
    )
  );

-- Function to check max collaborators limit (3)
CREATE OR REPLACE FUNCTION check_max_collaborators()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM contract_collaborators
    WHERE contract_id = NEW.contract_id
    AND status = 'accepted'
  ) >= 3 THEN
    RAISE EXCEPTION 'Maximum 3 collaborators allowed per contract';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce max collaborators
CREATE TRIGGER enforce_max_collaborators
  BEFORE INSERT ON contract_collaborators
  FOR EACH ROW
  EXECUTE FUNCTION check_max_collaborators();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contract_collaborators_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE TRIGGER update_contract_collaborators_timestamp
  BEFORE UPDATE ON contract_collaborators
  FOR EACH ROW
  EXECUTE FUNCTION update_contract_collaborators_updated_at();

-- Add comment
COMMENT ON TABLE contract_collaborators IS 'Collaborative editing for contracts with max 3 collaborators';
COMMENT ON COLUMN contract_collaborators.role IS 'editor: can edit, viewer: read-only';
COMMENT ON COLUMN contract_collaborators.status IS 'pending: invited, accepted: active, rejected: declined';
COMMENT ON COLUMN contract_collaborators.permissions IS 'Fine-grained permissions for collaborator';
