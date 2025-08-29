import { createLanguageSwitcher, getCommonLanguages } from '../src/index';

// Create a language switcher instance
const languageSwitcher = createLanguageSwitcher({
  defaultLanguage: 'en',
  fallbackLanguage: 'en',
  persistLanguage: true,
  debug: true
});

// Add common languages including Chinese
const commonLanguages = getCommonLanguages();
commonLanguages.forEach(lang => {
  languageSwitcher.addLanguage(lang.code, lang);
});

// Add translations for English
languageSwitcher.addTranslations('en', {
  welcome: 'Welcome to our application!',
  hello: 'Hello, {{name}}!',
  description: 'This is a dynamic language switcher that supports multiple languages including Chinese.',
  features: 'Features: {{feature1}}, {{feature2}}, {{feature3}}',
  currentLanguage: 'Current language: {{language}}'
});

// Add translations for Spanish
languageSwitcher.addTranslations('es', {
  welcome: '¡Bienvenido a nuestra aplicación!',
  hello: '¡Hola, {{name}}!',
  description: 'Este es un cambiador de idioma dinámico que admite múltiples idiomas incluyendo chino.',
  features: 'Características: {{feature1}}, {{feature2}}, {{feature3}}',
  currentLanguage: 'Idioma actual: {{language}}'
});

// Add translations for Simplified Chinese
languageSwitcher.addTranslations('zh-CN', {
  welcome: '欢迎使用我们的应用程序！',
  hello: '你好，{{name}}！',
  description: '这是一个支持多种语言（包括中文）的动态语言切换器。',
  features: '功能：{{feature1}}、{{feature2}}、{{feature3}}',
  currentLanguage: '当前语言：{{language}}'
});

// Add translations for Traditional Chinese
languageSwitcher.addTranslations('zh-TW', {
  welcome: '歡迎使用我們的應用程式！',
  hello: '你好，{{name}}！',
  description: '這是一個支援多種語言（包括中文）的動態語言切換器。',
  features: '功能：{{feature1}}、{{feature2}}、{{feature3}}',
  currentLanguage: '當前語言：{{language}}'
});

// Add translations for French
languageSwitcher.addTranslations('fr', {
  welcome: 'Bienvenue dans notre application !',
  hello: 'Bonjour, {{name}} !',
  description: 'Ceci est un changeur de langue dynamique qui prend en charge plusieurs langues, y compris le chinois.',
  features: 'Fonctionnalités : {{feature1}}, {{feature2}}, {{feature3}}',
  currentLanguage: 'Langue actuelle : {{language}}'
});

// Demo function to show language switching
async function demonstrateLanguageSwitching() {
  console.log('=== Dynamic Language Switcher Demo ===\n');

  // Show available languages
  console.log('Available languages:');
  languageSwitcher.availableLanguages.forEach(lang => {
    console.log(`  ${lang.flag} ${lang.name} (${lang.code})`);
  });
  console.log('');

  // Test different languages
  const languages = ['en', 'es', 'zh-CN', 'zh-TW', 'fr'];
  
  for (const lang of languages) {
    await languageSwitcher.setLanguage(lang);
    const config = languageSwitcher.getCurrentLanguageConfig();
    
    console.log(`=== ${config?.flag} ${config?.name} ===`);
    console.log(languageSwitcher.getText('welcome'));
    console.log(languageSwitcher.getText('hello', { name: 'World' }));
    console.log(languageSwitcher.getText('description'));
    console.log(languageSwitcher.getText('features', {
      feature1: 'Multi-language support',
      feature2: 'Dynamic switching',
      feature3: 'Parameter interpolation'
    }));
    console.log(languageSwitcher.getText('currentLanguage', {
      language: config?.name || lang
    }));
    console.log('');
  }

  // Show RTL support
  console.log('=== RTL Language Support ===');
  languageSwitcher.addLanguage('ar', {
    code: 'ar',
    name: 'العربية',
    flag: '🇸🇦',
    rtl: true
  });
  
  languageSwitcher.addTranslations('ar', {
    welcome: 'مرحباً بكم في تطبيقنا!',
    hello: 'مرحباً، {{name}}!',
    description: 'هذا مبدل لغة ديناميكي يدعم لغات متعددة بما في ذلك الصينية.',
    features: 'الميزات: {{feature1}}، {{feature2}}، {{feature3}}',
    currentLanguage: 'اللغة الحالية: {{language}}'
  });

  await languageSwitcher.setLanguage('ar');
  const arabicConfig = languageSwitcher.getCurrentLanguageConfig();
  console.log(`Current language: ${arabicConfig?.name} (${arabicConfig?.code})`);
  console.log(`Is RTL: ${languageSwitcher.isRTL()}`);
  console.log(languageSwitcher.getText('welcome'));
  console.log('');

  // Switch back to English
  await languageSwitcher.setLanguage('en');
  console.log('Switched back to English');
  console.log(`Current language: ${languageSwitcher.getCurrentLanguageConfig()?.name}`);
}

// Run the demo
demonstrateLanguageSwitching().catch(console.error);

// Export for use in other files
export { languageSwitcher }; 