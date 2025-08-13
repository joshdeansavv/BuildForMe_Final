-- Remove subscription_plans and user_subscriptions tables
-- These tables are not needed with the simplified subscription system

-- Drop the user_subscriptions table
DROP TABLE IF EXISTS user_subscriptions CASCADE;

-- Drop the subscription_plans table
DROP TABLE IF EXISTS subscription_plans CASCADE;

-- Update the get_server_subscription_status function to use the simplified subscribers table
CREATE OR REPLACE FUNCTION get_server_subscription_status(server_id_param TEXT)
RETURNS TEXT AS $$
DECLARE
  subscription_status TEXT;
BEGIN
  SET search_path = public;
  -- Check if server has an active subscription by looking up the server owner
  SELECT 
    CASE 
      WHEN s.subscription_status = 'active' THEN 'active'
      WHEN s.subscription_status = 'cancelled' THEN 'inactive'
      WHEN s.subscription_status = 'expired' THEN 'payment_failed'
      ELSE 'no_subscription'
    END INTO subscription_status
  FROM guilds g
  LEFT JOIN profiles p ON g.owner_id = p.discord_id
  LEFT JOIN subscribers s ON p.email = s.email
  WHERE g.id = server_id_param
  ORDER BY s.updated_at DESC
  LIMIT 1;

  -- Return default if no result found
  IF subscription_status IS NULL THEN
    subscription_status := 'no_subscription';
  END IF;

  RETURN subscription_status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_server_subscription_status(TEXT) TO authenticated; 