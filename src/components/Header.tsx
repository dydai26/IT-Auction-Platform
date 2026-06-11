'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import AuthModal from './AuthModal';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser: user, logout } = useApp();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    window.location.href = `/${language}`;
  };

  const handleLangChange = (lang: 'ru' | 'en' | 'zh') => {
    setLanguage(lang);
    setIsLangMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const langs = [
    { code: 'ru', label: 'RU' },
    { code: 'en', label: 'EN' },
    { code: 'zh', label: 'ZH' }
  ];

  const currentLangObj = langs.find(l => l.code === language) || langs[0];

  return (
    <>
      <nav 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e5e7eb',
          padding: '1rem 0'
        }}
      >
        <div 
          className="container" 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          {/* Logo */}
          <Link 
            href={`/${language}`}
            className="gold-text header-logo" 
            style={{ 
              fontWeight: 'bold',
              letterSpacing: '2px',
              textDecoration: 'none',
              zIndex: 51
            }}
          >
            IT
          </Link>
          
          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: 'none', gap: '2.5rem', alignItems: 'center' }}>
            <Link 
              href={`/${language}/auctions`} 
              style={{ fontSize: '1.1rem', fontWeight: 500, color: '#171717', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#171717'}
            >
              {t.nav.auction}
            </Link>
            <Link 
              href={`/${language}/about`} 
              style={{ fontSize: '1.1rem', fontWeight: 500, color: '#171717', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#171717'}
            >
              {t.nav.about}
            </Link>
            <a 
              href="#footer" 
              style={{ fontSize: '1.1rem', fontWeight: 500, color: '#171717', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#171717'}
            >
              {t.nav.contacts || 'Contacts'}
            </a>
          </div>
          
          {/* Right Section */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            
            {/* Language Dropdown */}
            <div className="desktop-nav" ref={langMenuRef} style={{ position: 'relative', display: 'none' }}>
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 0.75rem', borderRadius: '8px',
                  background: 'transparent', border: '1px solid #e5e7eb',
                  fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <span>{currentLangObj.label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isLangMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              {isLangMenuOpen && (
                <div style={{
                  position: 'absolute', top: '110%', right: 0,
                  background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden', width: '100%'
                }}>
                  {langs.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => handleLangChange(l.code as any)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        width: '100%', padding: '0.75rem 1rem', background: 'transparent',
                        border: 'none', borderBottom: '1px solid #f3f4f6',
                        textAlign: 'left', cursor: 'pointer',
                        fontWeight: language === l.code ? 600 : 400,
                        backgroundColor: language === l.code ? '#f9fafb' : 'transparent'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = language === l.code ? '#f9fafb' : 'transparent'}
                    >
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Actions (Desktop) */}
            <div className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: '1rem', borderLeft: '1px solid #e5e7eb', paddingLeft: '1rem' }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {user.role === 'admin' && (
                    <Link 
                      href={`/${language}/admin`} 
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '0.5rem', 
                        padding: '0.5rem 1rem', borderRadius: '8px', 
                        border: '1px solid #e5e7eb', textDecoration: 'none', 
                        color: '#111827', fontWeight: 600, backgroundColor: '#ffffff',
                        transition: 'border-color 0.2s ease'
                      }}
                    >
                      Кабінет
                    </Link>
                  )}
                  {user.role !== 'admin' && (
                    <Link 
                      href={`/${language}/profile`}
                      style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.5rem',
                        transition: 'opacity 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      title="Личный кабинет"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#d4af37' }}>
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', padding: '0.5rem', borderRadius: '6px' }}
                    title="Выйти"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                  </button>
                </div>
              ) : (
                <button 
                onClick={() => setIsAuthModalOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.5rem' }}
                aria-label="Account"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#171717' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', zIndex: 51 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isMobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Full Screen Menu */}
      <div 
        style={{
          position: 'fixed', inset: 0, background: '#fff', zIndex: 40,
          display: isMobileMenuOpen ? 'flex' : 'none',
          flexDirection: 'column', paddingTop: '100px', paddingBottom: '2rem',
          paddingLeft: '2rem', paddingRight: '2rem', gap: '2rem',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
          <Link href={`/${language}/auctions`} onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 600, color: '#171717', textDecoration: 'none' }}>
            {t.nav.auction}
          </Link>
          <Link href={`/${language}/about`} onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 600, color: '#171717', textDecoration: 'none' }}>
            {t.nav.about}
          </Link>
          <a href="#footer" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1.5rem', fontWeight: 600, color: '#171717', textDecoration: 'none' }}>
            {t.nav.contacts || 'Contacts'}
          </a>
        </div>

        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500, margin: 0, textTransform: 'uppercase' }}>Мова</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {langs.map(l => (
              <button 
                key={l.code}
                onClick={() => handleLangChange(l.code as any)}
                style={{
                  padding: '0.75rem', borderRadius: '8px', border: `1px solid ${language === l.code ? '#171717' : '#e5e7eb'}`,
                  background: language === l.code ? '#171717' : '#fff', color: language === l.code ? '#fff' : '#171717',
                  fontWeight: 600, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '2rem', marginTop: 'auto' }}>
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#171717' }}>{user.name || user.email}</div>
              <Link 
                href={`/${language}/profile`} 
                onClick={() => setIsMobileMenuOpen(false)} 
                style={{ 
                  padding: '1rem', 
                  background: '#f3f4f6', 
                  borderRadius: '8px', 
                  textAlign: 'center', 
                  fontWeight: 600, 
                  color: '#171717', 
                  textDecoration: 'none' 
                }}
              >
                {t.nav.profile || 'Кабинет'}
              </Link>
              {user.role === 'admin' && (
                <Link href={`/${language}/admin`} onClick={() => setIsMobileMenuOpen(false)} style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px', textAlign: 'center', fontWeight: 600, color: '#171717', textDecoration: 'none' }}>
                  Адмін панель
                </Link>
              )}
              <button onClick={handleLogout} style={{ padding: '1rem', background: '#fef2f2', color: '#dc2626', borderRadius: '8px', fontWeight: 600, border: 'none' }}>
                Вийти
              </button>
            </div>
          ) : (
            <button 
              onClick={() => { setIsMobileMenuOpen(false); setIsAuthModalOpen(true); }}
              style={{ width: '100%', padding: '1rem', background: '#171717', color: '#fff', borderRadius: '8px', fontWeight: 600, border: 'none' }}
            >
              Увійти
            </button>
          )}
        </div>
      </div>

      <style jsx global>{`
        .desktop-nav {
          display: flex !important;
        }
        .mobile-toggle {
          display: none !important;
        }
        .header-logo {
          font-size: 2rem !important;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
          .header-logo {
            font-size: 1.6rem !important;
          }
        }
      `}</style>

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </>
  );
}
