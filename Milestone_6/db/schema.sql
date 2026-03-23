CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email_tips BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS moods (
  id SERIAL PRIMARY KEY,
  code VARCHAR(32) NOT NULL UNIQUE,
  label VARCHAR(64) NOT NULL
);

CREATE TABLE IF NOT EXISTS mood_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood_id INTEGER NOT NULL REFERENCES moods(id) ON DELETE RESTRICT,
  notes TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood_id INTEGER REFERENCES moods(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS support_resources (
  id SERIAL PRIMARY KEY,
  audience VARCHAR(20) NOT NULL CHECK (audience IN ('for_me', 'supporter', 'crisis')),
  category VARCHAR(50) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  link_or_phone VARCHAR(255),
  mood_id INTEGER REFERENCES moods(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (audience, title)
);

CREATE INDEX IF NOT EXISTS idx_mood_logs_user_id ON mood_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_logs_mood_id ON mood_logs(mood_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_mood_id ON journal_entries(mood_id);
CREATE INDEX IF NOT EXISTS idx_support_resources_audience ON support_resources(audience);
CREATE INDEX IF NOT EXISTS idx_support_resources_mood_id ON support_resources(mood_id);
