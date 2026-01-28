-- Migration: Create contract_chat_history table
-- Description: Stores chat messages for contract editing with Lexy assistant
-- Date: 2026-01-28

-- Create contract_chat_history table
CREATE TABLE IF NOT EXISTS contract_chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES contract_generations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  edit_suggestion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_contract_chat_history_contract_id ON contract_chat_history(contract_id);
CREATE INDEX idx_contract_chat_history_user_id ON contract_chat_history(user_id);
CREATE INDEX idx_contract_chat_history_created_at ON contract_chat_history(created_at DESC);

-- Enable RLS
ALTER TABLE contract_chat_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own contract chat history
CREATE POLICY "Users can view their own contract chat history"
  ON contract_chat_history
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR contract_id IN (
      SELECT id FROM contract_generations WHERE user_id = auth.uid()
    )
  );

-- Users can insert messages for their own contracts
CREATE POLICY "Users can insert messages for their own contracts"
  ON contract_chat_history
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND contract_id IN (
      SELECT id FROM contract_generations WHERE user_id = auth.uid()
    )
  );

-- Users can delete their own contract chat history
CREATE POLICY "Users can delete their own contract chat history"
  ON contract_chat_history
  FOR DELETE
  USING (
    contract_id IN (
      SELECT id FROM contract_generations WHERE user_id = auth.uid()
    )
  );

-- Add comment
COMMENT ON TABLE contract_chat_history IS 'Chat history for contract editing with Lexy AI assistant';
