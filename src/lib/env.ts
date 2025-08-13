// Environment variable validation utility
// This ensures all required environment variables are properly configured

interface EnvConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_DISCORD_CLIENT_ID: string;
  VITE_STRIPE_AI_PREMIUM_PRICE_ID: string;
}

// List of required environment variables
const requiredEnvVars: (keyof EnvConfig)[] = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_DISCORD_CLIENT_ID',
  'VITE_STRIPE_AI_PREMIUM_PRICE_ID'
];

// Default/placeholder values that should be replaced
const defaultValues = [
  'your_supabase_url_here',
  'your_supabase_anon_key_here',
  'your_discord_client_id_here',
  'your_stripe_ai_premium_price_id_here',
  'price_your_actual_stripe_price_id_here'
];

export function validateEnvironmentVariables(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check each required environment variable
  for (const envVar of requiredEnvVars) {
    const value = import.meta.env[envVar];
    
    if (!value) {
      errors.push(`Missing required environment variable: ${envVar}`);
    } else if (defaultValues.includes(value)) {
      errors.push(`Environment variable ${envVar} is still set to default value: ${value}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

export function getEnvVar(key: keyof EnvConfig, fallback?: string): string {
  const value = import.meta.env[key];
  
  if (!value || defaultValues.includes(value)) {
    if (fallback) {
      console.warn(`Environment variable ${key} not configured, using fallback`);
      return fallback;
    }
    throw new Error(`Environment variable ${key} is not properly configured`);
  }
  
  return value;
}

// Validate environment on module load (in development)
if (import.meta.env.DEV) {
  const { isValid, errors } = validateEnvironmentVariables();
  
  if (!isValid) {
    console.warn('⚠️ Environment Configuration Issues (non-blocking):');
    errors.forEach(error => console.warn(`  • ${error}`));
    console.warn('Continuing with default values...');
  } else {
    console.log('✅ All environment variables are properly configured');
  }
} 