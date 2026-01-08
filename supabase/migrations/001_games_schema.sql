-- EIS 75th Anniversary Games Schema
-- Uses existing Convene Supabase instance with games_ prefix for all tables

-- Players table (links to existing auth.users)
CREATE TABLE IF NOT EXISTS games_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(50) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_played_at TIMESTAMPTZ,
  UNIQUE(user_id)
);

-- Player statistics
CREATE TABLE IF NOT EXISTS games_player_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES games_players(id) ON DELETE CASCADE UNIQUE,
  total_score INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  games_completed INTEGER DEFAULT 0,
  detective_cases_completed INTEGER DEFAULT 0,
  command_missions_completed INTEGER DEFAULT 0,
  average_accuracy DECIMAL(5,2) DEFAULT 0,
  fastest_case_time INTEGER,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game progress tracking
CREATE TABLE IF NOT EXISTS games_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES games_players(id) ON DELETE CASCADE,
  game_type VARCHAR(20) NOT NULL CHECK (game_type IN ('detective', 'command')),
  item_id VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')),
  score INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 1,
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, game_type, item_id)
);

-- Badge definitions
CREATE TABLE IF NOT EXISTS games_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  category VARCHAR(20) CHECK (category IN ('achievement', 'milestone', 'special')),
  requirement_type VARCHAR(50),
  requirement_value INTEGER,
  requirement_game_type VARCHAR(20),
  requirement_era VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player badges (earned badges)
CREATE TABLE IF NOT EXISTS games_player_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES games_players(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES games_badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, badge_id)
);

-- Leaderboard view for efficient queries
CREATE OR REPLACE VIEW games_leaderboard AS
SELECT
  gp.id as player_id,
  gp.display_name,
  gp.avatar_url,
  COALESCE(gps.total_score, 0) as total_score,
  COALESCE(gps.games_completed, 0) as games_completed,
  COALESCE(gps.detective_cases_completed, 0) as detective_cases,
  COALESCE(gps.command_missions_completed, 0) as command_missions,
  RANK() OVER (ORDER BY COALESCE(gps.total_score, 0) DESC) as rank
FROM games_players gp
LEFT JOIN games_player_stats gps ON gp.id = gps.player_id
ORDER BY total_score DESC;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_games_progress_player ON games_progress(player_id);
CREATE INDEX IF NOT EXISTS idx_games_progress_status ON games_progress(status);
CREATE INDEX IF NOT EXISTS idx_games_player_stats_score ON games_player_stats(total_score DESC);
CREATE INDEX IF NOT EXISTS idx_games_player_badges_player ON games_player_badges(player_id);

-- RLS Policies
ALTER TABLE games_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE games_player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE games_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE games_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE games_player_badges ENABLE ROW LEVEL SECURITY;

-- Players: Users can read all, update own
CREATE POLICY "games_players_select" ON games_players FOR SELECT USING (true);
CREATE POLICY "games_players_insert" ON games_players FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "games_players_update" ON games_players FOR UPDATE USING (auth.uid() = user_id);

-- Player stats: Users can read all, update own
CREATE POLICY "games_player_stats_select" ON games_player_stats FOR SELECT USING (true);
CREATE POLICY "games_player_stats_insert" ON games_player_stats FOR INSERT
  WITH CHECK (player_id IN (SELECT id FROM games_players WHERE user_id = auth.uid()));
CREATE POLICY "games_player_stats_update" ON games_player_stats FOR UPDATE
  USING (player_id IN (SELECT id FROM games_players WHERE user_id = auth.uid()));

-- Progress: Users can read all, manage own
CREATE POLICY "games_progress_select" ON games_progress FOR SELECT USING (true);
CREATE POLICY "games_progress_insert" ON games_progress FOR INSERT
  WITH CHECK (player_id IN (SELECT id FROM games_players WHERE user_id = auth.uid()));
CREATE POLICY "games_progress_update" ON games_progress FOR UPDATE
  USING (player_id IN (SELECT id FROM games_players WHERE user_id = auth.uid()));

-- Badges: Public read
CREATE POLICY "games_badges_select" ON games_badges FOR SELECT USING (true);

-- Player badges: Public read, insert for own player
CREATE POLICY "games_player_badges_select" ON games_player_badges FOR SELECT USING (true);
CREATE POLICY "games_player_badges_insert" ON games_player_badges FOR INSERT
  WITH CHECK (player_id IN (SELECT id FROM games_players WHERE user_id = auth.uid()));

-- Insert default badges
INSERT INTO games_badges (name, description, icon, category, requirement_type, requirement_value) VALUES
  ('First Case', 'Solved your first case', 'trophy', 'milestone', 'games_completed', 1),
  ('Disease Detective', 'Solved 5 detective cases', 'search', 'milestone', 'games_completed', 5),
  ('Master Detective', 'Solved 15 detective cases', 'star', 'achievement', 'games_completed', 15),
  ('Speed Solver', 'Solved a case in under 2 minutes', 'zap', 'achievement', 'speed_run', 120),
  ('Perfect Diagnosis', 'Solved a case without revealing all clues', 'target', 'achievement', 'perfect_diagnosis', 1),
  ('Streak Star', 'Achieved a 5-case winning streak', 'flame', 'achievement', 'streak', 5),
  ('Era Explorer: 1950s', 'Completed all 1950s cases', 'clock', 'milestone', 'era_completed', 1),
  ('Era Explorer: 1980s', 'Completed all 1980s cases', 'clock', 'milestone', 'era_completed', 1),
  ('Era Explorer: 2010s', 'Completed all 2010s cases', 'clock', 'milestone', 'era_completed', 1),
  ('Outbreak Commander', 'Completed 3 command missions', 'target', 'milestone', 'games_completed', 3)
ON CONFLICT DO NOTHING;

-- Function to update player stats after game completion
CREATE OR REPLACE FUNCTION update_games_player_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO games_player_stats (player_id, total_score, games_completed)
    VALUES (NEW.player_id, NEW.score, 1)
    ON CONFLICT (player_id) DO UPDATE SET
      total_score = games_player_stats.total_score + NEW.score,
      games_completed = games_player_stats.games_completed + 1,
      detective_cases_completed = CASE
        WHEN NEW.game_type = 'detective'
        THEN games_player_stats.detective_cases_completed + 1
        ELSE games_player_stats.detective_cases_completed
      END,
      command_missions_completed = CASE
        WHEN NEW.game_type = 'command'
        THEN games_player_stats.command_missions_completed + 1
        ELSE games_player_stats.command_missions_completed
      END,
      updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update stats
DROP TRIGGER IF EXISTS trigger_update_games_stats ON games_progress;
CREATE TRIGGER trigger_update_games_stats
  AFTER UPDATE ON games_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_games_player_stats();
