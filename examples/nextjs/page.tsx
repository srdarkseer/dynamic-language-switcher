/**
 * Next.js Integration Example with Tailwind CSS
 * 
 * This example demonstrates how to use the language switcher
 * with Next.js features like getStaticProps, getServerSideProps,
 * and middleware integration, styled with Tailwind CSS.
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 text-center max-w-3xl mx-auto">
            {t('description')}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Language Information */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Language Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {language.toUpperCase()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('language', { lang: language })}
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                {supportedLanguages.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('supported', { languages: supportedLanguages.join(', ') })}
              </div>
            </div>
          </div>
        </section>

        {/* Server Information */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Server Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center">
              <div className="text-lg font-medium text-purple-600 dark:text-purple-400 mb-2">
                {t('currentTime', { time: new Date(currentTime).toLocaleString() })}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Server Time
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 text-center">
              <div className="text-lg font-medium text-orange-600 dark:text-orange-400 mb-2">
                {typeof window === 'undefined' ? 'Server-side' : 'Client-side'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Rendering Method
              </div>
            </div>
          </div>
        </section>

        {/* Language Switcher */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Switch Language
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {supportedLanguages.map((lang) => (
              <a
                key={lang}
                href={`/${lang}`}
                className={`px-6 py-3 rounded-lg border-2 font-medium transition-all duration-200 hover:scale-105 ${
                  language === lang
                    ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                <span className="mr-2">
                  {lang === 'en' && '🇺🇸'}
                  {lang === 'es' && '🇪🇸'}
                  {lang === 'zh-CN' && '🇨🇳'}
                </span>
                {lang}
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
            <p className="mt-2">Dynamic Language Switcher - Server-side Rendering Example</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 