-- Script SQL simplifié pour créer les tables essentielles
-- À copier-coller dans l'éditeur SQL de Supabase

-- Supprimer les tables si elles existent déjà (optionnel)
DROP TABLE IF EXISTS emails;
DROP TABLE IF EXISTS inboxes;

-- Créer la table inboxes
CREATE TABLE inboxes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer la table emails
CREATE TABLE emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inbox_id UUID REFERENCES inboxes(id) ON DELETE CASCADE,
  external_id TEXT UNIQUE,
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

-- Créer les index essentiels
CREATE INDEX idx_inboxes_email ON inboxes(email);
CREATE INDEX idx_emails_inbox_id ON emails(inbox_id);
CREATE INDEX idx_emails_external_id ON emails(external_id);

-- Désactiver RLS (Row Level Security) pour simplifier
ALTER TABLE inboxes DISABLE ROW LEVEL SECURITY;
ALTER TABLE emails DISABLE ROW LEVEL SECURITY;

-- Vérifier que les tables sont créées
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('inboxes', 'emails');