import { LanguageSwitcher } from '../src/core/language-switcher';
import { LanguageConfig, TranslationData } from '../src/types/types';

describe('LanguageSwitcher', () => {
  let languageSwitcher: LanguageSwitcher;

  beforeEach(() => {
    languageSwitcher = new LanguageSwitcher({
      defaultLanguage: 'en',
      debug: false
    });
  });

  describe('Constructor', () => {
    it('should initialize with default language', () => {
      expect(languageSwitcher.currentLanguage).toBe('en');
      expect(languageSwitcher.availableLanguages).toHaveLength(1);
      expect(languageSwitcher.availableLanguages[0].code).toBe('en');
    });

    it('should initialize with custom options', () => {
      const customSwitcher = new LanguageSwitcher({
        defaultLanguage: 'es',
        fallbackLanguage: 'en',
        persistLanguage: false,
        storageKey: 'custom-key',
        debug: true
      });

      expect(customSwitcher.currentLanguage).toBe('es');
    });
  });

  describe('Language Management', () => {
    it('should add a new language', () => {
      const spanishConfig: LanguageConfig = {
        code: 'es',
        name: 'Español',
        flag: '🇪🇸',
        rtl: false
      };

      languageSwitcher.addLanguage('es', spanishConfig);
      
      expect(languageSwitcher.availableLanguages).toHaveLength(2);
      expect(languageSwitcher.getLanguageConfig('es')).toEqual(spanishConfig);
    });

    it('should add Chinese languages correctly', () => {
      const simplifiedChineseConfig: LanguageConfig = {
        code: 'zh-CN',
        name: '简体中文',
        flag: '🇨🇳',
        rtl: false
      };

      const traditionalChineseConfig: LanguageConfig = {
        code: 'zh-TW',
        name: '繁體中文',
        flag: '🇹🇼',
        rtl: false
      };

      languageSwitcher.addLanguage('zh-CN', simplifiedChineseConfig);
      languageSwitcher.addLanguage('zh-TW', traditionalChineseConfig);
      
      expect(languageSwitcher.availableLanguages).toHaveLength(3);
      expect(languageSwitcher.getLanguageConfig('zh-CN')).toEqual(simplifiedChineseConfig);
      expect(languageSwitcher.getLanguageConfig('zh-TW')).toEqual(traditionalChineseConfig);
    });

    it('should update existing language', () => {
      const initialConfig: LanguageConfig = {
        code: 'es',
        name: 'Spanish',
        flag: '🇪🇸'
      };

      const updatedConfig: LanguageConfig = {
        code: 'es',
        name: 'Español',
        flag: '🇪🇸',
        rtl: false
      };

      languageSwitcher.addLanguage('es', initialConfig);
      languageSwitcher.addLanguage('es', updatedConfig);
      
      expect(languageSwitcher.availableLanguages).toHaveLength(2);
      expect(languageSwitcher.getLanguageConfig('es')).toEqual(updatedConfig);
    });

    it('should remove a language', () => {
      languageSwitcher.addLanguage('es', {
        code: 'es',
        name: 'Español'
      });

      languageSwitcher.removeLanguage('es');
      
      expect(languageSwitcher.availableLanguages).toHaveLength(1);
      expect(languageSwitcher.getLanguageConfig('es')).toBeUndefined();
    });

    it('should not remove default language', () => {
      expect(() => {
        languageSwitcher.removeLanguage('en');
      }).toThrow("Cannot remove default language 'en'");
    });
  });

  describe('Translation Management', () => {
    it('should add translations for a language', () => {
      const translations: TranslationData = {
        welcome: 'Welcome',
        hello: 'Hello, {{name}}!'
      };

      languageSwitcher.addTranslations('en', translations);
      
      expect(languageSwitcher.getText('welcome')).toBe('Welcome');
      expect(languageSwitcher.getText('hello', { name: 'John' })).toBe('Hello, John!');
    });

    it('should add Chinese translations correctly', () => {
      const simplifiedChineseTranslations: TranslationData = {
        welcome: '欢迎',
        hello: '你好，{{name}}！'
      };

      const traditionalChineseTranslations: TranslationData = {
        welcome: '歡迎',
        hello: '你好，{{name}}！'
      };

      languageSwitcher.addTranslations('zh-CN', simplifiedChineseTranslations);
      languageSwitcher.addTranslations('zh-TW', traditionalChineseTranslations);
      
      // Add the languages first
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

      // Test Simplified Chinese
      languageSwitcher.setLanguage('zh-CN');
      expect(languageSwitcher.getText('welcome')).toBe('欢迎');
      expect(languageSwitcher.getText('hello', { name: '张三' })).toBe('你好，张三！');

      // Test Traditional Chinese
      languageSwitcher.setLanguage('zh-TW');
      expect(languageSwitcher.getText('welcome')).toBe('歡迎');
      expect(languageSwitcher.getText('hello', { name: '張三' })).toBe('你好，張三！');
    });

    it('should merge translations for the same language', () => {
      const translations1: TranslationData = {
        welcome: 'Welcome'
      };

      const translations2: TranslationData = {
        hello: 'Hello'
      };

      languageSwitcher.addTranslations('en', translations1);
      languageSwitcher.addTranslations('en', translations2);
      
      expect(languageSwitcher.getText('welcome')).toBe('Welcome');
      expect(languageSwitcher.getText('hello')).toBe('Hello');
    });

    it('should handle nested translation keys', () => {
      const translations: TranslationData = {
        common: {
          welcome: 'Welcome',
          hello: 'Hello'
        }
      };

      languageSwitcher.addTranslations('en', translations);
      
      expect(languageSwitcher.getText('common.welcome')).toBe('Welcome');
      expect(languageSwitcher.getText('common.hello')).toBe('Hello');
    });
  });

  describe('Language Switching', () => {
    beforeEach(() => {
      languageSwitcher.addLanguage('es', {
        code: 'es',
        name: 'Español'
      });

      languageSwitcher.addLanguage('zh-CN', {
        code: 'zh-CN',
        name: '简体中文'
      });

      languageSwitcher.addTranslations('en', {
        welcome: 'Welcome',
        hello: 'Hello'
      });

      languageSwitcher.addTranslations('es', {
        welcome: 'Bienvenido',
        hello: 'Hola'
      });

      languageSwitcher.addTranslations('zh-CN', {
        welcome: '欢迎',
        hello: '你好'
      });
    });

    it('should switch to a valid language', async () => {
      await languageSwitcher.setLanguage('es');
      
      expect(languageSwitcher.currentLanguage).toBe('es');
      expect(languageSwitcher.getText('welcome')).toBe('Bienvenido');
    });

    it('should switch to Chinese languages', async () => {
      await languageSwitcher.setLanguage('zh-CN');
      
      expect(languageSwitcher.currentLanguage).toBe('zh-CN');
      expect(languageSwitcher.getText('welcome')).toBe('欢迎');
      expect(languageSwitcher.getText('hello')).toBe('你好');
    });

    it('should not switch to an invalid language', async () => {
      await expect(languageSwitcher.setLanguage('fr')).rejects.toThrow(
        "Language 'fr' is not available"
      );
      
      expect(languageSwitcher.currentLanguage).toBe('en');
    });

    it('should not switch if already on the same language', async () => {
      const onLanguageChange = jest.fn();
      languageSwitcher.onLanguageChange = onLanguageChange;

      await languageSwitcher.setLanguage('en');
      
      expect(onLanguageChange).not.toHaveBeenCalled();
    });

    it('should call onLanguageChange callback', async () => {
      const onLanguageChange = jest.fn();
      languageSwitcher.onLanguageChange = onLanguageChange;

      await languageSwitcher.setLanguage('es');
      
      expect(onLanguageChange).toHaveBeenCalledWith('es');
    });
  });

  describe('Text Retrieval', () => {
    beforeEach(() => {
      languageSwitcher.addTranslations('en', {
        welcome: 'Welcome',
        hello: 'Hello, {{name}}!',
        items: 'You have {{count}} items',
        nested: {
          deep: 'Deep nested text'
        }
      });
    });

    it('should return translation for simple key', () => {
      expect(languageSwitcher.getText('welcome')).toBe('Welcome');
    });

    it('should return key if translation not found', () => {
      expect(languageSwitcher.getText('nonexistent')).toBe('nonexistent');
    });

    it('should handle parameter interpolation', () => {
      expect(languageSwitcher.getText('hello', { name: 'John' })).toBe('Hello, John!');
      expect(languageSwitcher.getText('items', { count: 5 })).toBe('You have 5 items');
    });

    it('should handle nested keys', () => {
      expect(languageSwitcher.getText('nested.deep')).toBe('Deep nested text');
    });

    it('should handle missing parameters gracefully', () => {
      expect(languageSwitcher.getText('hello')).toBe('Hello, {{name}}!');
      expect(languageSwitcher.getText('hello', {})).toBe('Hello, {{name}}!');
    });
  });

  describe('Fallback Language', () => {
    beforeEach(() => {
      const switcher = new LanguageSwitcher({
        defaultLanguage: 'en',
        fallbackLanguage: 'en'
      });

      switcher.addLanguage('en', { code: 'en', name: 'English' });
      switcher.addLanguage('es', { code: 'es', name: 'Español' });
      switcher.addLanguage('zh-CN', { code: 'zh-CN', name: '简体中文' });

      switcher.addTranslations('en', {
        welcome: 'Welcome',
        hello: 'Hello'
      });

      switcher.addTranslations('es', {
        welcome: 'Bienvenido'
        // 'hello' is missing in Spanish
      });

      switcher.addTranslations('zh-CN', {
        welcome: '欢迎'
        // 'hello' is missing in Simplified Chinese
      });

      languageSwitcher = switcher;
    });

    it('should fallback to fallback language when translation is missing', async () => {
      await languageSwitcher.setLanguage('es');
      
      // 'hello' should fallback to English
      expect(languageSwitcher.getText('hello')).toBe('Hello');
    });

    it('should fallback for Chinese languages', async () => {
      await languageSwitcher.setLanguage('zh-CN');
      
      // 'hello' should fallback to English
      expect(languageSwitcher.getText('hello')).toBe('Hello');
    });

    it('should not fallback when translation exists in current language', async () => {
      await languageSwitcher.setLanguage('es');
      
      expect(languageSwitcher.getText('welcome')).toBe('Bienvenido');
    });
  });

  describe('RTL Support', () => {
    it('should detect RTL language correctly', () => {
      languageSwitcher.addLanguage('ar', {
        code: 'ar',
        name: 'العربية',
        rtl: true
      });

      languageSwitcher.setLanguage('ar');
      
      expect(languageSwitcher.isRTL()).toBe(true);
    });

    it('should return false for non-RTL languages including Chinese', () => {
      languageSwitcher.addLanguage('zh-CN', {
        code: 'zh-CN',
        name: '简体中文',
        rtl: false
      });

      languageSwitcher.setLanguage('zh-CN');
      expect(languageSwitcher.isRTL()).toBe(false);
    });
  });

  describe('Utility Methods', () => {
    it('should get available language codes', () => {
      languageSwitcher.addLanguage('es', { code: 'es', name: 'Español' });
      languageSwitcher.addLanguage('zh-CN', { code: 'zh-CN', name: '简体中文' });
      
      const codes = languageSwitcher.getAvailableLanguageCodes();
      expect(codes).toEqual(['en', 'es', 'zh-CN']);
    });

    it('should check if language is available', () => {
      expect(languageSwitcher.isLanguageAvailable('en')).toBe(true);
      expect(languageSwitcher.isLanguageAvailable('fr')).toBe(false);
      expect(languageSwitcher.isLanguageAvailable('zh-CN')).toBe(false);
    });

    it('should get current language configuration', () => {
      const config = languageSwitcher.getCurrentLanguageConfig();
      expect(config?.code).toBe('en');
    });
  });

  describe('Custom Interpolation', () => {
    it('should use custom interpolation function', () => {
      const customInterpolation = (text: string, params: Record<string, string | number>) => {
        return text.replace(/\$(\w+)/g, (match, key) => {
          return params[key]?.toString() || match;
        });
      };

      languageSwitcher.setInterpolationFunction(customInterpolation);

      languageSwitcher.addTranslations('en', {
        greeting: 'Hello, $name! You have $count messages.'
      });

      const result = languageSwitcher.getText('greeting', { name: 'John', count: 3 });
      expect(result).toBe('Hello, John! You have 3 messages.');
    });
  });
}); 