import React from 'react';
import { GetStaticProps, GetServerSideProps } from 'next';
import { 
  createNextJSLanguageSwitcher,
  detectLanguageFromRequest,
  createLocalizedPage,
  useNextJSLanguage
} from '../src/nextjs';
import { LanguageSwitcher, Translation, RTLDirection } from '../src/react/components';

// Example Next.js page with language support
interface PageProps {
  language: string;
  supportedLanguages: string[];
  translations: Record<string, any>;
}

export default function LocalizedPage({ language, supportedLanguages, translations }: PageProps) {
  const { currentLanguage, changeLanguage } = useNextJSLanguage();

  return (
    <div className="nextjs-page">
      <header>
        <h1>
          <Translation key="welcome" />
        </h1>
        
        <LanguageSwitcher 
          variant="dropdown"
          showFlags={true}
          showNames={true}
        />
      </header>

      <main>
        <section>
          <h2>
            <Translation key="hello" params={{ name: 'Next.js User' }} />
          </h2>
          <p>
            <Translation key="description" />
          </p>
        </section>

        <section>
          <h3>Language Information</h3>
          <p>Current Language: {currentLanguage}</p>
          <p>Supported Languages: {supportedLanguages.join(', ')}</p>
        </section>

        <RTLDirection>
          <section>
            <h3>RTL Support</h3>
            <p>This content automatically adjusts direction based on language.</p>
          </section>
        </RTLDirection>
      </main>
    </div>
  );
}

// Example getStaticProps with language support
export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const language = detectLanguageFromRequest(context);
  const supportedLanguages = ['en', 'zh-CN', 'zh-TW', 'ar'];

  // Load translations for the detected language
  const translations = await loadTranslationsForLanguage(language);

  return {
    props: {
      language,
      supportedLanguages,
      translations,
    },
    revalidate: 3600, // Revalidate every hour
  };
};

// Example getServerSideProps with language support
export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const language = detectLanguageFromRequest(context);
  const supportedLanguages = ['en', 'zh-CN', 'zh-TW', 'ar'];

  // Load translations for the detected language
  const translations = await loadTranslationsForLanguage(language);

  return {
    props: {
      language,
      supportedLanguages,
      translations,
    },
  };
};

// Helper function to load translations
async function loadTranslationsForLanguage(language: string) {
  // In a real app, you would load translations from files or API
  const translations = {
    en: {
      welcome: 'Welcome to Next.js with Language Support',
      hello: 'Hello, {{name}}!',
      description: 'This is a Next.js page with built-in language switching and RTL support.'
    },
    'zh-CN': {
      welcome: '欢迎使用支持多语言的Next.js',
      hello: '你好，{{name}}！',
      description: '这是一个内置语言切换和RTL支持的Next.js页面。'
    },
    'zh-TW': {
      welcome: '歡迎使用支援多語言的Next.js',
      hello: '你好，{{name}}！',
      description: '這是一個內建語言切換和RTL支援的Next.js頁面。'
    },
    ar: {
      welcome: 'مرحباً بكم في Next.js مع دعم اللغة',
      hello: 'مرحباً، {{name}}!',
      description: 'هذه صفحة Next.js مع تبديل لغة مدمج ودعم RTL.'
    }
  };

  return translations[language] || translations.en;
}

// Example of using the createLocalizedPage helper
export const localizedGetStaticProps = createLocalizedPage(
  getStaticProps,
  ['en', 'zh-CN', 'zh-TW', 'ar']
);

// Example Next.js API route for language switching
export async function handler(req: any, res: any) {
  if (req.method === 'POST') {
    const { language } = req.body;
    
    // Validate language
    const supportedLanguages = ['en', 'zh-CN', 'zh-TW', 'ar'];
    if (!supportedLanguages.includes(language)) {
      return res.status(400).json({ error: 'Unsupported language' });
    }

    // Set language cookie
    res.setHeader('Set-Cookie', `language=${language}; Path=/; HttpOnly`);
    
    return res.json({ success: true, language });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Example Next.js middleware configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

// Example of a Next.js app with language initialization
export function AppWithLanguage({ Component, pageProps }: any) {
  const { language, translations } = pageProps;

  // Initialize language switcher on the client side
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const { initializeLanguageSwitcher } = require('../src/react/useLanguage');
      
      const switcher = initializeLanguageSwitcher({
        defaultLanguage: language,
        persistLanguage: true,
      });

      // Add translations
      if (translations) {
        Object.entries(translations).forEach(([lang, data]) => {
          switcher.addTranslations(lang, data);
        });
      }
    }
  }, [language, translations]);

  return <Component {...pageProps} />;
}

// Example of dynamic imports for translations
export async function getStaticPaths() {
  const languages = ['en', 'zh-CN', 'zh-TW', 'ar'];
  
  const paths = languages.map((language) => ({
    params: { lang: language },
  }));

  return {
    paths,
    fallback: false,
  };
}

// Example of using dynamic routes for language-specific pages
export async function getStaticPropsForLanguage({ params }: any) {
  const { lang } = params;
  const language = lang || 'en';
  
  const translations = await loadTranslationsForLanguage(language);
  
  return {
    props: {
      language,
      translations,
    },
  };
} 