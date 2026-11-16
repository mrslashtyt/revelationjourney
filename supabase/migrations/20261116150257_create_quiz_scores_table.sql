/*
# Create quiz_scores table (single-tenant, no auth)

1. New Tables
- `quiz_scores`
  - `id` (uuid, primary key, auto-generated)
  - `player_name` (text, not null) — name entered by the visitor for the leaderboard
  - `score` (integer, not null) — number of correct answers
  - `total` (integer, not null) — total questions in that quiz round
  - `best_streak` (integer, not null, default 0) — longest run of correct answers
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `quiz_scores`.
- Grant SELECT + INSERT to `anon` and `authenticated` (no sign-in screen in this app; scores are intentionally public/shared for the leaderboard).
- Policies: everyone may read all scores (public leaderboard) and insert new scores. No update/delete policies — scores are immutable once submitted.

3. Notes
- Single-tenant app with no authentication, so policies target `anon, authenticated`.
- No user_id column: visitors are anonymous leaderboard participants.
*/

CREATE TABLE IF NOT EXISTS quiz_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  score integer NOT NULL,
  total integer NOT NULL,
  best_streak integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE quiz_scores ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON quiz_scores TO anon, authenticated;

DROP POLICY IF EXISTS "public can read leaderboard" ON quiz_scores;
CREATE POLICY "public can read leaderboard"
ON quiz_scores FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "public can submit score" ON quiz_scores;
CREATE POLICY "public can submit score"
ON quiz_scores FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(player_name) BETWEEN 1 AND 30
  AND score >= 0
  AND total > 0
  AND best_streak >= 0
);