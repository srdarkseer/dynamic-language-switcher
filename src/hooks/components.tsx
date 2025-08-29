import React, { ReactNode, useState } from 'react';
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
  const { currentLanguage, availableLanguages, switchLanguage, direction } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3'
  };

  const handleLanguageChange = async (language: string) => {
    await switchLanguage(language);
    if (variant === 'dropdown') {
      setIsDropdownOpen(false);
    }
  };

  // Select variant
  if (variant === 'select') {
    return (
      <select
        className={`language-selector ${sizeClasses[size]} ${className}`}
        value={currentLanguage}
        onChange={(e) => handleLanguageChange(e.target.value)}
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

  // Dropdown variant
  if (variant === 'dropdown') {
    return (
      <div className={`language-dropdown ${className}`} dir={direction}>
        <button 
          className={`dropdown-trigger ${sizeClasses[size]}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          {showFlags && availableLanguages.find((l: any) => l.code === currentLanguage)?.flag}
          {showNames && availableLanguages.find((l: any) => l.code === currentLanguage)?.name}
          {showCodes && ` (${currentLanguage})`}
          <svg 
            className={`ml-2 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isDropdownOpen && (
          <div className="dropdown-menu">
            {availableLanguages.map((lang: any) => (
              <button
                key={lang.code}
                className={`dropdown-item ${lang.code === currentLanguage ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                {showFlags && lang.flag} {showNames && lang.name} {showCodes && `(${lang.code})`}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Buttons variant
  return (
    <div className={`language-buttons ${className}`} dir={direction}>
      {availableLanguages.map((lang: any) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
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
    return <div className="flex items-center justify-center p-8">Loading...</div>;
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