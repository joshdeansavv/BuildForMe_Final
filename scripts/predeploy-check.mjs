import fs from 'node:fs';

const required = ['VITE_SUPABASE_URL','VITE_SUPABASE_ANON_KEY','VITE_DISCORD_CLIENT_ID','VITE_STRIPE_AI_PREMIUM_PRICE_ID'];
const missing = required.filter(k => !process.env[k]);

if (!fs.existsSync('index.html')) { 
  console.error('❌ index.html missing from repository root'); 
  process.exit(1); 
}

if (missing.length) { 
  console.error('❌ Missing environment variables:', missing.join(', ')); 
  console.error('Set these in Cloudflare Pages > Settings > Environment variables');
  process.exit(1); 
}

console.log('✅ All predeploy checks passed');
