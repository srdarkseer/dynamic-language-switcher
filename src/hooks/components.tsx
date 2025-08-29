import React, { ReactNode } from 'react';
import { useLanguage, useTranslations } from './useLanguage';
import { TranslationData } from '../types/types';

// Language Switcher Component
export interface LanguageSwitcherProps {
  className?: string;
  showFlags?: boolean;
  showNames?: boolean;
  showCodes?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'select' | 'dropdown' | 'buttons';
}

export function LanguageSwitcher({
  className = '',
  showFlags = true,
  showNames = true,
  showCodes = false,
  size = 'md',
  variant = 'select'
}: LanguageSwitcherProps) {
  const { currentLanguage, availableLanguages, switchLanguage, isRTL, direction } = useLanguage();

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3'
  };

  if (variant === 'select') {
    return (
      <select
        value={currentLanguage}
        onChange={(e) => switchLanguage(e.target.value)}
        className={`language-selector ${sizeClasses[size]} ${className}`}
        dir={direction}
      >
        {availableLanguages.map((lang: any) => (
          <option key={lang.code} value={lang.code}>
            {showFlags && lang.flag} {showNames && lang.name} {showCodes && `(${lang.code})`}
          </option>
        ))}
      </select>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`language-dropdown ${className}`} dir={direction}>
        <button className={`dropdown-trigger ${sizeClasses[size]}`}>
          {showFlags && availableLanguages.find((l: any) => l.code === currentLanguage)?.flag}
          {showNames && availableLanguages.find((l: any) => l.code === currentLanguage)?.name}
          {showCodes && ` (${currentLanguage})`}
        </button>
        <div className="dropdown-menu">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`dropdown-item ${lang.code === currentLanguage ? 'active' : ''}`}
            >
              {showFlags && lang.flag} {showNames && lang.name} {showCodes && `(${lang.code})`}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Buttons variant
  return (
    <div className={`language-buttons ${className}`} dir={direction}>
      {availableLanguages.map((lang: any) => (
        <button
          key={lang.code}
          onClick={() => switchLanguage(lang.code)}
          className={`language-button ${sizeClasses[size]} ${
            lang.code === currentLanguage ? 'active' : ''
          }`}
        >
          {showFlags && lang.flag} {showNames && lang.name} {showCodes && `(${lang.code})`}
        </button>
      ))}
    </div>
  );
}

// Translation Component
export interface TranslationProps {
  key: string;
  params?: Record<string, string | number>;
  children?: ReactNode;
  fallback?: string;
  className?: string;
}

export function Translation({ key, params, children, fallback, className = '' }: TranslationProps) {
  const { t } = useLanguage();
  const translatedText = t(key, params);

  if (translatedText === key && fallback) {
    return <span className={className}>{fallback}</span>;
  }

  if (children) {
    return <span className={className}>{translatedText || children}</span>;
  }

  return <span className={className}>{translatedText}</span>;
}

// RTL Direction Component
export interface RTLDirectionProps {
  children: ReactNode;
  className?: string;
}

export function RTLDirection({ children, className = '' }: RTLDirectionProps) {
  const { direction, isRTL } = useLanguage();

  return (
    <div 
      className={`rtl-direction ${className}`}
      dir={direction}
      data-rtl={isRTL}
    >
      {children}
    </div>
  );
}

// Language Context Provider
export interface LanguageProviderProps {
  children: ReactNode;
  options: any; // LanguageSwitcherOptions
  translations?: Record<string, TranslationData>;
}

export function LanguageProvider({ children, options, translations }: LanguageProviderProps) {
  const { languageSwitcher, isReady } = useLanguage();

  React.useEffect(() => {
    if (languageSwitcher && translations) {
      Object.entries(translations).forEach(([language, data]) => {
        languageSwitcher.addTranslations(language, data);
      });
    }
  }, [languageSwitcher, translations]);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

// Higher-order component for translating components
export function withTranslation<P extends object>(
  Component: React.ComponentType<P>,
  translationKeys: string[]
) {
  return function TranslatedComponent(props: P) {
    const translations = useTranslations(translationKeys);
    
    return <Component {...props} translations={translations} />;
  };
} 