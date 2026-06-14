import React from 'react';
import { Metadata } from 'next';
import AuctionDetail from './AuctionDetail';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/server';
import { slugify } from '@/lib/utils/slugify';

export async function generateMetadata({ params }: { params: Promise<{ slug: string, lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const lang = resolvedParams.lang;

  const supabase = await createClient();
  const { data: lots } = await supabase.from('auctions').select('*');
  
  if (lots) {
    const lot = lots.find((a: any) => 
      slugify(a.title_ru) === slug || 
      slugify(a.title_en) === slug || 
      slugify(a.title_zh) === slug || 
      a.id === slug
    );

    if (lot) {
      const title = (lang === 'zh' ? lot.title_zh : lang === 'en' ? lot.title_en : lot.title_ru) || lot.title_ru || 'Аукціон';
      const description = (lang === 'zh' ? lot.description_zh : lang === 'en' ? lot.description_en : lot.description_ru) || lot.description_ru || '';
      
      return {
        title: `${title} | IT - Безпечний Аукціон`,
        description: description,
      };
    }
  }

  return {
    title: 'Аукціон | IT - Безпечний Аукціон',
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string, lang: string }> }) {
  const resolvedParams = await params;
  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <Header />
      <AuctionDetail id={resolvedParams.slug} />
      <Footer lang={resolvedParams.lang} />
    </div>
  );
}
