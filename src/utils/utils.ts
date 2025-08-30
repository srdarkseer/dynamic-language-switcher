import { LanguageConfig } from '../types/types';

// Export new utilities
export { ContentDetector } from './content-detector';
export { TranslationService } from './translation-service';
export * from './env-loader';

/**
 * Get browser's preferred language
 */
export function getBrowserLanguage(): string {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const language = navigator.language || navigator.languages?.[0] || 'en';
  return language.split('-')[0]; // Get primary language code
}

/**
 * Get all browser languages
 */
export function getBrowserLanguages(): string[] {
  if (typeof navigator === 'undefined') {
    return ['en'];
  }

  return Array.from(navigator.languages || [navigator.language || 'en']);
}

/**
 * Check if a language code is valid
 */
export function isValidLanguageCode(code: string): boolean {
  return /^[a-z]{2}(-[A-Z]{2})?$/.test(code);
}

/**
 * Normalize language code to standard format
 */
export function normalizeLanguageCode(code: string): string {
  return code.toLowerCase().replace('_', '-');
}

/**
 * Get language name from language code
 */
export function getLanguageName(code: string): string {
  const languageNames: Record<string, string> = {
    'en': 'English',
    'es': 'Español',
    'fr': 'Français',
    'de': 'Deutsch',
    'it': 'Italiano',
    'pt': 'Português',
    'ru': 'Русский',
    'zh': '中文',
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'ja': '日本語',
    'ko': '한국어',
    'np': 'नेपाली',
    'ar': 'العربية',
    'he': 'עברית',
    'fa': 'فارسی',
    'ur': 'اردو',
    'ps': 'پښتو',
    'sd': 'سنڌي',
    'yi': 'יידיש',
    'ku': 'کوردی',
    'dv': 'ދިވެހި',
    'ks': 'کٲشُر',
    'pa': 'ਪੰਜਾਬੀ',
    'tg': 'тоҷикӣ',
    'uz': 'O\'zbekcha',
    'hi': 'हिन्दी',
    'tr': 'Türkçe',
    'nl': 'Nederlands',
    'pl': 'Polski',
    'sv': 'Svenska',
    'da': 'Dansk',
    'no': 'Norsk',
    'fi': 'Suomi',
    'cs': 'Čeština',
    'sk': 'Slovenčina',
    'hu': 'Magyar',
    'ro': 'Română',
    'bg': 'Български',
    'hr': 'Hrvatski',
    'sr': 'Српски',
    'uk': 'Українська',
    'be': 'Беларуская',
    'mk': 'Македонски',
    'sl': 'Slovenščina',
    'et': 'Eesti',
    'lv': 'Latviešu',
    'lt': 'Lietuvių',
    'mt': 'Malti',
    'ga': 'Gaeilge',
    'cy': 'Cymraeg'
  };

  return languageNames[code.toLowerCase()] || code.toUpperCase();
}

/**
 * Get flag emoji for a language code
 */
export function getLanguageFlag(code: string): string {
  const flagMap: Record<string, string> = {
    'en': '🇺🇸',
    'es': '🇪🇸',
    'fr': '🇫🇷',
    'de': '🇩🇪',
    'it': '🇮🇹',
    'pt': '🇵🇹',
    'ru': '🇷🇺',
    'zh': '🇨🇳',
    'zh-CN': '🇨🇳',
    'zh-TW': '🇹🇼',
    'ja': '🇯🇵',
    'ko': '🇰🇷',
    'np': '🇳🇵',
    'ar': '🇸🇦',
    'he': '🇮🇱',
    'fa': '🇮🇷',
    'ur': '🇵🇰',
    'ps': '🇦🇫',
    'sd': '🇵🇰',
    'yi': '🇮🇱',
    'ku': '🇮🇶',
    'dv': '🇲🇻',
    'ks': '🇮🇳',
    'pa': '🇮🇳',
    'tg': '🇹🇯',
    'uz': '🇺🇿',
    'hi': '🇮🇳',
    'tr': '🇹🇷',
    'nl': '🇳🇱',
    'pl': '🇵🇱',
    'sv': '🇸🇪',
    'da': '🇩🇰',
    'no': '🇳🇴',
    'fi': '🇫🇮',
    'cs': '🇨🇿',
    'sk': '🇸🇰',
    'hu': '🇭🇺',
    'ro': '🇷🇴',
    'bg': '🇧🇬',
    'hr': '🇭🇷',
    'sr': '🇷🇸',
    'uk': '🇺🇦',
    'be': '🇧🇾',
    'mk': '🇲🇰',
    'sl': '🇸🇮',
    'et': '🇪🇪',
    'lv': '🇱🇻',
    'lt': '🇱🇹',
    'mt': '🇲🇹',
    'ga': '🇮🇪',
    'cy': '🇬🇧'
  };

  return flagMap[code.toLowerCase()] || '🌐';
}

/**
 * Check if a language is RTL (Right-to-Left)
 */
export function isRTLLanguage(code: string): boolean {
  const rtlLanguages = [
    'ar',    // Arabic
    'he',    // Hebrew
    'fa',    // Persian/Farsi
    'ur',    // Urdu
    'ps',    // Pashto
    'sd',    // Sindhi
    'yi',    // Yiddish
    'ku',    // Kurdish
    'az',    // Azerbaijani (when written in Arabic script)
    'dv',    // Divehi/Maldivian
    'ks',    // Kashmiri
    'pa',    // Punjabi (when written in Shahmukhi script)
    'tg',    // Tajik (when written in Arabic script)
    'uz'     // Uzbek (when written in Arabic script)
  ];
  return rtlLanguages.includes(code.toLowerCase());
}

/**
 * Create a language config object with common properties
 */
export function createLanguageConfig(code: string, name?: string): LanguageConfig {
  return {
    code: normalizeLanguageCode(code),
    name: name || getLanguageName(code),
    flag: getLanguageFlag(code),
    rtl: isRTLLanguage(code)
  };
}

/**
 * Get common language configurations for popular languages
 */
export function getCommonLanguages(): LanguageConfig[] {
  const commonCodes = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh-CN', 'zh-TW', 'ja', 'ko', 'ar', 'he', 'fa', 'ur'];
  return commonCodes.map(code => createLanguageConfig(code));
}

/**
 * Format number according to locale
 */
export function formatNumber(value: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    return value.toString();
  }
}

/**
 * Format date according to locale
 */
export function formatDate(date: Date, locale: string, options?: Intl.DateTimeFormatOptions): string {
  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

/**
 * Format currency according to locale
 */
export function formatCurrency(value: number, locale: string, currency: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
} 