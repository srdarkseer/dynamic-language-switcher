import { createLanguageSwitcher } from '../src/index';

// Simple example of using the language switcher
async function simpleExample() {
  // Create a language switcher
  const switcher = createLanguageSwitcher({
    defaultLanguage: 'en',
    debug: true
  });

  // Add languages
  switcher.addLanguage('en', {
    code: 'en',
    name: 'English',
    flag: '🇺🇸'
  });

  switcher.addLanguage('zh-CN', {
    code: 'zh-CN',
    name: '简体中文',
    flag: '🇨🇳'
  });

  switcher.addLanguage('zh-TW', {
    code: 'zh-TW',
    name: '繁體中文',
    flag: '🇹🇼'
  });

  // Add translations
  switcher.addTranslations('en', {
    greeting: 'Hello, {{name}}!',
    welcome: 'Welcome to our app'
  });

  switcher.addTranslations('zh-CN', {
    greeting: '你好，{{name}}！',
    welcome: '欢迎使用我们的应用'
  });

  switcher.addTranslations('zh-TW', {
    greeting: '你好，{{name}}！',
    welcome: '歡迎使用我們的應用'
  });

  // Test different languages
  console.log('=== English ===');
  console.log(switcher.getText('greeting', { name: 'John' }));
  console.log(switcher.getText('welcome'));

  console.log('\n=== Simplified Chinese ===');
  await switcher.setLanguage('zh-CN');
  console.log(switcher.getText('greeting', { name: '张三' }));
  console.log(switcher.getText('welcome'));

  console.log('\n=== Traditional Chinese ===');
  await switcher.setLanguage('zh-TW');
  console.log(switcher.getText('greeting', { name: '張三' }));
  console.log(switcher.getText('welcome'));

  // Show current language info
  console.log('\n=== Current Language Info ===');
  const currentConfig = switcher.getCurrentLanguageConfig();
  console.log(`Language: ${currentConfig?.name} (${currentConfig?.code})`);
  console.log(`Flag: ${currentConfig?.flag}`);
  console.log(`Is RTL: ${switcher.isRTL()}`);
}

// Run the example
simpleExample().catch(console.error); 