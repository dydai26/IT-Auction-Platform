import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://it-auction-platform.vercel.app';
  const locales = ['ru', 'en', 'zh'];
  
  const staticRoutes = [
    '',
    '/about',
    '/auctions',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Статичні сторінки для кожної мови
  locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  // Динамічні сторінки аукціонів
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data: lots } = await supabase
        .from('lots')
        .select('id, created_at')
        .eq('status', 'active');

      if (lots) {
        lots.forEach((lot) => {
          locales.forEach((locale) => {
            sitemapEntries.push({
              url: `${baseUrl}/${locale}/auction/${lot.id}`,
              lastModified: lot.created_at ? new Date(lot.created_at) : new Date(),
              changeFrequency: 'always',
              priority: 0.9,
            });
          });
        });
      }
    }
  } catch (error) {
    console.error('Помилка при генерації sitemap:', error);
  }

  return sitemapEntries;
}
