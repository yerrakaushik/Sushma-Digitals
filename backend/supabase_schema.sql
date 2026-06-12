-- ============================================================
-- Sushma Digitals — Supabase Schema Migration
-- Run this in your Supabase SQL Editor (Project > SQL Editor)
-- ============================================================

-- ─── Hero settings (single row, id always = 1) ───────────────
CREATE TABLE IF NOT EXISTS hero_settings (
  id          INT PRIMARY KEY DEFAULT 1,
  video_url   TEXT,
  updated_at  TIMESTAMPTZ DEFAULT now()
);
INSERT INTO hero_settings (id, video_url) VALUES (1, NULL)
  ON CONFLICT (id) DO NOTHING;

-- ─── Gallery photos ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_photos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url         TEXT NOT NULL,
  alt         TEXT,
  category    TEXT DEFAULT 'Wedding',
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── YouTube videos ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS youtube_videos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_id  TEXT NOT NULL,
  title       TEXT,
  description TEXT,
  tag         TEXT DEFAULT 'Wedding Film',
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── Service packages ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS service_packages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id  TEXT NOT NULL,
  name        TEXT NOT NULL,
  price       TEXT NOT NULL,
  note        TEXT,
  sort_order  INT DEFAULT 0
);

-- ─── Client Wishes (WhatsApp Automation) ─────────────────────
CREATE TABLE IF NOT EXISTS client_wishes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name      TEXT NOT NULL,
  spouse_name      TEXT,
  whatsapp_number  TEXT NOT NULL,
  wish_type        TEXT NOT NULL DEFAULT 'Birthday',
  wish_date        DATE NOT NULL,
  wish_message     TEXT,
  media_url        TEXT,
  media_type       TEXT,
  cloudinary_id    TEXT,
  is_sent          BOOLEAN DEFAULT false,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- ─── WhatsApp Auth State (Baileys) ───────────────────────────
CREATE TABLE IF NOT EXISTS wa_auth_state (
  key         TEXT PRIMARY KEY,
  data        JSONB NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ─── Design Albums ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS albums (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  cover_url   TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS album_photos (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id       UUID NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  url            TEXT NOT NULL,
  cloudinary_id  TEXT,
  caption        TEXT,
  sort_order     INT DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ─── Row Level Security (RLS) ────────────────────────────────
ALTER TABLE hero_settings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_videos   ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_wishes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_auth_state    ENABLE ROW LEVEL SECURITY;
ALTER TABLE albums           ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_photos     ENABLE ROW LEVEL SECURITY;

-- Public reads
CREATE POLICY "Public read hero"     ON hero_settings    FOR SELECT USING (true);
CREATE POLICY "Public read gallery"  ON gallery_photos   FOR SELECT USING (true);
CREATE POLICY "Public read videos"   ON youtube_videos   FOR SELECT USING (true);
CREATE POLICY "Public read services" ON service_packages FOR SELECT USING (true);
CREATE POLICY "Public read albums"   ON albums           FOR SELECT USING (true);
CREATE POLICY "Public read album_photos" ON album_photos FOR SELECT USING (true);

-- client_wishes: admin only (service-role key bypasses RLS)
CREATE POLICY "No public read wishes" ON client_wishes FOR SELECT USING (false);
