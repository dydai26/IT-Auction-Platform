'use client';

import styles from './HeroSection.module.css';

export default function HeroLoginButton({ label }: { label: string }) {
  return (
    <button 
      onClick={() => window.dispatchEvent(new Event('openAuth'))}
      className={styles.button} 
    >
      {label}
    </button>
  );
}
