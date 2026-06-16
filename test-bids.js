const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data: lots } = await supabase.from('auctions').select('*').limit(1);
  console.log('Lot:', lots[0].id, lots[0].current_price);
}
test();
