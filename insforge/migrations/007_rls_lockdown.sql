-- 007_rls_lockdown.sql
-- ---------------------------------------------------------------------------
-- Enable Row-Level Security (RLS) on every application table so the public
-- `anon` role (the anon key) can no longer read or write ANY row.
--
-- WHY: all database access in this app is server-side (Next.js API routes +
-- server libs) and is already gated by our own admin/JWT auth. The server now
-- connects with the full-access admin key (INSFORGE_API_KEY → `project_admin`
-- role, which has BYPASSRLS), so enabling RLS does not affect the app — but it
-- turns an accidentally-leaked anon key into a harmless, zero-access credential.
--
-- ⚠️ PREREQUISITE — APPLY IN THIS ORDER, or the live site breaks:
--   1. Set INSFORGE_API_KEY in the server env (Vercel + .env.local).
--   2. Deploy the code that reads it (lib/insforge.ts).
--   3. THEN run this migration.
-- If RLS is enabled while the server still uses the anon key, every query is
-- denied and the site cannot read its own data.
--
-- MECHANISM: `ENABLE ROW LEVEL SECURITY` with ZERO permissive policies is a
-- default-deny for `anon`/`authenticated` (rolbypassrls = false). We do NOT
-- `FORCE` RLS, so the `project_admin` bypass role keeps full access.
--
-- ROLLBACK: replace `ENABLE` with `DISABLE` for each table below.
-- ---------------------------------------------------------------------------

ALTER TABLE business_profile   ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_projects  ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients            ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_base            ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_generated       ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_entries    ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals              ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_content       ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads              ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbound_prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects           ENABLE ROW LEVEL SECURITY;
