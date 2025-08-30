// Core exports
export { LanguageSwitcher } from './core/language-switcher';
export * from './types/types';
export * from './utils/utils';

// React hooks and components
export { useLanguage, useTranslation, useTranslations } from './hooks/useLanguage';
export { 
  LanguageSwitcher as ReactLanguageSwitcher,
  Translation,
  RTLDirection,
  LanguageProvider,
  withTranslation
} from './components/components';

// Next.js adapters
export * from './adapters';

// Weglot-like functionality
export { ContentDetector } from './utils/content-detector';
export { TranslationService } from './utils/translation-service'; 