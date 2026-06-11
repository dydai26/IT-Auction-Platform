'use client';

import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import FilterSidebar from './FilterSidebar';
import AuctionCard from './AuctionCard';
import styles from './AuctionsExplorer.module.css';

export default function AuctionsExplorer() {
  const { t, language } = useLanguage();
  const { lots, categories, getBidsForLot } = useApp();

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedSearchQuery, setAppliedSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showPopularOnly, setShowPopularOnly] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Auto-search effect with debounce
  useEffect(() => {
    if (searchQuery.length >= 2 || searchQuery.length === 0) {
      const timeoutId = setTimeout(() => {
        setAppliedSearchQuery(searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery]);

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearchQuery(searchQuery);
  };

  // We can extract unique brands from the lots
  const brands = useMemo(() => {
    const brandSet = new Set<string>();
    lots.forEach(lot => {
      if (lot.brand) brandSet.add(lot.brand);
    });
    return Array.from(brandSet);
  }, [lots]);

  // Toggle handlers for filters
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Process data (Filter and Sort)
  const filteredAndSortedLots = useMemo(() => {
    let result = [...lots];

    // Filter by Category
    if (selectedCategories.length > 0) {
      result = result.filter(lot => selectedCategories.includes(lot.category_en));
    }

    // Filter by Brand
    if (selectedBrands.length > 0) {
      result = result.filter(lot => selectedBrands.includes(lot.brand));
    }

    // Filter by Popularity
    if (showPopularOnly) {
      result = result.filter(lot => getBidsForLot(lot.id).length >= 5);
    }

    // Filter by Search Query
    if (appliedSearchQuery.trim() !== '') {
      const query = appliedSearchQuery.toLowerCase();
      result = result.filter(lot => {
        const titleRu = lot.title_ru?.toLowerCase() || '';
        const titleEn = lot.title_en?.toLowerCase() || '';
        const titleZh = lot.title_zh?.toLowerCase() || '';
        const descRu = lot.description_ru?.toLowerCase() || '';
        const descEn = lot.description_en?.toLowerCase() || '';
        const descZh = lot.description_zh?.toLowerCase() || '';
        
        return titleRu.includes(query) || titleEn.includes(query) || titleZh.includes(query) ||
               descRu.includes(query) || descEn.includes(query) || descZh.includes(query);
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'priceLowHigh':
          return a.currentPrice - b.currentPrice;
        case 'priceHighLow':
          return b.currentPrice - a.currentPrice;
        case 'mostBids':
          return getBidsForLot(b.id).length - getBidsForLot(a.id).length;
        case 'featured':
        default:
          return 0; // retain original order
      }
    });

    return result;
  }, [lots, selectedCategories, selectedBrands, appliedSearchQuery, sortBy, showPopularOnly, getBidsForLot]);

  return (
    <div style={{ paddingTop: '2rem' }}>
      <h1 className={styles.pageTitle}>
        {t.nav.auction}
      </h1>

      <div className={styles.layoutGrid}>
        <FilterSidebar 
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
          showPopularOnly={showPopularOnly}
          setShowPopularOnly={setShowPopularOnly}
          selectedCategories={selectedCategories}
          handleCategoryChange={handleCategoryChange}
          categories={categories}
          selectedBrands={selectedBrands}
          handleBrandChange={handleBrandChange}
          brands={brands}
        />

        {/* Right Side: Results */}
        <div className={styles.mainContent}>
          {/* Header row with count, search and sort */}
          <div className={styles.headerRow}>
            <div className={styles.resultsCount}>
              {language === 'ru' ? 'Показано' : language === 'zh' ? '显示' : 'Showing'} <strong>{filteredAndSortedLots.length}</strong> {language === 'ru' ? 'товаров' : language === 'zh' ? '件商品' : 'items'}
            </div>
            
            <div className={styles.rightControls}>
              <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
                <input 
                  type="text" 
                  placeholder={t.lots.searchPlaceholder}
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className={styles.searchButton}>
                  {t.lots.searchBtn}
                </button>
              </form>

              <div className={styles.sortContainer}>
                <button className={styles.mobileFiltersBtn} onClick={() => setIsFiltersOpen(true)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  {language === 'ru' ? 'Фильтры' : language === 'zh' ? '过滤器' : 'Filters'}
                </button>
                <span className={styles.sortLabel}>{t.lots.sortBy}:</span>
                <select 
                  className={styles.sortSelect}
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">{t.lots.sortOptions.featured}</option>
                  <option value="priceLowHigh">{t.lots.sortOptions.priceLowHigh}</option>
                  <option value="priceHighLow">{t.lots.sortOptions.priceHighLow}</option>
                  <option value="mostBids">{t.lots.sortOptions.mostBids}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid of Cards */}
          <div className={styles.grid}>
            {filteredAndSortedLots.map((lot) => (
              <AuctionCard 
                key={lot.id} 
                lot={lot} 
                isFavorite={favorites.includes(lot.id)}
                onToggleFavorite={toggleFavorite}
                showFavoriteButton={true}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredAndSortedLots.length === 0 && (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--card-bg)', borderRadius: '12px', border: '1px dashed var(--border)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}>
                {language === 'ru' ? 'Лоти не знайдено' : language === 'zh' ? '未找到拍品' : 'No lots found'}
              </h3>
              <p style={{ color: 'var(--text-muted)' }}>
                {language === 'ru' ? 'Спробуйте змінити критерії пошуку або скинути фільтри.' : language === 'zh' ? '尝试更改搜索条件或重置过滤器。' : 'Try changing your search criteria or resetting filters.'}
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setAppliedSearchQuery('');
                  setSelectedCategories([]);
                  setSelectedBrands([]);
                  setShowPopularOnly(false);
                }}
                style={{
                  marginTop: '1.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'var(--foreground)',
                  color: 'var(--background)',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                {language === 'ru' ? 'Скинути всі фільтри' : language === 'zh' ? '重置所有过滤器' : 'Reset all filters'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
