CREATE TABLE IF NOT EXISTS assistant_messages (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL DEFAULT '',
    parent_id TEXT,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
CREATE INDEX IF NOT EXISTS idx_assistant_msg_parent ON assistant_messages (parent_id);
CREATE INDEX IF NOT EXISTS idx_assistant_msg_session ON assistant_messages (session_id);

CREATE TABLE IF NOT EXISTS assistant_compactions (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL,
  from_message_id TEXT NOT NULL,
  to_message_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cf_agents_context_blocks (
  label TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);