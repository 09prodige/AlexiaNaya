const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env', 'utf8');
const anonKeyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY="([^"]+)"/);
const anonKey = anonKeyMatch ? anonKeyMatch[1] : '';

const supabase = createClient('https://qozvgyphilxbjhxnrhda.supabase.co', anonKey);

supabase.from('portfolio_items').select('id, title, category_id, type, sort_order').then(({data, error}) => {
  if (error) {
    console.error('Supabase Error:', error);
  } else {
    console.log('Total items:', data.length);
    console.log('Categories present:', [...new Set(data.map(d => d.category_id))]);
    console.log('Sample item:', data[0]);
  }
});
