import fs from 'fs';
import path from 'path';
import { DISCIPLINES } from './disciplines';

const assetsDir = path.join(process.cwd(), 'public', 'assets');

export interface CategoryData {
  id: string;
  title: string;
  categoryName: string;
  disciplineId: string;
  color: string;
  textColor: string;
  cardImage: string;
  coverImage: string;
  items: {
    title: string;
    type: 'image' | 'video';
    url: string;
  }[];
}



import { createClient } from '@supabase/supabase-js';

export async function getCategoriesData(): Promise<CategoryData[]> {
  if (!fs.existsSync(assetsDir)) return [];

  // 1. Fetch from Supabase (if configured)
  let supabaseItems: any[] = [];
  let customCategories: Record<string, string> = {};
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      // Fetch items
      const { data: itemsData, error: itemsError } = await supabase.from('portfolio_items').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false });
      if (!itemsError && itemsData) {
        supabaseItems = itemsData;
      }
      
      // Fetch custom category names
      const { data: catData, error: catError } = await supabase.from('portfolio_categories').select('*');
      if (!catError && catData) {
        catData.forEach((c: any) => {
          customCategories[c.id] = c.label;
        });
      }
    } catch (e) {
      console.warn("Failed to fetch from Supabase:", e);
    }
  }

  return DISCIPLINES.map((discipline) => {
    // 2. Gather Supabase files for this discipline
    const remoteItems = supabaseItems
      .filter(item => item.category_id === discipline.id)
      .map(item => ({
        title: item.title || '',
        type: item.type as 'image' | 'video',
        url: item.image_url,
      }));

    const items = [...remoteItems];
    const coverItem = items.find((i) => i.type === 'image') || items[0];

    // Merge custom label if available
    const finalLabel = customCategories[discipline.id] || discipline.label;

    return {
      id: discipline.id,
      title: finalLabel,
      categoryName: finalLabel,
      disciplineId: discipline.id,
      color: discipline.color,
      textColor: discipline.textColor,
      cardImage: discipline.cardImage,
      coverImage: coverItem?.url ?? discipline.cardImage,
      items,
    };
  });
}
