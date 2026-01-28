-- Migration: Fix infinite recursion in contract_collaborators RLS policies
-- Description: Replace recursive policy with direct table access using security definer function
-- Date: 2026-01-28

-- Drop problematic policies
DROP POLICY IF EXISTS "Users can view contract collaborators" ON contract_collaborators;
DROP POLICY IF EXISTS "Users can update their own invitations" ON contract_collaborators;

-- Create security definer function to check if user is collaborator
-- This bypasses RLS and prevents infinite recursion
CREATE OR REPLACE FUNCTION is_contract_collaborator(
  p_contract_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM contract_collaborators
    WHERE contract_id = p_contract_id
    AND user_id = p_user_id
    AND status = 'accepted'
  );
$$;

-- Create security definer function to check if user is contract owner
CREATE OR REPLACE FUNCTION is_contract_owner(
  p_contract_id UUID,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM contract_generations
    WHERE id = p_contract_id
    AND user_id = p_user_id
  );
$$;

-- Recreate SELECT policy without recursion
CREATE POLICY "Users can view contract collaborators"
  ON contract_collaborators
  FOR SELECT
  USING (
    -- Owner can see all collaborators
    is_contract_owner(contract_id)
    OR
    -- Collaborator can see other collaborators (using security definer function)
    is_contract_collaborator(contract_id)
  );

-- Recreate UPDATE policy without recursion
CREATE POLICY "Users can update their own invitations"
  ON contract_collaborators
  FOR UPDATE
  USING (
    -- User can update their own invitation
    user_id = auth.uid()
    OR
    -- Contract owner can update any collaborator
    is_contract_owner(contract_id)
  );

-- Add index for performance on security definer functions
CREATE INDEX IF NOT EXISTS idx_contract_collaborators_status_lookup
  ON contract_collaborators(contract_id, user_id, status);

-- Add comment explaining the fix
COMMENT ON FUNCTION is_contract_collaborator IS 'Security definer function to check collaborator status without RLS recursion';
COMMENT ON FUNCTION is_contract_owner IS 'Security definer function to check contract ownership without RLS recursion';
