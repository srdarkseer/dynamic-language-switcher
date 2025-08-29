import { LanguageSwitcher } from './language-switcher';
import type {
  LanguageSwitcherOptions,
  LanguageSwitcherInstance,
  LanguageConfig,
  TranslationData,
  InterpolationFunction
} from './types';

export { LanguageSwitcher } from './language-switcher';
export * from './utils';
export type {
  LanguageSwitcherOptions,
  LanguageSwitcherInstance,
  LanguageConfig,
  TranslationData,
  InterpolationFunction
} from './types';

// React exports
export * from './react/useLanguage';
export * from './react/components';

// Next.js exports
export * from './nextjs';

// Convenience function to create a language switcher instance
export function createLanguageSwitcher(options: LanguageSwitcherOptions): LanguageSwitcher {
  return new LanguageSwitcher(options);
}

// Default export
export default LanguageSwitcher; 