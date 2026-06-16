import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: lots } = await supabase.from('auctions').select('*').limit(1);
  console.log('Lot:', lots?.[0]?.id, lots?.[0]?.current_price);
  
  // Try to insert a bid
  /*
  const { data: bid, error } = await supabase.from('bids').insert({
    auction_id: lots?.[0]?.id,
    user_id: '00000000-0000-0000-0000-000000000000', // invalid user, just checking error
    amount: lots?.[0]?.current_price + 100
  });
  console.log(error);
  */
}
test();
