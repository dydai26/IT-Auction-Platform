'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Category } from '@/context/AppContext';
import styles from './AuctionsExplorer.module.css';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  showPopularOnly: boolean;
  setShowPopularOnly: (val: boolean) => void;
  selectedCategories: string[];
  handleCategoryChange: (catNameEn: string) => void;
  categories: Category[];
  selectedBrands: string[];
  handleBrandChange: (brand: string) => void;
  brands: string[];
}

export default function FilterSidebar({
  isOpen,
  onClose,
  showPopularOnly,
  setShowPopularOnly,
  selectedCategories,
  handleCategoryChange,
  categories,
  selectedBrands,
  handleBrandChange,
  brands
}: FilterSidebarProps) {
  const { t, language } = useLanguage();

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      {/* Mobile Header */}
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarHeaderTitle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          {language === 'ru' ? 'Фильтры' : language === 'zh' ? '过滤器' : 'Filters'}
        </div>
        <button className={styles.sidebarCloseBtn} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className={styles.sidebarContent}>
        {/* Popular Lots Filter Box */}
        <div className={styles.filterBox}>
          <h3 className={styles.filterTitle}>
            {language === 'ru' ? 'Популярность' : language === 'zh' ? '热度' : 'Popularity'}
          </h3>
          <div className={styles.filterGroup}>
            <div className={styles.checkboxRow} onClick={() => setShowPopularOnly(!showPopularOnly)}>
              <div className={styles.checkboxLabelContainer}>
                <input
                  type="checkbox"
                  checked={showPopularOnly}
                  onChange={() => {}} // Controlled by row click
                  className={styles.checkbox}
                />
                <span className={styles.checkboxLabel}>
                  {language === 'ru' ? 'Популярные лоты (от 10 ставок)' : language === 'zh' ? '热门拍品 (10次出价以上)' : 'Popular Lots (10+ bids)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Filter Box */}
        <div className={styles.filterBox}>
          <h3 className={styles.filterTitle}>
            {language === 'ru' ? 'Категории' : language === 'zh' ? '类别' : 'Categories'}
          </h3>
          <div className={styles.filterGroup}>
            {categories.map((cat) => {
              const isChecked = selectedCategories.includes(cat.name_en);
              const catName = language === 'ru' ? cat.name_ru : language === 'zh' ? cat.name_zh : cat.name_en;
              
              return (
                <div 
                  key={cat.id}
                  className={styles.checkboxRow}
                  onClick={() => handleCategoryChange(cat.name_en)}
                >
                  <div className={styles.checkboxLabelContainer}>
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => {}} // handled by div click
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxLabel}>{catName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Brands Filter Box */}
        <div className={styles.filterBox}>
          <h3 className={styles.filterTitle}>
            {language === 'ru' ? 'Бренды' : language === 'zh' ? '品牌' : 'Brands'}
          </h3>
          <div className={styles.filterGroup}>
            {brands.map((brandKey) => {
              const isChecked = selectedBrands.includes(brandKey);
              const brandName = t.lots.brands[brandKey as keyof typeof t.lots.brands] || brandKey;

              return (
                <div 
                  key={brandKey}
                  className={styles.checkboxRow}
                  onClick={() => handleBrandChange(brandKey)}
                >
                  <div className={styles.checkboxLabelContainer}>
                    <input 
                      type="checkbox" 
                      checked={isChecked}
                      onChange={() => {}} // handled by div click
                      className={styles.checkbox}
                    />
                    <span className={styles.checkboxLabel}>{brandName}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <button className={styles.sidebarApplyBtn} onClick={onClose}>
        {language === 'ru' ? 'Применить' : language === 'zh' ? '应用' : 'Apply'}
      </button>
    </div>
  );
}
