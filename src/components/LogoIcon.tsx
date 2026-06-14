'use client';

import React from 'react';

interface LogoIconProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function LogoIcon({ className, style }: LogoIconProps) {
  return (
    <div 
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2em',
        height: '2em',
        verticalAlign: 'middle',
        ...style
      }}
    >
      {/* Globe Grid Outline in Background */}
      <svg 
        viewBox="0 0 48 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        <defs>
          <linearGradient id="logo-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bf953f" />
            <stop offset="25%" stopColor="#fcf6ba" />
            <stop offset="50%" stopColor="#b38728" />
            <stop offset="75%" stopColor="#fbf5b7" />
            <stop offset="100%" stopColor="#aa771c" />
          </linearGradient>
        </defs>
        
        <circle 
          cx="24" 
          cy="24" 
          r="22" 
          stroke="url(#logo-gold-grad)" 
          strokeWidth="1.5" 
          fill="none" 
          opacity="0.4"
        />
        <ellipse 
          cx="24" 
          cy="24" 
          rx="22" 
          ry="10" 
          stroke="url(#logo-gold-grad)" 
          strokeWidth="1" 
          fill="none" 
          opacity="0.25" 
        />
        <ellipse 
          cx="24" 
          cy="24" 
          rx="10" 
          ry="22" 
          stroke="url(#logo-gold-grad)" 
          strokeWidth="1" 
          fill="none" 
          opacity="0.25" 
        />
        <line 
          x1="2" 
          y1="24" 
          x2="46" 
          y2="24" 
          stroke="url(#logo-gold-grad)" 
          strokeWidth="1" 
          opacity="0.25" 
        />
        <line 
          x1="24" 
          y1="2" 
          x2="24" 
          y2="46" 
          stroke="url(#logo-gold-grad)" 
          strokeWidth="1" 
          opacity="0.25" 
        />
      </svg>

      {/* Large IT Letters in Foreground */}
      <span 
        className="gold-text"
        style={{
          position: 'relative',
          zIndex: 1,
          fontSize: '1em', // Full container size (e.g. 3.5rem)
          lineHeight: 1,
          fontWeight: 900,
          fontFamily: 'inherit',
          letterSpacing: '1px',
          display: 'block',
          textAlign: 'center',
          transform: 'translateY(-2px)' // Precise optical alignment
        }}
      >
        IT
      </span>
    </div>
  );
}
