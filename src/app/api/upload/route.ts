import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // 1. Validate Auth via JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;

    if (!file || !category) {
      return NextResponse.json({ error: 'Fichier et catégorie requis' }, { status: 400 });
    }

    // Check if env variables are configured
    if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_ACCESS_KEY_ID || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ 
        error: 'Configuration incomplète (Vérifiez le fichier .env)' 
      }, { status: 500 });
    }

    // 2. Upload to Cloudflare R2
    const S3 = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
      },
    });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique filename
    const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.name.split('.').pop();
    const fileName = `${category}/${uniqueId}.${ext}`;

    await S3.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    }));

    const fileUrl = `${process.env.CLOUDFLARE_PUBLIC_URL}/${fileName}`;
    const type = file.type.startsWith('video') ? 'video' : 'image';

    // 3. Save to Supabase
    // (Supabase client already initialized with user token above)

    const { error: dbError } = await supabase
      .from('portfolio_items')
      .insert([
        { 
          title: title || null,
          category_id: category,
          image_url: fileUrl,
          type
        }
      ]);

    if (dbError) throw dbError;

    return NextResponse.json({ success: true, url: fileUrl });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Erreur interne' }, { status: 500 });
  }
}
