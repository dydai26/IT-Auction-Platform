'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './AdminLayout.module.css';

export default function AdminSidebar({ lang }: { lang: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <div className={styles.mobileHeader}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 }}>Админ-панель</h2>
        <button className={styles.hamburger} onClick={() => setIsOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <div 
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`} 
        onClick={closeSidebar}
      ></div>

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', paddingLeft: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 }}>
            Админ-панель
          </h2>
          <button 
            className={styles.hamburger} 
            onClick={closeSidebar} 
            style={{ display: isOpen ? 'flex' : 'none' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Link href={`/${lang}/admin`} onClick={closeSidebar} style={{ padding: '0.75rem 1rem', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontWeight: 500 }} className="admin-nav-link">
            Дашборд
          </Link>
          <Link href={`/${lang}/admin/lots`} onClick={closeSidebar} style={{ padding: '0.75rem 1rem', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontWeight: 500 }} className="admin-nav-link">
            Управление лотами
          </Link>
          <Link href={`/${lang}/admin/categories`} onClick={closeSidebar} style={{ padding: '0.75rem 1rem', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontWeight: 500 }} className="admin-nav-link">
            Категории
          </Link>
          <Link href={`/${lang}/admin/users`} onClick={closeSidebar} style={{ padding: '0.75rem 1rem', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontWeight: 500 }} className="admin-nav-link">
            Пользователи
          </Link>
          <Link href={`/${lang}/admin/settings`} onClick={closeSidebar} style={{ padding: '0.75rem 1rem', borderRadius: '8px', textDecoration: 'none', color: '#374151', fontWeight: 500 }} className="admin-nav-link">
            Настройки
          </Link>
        </nav>
        
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
          <Link 
            href={`/${lang}`} 
            style={{ 
              display: 'block', 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              color: '#854d0e', 
              backgroundColor: '#fef08a', 
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            ← Вернуться на сайт
          </Link>
        </div>
      </aside>
    </>
  );
}
