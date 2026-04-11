const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAdmin() {
  const { data, error } = await supabase
    .from('users')
    .select('email, role');
  
  if (error) {
    console.error('Error fetching users:', error);
  } else {
    console.log('Current Database Users:');
    console.table(data);
  }
}

checkAdmin();
