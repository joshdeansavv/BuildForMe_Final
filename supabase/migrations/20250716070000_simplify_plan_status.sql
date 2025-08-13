-- Simplify plan status by removing subscription_tier column
-- Plan status will be derived from subscription_status

-- First, let's verify current data
SELECT 
  subscription_status,
  subscription_tier,
  COUNT(*) as count
FROM subscribers 
GROUP BY subscription_status, subscription_tier
ORDER BY subscription_status, subscription_tier;

-- Remove the subscription_tier column since we can derive plan status from subscription_status
ALTER TABLE subscribers 
DROP COLUMN subscription_tier;

-- Remove the constraint we added earlier
ALTER TABLE subscribers 
DROP CONSTRAINT IF EXISTS check_subscription_tier;

-- Verify the changes
SELECT 
  subscription_status,
  COUNT(*) as count
FROM subscribers 
GROUP BY subscription_status
ORDER BY subscription_status; 