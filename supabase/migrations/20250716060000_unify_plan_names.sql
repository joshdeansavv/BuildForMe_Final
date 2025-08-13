-- Unify plan names to "Free" and "Premium" only
-- This migration standardizes all subscription_tier values

-- Update all existing records to use unified naming
UPDATE subscribers 
SET subscription_tier = 'Premium'
WHERE subscription_tier IN ('pro', 'premium', 'basic', 'Pro', 'Premium', 'PRO');

UPDATE subscribers 
SET subscription_tier = 'Free'
WHERE subscription_tier IN ('free', 'Free', 'FREE') OR subscription_tier IS NULL;

-- Set default value for new records
ALTER TABLE subscribers 
ALTER COLUMN subscription_tier SET DEFAULT 'Free';

-- Add constraint to only allow 'Free' and 'Premium'
ALTER TABLE subscribers 
ADD CONSTRAINT check_subscription_tier 
CHECK (subscription_tier IN ('Free', 'Premium'));

-- Verify the changes
SELECT 
  subscription_tier,
  COUNT(*) as count
FROM subscribers 
GROUP BY subscription_tier
ORDER BY subscription_tier; 