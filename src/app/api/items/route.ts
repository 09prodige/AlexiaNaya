import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Helper to get an anonymous client (for GET)
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Helper to validate JWT token and return an authenticated client
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

// GET — list all items, optionally filtered by category
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  const supabase = getSupabase();
  let query = supabase.from('portfolio_items').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false });
  if (category) query = query.eq('category_id', category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — remove an item by id
export async function DELETE(req: NextRequest) {
  const supabase = await validateAuth(req);
  if (!supabase) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });

  const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// PATCH — update item (reorder, rename, transfer)
export async function PATCH(req: NextRequest) {
  const supabase = await validateAuth(req);
  if (!supabase) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const payload = await req.json();

  if (payload.action === 'reorder') {
    const { items } = payload;
    if (!items || !Array.isArray(items)) return NextResponse.json({ error: 'items requis' }, { status: 400 });
    for (const item of items) {
      await supabase.from('portfolio_items').update({ sort_order: item.sort_order }).eq('id', item.id);
    }
    return NextResponse.json({ success: true });
  } 
  
  if (payload.action === 'update') {
    const { id, title, category_id } = payload;
    if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });
    
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (category_id !== undefined) updates.category_id = category_id;
    
    const { error } = await supabase.from('portfolio_items').update(updates).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Action non reconnue' }, { status: 400 });
}
