import Link from 'next/link';
import Image from 'next/image';
import { getServerTranslations } from '@/lib/server-i18n';
import styles from './HeroSection.module.css';

export default async function HeroSection({ lang }: { lang: string }) {
  const { t } = await getServerTranslations(lang);

  return (
    <section className={styles.banner}>
      {/* Optimized Background Image */}
      <Image 
        src="/baner.png" 
        alt="Auction Banner" 
        fill 
        style={{ objectFit: 'cover' }} 
        priority 
      />
      <div className={styles.overlay}></div>
      
      <div className={`container ${styles.container}`}>
        <div className={styles.content}>
          <h1 className={styles.title}>{t.hero.title}</h1>
          <p 
            className={styles.subtitle}
            dangerouslySetInnerHTML={{ __html: t.hero.subtitle }}
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
