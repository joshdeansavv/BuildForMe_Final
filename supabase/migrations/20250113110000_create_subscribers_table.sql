-- Create subscribers table with proper structure
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  user_id TEXT,
  stripe_customer_id TEXT,
  discord_user_id TEXT,
  discord_username TEXT,
  subscription_status TEXT DEFAULT 'pending',
  subscription_tier TEXT DEFAULT 'free',
  subscription_start TIMESTAMP WITH TIME ZONE,
  subscription_end TIMESTAMP WITH TIME ZONE,
  subscribed BOOLEAN DEFAULT false,
  last_payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_user_id ON subscribers(user_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_stripe_customer_id ON subscribers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_subscription_status ON subscribers(subscription_status);
CREATE INDEX IF NOT EXISTS idx_subscribers_discord_user_id ON subscribers(discord_user_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_discord_username ON subscribers(discord_username);

-- Enable RLS (Row Level Security)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscribers
CREATE POLICY "Users can view their own subscription" ON subscribers
  FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can update their own subscription" ON subscribers
  FOR UPDATE USING (auth.uid()::TEXT = user_id);

-- Allow service role to manage all subscriptions (for webhooks and functions)
CREATE POLICY "Service role can manage all subscriptions" ON subscribers
  FOR ALL TO service_role
  WITH CHECK (true);

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  SET search_path = public;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_subscribers_updated_at(); 