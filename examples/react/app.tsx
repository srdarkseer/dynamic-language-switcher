/**
 * React Integration Example with Tailwind CSS
 * 
 * This example demonstrates how to use the language switcher
 * with React hooks and components, styled with Tailwind CSS.
 */

import React from 'react';
import { 
  LanguageSwitcher as LanguageSwitcherComponent,
  Translation,
  RTLDirection 
} from '../../src/hooks/components';
import { 
  initializeLanguageSwitcher, 
  useLanguage 
} from '../../src/hooks/useLanguage';

// Initialize the language switcher (call this once in your app)
initializeLanguageSwitcher({
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  persistLanguage: true,
  debug: false
});

// Add languages and translations (this would typically be done in your app initialization)
const languageSwitcher = initializeLanguageSwitcher({
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  persistLanguage: true,
  debug: false
});

// Add languages
languageSwitcher.addLanguage('en', { code: 'en', name: 'English', flag: '🇺🇸' });
languageSwitcher.addLanguage('es', { code: 'es', name: 'Español', flag: '🇪🇸' });
languageSwitcher.addLanguage('zh-CN', { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' });
languageSwitcher.addLanguage('zh-TW', { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' });
languageSwitcher.addLanguage('ar', { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true });

// Add translations
languageSwitcher.addTranslations('en', {
  common: {
    welcome: 'Welcome to our app',
    hello: 'Hello, {name}!',
    description: 'This is a multilingual React application'
  },
  navigation: {
    home: 'Home',
    about: 'About',
    contact: 'Contact'
  }
});

languageSwitcher.addTranslations('es', {
  common: {
    welcome: 'Bienvenido a nuestra aplicación',
    hello: '¡Hola, {name}!',
    description: 'Esta es una aplicación React multilingüe'
  },
  navigation: {
    home: 'Inicio',
    about: 'Acerca de',
    contact: 'Contacto'
  }
});

languageSwitcher.addTranslations('zh-CN', {
  common: {
    welcome: '欢迎使用我们的应用',
    hello: '你好，{name}！',
    description: '这是一个多语言React应用'
  },
  navigation: {
    home: '首页',
    about: '关于',
    contact: '联系'
  }
});

// Main App Component
export function App() {
  const { 
    currentLanguage, 
    isReady, 
    switchLanguage, 
    t, 
    isRTL, 
    direction,
    availableLanguages 
  } = useLanguage();

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <RTLDirection>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                <Translation key="common.welcome" />
              </h1>
              
              <LanguageSwitcherComponent 
                variant="dropdown"
                showFlags={true}
                showNames={true}
                size="lg"
                className="shadow-lg"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <section className="text-center mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                <Translation key="common.hello" params={{ name: 'User' }} />
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                <Translation key="common.description" />
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {currentLanguage.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Language</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {direction.toUpperCase()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Text Direction</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {isRTL ? 'RTL' : 'LTR'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Layout Mode</div>
                </div>
              </div>
            </div>
          </section>

          {/* Navigation Section */}
          <section className="mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Navigation
              </h3>
              <nav className="flex justify-center">
                <ul className="flex space-x-8">
                  <li>
                    <a href="#home" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                      {t('navigation.home')}
                    </a>
                  </li>
                  <li>
                    <a href="#about" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                      {t('navigation.about')}
                    </a>
                  </li>
                  <li>
                    <a href="#contact" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                      {t('navigation.contact')}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </section>

          {/* Language Demo Section */}
          <section>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Available Languages
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLanguage(lang.code)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      currentLanguage === lang.code
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-3xl mb-2">{lang.flag}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {lang.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {lang.code}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p>Built with React, TypeScript, and Tailwind CSS</p>
              <p className="mt-2">Dynamic Language Switcher - Supporting {availableLanguages.length} languages</p>
            </div>
          </div>
        </footer>
      </div>
    </RTLDirection>
  );
} 