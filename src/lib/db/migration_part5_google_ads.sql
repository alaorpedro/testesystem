CREATE TABLE IF NOT EXISTS google_ads_integration (
  id TEXT PRIMARY KEY DEFAULT 'global',
  status TEXT NOT NULL DEFAULT 'disconnected',
  email TEXT NOT NULL DEFAULT '',
  manager_id TEXT NOT NULL DEFAULT '',
  developer_token TEXT NOT NULL DEFAULT '',
  connected_at TIMESTAMPTZ
);

INSERT INTO google_ads_integration (id) VALUES ('global') ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS google_ads_connections (
  client_id TEXT PRIMARY KEY,
  manager_id TEXT,
  account_ids TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'connected',
  connected_at TIMESTAMPTZ,
  last_sync TIMESTAMPTZ
);

ALTER TABLE google_ads_integration DISABLE ROW LEVEL SECURITY;
ALTER TABLE google_ads_connections DISABLE ROW LEVEL SECURITY;
