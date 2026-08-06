-- ============================================================
-- TAP SuperApp — Supabase Database Schema
-- Regional & Eco-Tourism Ecosystem for Kazakhstan
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id         UUID UNIQUE,                    -- Supabase Auth UID
  phone           TEXT UNIQUE,
  name            TEXT NOT NULL,
  role            TEXT NOT NULL DEFAULT 'tourist' CHECK (role IN ('tourist', 'partner')),
  avatar_url      TEXT,
  rating          NUMERIC(3,2) DEFAULT 5.0,
  trips_count     INTEGER DEFAULT 0,
  wallet_balance  BIGINT DEFAULT 0,               -- in tenge (tiyn)
  badges          JSONB DEFAULT '[]',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index on auth_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON public.users(auth_id);

-- ─── B2B SERVICES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.b2b_services (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type            TEXT NOT NULL CHECK (type IN ('transport', 'housing', 'rental')),
  name            TEXT,
  description     TEXT,
  price           BIGINT NOT NULL,                -- per seat / per night / per day
  currency        TEXT DEFAULT 'KZT',
  -- Transport specific
  from_location   TEXT,
  to_location     TEXT,
  departure_time  TIMESTAMPTZ,
  total_seats     INTEGER,
  booked_seats    INTEGER DEFAULT 0,
  vehicle_name    TEXT,
  vehicle_plate   TEXT,
  -- Housing specific
  address         TEXT,
  amenities       JSONB DEFAULT '[]',
  -- Rental specific
  deposit_amount  BIGINT DEFAULT 0,
  -- Location
  lat             DOUBLE PRECISION,
  lng             DOUBLE PRECISION,
  -- Status
  is_active       BOOLEAN DEFAULT TRUE,
  tag             TEXT,                           -- 'HOT', 'TOP', 'NEW', etc.
  emoji           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_b2b_services_partner ON public.b2b_services(partner_id);
CREATE INDEX IF NOT EXISTS idx_b2b_services_type ON public.b2b_services(type);
CREATE INDEX IF NOT EXISTS idx_b2b_services_departure ON public.b2b_services(departure_time);

-- ─── BOOKINGS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tourist_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  partner_id      UUID NOT NULL REFERENCES public.users(id),
  service_id      UUID NOT NULL REFERENCES public.b2b_services(id),
  seats           INTEGER NOT NULL DEFAULT 1,
  -- Financials
  total_amount    BIGINT NOT NULL,                -- full amount charged to tourist
  platform_fee    BIGINT NOT NULL,                -- 10% to TAP
  partner_amount  BIGINT NOT NULL,                -- 90% to partner
  -- Status & QR
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'confirmed', 'completed', 'rejected', 'cancelled')),
  qr_code_hash    TEXT UNIQUE NOT NULL,
  -- Timestamps
  booked_at       TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at    TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_tourist ON public.bookings(tourist_id);
