export interface TranslationData {
  [key: string]: string | TranslationData;
}

export interface LanguageConfig {
  code: string;
  name: string;
  flag?: string;
  rtl?: boolean;
}

export interface LanguageSwitcherOptions {
  defaultLanguage: string;
  fallbackLanguage?: string;
  persistLanguage?: boolean;
  storageKey?: string;
  onLanguageChange?: (language: string) => void;
  debug?: boolean;
}

export interface LanguageSwitcherInstance {
  currentLanguage: string;
  availableLanguages: LanguageConfig[];
  translations: Record<string, TranslationData>;
  
  setLanguage(language: string): Promise<void>;
  getText(key: string, params?: Record<string, string | number>): string;
  addLanguage(language: string, config: LanguageConfig): void;
  addTranslations(language: string, translations: TranslationData): void;
  removeLanguage(language: string): void;
  isRTL(): boolean;
  getLanguageConfig(language: string): LanguageConfig | undefined;
}

export type InterpolationFunction = (key: string, params: Record<string, string | number>) => string; 