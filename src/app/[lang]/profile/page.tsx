'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import styles from './profile.module.css';

export default function ProfilePage() {
  const params = useParams();
  const lang = (params.lang as string) || 'ru';
  
  const { currentUser: user, lots } = useApp();
  const { t } = useLanguage();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Filter lots won by the current user
  const wonLots = user 
    ? lots.filter(lot => lot.winnerId === user.id) 
    : [];

  const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || 'vash_bot';
  const telegramLink = user 
    ? `https://t.me/${botName}?start=${user.id}` 
    : '#';

  // Helper to get localized title of a lot
  const getLotTitle = (lot: any) => {
    if (lang === 'en') return lot.title_en;
    if (lang === 'zh') return lot.title_zh;
    return lot.title_ru;
  };

  // Helper to format currency
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat(lang === 'zh' ? 'zh-CN' : lang === 'en' ? 'en-US' : 'ru-RU', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div style={{ backgroundColor: 'var(--background)' }}>
      <Header />
      
      {!user ? (
        <main className={styles.unauthenticatedWrapper}>
          <div className={styles.unauthCard}>
            <div className={styles.unauthIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h1 className={styles.unauthTitle}>{t.profile?.title || 'Личный кабинет'}</h1>
            <p className={styles.unauthDesc}>
              {t.profile?.loginRequired || 'Пожалуйста, войдите в систему для просмотра личного кабинета.'}
            </p>
            <button 
              className="btn-primary" 
              onClick={() => setIsAuthModalOpen(true)}
              style={{ padding: '0.85rem 2.5rem', fontSize: '1rem' }}
            >
              {t.auth?.signIn || 'Войти'}
            </button>
          </div>
        </main>
      ) : (
        <main className={`container ${styles.wrapper}`}>
          <div className={styles.titleSection}>
            <h1 className="gold-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
              {t.profile?.title || 'Личный кабинет'}
            </h1>
            <p className={styles.subtitle}>{user.email}</p>
          </div>

          <div className={styles.profileGrid}>
            {/* User details card */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {t.auth?.name || 'Профиль'}
              </h2>
              
              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t.auth?.name || 'Имя'}</span>
                  <span className={styles.infoValue}>{user.name}</span>
                </div>
                
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t.auth?.email || 'Email'}</span>
                  <span className={styles.infoValue}>{user.email}</span>
                </div>
                
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>{t.auth?.phone || 'Телефон'}</span>
                  <span className={styles.infoValue}>
                    {user.phone || <em style={{ color: 'var(--text-muted)' }}>{t.profile?.notSpecified || 'Не указан'}</em>}
                  </span>
                </div>
              </div>
            </div>

            {/* Telegram Notification linking card */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                </svg>
                {t.profile?.telegramStatus || 'Статус Telegram'}
              </h2>

              {user.telegramChatId ? (
                <div className={`${styles.telegramContainer} ${styles.telegramConnected}`}>
                  <div className={`${styles.telegramIcon} ${styles.telegramIconConnected}`}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div className={styles.telegramStatusTitle}>
                    {t.profile?.connected || 'Подключено'}
                  </div>
                  <p className={styles.telegramStatusDesc}>
                    {lang === 'en' 
                      ? 'You will receive instant notifications in Telegram about your bids and auction completions.'
                      : lang === 'zh'
                      ? '您将在 Telegram 中收到关于您的出价和拍卖完成的即时通知。'
                      : 'Вы будете получать мгновенные уведомления в Telegram о ваших ставках и завершении аукционов.'
                    }
                  </p>
                  <span className={styles.telegramBadge}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Chat ID: {user.telegramChatId}
                  </span>
                </div>
              ) : (
                <div className={styles.telegramContainer}>
                  <div className={styles.telegramIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <div className={styles.telegramStatusTitle}>
                    {t.profile?.notConnected || 'Не подключено'}
                  </div>
                  <p className={styles.telegramStatusDesc}>
                    {lang === 'en'
                      ? 'Link your account to Telegram to get real-time outbid warnings and winning notifications.'
                      : lang === 'zh'
                      ? '将您的账户与 Telegram 绑定，以获取实时被超越出价警告和中拍通知。'
                      : 'Привяжите ваш аккаунт к Telegram, чтобы получать мгновенные предупреждения о перебитых ставках и выигрышах.'
                    }
                  </p>
                  <a 
                    href={telegramLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.telegramBtn}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    {t.profile?.connectBtn || 'Подключить Telegram'}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Won Lots Section */}
          <div className={styles.wonSection}>
            <h2 className={styles.wonTitle}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#d4af37' }}>
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
              {t.profile?.wonLotsTitle || 'Ваши выигранные лоты'}
            </h2>

            {wonLots.length > 0 ? (
              <div className={styles.lotsGrid}>
                {wonLots.map((lot) => (
                  <div key={lot.id} className={styles.lotCard}>
                    <div className={styles.imageWrapper}>
                      {lot.image ? (
                        <img src={lot.image} alt={getLotTitle(lot)} className={styles.lotImage} />
                      ) : (
                        <div style={{ color: 'var(--text-muted)' }}>No Image</div>
                      )}
                      <span className={styles.badge}>
                        {lang === 'en' ? 'Won' : lang === 'zh' ? '已赢得' : 'Выигран'}
                      </span>
                    </div>
                    <div className={styles.cardContent}>
                      <h3 className={styles.lotTitle}>{getLotTitle(lot)}</h3>
                      <div className={styles.priceRow}>
                        <span className={styles.priceLabel}>
                          {lang === 'en' ? 'Winning Bid' : lang === 'zh' ? '最终出价' : 'Победная ставка'}
                        </span>
                        <span className={styles.priceValue}>
                          {formatPrice(lot.currentPrice, lot.currency)}
                        </span>
                      </div>
                      <Link 
                        href={`/${lang}/auction/${lot.id}`}
                        className="btn-secondary"
                        style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: '1.25rem', padding: '0.65rem' }}
                      >
                        {lang === 'en' ? 'View Details' : lang === 'zh' ? '查看详情' : 'Подробнее'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noLotsCard}>
                <div style={{ color: 'var(--text-muted)', opacity: 0.5 }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
                <h3 className={styles.noLotsTitle}>
                  {t.profile?.noWonLots || 'Вы пока не выиграли ни одного лота.'}
                </h3>
                <p className={styles.noLotsDesc}>
                  {lang === 'en'
                    ? 'Explore our premium active auctions and place your bids to see your won lots here!'
                    : lang === 'zh'
                    ? '浏览我们上架的优质拍卖，参与竞拍，在这里查看您赢得的拍品！'
                    : 'Ознакомьтесь с нашими активными аукционами и делайте ставки, чтобы выиграть лоты!'
                  }
                </p>
                <Link href={`/${lang}/auctions`} className={styles.browseBtn}>
                  {t.hero?.button || 'Посмотреть аукционы'}
                </Link>
              </div>
            )}
          </div>
        </main>
      )}

      <Footer lang={lang} />

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </div>
  );
}
