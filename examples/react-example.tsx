import React, { useEffect } from 'react';
import { 
  initializeLanguageSwitcher, 
  useLanguage, 
  useTranslation, 
  useTranslations 
} from '../src/react/useLanguage';
import { 
  LanguageSwitcher, 
  Translation, 
  RTLDirection, 
  LanguageProvider 
} from '../src/react/components';

// Initialize the language switcher (call this in your app root)
initializeLanguageSwitcher({
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  persistLanguage: true,
  debug: true
});

// Add languages and translations
const languageSwitcher = initializeLanguageSwitcher({
  defaultLanguage: 'en',
  persistLanguage: true
});

languageSwitcher.addLanguage('en', {
  code: 'en',
  name: 'English',
  flag: '🇺🇸'
});

languageSwitcher.addLanguage('zh-CN', {
  code: 'zh-CN',
  name: '简体中文',
  flag: '🇨🇳'
});

languageSwitcher.addLanguage('zh-TW', {
  code: 'zh-TW',
  name: '繁體中文',
  flag: '🇹🇼'
});

languageSwitcher.addLanguage('ar', {
  code: 'ar',
  name: 'العربية',
  flag: '🇸🇦',
  rtl: true
});

// Add translations
languageSwitcher.addTranslations('en', {
  welcome: 'Welcome to our app!',
  hello: 'Hello, {{name}}!',
  description: 'This is a multilingual React app with RTL support.',
  features: 'Features: {{feature1}}, {{feature2}}, {{feature3}}',
  navigation: {
    home: 'Home',
    about: 'About',
    contact: 'Contact'
  }
});

languageSwitcher.addTranslations('zh-CN', {
  welcome: '欢迎使用我们的应用！',
  hello: '你好，{{name}}！',
  description: '这是一个支持多语言和RTL的React应用。',
  features: '功能：{{feature1}}、{{feature2}}、{{feature3}}',
  navigation: {
    home: '首页',
    about: '关于',
    contact: '联系'
  }
});

languageSwitcher.addTranslations('zh-TW', {
  welcome: '歡迎使用我們的應用！',
  hello: '你好，{{name}}！',
  description: '這是一個支援多語言和RTL的React應用。',
  features: '功能：{{feature1}}、{{feature2}}、{{feature3}}',
  navigation: {
    home: '首頁',
    about: '關於',
    contact: '聯繫'
  }
});

languageSwitcher.addTranslations('ar', {
  welcome: 'مرحباً بكم في تطبيقنا!',
  hello: 'مرحباً، {{name}}!',
  description: 'هذا تطبيق React متعدد اللغات مع دعم RTL.',
  features: 'الميزات: {{feature1}}، {{feature2}}، {{feature3}}',
  navigation: {
    home: 'الرئيسية',
    about: 'حول',
    contact: 'اتصل بنا'
  }
});

// Main App Component
export function App() {
  return (
    <LanguageProvider options={{ defaultLanguage: 'en' }}>
      <div className="app">
        <Header />
        <MainContent />
        <Footer />
      </div>
    </LanguageProvider>
  );
}

// Header Component with Language Switcher
function Header() {
  const { currentLanguage, isRTL, direction } = useLanguage();

  return (
    <header className="header" dir={direction}>
      <div className="header-content">
        <h1 className="logo">
          <Translation key="welcome" />
        </h1>
        
        <nav className="navigation">
          <a href="#home">
            <Translation key="navigation.home" />
          </a>
          <a href="#about">
            <Translation key="navigation.about" />
          </a>
          <a href="#contact">
            <Translation key="navigation.contact" />
          </a>
        </nav>

        <div className="language-controls">
          <LanguageSwitcher 
            variant="dropdown"
            showFlags={true}
            showNames={true}
            size="md"
            className="language-switcher"
          />
          
          <div className="language-info">
            <span>Current: {currentLanguage}</span>
            <span>RTL: {isRTL ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

// Main Content Component
function MainContent() {
  const { t, currentLanguage } = useLanguage();
  
  // Example of using the translation hook
  const welcomeText = useTranslation('welcome');
  const helloText = useTranslation('hello', { name: 'World' });
  
  // Example of using multiple translations at once
  const navigationTexts = useTranslations(['navigation.home', 'navigation.about', 'navigation.contact']);

  return (
    <main className="main-content">
      <section className="hero">
        <h2>{welcomeText}</h2>
        <p>{helloText}</p>
        <p>{t('description')}</p>
        
        <div className="features">
          <h3>{t('features', {
            feature1: 'Multi-language support',
            feature2: 'RTL support',
            feature3: 'Dynamic switching'
          })}</h3>
        </div>
      </section>

      <section className="navigation-example">
        <h3>Navigation Example:</h3>
        <ul>
          <li>{navigationTexts['navigation.home']}</li>
          <li>{navigationTexts['navigation.about']}</li>
          <li>{navigationTexts['navigation.contact']}</li>
        </ul>
      </section>

      <section className="rtl-example">
        <h3>RTL Support Example:</h3>
        <RTLDirection>
          <p>This text will automatically adjust direction based on the current language.</p>
          <p>For Arabic and Hebrew, this will be right-to-left.</p>
          <p>For English and Chinese, this will be left-to-right.</p>
        </RTLDirection>
      </section>
    </main>
  );
}

// Footer Component
function Footer() {
  const { currentLanguage, availableLanguages } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>Current Language: {currentLanguage}</p>
        <p>Available Languages: {availableLanguages.map(lang => lang.name).join(', ')}</p>
        
        <div className="language-buttons">
          {availableLanguages.map(lang => (
            <button
              key={lang.code}
              onClick={() => languageSwitcher.setLanguage(lang.code)}
              className={`lang-btn ${lang.code === currentLanguage ? 'active' : ''}`}
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

// Example of a component that automatically updates when language changes
function DynamicContent() {
  const { t, currentLanguage } = useLanguage();
  
  useEffect(() => {
    // This effect will run every time the language changes
    console.log(`Language changed to: ${currentLanguage}`);
  }, [currentLanguage]);

  return (
    <div className="dynamic-content">
      <h3>Dynamic Content (Auto-updates)</h3>
      <p>{t('welcome')}</p>
      <p>{t('hello', { name: 'User' })}</p>
      <p>Current language: {currentLanguage}</p>
    </div>
  );
}

// Example of using the Translation component with fallback
function FallbackExample() {
  return (
    <div className="fallback-example">
      <h3>Translation with Fallback</h3>
      <Translation 
        key="nonexistent.key" 
        fallback="This text will show if translation is missing"
      />
    </div>
  );
}

// Example of conditional rendering based on language
function ConditionalContent() {
  const { currentLanguage, isRTL } = useLanguage();
  
  return (
    <div className="conditional-content">
      {currentLanguage.startsWith('zh') && (
        <div className="chinese-specific">
          <h3>中文特定内容</h3>
          <p>这部分内容只对中文用户显示</p>
        </div>
      )}
      
      {isRTL && (
        <div className="rtl-specific">
          <h3>RTL Specific Content</h3>
          <p>This content is specifically for RTL languages</p>
        </div>
      )}
    </div>
  );
} 