'use client';

import React, { useState } from 'react';

export function LanguageToggle() {
  const [language, setLanguage] = useState<'en' | 'it'>('en');

  const toggle = () => {
    const next = language === 'en' ? 'it' : 'en';
    setLanguage(next);
  };

  const isEN = language === 'en';

  return (
    <button
      onClick={toggle}
      aria-label={isEN ? 'Switch to Italian' : 'Passa all\'inglese'}
      title={isEN ? 'Switch to Italian' : 'Passa all\'inglese'}
      className="language-toggle"
    >
      {/* Track */}
      <span className="language-toggle__track" aria-hidden="true">
        {/* Sliding indicator */}
        <span
          className={`language-toggle__indicator ${isEN ? 'language-toggle__indicator--en' : 'language-toggle__indicator--it'}`}
        />
        {/* Labels */}
        <span className={`language-toggle__label language-toggle__label--left ${isEN ? 'language-toggle__label--active' : ''}`}>
          <span className="language-toggle__flag">🇬🇧</span>
          <span className="language-toggle__code">EN</span>
        </span>
        <span className={`language-toggle__label language-toggle__label--right ${!isEN ? 'language-toggle__label--active' : ''}`}>
          <span className="language-toggle__flag">🇮🇹</span>
          <span className="language-toggle__code">IT</span>
        </span>
      </span>
      <style>{`
        .language-toggle {
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          background: transparent;
          border: none;
          padding: 0;
          outline: none;
        }
        .language-toggle:focus-visible .language-toggle__track {
          box-shadow: 0 0 0 2px #13BE77;
        }
        .language-toggle__track {
          position: relative;
          display: flex;
          align-items: center;
          width: 80px;
          height: 30px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.10);
          border: 1px solid rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(8px);
          transition: background 0.3s ease;
          overflow: hidden;
        }
        .language-toggle__indicator {
          position: absolute;
          top: 2px;
          bottom: 2px;
          width: calc(50% - 2px);
          border-radius: 999px;
          background: #13BE77;
          box-shadow: 0 0 12px rgba(19, 190, 119, 0.5);
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .language-toggle__indicator--en {
          transform: translateX(2px);
        }
        .language-toggle__indicator--it {
          transform: translateX(calc(100% + 2px));
        }
        .language-toggle__label {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          width: 50%;
          height: 100%;
          transition: color 0.25s ease;
          color: rgba(255, 255, 255, 0.45);
          user-select: none;
        }
        .language-toggle__label--active {
          color: #ffffff;
        }
        .language-toggle__flag {
          font-size: 12px;
          line-height: 1;
        }
        .language-toggle__code {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }
      `}</style>
    </button>
  );
}
