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

export async function GET(req: NextRequest) {
  const supabase = await validateAuth(req);
  if (!supabase) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { data, error } = await supabase
    .from('quote_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json([]);
  }

  return NextResponse.json(data);
}

// POST is PUBLIC! Anyone can submit a quote request.
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, category, timeline, budget, details } = data;

    if (!name || !email || !category || !timeline || !details) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    // 1. Sauvegarde dans Supabase
    const supabase = getSupabase();
    const { error: dbError } = await supabase
      .from('quote_requests')
      .insert([
        { 
          name, 
          email, 
          category, 
          timeline, 
          budget: budget || null, 
          details 
        }
      ]);

    if (dbError) {
      console.error('Erreur Supabase lors de la sauvegarde du devis:', dbError);
    }

    // 2. Envoi de l'email via Resend (si configuré)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const emailHtml = `
        <h2>Nouvelle demande de devis : ${category}</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Délai :</strong> ${timeline}</p>
        <p><strong>Budget :</strong> ${budget || 'Non spécifié'}</p>
        <hr />
        <h3>Détails du projet :</h3>
        <p>${details.replace(/\n/g, '<br />')}</p>
      `;

      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`
        },
        body: JSON.stringify({
          from: 'Devis Alexia <onboarding@resend.dev>', // resend.dev for testing, should be their verified domain in prod
          to: 'hello@alexianaya.com', // Replace with their actual email
          subject: `NOUVEAU DEVIS - ${category} - ${name}`,
          html: emailHtml
        })
      });

      if (!emailRes.ok) {
        console.error('Erreur Resend:', await emailRes.text());
      }
    } else {
      console.warn('RESEND_API_KEY non configurée, email non envoyé.');
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Erreur API Devis:', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const supabase = await validateAuth(req);
  if (!supabase) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { id, is_read } = await req.json();
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });

  const { error } = await supabase.from('quote_requests').update({ is_read }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const supabase = await validateAuth(req);
  if (!supabase) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });

  const { error } = await supabase.from('quote_requests').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
