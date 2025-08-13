-- Create function to get server subscription status
CREATE OR REPLACE FUNCTION get_server_subscription_status(server_id_param TEXT)
RETURNS TEXT AS $$
DECLARE
  subscription_status TEXT;
BEGIN
  SET search_path = public;
  -- Check if server has an active subscription
  SELECT 
    CASE 
      WHEN us.status = 'active' THEN 'active'
      WHEN us.status = 'past_due' THEN 'payment_failed'
      WHEN us.status = 'canceled' THEN 'inactive'
      ELSE 'no_subscription'
    END INTO subscription_status
  FROM servers s
  LEFT JOIN user_subscriptions us ON s.owner_id = us.user_id
  WHERE s.discord_server_id = server_id_param
  AND (us.status IS NULL OR us.status IN ('active', 'past_due', 'canceled'))
  ORDER BY us.created_at DESC
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