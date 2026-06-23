-- Add bilingual translations support to reviews
-- The manager can now provide English (EN) versions of title, summary, and body blocks.
-- These are stored as JSONB: { "en": { "title": "...", "summary": "...", "body": [...] } }

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}';
