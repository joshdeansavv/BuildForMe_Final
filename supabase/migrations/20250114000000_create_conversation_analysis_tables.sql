-- Create conversation analysis tables for BuildForMe AI features
-- These tables store AI-generated summaries, sentiment analysis, and insights

-- Table for storing channel summaries
CREATE TABLE IF NOT EXISTS summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id TEXT NOT NULL,
  guild_id TEXT NOT NULL,
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  highlights JSONB DEFAULT '{}',
  action_items JSONB DEFAULT '{}',
  message_count INTEGER DEFAULT 0,
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing sentiment analysis
CREATE TABLE IF NOT EXISTS sentiment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id TEXT NOT NULL,
  guild_id TEXT NOT NULL,
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  score FLOAT NOT NULL,
  toxicity FLOAT DEFAULT 0.0,
  message_id TEXT,
  user_id TEXT,
  content_preview TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing topic clusters
CREATE TABLE IF NOT EXISTS topic_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cluster_id INTEGER NOT NULL,
  topic_name TEXT NOT NULL,
  keywords JSONB DEFAULT '[]',
  message_count INTEGER DEFAULT 0,
  sentiment_avg FLOAT DEFAULT 0.0,
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing unanswered questions
CREATE TABLE IF NOT EXISTS unanswered_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  message_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  question_text TEXT NOT NULL,
  ts TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing insight feed configurations
CREATE TABLE IF NOT EXISTS insight_feed_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT FALSE,
  alert_channel_id TEXT,
  sentiment_threshold FLOAT DEFAULT -0.5,
  toxicity_threshold FLOAT DEFAULT 0.8,
  digest_channel_id TEXT,
  digest_time TIME DEFAULT '00:00:00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing daily digests
CREATE TABLE IF NOT EXISTS daily_digests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  digest_date DATE NOT NULL,
  highlights JSONB DEFAULT '{}',
  top_links JSONB DEFAULT '[]',
  open_questions JSONB DEFAULT '[]',
  sentiment_summary JSONB DEFAULT '{}',
  message_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing Q&A knowledge base
CREATE TABLE IF NOT EXISTS qa_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guild_id TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  thread_id TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  tags JSONB DEFAULT '[]',
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_summaries_channel_id ON summaries(channel_id);
CREATE INDEX IF NOT EXISTS idx_summaries_guild_id ON summaries(guild_id);
CREATE INDEX IF NOT EXISTS idx_summaries_ts ON summaries(ts);
CREATE INDEX IF NOT EXISTS idx_summaries_period ON summaries(period_start, period_end);

CREATE INDEX IF NOT EXISTS idx_sentiment_channel_id ON sentiment(channel_id);
CREATE INDEX IF NOT EXISTS idx_sentiment_guild_id ON sentiment(guild_id);
CREATE INDEX IF NOT EXISTS idx_sentiment_ts ON sentiment(ts);
CREATE INDEX IF NOT EXISTS idx_sentiment_score ON sentiment(score);

CREATE INDEX IF NOT EXISTS idx_topic_clusters_guild_id ON topic_clusters(guild_id);
CREATE INDEX IF NOT EXISTS idx_topic_clusters_channel_id ON topic_clusters(channel_id);
CREATE INDEX IF NOT EXISTS idx_topic_clusters_ts ON topic_clusters(ts);

CREATE INDEX IF NOT EXISTS idx_unanswered_questions_guild_id ON unanswered_questions(guild_id);
CREATE INDEX IF NOT EXISTS idx_unanswered_questions_channel_id ON unanswered_questions(channel_id);
CREATE INDEX IF NOT EXISTS idx_unanswered_questions_resolved ON unanswered_questions(is_resolved);

CREATE INDEX IF NOT EXISTS idx_insight_feed_config_guild_id ON insight_feed_config(guild_id);

CREATE INDEX IF NOT EXISTS idx_daily_digests_guild_id ON daily_digests(guild_id);
CREATE INDEX IF NOT EXISTS idx_daily_digests_date ON daily_digests(digest_date);

CREATE INDEX IF NOT EXISTS idx_qa_knowledge_guild_id ON qa_knowledge(guild_id);
CREATE INDEX IF NOT EXISTS idx_qa_knowledge_channel_id ON qa_knowledge(channel_id);

