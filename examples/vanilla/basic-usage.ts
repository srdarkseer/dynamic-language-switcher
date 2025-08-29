/**
 * Basic Usage Example - Vanilla JavaScript/TypeScript
 * 
 * This example demonstrates the core functionality of the language switcher
 * without any framework dependencies.
 */

import { LanguageSwitcher } from '../../src/core/language-switcher';

// Initialize the language switcher
const languageSwitcher = new LanguageSwitcher({
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  persistLanguage: true,
  debug: false
});

// Add languages
languageSwitcher.addLanguage('en', { code: 'en', name: 'English', flag: '🇺🇸' });
languageSwitcher.addLanguage('es', { code: 'es', name: 'Español', flag: '🇪🇸' });
languageSwitcher.addLanguage('fr', { code: 'fr', name: 'Français', flag: '🇫🇷' });
languageSwitcher.addLanguage('zh-CN', { code: 'zh-CN', name: '简体中文', flag: '🇨🇳' });
languageSwitcher.addLanguage('zh-TW', { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' });
languageSwitcher.addLanguage('ar', { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true }); // RTL language

// Add translations
languageSwitcher.addTranslations('en', {
  common: {
    welcome: 'Welcome',
    hello: 'Hello, {name}!',
    goodbye: 'Goodbye, {name}!'
  },
  navigation: {
    home: 'Home',
    about: 'About',
    contact: 'Contact'
  }
});

languageSwitcher.addTranslations('es', {
  common: {
    welcome: 'Bienvenido',
    hello: '¡Hola, {name}!',
    goodbye: '¡Adiós, {name}!'
  },
  navigation: {
    home: 'Inicio',
    about: 'Acerca de',
    contact: 'Contacto'
  }
});

languageSwitcher.addTranslations('zh-CN', {
  common: {
    welcome: '欢迎',
    hello: '你好，{name}！',
    goodbye: '再见，{name}！'
  },
  navigation: {
    home: '首页',
    about: '关于',
    contact: '联系'
  }
});

// Example usage
console.log('Current language:', languageSwitcher.currentLanguage);
console.log('Welcome message:', languageSwitcher.getText('common.welcome'));
console.log('Hello message:', languageSwitcher.getText('common.hello', { name: 'World' }));

// Switch language
languageSwitcher.setLanguage('es');
console.log('After switching to Spanish:');
console.log('Welcome message:', languageSwitcher.getText('common.welcome'));
console.log('Hello message:', languageSwitcher.getText('common.hello', { name: 'Mundo' }));

// Switch to Chinese
languageSwitcher.setLanguage('zh-CN');
console.log('After switching to Chinese:');
console.log('Welcome message:', languageSwitcher.getText('common.welcome'));
console.log('Hello message:', languageSwitcher.getText('common.hello', { name: '世界' }));

// Check RTL support
console.log('Is RTL:', languageSwitcher.isRTL());
languageSwitcher.setLanguage('ar');
console.log('After switching to Arabic (RTL):');
console.log('Is RTL:', languageSwitcher.isRTL());
console.log('Document direction:', languageSwitcher.getDocumentDirection()); 