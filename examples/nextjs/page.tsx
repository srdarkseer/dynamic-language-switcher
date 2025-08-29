/**
 * Next.js Integration Example
 * 
 * This example demonstrates how to use the language switcher
 * with Next.js features like getStaticProps, getServerSideProps,
 * and middleware integration.
 */

import React from 'react';
import { GetStaticProps, GetServerSideProps } from 'next';
import { 
  detectLanguageFromRequest,
  createLocalizedPage,
  getTranslationsForLanguage 
} from '../../src/adapters';

// Types for our page props
interface PageProps {
  language: string;
  supportedLanguages: string[];
  translations: Record<string, any>;
  currentTime: string;
}

// Example translations
const translations = {
  en: {
    title: 'Welcome to Next.js with Language Support',
    description: 'This page demonstrates server-side language detection',
    currentTime: 'Current server time: {time}',
    language: 'Current language: {lang}',
    supported: 'Supported languages: {languages}'
  },
  es: {
    title: 'Bienvenido a Next.js con Soporte de Idiomas',
    description: 'Esta página demuestra la detección de idioma del lado del servidor',
    currentTime: 'Hora actual del servidor: {time}',
    language: 'Idioma actual: {lang}',
    supported: 'Idiomas soportados: {languages}'
  },
  'zh-CN': {
    title: '欢迎使用支持多语言的Next.js',
    description: '此页面演示服务器端语言检测',
    currentTime: '当前服务器时间：{time}',
    language: '当前语言：{lang}',
    supported: '支持的语言：{languages}'
  }
};

// Static generation with language support
export const getStaticProps: GetStaticProps<PageProps> = async (context) => {
  const language = detectLanguageFromRequest(context);
  const languageTranslations = getTranslationsForLanguage(translations, language);
  
  return {
    props: {
      language,
      supportedLanguages: Object.keys(translations),
      translations: languageTranslations,
      currentTime: new Date().toISOString()
    },
    revalidate: 60 // Revalidate every minute
  };
};

// Server-side rendering with language support
export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const language = detectLanguageFromRequest(context);
  const languageTranslations = getTranslationsForLanguage(translations, language);
  
  return {
    props: {
      language,
      supportedLanguages: Object.keys(translations),
      translations: languageTranslations,
      currentTime: new Date().toISOString()
    }
  };
};

// Generate static paths for all languages
export async function getStaticPaths() {
  const languages = Object.keys(translations);
  
  const paths = languages.map((lang) => ({
    params: { lang },
  }));

  return {
    paths,
    fallback: false,
  };
}

// Main page component
export default function LocalizedPage({ 
  language, 
  supportedLanguages, 
  translations, 
  currentTime 
}: PageProps) {
  const t = (key: string, params?: Record<string, string>) => {
    let text = translations[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, value);
      });
    }
    
    return text;
  };

  return (
    <div className="nextjs-page">
      <header>
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
      </header>

      <main>
        <section className="language-info">
          <h2>Language Information</h2>
          <p>{t('language', { lang: language })}</p>
          <p>{t('supported', { languages: supportedLanguages.join(', ') })}</p>
        </section>

        <section className="server-info">
          <h2>Server Information</h2>
          <p>{t('currentTime', { time: currentTime })}</p>
          <p>Rendering method: {typeof window === 'undefined' ? 'Server-side' : 'Client-side'}</p>
        </section>

        <section className="language-switcher">
          <h2>Switch Language</h2>
          <div className="language-buttons">
            {supportedLanguages.map((lang) => (
              <a
                key={lang}
                href={`/${lang}`}
                className={`lang-button ${language === lang ? 'active' : ''}`}
              >
                {lang === 'en' && '🇺🇸'}
                {lang === 'es' && '🇪🇸'}
                {lang === 'zh-CN' && '🇨🇳'}
                {lang}
              </a>
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        .nextjs-page {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        h1 {
          color: #333;
          margin-bottom: 1rem;
        }
        
        section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          background: #f8f9fa;
        }
        
        h2 {
          color: #495057;
          margin-bottom: 1rem;
        }
        
        .language-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        
        .lang-button {
          padding: 0.5rem 1rem;
          border: 1px solid #007bff;
          border-radius: 4px;
          text-decoration: none;
          color: #007bff;
          background: white;
          transition: all 0.2s;
        }
        
        .lang-button:hover {
          background: #007bff;
          color: white;
        }
        
        .lang-button.active {
          background: #007bff;
          color: white;
        }
      `}</style>
    </div>
  );
} 