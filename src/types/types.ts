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
  onLanguageChange?: (_language: string) => void;
  debug?: boolean;
  // New options for Weglot-like functionality
  autoTranslate?: boolean;
  translationApi?: TranslationApiConfig;
  contentSelectors?: string[];
  excludeSelectors?: string[];
  preserveOriginalText?: boolean;
}

export interface TranslationApiConfig {
  provider: 'deepl' | 'google-cloud' | 'custom';
  apiKey?: string;
  endpoint?: string;
  region?: string;
  model?: string;
  batchSize?: number;
  rateLimit?: number;
}

export interface DetectedContent {
  element: HTMLElement;
  originalText: string;
  translatedText?: string;
  language: string;
  isTranslated: boolean;
  timestamp: number;
}

export interface TranslationRequest {
  text: string;
  fromLanguage: string;
  toLanguage: string;
  context?: string;
  element?: HTMLElement;
}

export interface TranslationResponse {
  translatedText: string;
  confidence?: number;
  detectedLanguage?: string;
  alternatives?: string[];
}

export interface ContentDetector {
  detect(): DetectedContent[];
  watch(_callback: (_content: DetectedContent[]) => void): void;
  unwatch(): void;
}

export interface TranslationService {
  translate(_request: TranslationRequest): Promise<TranslationResponse>;
  translateBatch(_requests: TranslationRequest[]): Promise<TranslationResponse[]>;
  detectLanguage(_text: string): Promise<string>;
}

export interface LanguageSwitcherInstance {
  currentLanguage: string;
  availableLanguages: LanguageConfig[];
  translations: Record<string, TranslationData>;
  
  // Original methods
  setLanguage(_language: string): Promise<void>;
  getText(_key: string, _params?: Record<string, string | number>): string;
  addLanguage(_language: string, _config: LanguageConfig): void;
  addTranslations(_language: string, _translations: TranslationData): void;
  removeLanguage(_language: string): void;
  isRTL(): boolean;
  getLanguageConfig(_language: string): LanguageConfig | undefined;
  
  // New Weglot-like methods
  startAutoTranslation(): void;
  stopAutoTranslation(): void;
  translatePage(_targetLanguage?: string): Promise<void>;
  translateElement(_element: HTMLElement, _targetLanguage?: string): Promise<void>;
  restoreOriginalText(): void;
  getDetectedContent(): DetectedContent[];
  setTranslationApi(_config: TranslationApiConfig): void;
}

export type InterpolationFunction = (_key: string, _params: Record<string, string | number>) => string; 