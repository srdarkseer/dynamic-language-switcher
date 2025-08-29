import { LanguageSwitcher } from '../core/language-switcher';
import { TranslationData, LanguageSwitcherOptions } from '../types/types';

// Type definitions for Next.js contexts
interface GetServerSidePropsContext {
  params?: Record<string, string | string[]>;
  query?: Record<string, string | string[]>;
  req?: any;
}

interface GetStaticPropsContext {
  params?: Record<string, string | string[]>;
  query?: Record<string, string | string[]>;
}

// Next.js server-side language detection
export function detectLanguageFromRequest(
  context: GetServerSidePropsContext | GetStaticPropsContext
): string {
  // Check for language in query params first
  const { lang } = context.params || {};
  if (lang && typeof lang === 'string') {
    return lang;
  }

  // Check for language in query string
  const { locale } = context.query || {};
  if (locale && typeof locale === 'string') {
    return locale;
  }

  // Check for Accept-Language header
  if ('req' in context && context.req) {
          const acceptLanguage = context.req.headers['accept-language'];
      if (acceptLanguage) {
        const languages = acceptLanguage.split(',').map((lang: string) => lang.split(';')[0].trim());
        return languages[0] || 'en';
      }
  }

  return 'en';
}

// Create language switcher for Next.js
export function createNextJSLanguageSwitcher(
  options: LanguageSwitcherOptions,
  translations?: Record<string, TranslationData>
): LanguageSwitcher {
  const switcher = new LanguageSwitcher(options);
  
  if (translations) {
    Object.entries(translations).forEach(([language, data]) => {
      switcher.addTranslations(language, data);
    });
  }
  
  return switcher;
}

// Get translations for a specific language
export async function getTranslationsForLanguage(
  language: string,
  translationFiles: Record<string, () => Promise<TranslationData>>
): Promise<TranslationData> {
  try {
    const getTranslation = translationFiles[language];
    if (getTranslation) {
      return await getTranslation();
    }
  } catch (error) {
    // Silently handle translation loading errors
  }
  
  return {};
}

// Load all translations for Next.js
export async function loadAllTranslations(
  languages: string[],
  translationFiles: Record<string, () => Promise<TranslationData>>
): Promise<Record<string, TranslationData>> {
  const translations: Record<string, TranslationData> = {};
  
  await Promise.all(
    languages.map(async (language) => {
      translations[language] = await getTranslationsForLanguage(language, translationFiles);
    })
  );
  
  return translations;
}

// Next.js middleware for language detection
export function createLanguageMiddleware(
  defaultLanguage: string = 'en',
  supportedLanguages: string[] = ['en']
) {
  return function languageMiddleware(req: any, res: any, next: any) {
    // Extract language from URL path
    const path = req.url || req.path || '/';
    const pathSegments = path.split('/').filter(Boolean);
    
    let language = defaultLanguage;
    
    // Check if first segment is a language code
    if (pathSegments.length > 0 && supportedLanguages.includes(pathSegments[0])) {
      language = pathSegments[0];
    } else {
      // Check Accept-Language header
      const acceptLanguage = req.headers['accept-language'];
      if (acceptLanguage) {
        const languages = acceptLanguage.split(',').map((lang: string) => lang.split(';')[0].trim());
        const detectedLanguage = languages.find((lang: string) => 
          supportedLanguages.includes(lang) || supportedLanguages.includes(lang.split('-')[0])
        );
        if (detectedLanguage) {
          language = detectedLanguage.split('-')[0];
        }
      }
    }
    
    req.language = language;
    req.supportedLanguages = supportedLanguages;
    
    next();
  };
}

// Utility for creating Next.js pages with language support
export function createLocalizedPage(
  getStaticProps: (context: GetStaticPropsContext) => Promise<any>,
  languages: string[]
) {
  return async function localizedGetStaticProps(context: GetStaticPropsContext) {
    const props = await getStaticProps(context);
    
    // Add language information to props
    const language = detectLanguageFromRequest(context);
    
    return {
      ...props,
      props: {
        ...props.props,
        language,
        supportedLanguages: languages,
      },
    };
  };
}

// Hook for Next.js router language handling
export function useNextJSLanguage() {
  // This function should be used in a Next.js component where useRouter is available
  // For now, we'll return a mock implementation
  return {
    currentLanguage: 'en',
    availableLanguages: ['en'],
    defaultLanguage: 'en',
    changeLanguage: (newLocale: string) => {
      // Mock implementation - will be overridden in actual Next.js usage
      // Parameter is intentionally unused in mock implementation
      void newLocale;
    },
    router: null,
  };
}

// Utility for creating language-aware Next.js links
export function createLocalizedLink(
  href: string,
  locale: string,
  currentLocale: string
): string {
  if (locale === currentLocale) {
    return href;
  }
  
  // Add locale prefix if different from current
  return `/${locale}${href.startsWith('/') ? href : `/${href}`}`;
}

// Export types for Next.js usage
export type { LanguageSwitcherOptions, TranslationData };
export { LanguageSwitcher }; 