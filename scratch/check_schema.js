
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSchema() {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error fetching from listings:', error)
    return
  }

  if (data && data.length > 0) {
     console.log('Columns found:', Object.keys(data[0]))
     if ('category' in data[0]) {
       console.log('SUCCESS: category column exists')
     } else {
       console.warn('WARNING: category column is MISSING')
     }
  } else {
    // If no data, try to fetch table info via RPC or just assume it might be missing
    const { data: cols, error: colError } = await supabase.rpc('get_table_columns', { table_name: 'listings' })
    if (colError) {
        console.warn('Table is empty and RPC get_table_columns failed. Likely need to manual check.')
    } else {
        console.log('Columns via RPC:', cols)
    }
  }
}

checkSchema()
