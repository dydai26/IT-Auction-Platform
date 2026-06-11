'use client';

import React, { useState } from 'react';
import styles from './AuthModal.module.css';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { createClient } from '@/lib/supabase/client';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const supabase = createClient();
  const { t } = useLanguage();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Dev bypass for dydai26@gmail.com when Supabase has rate limits
        if (email.toLowerCase() === 'dydai26@gmail.com' && password === '123456') {
          document.cookie = "test_admin=true; path=/; max-age=3600";
          // We will set user inside the context bypass or reload
          // Let's use the local fallback simulation by setting auth cookie
          onClose();
          window.location.reload(); // Reload to let AppContext fetch the bypass profile or simulation
          return;
        }

        // Real Supabase Sign In
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (signInError) throw signInError;

        // If login is test admin, set cookie to bypass middleware if needed
        if (email.trim().toLowerCase() === 'admin@example.com') {
          document.cookie = "test_admin=true; path=/; max-age=3600";
        } else {
          document.cookie = "test_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        }

        onClose();
        window.location.reload(); // Hard reload to ensure all states and middleware are fully updated
      } else {
        // Real Supabase Sign Up
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: name,
              phone: phone,
              role: 'user' // Default role
            }
          }
        });

        if (signUpError) throw signUpError;

        alert('Регистрация успешна! Проверьте почту для подтверждения или войдите.');
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || t.auth?.error || 'Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        {/* Premium Close Button */}
        <button 
          onClick={onClose} 
          className={styles.closeBtn}
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className={styles.header}>
          <button 
            className={`${styles.tab} ${isLogin ? styles.tabActive : ''}`} 
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            {t.auth.signIn}
          </button>
          <button 
            className={`${styles.tab} ${!isLogin ? styles.tabActive : ''}`} 
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            {t.auth.signUp}
          </button>
        </div>

        <div className={styles.content}>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t.auth.name}</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>{t.auth.phone} <span style={{fontSize: '0.8em', color: 'var(--text-muted)', fontWeight: 'normal'}}>(необов'язково)</span></label>
                  <input 
                    type="tel" 
                    className={styles.input} 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                </div>
              </>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label}>{t.auth.email}</label>
              <input 
                type="email" 
                className={styles.input} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="example@mail.com"
                required 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>{t.auth.password}</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className={styles.input} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  minLength={6}
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.25rem'
                  }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? t.auth.loading : isLogin ? t.auth.submitLogin : t.auth.submitRegister}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
