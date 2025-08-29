// Core exports
export { LanguageSwitcher } from './core/language-switcher';
export type { 
  TranslationData, 
  LanguageConfig, 
  LanguageSwitcherOptions, 
  LanguageSwitcherInstance, 
  InterpolationFunction 
} from './types/types';

// Utility exports
export * from './utils/utils';

// React hooks and components
export * from './hooks/useLanguage';
export * from './hooks/components';

// Next.js adapters
export * from './adapters';

// Re-export types for convenience
export * from './types/types'; 