-- Enable RLS (Row Level Security)
ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentiment ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE unanswered_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE insight_feed_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_digests ENABLE ROW LEVEL SECURITY;
ALTER TABLE qa_knowledge ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for service role access (bot operations)
CREATE POLICY "Service role can manage summaries" ON summaries
  FOR ALL TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can manage sentiment" ON sentiment
  FOR ALL TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can manage topic_clusters" ON topic_clusters
  FOR ALL TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can manage unanswered_questions" ON unanswered_questions
  FOR ALL TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can manage insight_feed_config" ON insight_feed_config
  FOR ALL TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can manage daily_digests" ON daily_digests
  FOR ALL TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can manage qa_knowledge" ON qa_knowledge
  FOR ALL TO service_role
  WITH CHECK (true);

-- Create RLS policies for authenticated users (read access to their guild data)
CREATE POLICY "Users can view summaries for their guilds" ON summaries
  FOR SELECT USING (
    guild_id IN (
      SELECT id FROM guilds WHERE owner_id IN (
        SELECT discord_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can view sentiment for their guilds" ON sentiment
  FOR SELECT USING (
    guild_id IN (
      SELECT id FROM guilds WHERE owner_id IN (
        SELECT discord_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can view topic_clusters for their guilds" ON topic_clusters
  FOR SELECT USING (
    guild_id IN (
      SELECT id FROM guilds WHERE owner_id IN (
        SELECT discord_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can view unanswered_questions for their guilds" ON unanswered_questions
  FOR SELECT USING (
    guild_id IN (
      SELECT id FROM guilds WHERE owner_id IN (
        SELECT discord_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage insight_feed_config for their guilds" ON insight_feed_config
  FOR ALL USING (
    guild_id IN (
      SELECT id FROM guilds WHERE owner_id IN (
        SELECT discord_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can view daily_digests for their guilds" ON daily_digests
  FOR SELECT USING (
    guild_id IN (
      SELECT id FROM guilds WHERE owner_id IN (
        SELECT discord_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can manage qa_knowledge for their guilds" ON qa_knowledge
  FOR ALL USING (
    guild_id IN (
      SELECT id FROM guilds WHERE owner_id IN (
        SELECT discord_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_insight_feed_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  SET search_path = public;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_insight_feed_config_updated_at
  BEFORE UPDATE ON insight_feed_config
  FOR EACH ROW
  EXECUTE FUNCTION update_insight_feed_config_updated_at();

CREATE OR REPLACE FUNCTION update_qa_knowledge_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  SET search_path = public;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_qa_knowledge_updated_at
  BEFORE UPDATE ON qa_knowledge
  FOR EACH ROW
  EXECUTE FUNCTION update_qa_knowledge_updated_at();

-- Create function to get conversation analytics for a guild
CREATE OR REPLACE FUNCTION get_guild_conversation_analytics(guild_id_param TEXT, days_back INTEGER DEFAULT 7)
RETURNS TABLE (
  total_messages BIGINT,
  avg_sentiment FLOAT,
  avg_toxicity FLOAT,
  top_topics JSONB,
  unanswered_count BIGINT,
  summary_count BIGINT
) AS $$
BEGIN
  SET search_path = public;
  RETURN QUERY
  SELECT 
    COUNT(sentiment.id)::BIGINT as total_messages,
    AVG(sentiment.score)::FLOAT as avg_sentiment,
    AVG(sentiment.toxicity)::FLOAT as avg_toxicity,
    COALESCE(
      (SELECT jsonb_agg(jsonb_build_object(
        'topic', tc.topic_name,
        'count', tc.message_count,
        'sentiment', tc.sentiment_avg
      )) FROM topic_clusters tc 
       WHERE tc.guild_id = guild_id_param 
       AND tc.ts >= NOW() - INTERVAL '1 day' * days_back
       ORDER BY tc.message_count DESC LIMIT 5),
      '[]'::jsonb
    ) as top_topics,
    COUNT(uq.id)::BIGINT as unanswered_count,
    COUNT(sum.id)::BIGINT as summary_count
  FROM sentiment
  LEFT JOIN unanswered_questions uq ON uq.guild_id = sentiment.guild_id AND uq.is_resolved = FALSE
  LEFT JOIN summaries sum ON sum.guild_id = sentiment.guild_id
  WHERE sentiment.guild_id = guild_id_param
  AND sentiment.ts >= NOW() - INTERVAL '1 day' * days_back;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_guild_conversation_analytics(TEXT, INTEGER) TO authenticated; 