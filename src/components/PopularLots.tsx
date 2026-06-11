'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import AuctionCard from './AuctionCard';
import styles from './PopularLots.module.css';

export default function PopularLots() {
  const { t, language } = useLanguage();
  const { lots, getBidsForLot } = useApp();

  // Get top 6 popular lots by bids count
  const popularLots = [...lots]
    .sort((a, b) => getBidsForLot(b.id).length - getBidsForLot(a.id).length)
    .slice(0, 6);

  return (
    <section className={styles.section}>
      <div className={styles.headerRow}>
        <h2 className={styles.blockTitle}>{t.lots.title}</h2>
        <Link 
          href={`/${language}/auctions`} 
          className={styles.viewAllLink}
        >
          {t.lots.viewAll} &rarr;
        </Link>
      </div>
      
      <div className={styles.grid}>
        {popularLots.map((lot) => (
          <AuctionCard 
            key={lot.id} 
            lot={lot}
            showFavoriteButton={false} 
          />
        ))}
      </div>
    </section>
  );
}
