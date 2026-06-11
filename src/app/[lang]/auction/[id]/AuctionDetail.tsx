'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';

export default function AuctionDetail({ id }: { id: string }) {
  const { language, t } = useLanguage();
  const { lots, placeBid, getBidsForLot, currentUser } = useApp();
  const [bidAmount, setBidAmount] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  const [now, setNow] = useState(new Date().getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date().getTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const lot = lots.find(a => a.id === id);

  const formatPrice = (amount: number) => {
    const currency = lot?.currency || 'USD';
    const locale = language === 'zh' ? 'zh-CN' : language === 'ru' ? 'ru-RU' : 'en-US';
    const formattedAmount = amount.toLocaleString(locale);
    switch (currency) {
      case 'UAH':
        return `${formattedAmount} грн`;
      case 'EUR':
        return `€${formattedAmount}`;
      case 'USD':
      default:
        return `$${formattedAmount}`;
    }
  };

  // ================= STYLE CONFIGURATION =================
  const styles = {
    container: {
      padding: '3rem 0',
      minHeight: '80vh',
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: 'var(--text-muted)',
      textDecoration: 'none',
      fontWeight: 500,
      marginBottom: '2rem',
      cursor: 'pointer',
      transition: 'color 0.2s',
    },
    layout: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: '3rem',
    },
    // Left column
    imageArea: {
      width: '100%',
      height: '380px',
      background: 'var(--secondary)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '2rem',
      border: '1px solid var(--border)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: 'var(--foreground)',
      marginBottom: '1rem',
    },
    categoryBadge: {
      display: 'inline-block',
      padding: '0.4rem 0.85rem',
      borderRadius: '20px',
      fontSize: '0.85rem',
      fontWeight: 600,
      background: 'var(--secondary)',
      color: 'var(--foreground)',
      marginBottom: '1.5rem',
    },
    description: {
      fontSize: '1.15rem',
      lineHeight: '1.7',
      color: 'var(--foreground)',
      opacity: 0.9,
    },
    // Right column (Bidding Card)
    bidCard: {
      background: 'white',
      border: '1px solid var(--border)',
      borderRadius: '16px',
      padding: '2.5rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
      position: 'sticky' as const,
      top: '120px',
      height: 'fit-content',
    },
    priceBox: {
      marginBottom: '2rem',
    },
    priceLabel: {
      fontSize: '0.9rem',
      color: 'var(--text-muted)',
      marginBottom: '0.5rem',
    },
    priceValue: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: 'var(--foreground)',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.75rem',
      marginBottom: '1.5rem',
    },
    input: {
      padding: '0.85rem 1.25rem',
      borderRadius: '8px',
      border: '1px solid var(--border)',
      fontSize: '1.1rem',
      outline: 'none',
      fontFamily: 'inherit',
    },
    submitButton: {
      width: '100%',
      padding: '0.9rem',
      fontSize: '1.1rem',
      fontWeight: 600,
      borderRadius: '8px',
      border: 'none',
      background: 'var(--foreground)',
      color: 'var(--background)',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    // Bid history
    historyContainer: {
      marginTop: '2rem',
      borderTop: '1px solid var(--border)',
      paddingTop: '2rem',
    },
    historyTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      marginBottom: '1.25rem',
    },
    historyList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.75rem',
    },
    historyItem: (isCurrentUser: boolean) => ({
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.85rem 1.25rem',
      borderRadius: '8px',
      background: isCurrentUser ? 'rgba(212, 175, 55, 0.08)' : 'var(--secondary)',
      border: isCurrentUser ? '1px dashed var(--primary)' : '1px solid transparent',
    }),
    histUser: {
      fontWeight: 600,
      fontSize: '0.95rem',
    },
    histMeta: {
      fontSize: '0.85rem',
      color: 'var(--text-muted)',
    },
    histAmount: {
      fontWeight: 700,
      fontSize: '1.1rem',
      color: 'var(--foreground)',
    }
  };
  // =======================================================

  if (!lot) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 0' }}>
        <h2>{t.notfound.title}</h2>
        <Link href={`/${language}`} className="btn-primary" style={{ marginTop: '2rem' }}>
          {t.notfound.button}
        </Link>
      </div>
    );
  }

  const title = (language === 'zh' ? lot.title_zh : language === 'en' ? lot.title_en : lot.title_ru) || lot.title_ru || '';
  const description = (language === 'zh' ? lot.description_zh : language === 'en' ? lot.description_en : lot.description_ru) || lot.description_ru || '';
  const categoryName = (language === 'zh' ? lot.category_zh : language === 'en' ? lot.category_en : lot.category_ru) || lot.category_ru || '';

  const bidsHistory = getBidsForLot(lot.id);

  const end = new Date(lot.endTime).getTime();
  const diff = end - now;
  const isEnded = diff <= 0;

  const formatTimeLeft = () => {
    if (diff <= 0) {
      return language === 'ru' ? 'Завершен' : language === 'zh' ? '已结束' : 'Ended';
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} ${language === 'ru' ? 'дн.' : language === 'zh' ? '天' : 'd.'}`;
    }
    
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg(false);

    if (!currentUser) {
      setErrorMsg(language === 'ru' ? 'Сначала войдите в систему!' : language === 'zh' ? '请先登录！' : 'Please login first!');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrorMsg(language === 'ru' ? 'Введите корректное число!' : language === 'zh' ? '请输入有效数字！' : 'Please enter a valid number!');
      return;
    }

    const res = await placeBid(lot.id, amount);
    if (!res.success) {
      if (res.error === 'invalid_amount') {
        setErrorMsg(language === 'ru' ? 'Ставка должна быть больше текущей!' : 'Bid must be higher than current price!');
      } else {
        setErrorMsg(res.error || 'Error placing bid');
      }
    } else {
      setSuccessMsg(true);
      setBidAmount('');
      // Show success briefly
      setTimeout(() => setSuccessMsg(false), 3000);
    }
  };

  return (
    <main className="container" style={styles.container}>
      {/* Back Link */}
      <Link 
        href={`/${language}/auctions`} 
        style={styles.backButton}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--foreground)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        &larr; {t.lots.backToList}
      </Link>

      <div style={styles.layout}>
        {/* Left Column: Info & Details */}
        <div>
          <div style={{...styles.imageArea, backgroundImage: lot.image ? `url(${lot.image})` : 'none'}}>
            {!lot.image && (
              <span style={{ color: '#9ca3af', fontSize: '3rem' }}>{(title || '').charAt(0)}</span>
            )}
          </div>
          <span style={styles.categoryBadge}>{categoryName}</span>
          <h1 style={styles.title}>{title}</h1>
          <p style={styles.description}>{description}</p>
        </div>

        {/* Right Column: Place Bids & History */}
        <div style={styles.bidCard}>
          <div style={styles.priceBox}>
            <p style={styles.priceLabel}>{t.lots.currentBid}</p>
            <p style={styles.priceValue}>{formatPrice(lot.currentPrice)}</p>
          </div>

          <div style={styles.priceBox}>
            <p style={styles.priceLabel}>{language === 'ru' ? 'До завершения:' : 'Time Left:'}</p>
            <p style={{...styles.priceValue, fontSize: '1.75rem', color: isEnded ? '#6b7280' : '#ef4444', fontVariantNumeric: 'tabular-nums'}}>
              {formatTimeLeft()}
            </p>
          </div>

          {/* Placing bid form */}
          <form onSubmit={handleBidSubmit}>
            <div style={styles.inputGroup}>
              <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {t.lots.placeBidBtn} ( &gt; {formatPrice(lot.currentPrice)} )
              </label>
              <input 
                type="number"
                placeholder={formatPrice(lot.currentPrice + 50)}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                style={styles.input}
                disabled={isEnded}
              />
            </div>
            
            <button 
              type="submit" 
              style={{...styles.submitButton, opacity: isEnded ? 0.5 : 1, cursor: isEnded ? 'not-allowed' : 'pointer'}}
              onMouseEnter={(e) => { if(!isEnded) e.currentTarget.style.opacity = '0.9'; }}
              onMouseLeave={(e) => { if(!isEnded) e.currentTarget.style.opacity = '1'; }}
              disabled={isEnded}
            >
              {isEnded ? (language === 'ru' ? 'Аукцион завершен' : 'Auction Ended') : t.lots.placeBidBtn}
            </button>
          </form>

          {errorMsg && (
            <p style={{ color: 'red', marginTop: '1rem', fontWeight: 500 }}>{errorMsg}</p>
          )}
          {successMsg && (
            <p style={{ color: 'var(--accent)', marginTop: '1rem', fontWeight: 500 }}>{t.lots.successBid}</p>
          )}

          {/* Bids history block */}
          <div style={styles.historyContainer}>
            <h3 style={styles.historyTitle}>{t.lots.historyTitle} ({bidsHistory.length})</h3>
            <div style={styles.historyList}>
              {bidsHistory.map((bid) => {
                const isCurrent = currentUser && bid.anonName === currentUser.name;
                return (
                  <div key={bid.id} style={styles.historyItem(!!isCurrent)}>
                    <div>
                      <p style={styles.histUser}>
                        {bid.anonName} {isCurrent && <span style={{ color: 'var(--primary)', fontSize: '0.75rem' }}>{t.lots.you}</span>}
                      </p>
                      <p style={styles.histMeta}>{new Date(bid.createdAt).toLocaleTimeString()}</p>
                    </div>
                    <p style={styles.histAmount}>{formatPrice(bid.amount)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
