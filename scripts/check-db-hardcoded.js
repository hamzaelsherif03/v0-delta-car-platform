const { createClient } = require('@supabase/supabase-js');

// Hardcoding the values from your .env.local to avoid 'dotenv' errors
const supabaseUrl = 'https://tuouqprwwnrsottxtlpp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1b3VxcHJ3d25yc290dHh0bHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NzU4MjAsImV4cCI6MjA5MTQ1MTgyMH0.xpEDtzbSGH4DXpoN7sstpU1TaJGTYJArmAl9TDFf2eE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAdmin() {
  console.log('--- Connecting to Supabase ---');
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
