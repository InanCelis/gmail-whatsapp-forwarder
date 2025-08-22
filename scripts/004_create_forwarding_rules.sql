-- Create forwarding rules table
CREATE TABLE IF NOT EXISTS forwarding_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gmail_filter TEXT NOT NULL,
  whatsapp_message_template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE forwarding_rules ENABLE ROW LEVEL SECURITY;

-- Users can manage their own rules
CREATE POLICY "rules_select_own" ON forwarding_rules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "rules_insert_own" ON forwarding_rules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rules_update_own" ON forwarding_rules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "rules_delete_own" ON forwarding_rules FOR DELETE USING (auth.uid() = user_id);

-- Admins can manage all rules
CREATE POLICY "rules_select_admin" ON forwarding_rules FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "rules_update_admin" ON forwarding_rules FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "rules_delete_admin" ON forwarding_rules FOR DELETE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
