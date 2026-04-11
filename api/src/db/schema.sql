-- DriveWell Database Schema
-- Run: psql -U postgres -d drivewell -f schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email                VARCHAR(255) UNIQUE NOT NULL,
  password_hash        VARCHAR(255) NOT NULL,
  first_name           VARCHAR(100) NOT NULL,
  last_name            VARCHAR(100) NOT NULL,
  role                 VARCHAR(20)  NOT NULL DEFAULT 'driver' CHECK (role IN ('driver','fleet_admin','admin')),
  fleet_id             UUID,
  cdl_number           VARCHAR(50),
  dot_cert_expiry      DATE,
  notification_prefs   JSONB        NOT NULL DEFAULT '{"dot_reminders":true,"streaks":true,"checkin_prompts":true,"weekly_summary":true}',
  onboarding_complete  BOOLEAN      NOT NULL DEFAULT FALSE,
  subscription_tier    VARCHAR(20)  NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free','driver_pro','fleet')),
  subscription_status  VARCHAR(20)  NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active','past_due','cancelled')),
  stripe_customer_id   VARCHAR(100),
  height_in            NUMERIC(5,1),
  date_of_birth        DATE,
  phone                VARCHAR(30),
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Fleets ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fleets (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name         VARCHAR(255) NOT NULL,
  plan_tier            VARCHAR(20)  NOT NULL DEFAULT 'starter' CHECK (plan_tier IN ('starter','growth','professional','enterprise')),
  licensed_seat_count  INT          NOT NULL DEFAULT 10,
  billing_email        VARCHAR(255) NOT NULL,
  white_label_config   JSONB        NOT NULL DEFAULT '{}',
  stripe_customer_id   VARCHAR(100),
  admin_contact_id     UUID,
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

ALTER TABLE users ADD CONSTRAINT fk_users_fleet FOREIGN KEY (fleet_id) REFERENCES fleets(id) ON DELETE SET NULL;

-- ── Refresh Tokens ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ  NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);

-- ── Health Records ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS health_records (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recorded_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metric_type    VARCHAR(30) NOT NULL CHECK (metric_type IN ('blood_pressure','weight','heart_rate','blood_glucose','bmi','waist')),
  value_primary  NUMERIC(8,2) NOT NULL,   -- systolic, weight, HR, glucose, BMI
  value_secondary NUMERIC(8,2),           -- diastolic (BP only)
  unit           VARCHAR(20)  NOT NULL,   -- mmHg, lbs, bpm, mg/dL, etc.
  notes          TEXT,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_health_user_type ON health_records(user_id, metric_type, recorded_at DESC);

-- ── Workouts ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workouts (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title               VARCHAR(255) NOT NULL,
  location_type       VARCHAR(20)  NOT NULL CHECK (location_type IN ('cab','truck_stop','gym')),
  duration_minutes    INT          NOT NULL,
  difficulty          VARCHAR(20)  NOT NULL CHECK (difficulty IN ('easy','moderate','hard')),
  body_focus          TEXT[]       NOT NULL DEFAULT '{}',
  dot_goal            VARCHAR(30),
  equipment_required  TEXT,
  description         TEXT,
  video_id            VARCHAR(50),    -- YouTube video ID
  video_url           TEXT,           -- S3 URL when self-hosted
  thumbnail_url       TEXT,
  instructions        JSONB        NOT NULL DEFAULT '[]',  -- [{step, text}]
  is_published        BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Workout Logs ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workout_logs (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workout_id              UUID REFERENCES workouts(id) ON DELETE SET NULL,
  workout_title           VARCHAR(255),  -- denormalized in case workout is deleted
  completed_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  duration_minutes        INT,
  calories_burned         INT,
  notes                   TEXT,
  rating                  SMALLINT CHECK (rating BETWEEN 1 AND 5),
  location_lat            NUMERIC(9,6),
  location_lng            NUMERIC(9,6)
);
CREATE INDEX idx_workout_logs_user ON workout_logs(user_id, completed_at DESC);

-- ── Daily Check-ins ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_checkins (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  checked_in_date DATE NOT NULL,
  sleep_quality   SMALLINT NOT NULL CHECK (sleep_quality BETWEEN 1 AND 5),
  energy_level    SMALLINT NOT NULL CHECK (energy_level BETWEEN 1 AND 5),
  stress_level    SMALLINT NOT NULL CHECK (stress_level BETWEEN 1 AND 5),
  water_intake_oz INT      NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, checked_in_date)
);
CREATE INDEX idx_checkins_user ON daily_checkins(user_id, checked_in_date DESC);

-- ── Driver Invitations ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS driver_invitations (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fleet_id       UUID NOT NULL REFERENCES fleets(id) ON DELETE CASCADE,
  invited_email  VARCHAR(255) NOT NULL,
  token          VARCHAR(255) NOT NULL,
  expires_at     TIMESTAMPTZ  NOT NULL,
  accepted       BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE(fleet_id, invited_email)
);

-- ── Password Reset Tokens ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  user_id    UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMPTZ  NOT NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Notifications ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type           VARCHAR(40) NOT NULL,
  scheduled_for  TIMESTAMPTZ NOT NULL,
  sent_at        TIMESTAMPTZ,
  payload        JSONB NOT NULL DEFAULT '{}'
);
CREATE INDEX idx_notifications_user ON notifications(user_id, scheduled_for);

-- ── Triggers: updated_at ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated   BEFORE UPDATE ON users   FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_fleets_updated  BEFORE UPDATE ON fleets  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Nutrition Logs ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  logged_date  DATE NOT NULL,
  food_name    VARCHAR(255) NOT NULL,
  calories     INT NOT NULL DEFAULT 0,
  protein_g    NUMERIC(6,1) NOT NULL DEFAULT 0,
  carbs_g      NUMERIC(6,1) NOT NULL DEFAULT 0,
  fat_g        NUMERIC(6,1) NOT NULL DEFAULT 0,
  sodium_mg    INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user ON nutrition_logs(user_id, logged_date DESC);
