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
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Визначаємо базовий URL: беремо з ENV (якщо є), інакше беремо поточний домен, інакше хардкодимо прод.
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${baseUrl}/ru/reset-password`, 
        });
        if (error) throw error;
        setResetSent(true);
      } else if (isLogin) {
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
            emailRedirectTo: `${baseUrl}/ru/profile`, // Направляємо користувача в профіль після підтвердження
            data: {
              full_name: name,
              phone: phone,
              role: 'user' // Default role
            }
          }
        });

        if (signUpError) throw signUpError;

        alert('Registration successful! Please check your email to confirm your account or sign in.');
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const errorMsg = err.message || t.auth?.error || 'Ошибка авторизации';
      setError(errorMsg);
      alert('Увага: ' + errorMsg); // Додаємо alert, щоб користувач точно бачив помилку
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
          {resetSent ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', marginBottom: '0.5rem' }}>Link sent!</h3>
              <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
                Please check your email ({email}). We have sent a password reset link there.
              </p>
              <button 
                className={styles.submitBtn} 
                onClick={() => { setIsForgotPassword(false); setResetSent(false); setIsLogin(true); }}
              >
                {t.auth.backToLogin || 'Вернуться ко входу'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {!isLogin && !isForgotPassword && (
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
                    <label className={styles.label}>{t.auth.phone}</label>
                    <input 
                      type="tel" 
                      className={styles.input} 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      required
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
              
              {!isForgotPassword && (
                <div className={styles.formGroup}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className={styles.label} style={{ marginBottom: 0 }}>{t.auth.password}</label>
                    {isLogin && (
                      <button 
                        type="button" 
                        onClick={() => { setIsForgotPassword(true); setError(''); }}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 500 }}
                      >
                        {t.auth.forgotPassword || 'Забыли пароль?'}
                      </button>
                    )}
                  </div>
                  <div style={{ position: 'relative', marginTop: '0.5rem' }}>
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
              )}

              {error && <div className={styles.error}>{error}</div>}

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading 
                  ? t.auth.loading 
                  : isForgotPassword 
                    ? (t.auth.sendResetLink || 'Отправить ссылку') 
                    : isLogin 
                      ? t.auth.submitLogin 
                      : t.auth.submitRegister}
              </button>

              {isForgotPassword && (
                <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                  <button 
                    type="button" 
                    onClick={() => { setIsForgotPassword(false); setError(''); }}
                    style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    {t.auth.backToLogin || 'Вернуться ко входу'}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
