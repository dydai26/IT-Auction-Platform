import Link from 'next/link';
import Image from 'next/image';
import { getServerTranslations } from '@/lib/server-i18n';
import styles from './HeroSection.module.css';
import { createClient } from '@/lib/supabase/server';

export default async function HeroSection({ lang }: { lang: string }) {
  const { t } = await getServerTranslations(lang);
  const supabase = await createClient();
  const { data: settings } = await supabase.from('settings').select('*').eq('id', 'global').single();

  const bannerImage = settings?.banner_image || '/baner.png';
  let bannerTitle = 'IT Ideas Technologies';
  let bannerSubtitle = t.hero.subtitle;

  if (settings) {
    if (lang === 'ru' && settings.banner_title_ru) bannerTitle = settings.banner_title_ru;
    if (lang === 'en' && settings.banner_title_en) bannerTitle = settings.banner_title_en;
    if (lang === 'zh' && settings.banner_title_zh) bannerTitle = settings.banner_title_zh;

    if (lang === 'ru' && settings.banner_subtitle_ru) bannerSubtitle = settings.banner_subtitle_ru;
    if (lang === 'en' && settings.banner_subtitle_en) bannerSubtitle = settings.banner_subtitle_en;
    if (lang === 'zh' && settings.banner_subtitle_zh) bannerSubtitle = settings.banner_subtitle_zh;
  }

  return (
    <section className={styles.banner}>
      <Image 
        src={bannerImage} 
        alt="Auction banner" 
        fill
        priority
        style={{ objectFit: 'cover', objectPosition: 'center', zIndex: 0 }}
      />
      <div className={styles.overlay}></div>
      
      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          <h1 className={styles.title}>{bannerTitle}</h1>
          <p 
            className={styles.subtitle}
            dangerouslySetInnerHTML={{ __html: bannerSubtitle }}
          ></p>
          <p className={styles.detail}>
            <span style={{ fontSize: '0.8rem', marginRight: '0.25rem' }}>●</span>
            {t.hero.detail}
          </p>
          <div style={{ marginTop: '1rem' }}>
            <Link href={`/${lang}/auctions`} className={styles.button}>
              {t.hero.button}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
