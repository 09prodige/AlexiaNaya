import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

async function validateAuth(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: authHeader } } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return user ? supabase : null;
}

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('portfolio_categories').select('*');
  
  if (error) {
    return NextResponse.json([]);
  }
  
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await validateAuth(req);
  if (!supabase) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { id, label } = await req.json();
  if (!id || !label) return NextResponse.json({ error: 'id et label requis' }, { status: 400 });

  const { error } = await supabase
    .from('portfolio_categories')
    .upsert({ id, label }, { onConflict: 'id' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}
