'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Lot, useApp } from '@/context/AppContext';
import styles from './AuctionCard.module.css';

interface AuctionCardProps {
  lot: Lot;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
  showFavoriteButton?: boolean;
}

export default function AuctionCard({ lot, isFavorite, onToggleFavorite, showFavoriteButton = false }: AuctionCardProps) {
  const { t, language } = useLanguage();
  const { getBidsForLot } = useApp();
  
  const [now, setNow] = useState(new Date().getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date().getTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const bids = getBidsForLot(lot.id);
  const bidsCount = bids.length;

  const title = (language === 'zh' ? lot.title_zh : language === 'en' ? lot.title_en : lot.title_ru) || lot.title_ru || '';
  const desc = (language === 'zh' ? lot.description_zh : language === 'en' ? lot.description_en : lot.description_ru) || lot.description_ru || '';
  const categoryName = (language === 'zh' ? lot.category_zh : language === 'en' ? lot.category_en : lot.category_ru) || lot.category_ru || '';

  const end = new Date(lot.endTime).getTime();
  const diff = end - now;
  const isEnded = diff <= 0;

  // Localized Labels
  const labels = {
    currentBid: language === 'ru' ? 'Текущая ставка' : language === 'zh' ? '当前出价' : 'Current Bid',
    bids: language === 'ru' ? 'Ставок' : language === 'zh' ? '出价数' : 'Bids',
    timeLeft: language === 'ru' ? 'До завершения' : language === 'zh' ? '结束时间' : 'Time Left',
    ended: language === 'ru' ? 'Завершено' : language === 'zh' ? '已结束' : 'Ended',
    actionBtn: language === 'ru' ? 'Участвовать в аукционе' : language === 'zh' ? '参与竞拍' : 'Join Auction',
    actionBtnEnded: language === 'ru' ? 'Аукцион завершен' : language === 'zh' ? '竞拍已结束' : 'Auction Ended'
  };

  const formatPrice = (amount: number) => {
    const currency = lot.currency || 'USD';
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

  const formatTimeLeft = () => {
    if (diff <= 0) {
      return labels.ended;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      const dSuffix = language === 'ru' ? 'д' : language === 'zh' ? '天' : 'd';
      return `${days}${dSuffix} ${remainingHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Link href={`/${language}/auction/${lot.id}`} style={{ textDecoration: 'none' }}>
      <div className={styles.card}>
        {/* Category Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className={styles.categoryBadge}>{(categoryName || '').toUpperCase()}</div>
          {showFavoriteButton && onToggleFavorite && (
            <div 
              className={styles.favoriteBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(lot.id, e);
              }}
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill={isFavorite ? "#ef4444" : "none"} 
                stroke={isFavorite ? "#ef4444" : "#6b7280"} 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className={styles.cardTitle}>{title}</h3>

        {/* Description */}
        <div className={styles.cardDescription}>{desc}</div>

        {/* Meta Stats Grid */}
        <div className={styles.metaGrid}>
          {/* Bid details */}
          <div className={styles.metaItemLeft}>
            <span className={styles.metaLabel}>{labels.currentBid}</span>
            <span className={styles.metaValuePrice}>{formatPrice(lot.currentPrice)}</span>
            <span className={styles.metaLabelBids}>{labels.bids}: {bidsCount}</span>
          </div>

          {/* Time details */}
          <div className={styles.metaItemRight}>
            <span className={styles.metaLabel}>{labels.timeLeft}</span>
            <span className={isEnded ? styles.metaValueTimeEnded : styles.metaValueTime}>
              {formatTimeLeft()}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className={isEnded ? styles.bidButtonEnded : styles.bidButton}>
          {isEnded ? labels.actionBtnEnded : labels.actionBtn}
        </div>
      </div>
    </Link>
  );
}
