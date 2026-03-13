/**
 * Migration script — run once with: node src/models/migrate.js
 * Creates all tables for dental-bot.
 */
require('dotenv').config();
const { pool } = require('./db');
const logger = require('../config/logger');

const SQL = `
-- ─────────────────────────────────────────────
-- EXTENSION
-- ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- ENUM TYPES
-- ─────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE channel_type AS ENUM ('whatsapp', 'instagram');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE conversation_state AS ENUM (
    'inicio',
    'esperando_servicio',
    'esperando_fecha',
    'esperando_hora',
    'esperando_nombre',
    'esperando_telefono',
    'confirmando',
    'confirmado',
    'cancelado'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM (
    'pendiente',
    'confirmada',
    'recordatorio_enviado',
    'completada',
    'cancelada'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─────────────────────────────────────────────
-- TABLE: patients
-- Stores patient contact info from any channel.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS patients (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel       channel_type NOT NULL,
  channel_id    VARCHAR(100) NOT NULL,       -- e.g. WA phone or IG IGSID
  full_name     VARCHAR(150),
  phone         VARCHAR(30),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (channel, channel_id)
);

-- ─────────────────────────────────────────────
-- TABLE: conversations
-- Tracks the FSM state for each patient.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversations (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id     UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  state          conversation_state NOT NULL DEFAULT 'inicio',
  context        JSONB NOT NULL DEFAULT '{}',   -- temp data (service, date, etc.)
  last_message   TEXT,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (patient_id)
);

-- ─────────────────────────────────────────────
-- TABLE: appointments
-- Finalized appointments linked to Google Calendar.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id        UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  service_key       VARCHAR(60) NOT NULL,
  service_name      VARCHAR(120) NOT NULL,
  appointment_at    TIMESTAMPTZ NOT NULL,
  duration_minutes  INT NOT NULL DEFAULT 60,
  google_event_id   VARCHAR(200),
  status            appointment_status NOT NULL DEFAULT 'pendiente',
  reminder_sent     BOOLEAN NOT NULL DEFAULT FALSE,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: message_logs
-- Audit log for every inbound/outbound message.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS message_logs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id   UUID REFERENCES patients(id),
  channel      channel_type NOT NULL,
  direction    VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  message_type VARCHAR(30) NOT NULL DEFAULT 'text',
  payload      JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_patients_channel ON patients(channel, channel_id);
CREATE INDEX IF NOT EXISTS idx_appointments_at ON appointments(appointment_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_message_logs_patient ON message_logs(patient_id, created_at);

-- ─────────────────────────────────────────────
-- AUTO-UPDATE updated_at via trigger
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_timestamp_patients ON patients;
CREATE TRIGGER set_timestamp_patients
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_conversations ON conversations;
CREATE TRIGGER set_timestamp_conversations
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

DROP TRIGGER IF EXISTS set_timestamp_appointments ON appointments;
CREATE TRIGGER set_timestamp_appointments
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
`;

const BACKFILL_CONFIRMADAS_SQL = `
UPDATE appointments
SET status = 'confirmada',
    updated_at = NOW()
WHERE status = 'pendiente'
  AND google_event_id IS NOT NULL;
`;

async function migrate() {
  logger.info('Running database migration…');
  try {
    await pool.query(SQL);
    const backfill = await pool.query(BACKFILL_CONFIRMADAS_SQL);
    logger.info('Backfill completed for pending appointments with Google Event ID', {
      updatedRows: backfill.rowCount,
    });
    logger.info('Migration completed successfully.');
  } catch (err) {
    logger.error('Migration failed', { error: err.message });
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
