-- VIGILANTE Phase 5: Security Architecture & Operational Boundaries
-- Creates the tracking logs but aggressively denies Anonymous/Public payload leaking.

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint TEXT NOT NULL,
    ip_hash TEXT NOT NULL,
    latency INTEGER NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on Row Level Security immediately
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Block public internet scanners using the anon or authenticated key from viewing logs.
CREATE POLICY "Block external Log Reads"
ON audit_logs AS PERMISSIVE
FOR SELECT
TO anon, authenticated
USING (false);

-- Only allow internal insertions.
CREATE POLICY "Deny external public inserts. Service Role Only"
ON audit_logs AS PERMISSIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (false);
