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

function getAllFiles(dirPath: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dirPath)) return results;

  const list = fs.readdirSync(dirPath);
  list.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath));
    } else {
      if (!file.startsWith('.') && !file.toLowerCase().includes('animat logo')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

function toRelUrl(absPath: string): string {
  const relPath = '/' + path.relative(path.join(process.cwd(), 'public'), absPath).replace(/\\/g, '/');
  return encodeURI(relPath);
}

import { createClient } from '@supabase/supabase-js';

export async function getCategoriesData(): Promise<CategoryData[]> {
  if (!fs.existsSync(assetsDir)) return [];

  // 1. Fetch from Supabase (if configured)
  let supabaseItems: any[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      const { data, error } = await supabase.from('portfolio_items').select('*');
      if (!error && data) {
        supabaseItems = data;
      }
    } catch (e) {
      console.warn("Failed to fetch from Supabase:", e);
    }
  }

  return DISCIPLINES.map((discipline) => {
    // 2. Gather local files
    const allFiles: string[] = [];
    for (const folderName of discipline.folders) {
      const folderPath = path.join(assetsDir, folderName);
      allFiles.push(...getAllFiles(folderPath));
    }

    const localItems = allFiles.map((absPath) => {
      const relPath = toRelUrl(absPath);
      const ext = path.extname(absPath).toLowerCase();
      const isVideo = ['.mp4', '.mov', '.webm', '.avi'].includes(ext);
      return {
        title: '',
        type: isVideo ? ('video' as const) : ('image' as const),
        url: relPath,
      };
    });

    // 3. Gather Supabase files for this discipline
    const remoteItems = supabaseItems
      .filter(item => item.category_id === discipline.id)
      .map(item => ({
        title: item.title || '',
        type: item.type as 'image' | 'video',
        url: item.image_url,
      }));

    // 4. Merge
    const items = [...remoteItems, ...localItems];
    const coverItem = items.find((i) => i.type === 'image') || items[0];

    return {
      id: discipline.id,
      title: discipline.label,
      categoryName: discipline.label,
      disciplineId: discipline.id,
      color: discipline.color,
      textColor: discipline.textColor,
      cardImage: discipline.cardImage,
      coverImage: coverItem?.url ?? discipline.cardImage,
      items,
    };
  });
}
