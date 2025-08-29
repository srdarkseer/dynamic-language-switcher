import { useState, useEffect, useCallback, useMemo } from 'react';
import { LanguageSwitcher } from '../core/language-switcher';
import { LanguageSwitcherOptions } from '../types/types';

// Global language switcher instance
let globalLanguageSwitcher: LanguageSwitcher | null = null;

// Initialize global language switcher
export function initializeLanguageSwitcher(options: LanguageSwitcherOptions): LanguageSwitcher {
  if (!globalLanguageSwitcher) {
    globalLanguageSwitcher = new LanguageSwitcher(options);
  }
  return globalLanguageSwitcher;
}

// Get global language switcher instance
export function getLanguageSwitcher(): LanguageSwitcher {
  if (!globalLanguageSwitcher) {
    throw new Error('Language switcher not initialized. Call initializeLanguageSwitcher first.');
  }
  return globalLanguageSwitcher;
}

// React hook for language switching
export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isReady, setIsReady] = useState(false);

  const languageSwitcher = useMemo(() => {
    try {
      return getLanguageSwitcher();
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (languageSwitcher) {
      setCurrentLanguage(languageSwitcher.currentLanguage);
      setIsReady(true);

      // Set up language change listener
      const handleLanguageChange = (language: string) => {
        setCurrentLanguage(language);
      };

      languageSwitcher.onLanguageChange = handleLanguageChange;

      // Cleanup
      return () => {
        if (languageSwitcher.onLanguageChange === handleLanguageChange) {
          languageSwitcher.onLanguageChange = undefined;
        }
      };
    }
  }, [languageSwitcher]);

  const switchLanguage = useCallback(async (language: string) => {
    if (languageSwitcher) {
      await languageSwitcher.setLanguage(language);
    }
  }, [languageSwitcher]);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    if (languageSwitcher) {
      return languageSwitcher.getText(key, params);
    }
    return key;
  }, [languageSwitcher]);

  const isRTL = useCallback((): boolean => {
    if (languageSwitcher) {
      return languageSwitcher.isRTL();
    }
    return false;
  }, [languageSwitcher]);

  const getDocumentDirection = useCallback((): 'ltr' | 'rtl' => {
    if (languageSwitcher) {
      return languageSwitcher.getDocumentDirection();
    }
    return 'ltr';
  }, [languageSwitcher]);

  const availableLanguages = useMemo(() => {
    if (languageSwitcher) {
      return languageSwitcher.availableLanguages;
    }
    return [];
  }, [languageSwitcher]);

  const currentLanguageConfig = useMemo(() => {
    if (languageSwitcher) {
      return languageSwitcher.getCurrentLanguageConfig();
    }
    return undefined;
  }, [languageSwitcher, currentLanguage]);

  return {
    // State
    currentLanguage,
    isReady,
    isRTL: isRTL(),
    direction: getDocumentDirection(),
    
    // Actions
    switchLanguage,
    t,
    
    // Data
    availableLanguages,
    currentLanguageConfig,
    
    // Instance
    languageSwitcher
  };
}

// Hook for translating specific keys with automatic updates
export function useTranslation(key: string, params?: Record<string, string | number>) {
  const { t, currentLanguage } = useLanguage();
  
  const translatedText = useMemo(() => {
    return t(key, params);
  }, [t, key, currentLanguage, params]);

  return translatedText;
}

// Hook for translating multiple keys at once
export function useTranslations(keys: string[]) {
  const { t, currentLanguage } = useLanguage();
  
  const translations = useMemo(() => {
    const result: Record<string, string> = {};
    keys.forEach(key => {
      result[key] = t(key);
    });
    return result;
  }, [t, keys, currentLanguage]);

  return translations;
} 