CREATE INDEX IF NOT EXISTS idx_bookings_partner ON public.bookings(partner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service ON public.bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_qr_hash ON public.bookings(qr_code_hash);

-- ─── GROUP CAMPS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.group_camps (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id    UUID NOT NULL REFERENCES public.users(id),
  name            TEXT NOT NULL,
  description     TEXT,
  lat             DOUBLE PRECISION NOT NULL,
  lng             DOUBLE PRECISION NOT NULL,
  max_members     INTEGER NOT NULL DEFAULT 20,
  departure_at    TIMESTAMPTZ,
  price           BIGINT DEFAULT 0,
  emoji           TEXT DEFAULT '🏕️',
  status          TEXT DEFAULT 'active' CHECK (status IN ('active', 'full', 'departed', 'cancelled')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.camp_members (
  camp_id         UUID NOT NULL REFERENCES public.group_camps(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at       TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (camp_id, user_id)
);

-- View: camp with current member count
CREATE OR REPLACE VIEW public.camps_with_counts AS
SELECT
  gc.*,
  COUNT(cm.user_id) AS current_members
FROM public.group_camps gc
LEFT JOIN public.camp_members cm ON cm.camp_id = gc.id
GROUP BY gc.id;

-- ─── CHATS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.chats (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type            TEXT NOT NULL CHECK (type IN ('dm', 'trip', 'group')),
  name            TEXT,
  emoji           TEXT,
  booking_id      UUID REFERENCES public.bookings(id),  -- for trip chats
  created_by      UUID REFERENCES public.users(id),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.chat_members (
  chat_id         UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at       TIMESTAMPTZ DEFAULT NOW(),
  last_read_at    TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (chat_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_members_user ON public.chat_members(user_id);

-- ─── MESSAGES ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id         UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id       UUID NOT NULL REFERENCES public.users(id),
  content         TEXT NOT NULL,
  content_type    TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'image', 'location', 'qr')),
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_chat ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at DESC);

-- Enable Realtime for messages
ALTER TABLE public.messages REPLICA IDENTITY FULL;

-- ─── STORIES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.stories (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  caption         TEXT NOT NULL,
  media_url       TEXT,
  bg_color        TEXT DEFAULT '#1a2a1a',
  emoji           TEXT DEFAULT '🌿',
  location_name   TEXT,
  lat             DOUBLE PRECISION,
  lng             DOUBLE PRECISION,
  likes_count     INTEGER DEFAULT 0,
  expires_at      TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.story_likes (
  story_id        UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  liked_at        TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (story_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_stories_user ON public.stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_expires ON public.stories(expires_at);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camp_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- Users: public read, own write
CREATE POLICY "users_public_read" ON public.users FOR SELECT USING (TRUE);
CREATE POLICY "users_own_update" ON public.users FOR UPDATE USING (auth.uid() = auth_id);

-- Services: public read, partner write own
CREATE POLICY "services_public_read" ON public.b2b_services FOR SELECT USING (is_active = TRUE);
CREATE POLICY "services_partner_write" ON public.b2b_services
  FOR ALL USING (partner_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Bookings: tourist + partner read own
CREATE POLICY "bookings_tourist_read" ON public.bookings
  FOR SELECT USING (
    tourist_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
    OR partner_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
  );
CREATE POLICY "bookings_tourist_insert" ON public.bookings
  FOR INSERT WITH CHECK (tourist_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));
CREATE POLICY "bookings_partner_update" ON public.bookings
  FOR UPDATE USING (partner_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Stories: public read, own write
CREATE POLICY "stories_public_read" ON public.stories FOR SELECT USING (expires_at > NOW());
CREATE POLICY "stories_own_write" ON public.stories
  FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Camps: public read
CREATE POLICY "camps_public_read" ON public.group_camps FOR SELECT USING (TRUE);

-- Messages: members only
CREATE POLICY "messages_members_read" ON public.messages
  FOR SELECT USING (
    chat_id IN (
      SELECT chat_id FROM public.chat_members
      WHERE user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
    )
  );
CREATE POLICY "messages_members_insert" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
    AND chat_id IN (
      SELECT chat_id FROM public.chat_members
      WHERE user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
    )
  );

-- ─── TRIGGERS ────────────────────────────────────────────────

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON public.b2b_services FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-decrement seats on booking
CREATE OR REPLACE FUNCTION public.handle_booking_seats()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.b2b_services
    SET booked_seats = booked_seats + NEW.seats
    WHERE id = NEW.service_id;
  ELSIF TG_OP = 'UPDATE' AND NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    UPDATE public.b2b_services
    SET booked_seats = GREATEST(0, booked_seats - OLD.seats)
    WHERE id = OLD.service_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_booking_seats
  AFTER INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_booking_seats();

-- Auto-release escrow on booking completion (add funds to partner wallet)
CREATE OR REPLACE FUNCTION public.handle_booking_complete()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE public.users
    SET wallet_balance = wallet_balance + NEW.partner_amount,
        trips_count = trips_count + 1
    WHERE id = NEW.partner_id;

    UPDATE public.bookings
    SET completed_at = NOW()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_booking_complete
  AFTER UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_booking_complete();

-- ─── SEED DATA ───────────────────────────────────────────────
-- (Development only — remove in production)

INSERT INTO public.group_camps (name, description, lat, lng, max_members, price, emoji)
VALUES
  ('Кольсай: Ночной лагерь', 'Групповой выезд к Кольсайским озёрам', 42.994, 78.298, 20, 15000, '🔥'),
  ('Чарын: Рассветная фотосессия', 'Фото-тур на рассвете у каньона', 43.353, 79.081, 15, 12000, '📸'),
  ('Алаколь: Эко-лагерь', 'Экологический лагерь у озера Алаколь', 46.053, 81.687, 25, 45000, '🌊')
ON CONFLICT DO NOTHING;
