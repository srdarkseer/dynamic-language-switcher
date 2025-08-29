/**
 * React Integration Example
 * 
 * This example demonstrates how to use the language switcher
 * with React hooks and components.
 */

import React from 'react';
import { 
  initializeLanguageSwitcher, 
  useLanguage, 
  LanguageSwitcher as LanguageSwitcherComponent,
  Translation,
  RTLDirection 
} from '../../src/hooks/components';

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
    return <div>Loading...</div>;
  }

  return (
    <RTLDirection>
      <div className="app">
        <header className="app-header">
          <h1>
            <Translation key="common.welcome" />
          </h1>
          
          <LanguageSwitcherComponent 
            variant="dropdown"
            showFlags={true}
            showNames={true}
            size="lg"
          />
        </header>

        <main className="app-main">
          <section className="welcome-section">
            <h2>
              <Translation key="common.hello" params={{ name: 'User' }} />
            </h2>
            <p>
              <Translation key="common.description" />
            </p>
            
            <div className="language-info">
              <p>Current Language: <strong>{currentLanguage}</strong></p>
              <p>Direction: <strong>{direction}</strong></p>
              <p>RTL: <strong>{isRTL ? 'Yes' : 'No'}</strong></p>
            </div>
          </section>

          <section className="navigation-section">
            <nav>
              <ul>
                <li><a href="#home">{t('navigation.home')}</a></li>
                <li><a href="#about">{t('navigation.about')}</a></li>
                <li><a href="#contact">{t('navigation.contact')}</a></li>
              </ul>
            </nav>
          </section>

          <section className="language-demo">
            <h3>Available Languages</h3>
            <div className="language-grid">
              {availableLanguages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => switchLanguage(lang.code)}
                  className={`lang-button ${currentLanguage === lang.code ? 'active' : ''}`}
                >
                  <span className="flag">{lang.flag}</span>
                  <span className="name">{lang.name}</span>
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
    </RTLDirection>
  );
} 