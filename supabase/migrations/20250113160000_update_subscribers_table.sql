-- Update subscribers table to match check-subscription function expectations
-- Add missing columns that the function expects

-- Add new columns if they don't exist
ALTER TABLE subscribers 
ADD COLUMN IF NOT EXISTS discord_user_id TEXT,
ADD COLUMN IF NOT EXISTS discord_username TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS subscription_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMP WITH TIME ZONE;

-- Create or update indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_user_id ON subscribers(user_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_stripe_customer_id ON subscribers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_subscription_status ON subscribers(subscription_status);
CREATE INDEX IF NOT EXISTS idx_subscribers_discord_user_id ON subscribers(discord_user_id);

-- Enable RLS (Row Level Security)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscribers
DROP POLICY IF EXISTS "Users can view their own subscription" ON subscribers;
CREATE POLICY "Users can view their own subscription" ON subscribers
  FOR SELECT USING (auth.uid() = user_id::UUID);

DROP POLICY IF EXISTS "Users can update their own subscription" ON subscribers;
CREATE POLICY "Users can update their own subscription" ON subscribers
  FOR UPDATE USING (auth.uid() = user_id::UUID);

-- Allow service role to manage all subscriptions (for webhooks and functions)
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON subscribers;
CREATE POLICY "Service role can manage all subscriptions" ON subscribers
  FOR ALL TO service_role
  WITH CHECK (true);

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_subscribers_updated_at ON subscribers;
CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_subscribers_updated_at();

-- Clean up any invalid data
UPDATE subscribers 
SET subscription_status = 'pending' 
WHERE subscription_status IS NULL;

-- Update subscribed boolean based on subscription_status
UPDATE subscribers 
SET subscribed = (subscription_status = 'active')
WHERE subscription_status IS NOT NULL; 