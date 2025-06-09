-- Schéma de base de données simplifié pour TempMail (usage local)
-- À exécuter dans l'éditeur SQL de Supabase

-- Table des boîtes de réception temporaires
CREATE TABLE IF NOT EXISTS inboxes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des emails reçus
CREATE TABLE IF NOT EXISTS emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inbox_id UUID REFERENCES inboxes(id) ON DELETE CASCADE,
  external_id TEXT UNIQUE, -- ID de l'email depuis l'API TempMail
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  subject TEXT,
  content TEXT,
  html_content TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  is_starred BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  received_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des règles de transfert (optionnel)
CREATE TABLE IF NOT EXISTS forwarding_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inbox_id UUID REFERENCES inboxes(id) ON DELETE CASCADE,
  forward_to_email TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  conditions JSONB DEFAULT '{}', -- Conditions de transfert (expéditeur, sujet, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_inboxes_email ON inboxes(email);
CREATE INDEX IF NOT EXISTS idx_inboxes_expires_at ON inboxes(expires_at);
CREATE INDEX IF NOT EXISTS idx_inboxes_is_active ON inboxes(is_active);
CREATE INDEX IF NOT EXISTS idx_emails_inbox_id ON emails(inbox_id);
CREATE INDEX IF NOT EXISTS idx_emails_external_id ON emails(external_id);
CREATE INDEX IF NOT EXISTS idx_emails_is_read ON emails(is_read);
CREATE INDEX IF NOT EXISTS idx_emails_received_at ON emails(received_at);
CREATE INDEX IF NOT EXISTS idx_forwarding_rules_inbox_id ON forwarding_rules(inbox_id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_inboxes_updated_at BEFORE UPDATE ON inboxes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emails_updated_at BEFORE UPDATE ON emails
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forwarding_rules_updated_at BEFORE UPDATE ON forwarding_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour supprimer automatiquement les boîtes expirées
CREATE OR REPLACE FUNCTION cleanup_expired_inboxes()
RETURNS void AS $$
BEGIN
  -- Supprimer les emails des boîtes expirées
  DELETE FROM emails 
  WHERE inbox_id IN (
    SELECT id FROM inboxes 
    WHERE expires_at < NOW() AND is_active = TRUE
  );
  
  -- Marquer les boîtes comme inactives
  UPDATE inboxes 
  SET is_active = FALSE, updated_at = NOW()
  WHERE expires_at < NOW() AND is_active = TRUE;
END;
$$ language 'plpgsql';

-- Vue pour les statistiques
CREATE OR REPLACE VIEW email_stats AS
SELECT 
  COUNT(DISTINCT i.id) as total_inboxes,
  COUNT(DISTINCT CASE WHEN i.is_active THEN i.id END) as active_inboxes,
  COUNT(DISTINCT e.id) as total_emails,
  COUNT(DISTINCT CASE WHEN NOT e.is_read THEN e.id END) as unread_emails,
  MAX(e.received_at) as last_email_received
FROM inboxes i
LEFT JOIN emails e ON i.id = e.inbox_id;

-- Désactiver RLS pour un usage local simplifié
ALTER TABLE inboxes DISABLE ROW LEVEL SECURITY;
ALTER TABLE emails DISABLE ROW LEVEL SECURITY;
ALTER TABLE forwarding_rules DISABLE ROW LEVEL SECURITY; 