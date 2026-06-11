'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { translations, Language } from '@/lib/i18n';

export default function NotFound() {
  const pathname = usePathname();
  const langSegment = pathname?.split('/')[1] as Language;
  const lang = ['ru', 'en', 'zh'].includes(langSegment) ? langSegment : 'ru';
  const t = translations[lang];

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#f7f4eb', // Крем-колір, що ідеально пасує під ілюстрацію
      fontFamily: "'Roboto', sans-serif",
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '550px', width: '100%' }}>
        {/* Ілюстрація з аукціоністом 404 */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Image 
            src="/not-found.png" 
            alt="404 Not Found" 
            width={450} 
            height={450} 
            style={{ 
              width: '100%', 
              maxWidth: '450px', 
              height: 'auto', 
              borderRadius: '16px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.03)'
            }}
            priority
          />
        </div>
        
        {/* Текст помилки */}
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#171717', marginBottom: '1rem' }}>
          {t.notfound.title}
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#6b7280', marginBottom: '2rem', lineHeight: '1.6' }}>
          {t.notfound.desc}
        </p>
        
        {/* Кнопка повернення */}
        <Link href={`/${lang}`} className="btn-primary" style={{ padding: '0.85rem 2.2rem', textDecoration: 'none', background: '#171717', color: '#ffffff', borderRadius: '8px', fontWeight: 600, display: 'inline-block' }}>
          {t.notfound.button}
        </Link>
      </div>
    </div>
  );
}
