import Link from 'next/link';
import Image from 'next/image';
import { translations, Language } from '@/lib/i18n';
import styles from './Footer.module.css';
import LogoIcon from './LogoIcon';

export default function Footer({ lang }: { lang: string }) {
  const t = translations[lang as Language] || translations.ru;

  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Column 1: Logo & Subtitle */}
          <div className={styles.logoCol}>
            <Link href={`/${lang}`} className={styles.logo} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <LogoIcon style={{ fontSize: '2.5rem' }} />
              <span style={{ fontSize: '1.5rem', letterSpacing: 'normal', lineHeight: 'normal', color: '#d4af37' }}>Ideas Technologies</span>
            </Link>
            <p 
              className={styles.subtitle} 
              dangerouslySetInnerHTML={{ __html: t.hero.subtitle }} 
            />
          </div>

          {/* Column 2: Contacts */}
          <div>
            <h3 className={styles.blockTitle}>{t.footer.contacts}</h3>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>{t.footer.phoneLabel}</span>
                <a href="tel:+48663447430" className={styles.contactLink}>
                  +48663447430
                </a>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>{t.footer.emailLabel}</span>
                <a href="mailto:ideas100technologies@gmail.com" className={styles.contactLink}>
                  ideas100technologies@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Socials */}
          <div>
            <h3 className={styles.blockTitle}>{t.footer.socials}</h3>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>{t.footer.whatsapp}</span>
                <a href="https://wa.me/48663447430" className={styles.contactLink} target="_blank" rel="noopener noreferrer">
                  <Image src="/whatsapp-svgrepo-com.svg" alt="WhatsApp" width={24} height={24} />
                  +48663447430
                </a>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>{t.footer.telegram}</span>
                <a href="https://t.me/ABRAM_GOLDENBERG" className={styles.contactLink} target="_blank" rel="noopener noreferrer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.32.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.888-.662 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  @ABRAM_GOLDENBERG
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          &copy; {new Date().getFullYear()} {t.footer.copy}
        </div>
      </div>
    </footer>
  );
}
