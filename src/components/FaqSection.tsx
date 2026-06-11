'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './FaqSection.module.css';

export default function FaqSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{t.faq.title}</h2>
      <div className={styles.container}>
        {t.faq.items.map((item: { q: string; a: string }, idx: number) => {
          const isOpen = openIndex === idx;
          
          return (
            <div 
              key={idx} 
              className={styles.faqItem}
              onClick={() => toggleFaq(idx)}
            >
              {/* Рядок питання */}
              <div className={styles.questionRow}>
                <h3 className={styles.question}>{item.q}</h3>
                {/* Анімована стрілочка */}
                <div className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}>
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              
              {/* Контейнер відповіді з плавною анімацією */}
              <div className={`${styles.answerContainer} ${isOpen ? styles.answerContainerOpen : ''}`}>
                <p className={styles.answer}>{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
