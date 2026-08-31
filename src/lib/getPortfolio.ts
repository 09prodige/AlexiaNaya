import fs from 'fs';
import path from 'path';

const assetsDir = path.join(process.cwd(), 'public', 'assets');

export interface CategoryData {
  id: string;
  title: string;
  categoryName: string;
  coverImage: string;
  items: {
    title: string;
    type: 'image' | 'video';
    url: string;
  }[];
}

export function getCategoriesData(): CategoryData[] {
  if (!fs.existsSync(assetsDir)) return [];

  const entries = fs.readdirSync(assetsDir, { withFileTypes: true });

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
        if (!file.startsWith('.') && !file.includes('ANIMAT LOGO')) {
          results.push(filePath);
        }
      }
    });
    return results;
  }

  const categories: CategoryData[] = [];

  entries.forEach((entry) => {
    if (entry.isDirectory()) {
      const folderName = entry.name;
      const fullFolderPath = path.join(assetsDir, folderName);
      const files = getAllFiles(fullFolderPath);

      const items = files.map((absPath) => {
        const relPath = '/' + path.relative(path.join(process.cwd(), 'public'), absPath).replace(/\\/g, '/');
        const ext = path.extname(absPath).toLowerCase();
        const isVideo = ['.mp4', '.mov', '.webm', '.avi'].includes(ext);

        return {
          title: '', // Titles completely stripped out
          type: isVideo ? ('video' as const) : ('image' as const),
          url: relPath,
        };
      });

      if (items.length > 0) {
        const coverItem = items.find(i => i.type === 'image') || items[0];

        categories.push({
          id: folderName.toLowerCase(),
          title: folderName,
          categoryName: folderName,
          coverImage: coverItem.url,
          items,
        });
      }
    }
  });

  return categories;
}
