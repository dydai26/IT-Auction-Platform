'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/context/LanguageContext';
import styles from './about.module.css';

export default function AboutPage() {
  const params = useParams();
  const lang = (params.lang as string) || 'ru';
  const { t } = useLanguage();

  // If translation for aboutPage doesn't exist (fallback)
  const aboutT = (t as any).aboutPage || {
    title: 'О платформе',
    subtitle: 'Узнайте, как работает наша система аукционов и как принимать в них участие',
    howItWorks: { title: 'Как это работает', steps: [] },
    rules: { title: 'Правила платформы', items: [] },
    cta: { title: 'Готовы сделать свою первую ставку?', button: 'Перейти к аукционам' }
  };

  const steps = aboutT.howItWorks.steps || [];
  const rules = aboutT.rules.items || [];

  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <Header />
      
      <main className={styles.container}>
        <section className={styles.hero}>
          <h1 className={`gold-text ${styles.title}`}>{aboutT.title}</h1>
          <p className={styles.subtitle}>{aboutT.subtitle}</p>
        </section>

        {steps.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{aboutT.howItWorks.title}</h2>
            <div className={styles.grid}>
              {steps.map((step: any, index: number) => (
                <div key={index} className={styles.card}>
                  <div className={styles.stepNumber}>{index + 1}</div>
                  <h3 className={styles.cardTitle}>{step.title}</h3>
                  <p className={styles.cardDesc}>{step.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {rules.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>{aboutT.rules.title}</h2>
            <div className={styles.grid}>
              {rules.map((rule: any, index: number) => (
                <div key={index} className={styles.card}>
                  <div className={styles.ruleIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h3 className={styles.cardTitle}>{rule.title}</h3>
                  <p className={styles.cardDesc}>{rule.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className={styles.cta}>
          <h2 className={styles.ctaTitle}>{aboutT.cta.title}</h2>
          <Link href={`/${lang}/auctions`} className={styles.ctaBtn}>
            {aboutT.cta.button}
          </Link>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
