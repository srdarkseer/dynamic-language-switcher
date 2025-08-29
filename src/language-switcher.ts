import {
  LanguageSwitcherOptions,
  LanguageSwitcherInstance,
  LanguageConfig,
  TranslationData,
  InterpolationFunction
} from './types';

export class LanguageSwitcher implements LanguageSwitcherInstance {
  public currentLanguage: string;
  public availableLanguages: LanguageConfig[] = [];
  public translations: Record<string, TranslationData> = {};
  public onLanguageChange?: (language: string) => void;

  private options: LanguageSwitcherOptions;
  private interpolationFunction: InterpolationFunction;

  constructor(options: LanguageSwitcherOptions) {
    this.options = {
      fallbackLanguage: 'en',
      persistLanguage: true,
      storageKey: 'preferred-language',
      debug: false,
      ...options
    };

    this.currentLanguage = this.options.defaultLanguage;
    this.interpolationFunction = this.defaultInterpolation;

    // Initialize with default language
    this.addLanguage(this.options.defaultLanguage, {
      code: this.options.defaultLanguage,
      name: this.options.defaultLanguage.toUpperCase()
    });

    // Load persisted language if enabled
    if (this.options.persistLanguage) {
      this.loadPersistedLanguage();
    }

    if (this.options.debug) {
      console.log('LanguageSwitcher initialized with options:', this.options);
    }
  }

  /**
   * Set the current language
   */
  public async setLanguage(language: string): Promise<void> {
    if (!this.availableLanguages.find(lang => lang.code === language)) {
      throw new Error(`Language '${language}' is not available`);
    }

    if (this.currentLanguage === language) {
      return;
    }

    this.currentLanguage = language;

    // Persist language if enabled
    if (this.options.persistLanguage) {
      this.persistLanguage(language);
    }

    // Update document direction for RTL support
    this.updateDocumentDirection();

    // Call change callback if provided
    if (this.onLanguageChange) {
      this.onLanguageChange(language);
    }

    if (this.options.debug) {
      console.log(`Language changed to: ${language}`);
    }
  }

  /**
   * Get translated text by key with optional parameter interpolation
   */
  public getText(key: string, params?: Record<string, string | number>): string {
    const translation = this.getTranslationByKey(key);
    
    if (!translation) {
      if (this.options.debug) {
        console.warn(`Translation key '${key}' not found for language '${this.currentLanguage}'`);
      }
      return key;
    }

    if (params) {
      return this.interpolationFunction(translation, params);
    }

    return translation;
  }

  /**
   * Add a new language configuration
   */
  public addLanguage(language: string, config: LanguageConfig): void {
    const existingIndex = this.availableLanguages.findIndex(lang => lang.code === language);
    
    if (existingIndex >= 0) {
      this.availableLanguages[existingIndex] = config;
    } else {
      this.availableLanguages.push(config);
    }

    if (this.options.debug) {
      console.log(`Language '${language}' added/updated:`, config);
    }
  }

  /**
   * Add translations for a specific language
   */
  public addTranslations(language: string, translations: TranslationData): void {
    this.translations[language] = {
      ...this.translations[language],
      ...translations
    };

    if (this.options.debug) {
      console.log(`Translations added for language '${language}':`, translations);
    }
  }

  /**
   * Remove a language and its translations
   */
  public removeLanguage(language: string): void {
    if (language === this.options.defaultLanguage) {
      throw new Error(`Cannot remove default language '${language}'`);
    }

    this.availableLanguages = this.availableLanguages.filter(lang => lang.code !== language);
    delete this.translations[language];

    // If current language is removed, fall back to default
    if (this.currentLanguage === language) {
      this.setLanguage(this.options.defaultLanguage);
    }

    if (this.options.debug) {
      console.log(`Language '${language}' removed`);
    }
  }

  /**
   * Check if current language is RTL
   */
  public isRTL(): boolean {
    const config = this.getLanguageConfig(this.currentLanguage);
    return config?.rtl || false;
  }

  /**
   * Check if a specific language is RTL
   */
  public isLanguageRTL(language: string): boolean {
    const config = this.getLanguageConfig(language);
    return config?.rtl || false;
  }

  /**
   * Get document direction for current language
   */
  public getDocumentDirection(): 'ltr' | 'rtl' {
    return this.isRTL() ? 'rtl' : 'ltr';
  }

  /**
   * Update document direction based on current language
   */
  public updateDocumentDirection(): void {
    if (typeof document !== 'undefined') {
      const direction = this.getDocumentDirection();
      document.documentElement.dir = direction;
      document.documentElement.setAttribute('data-direction', direction);
    }
  }

  /**
   * Get language configuration by language code
   */
  public getLanguageConfig(language: string): LanguageConfig | undefined {
    return this.availableLanguages.find(lang => lang.code === language);
  }

  /**
   * Set custom interpolation function
   */
  public setInterpolationFunction(fn: InterpolationFunction): void {
    this.interpolationFunction = fn;
  }

  /**
   * Get all available language codes
   */
  public getAvailableLanguageCodes(): string[] {
    return this.availableLanguages.map(lang => lang.code);
  }

  /**
   * Check if a language is available
   */
  public isLanguageAvailable(language: string): boolean {
    return this.availableLanguages.some(lang => lang.code === language);
  }

  /**
   * Get current language configuration
   */
  public getCurrentLanguageConfig(): LanguageConfig | undefined {
    return this.getLanguageConfig(this.currentLanguage);
  }

  private getTranslationByKey(key: string): string | undefined {
    const keys = key.split('.');
    let current: any = this.translations[this.currentLanguage];

    // Try current language first
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        current = undefined;
        break;
      }
    }

    if (typeof current === 'string') {
      return current;
    }

    // Fallback to fallback language if different
    if (this.options.fallbackLanguage && this.options.fallbackLanguage !== this.currentLanguage) {
      current = this.translations[this.options.fallbackLanguage];
      
      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k];
        } else {
          current = undefined;
          break;
        }
      }

      if (typeof current === 'string') {
        return current;
      }
    }

    return undefined;
  }

  private defaultInterpolation(text: string, params: Record<string, string | number>): string {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return params[key]?.toString() || match;
    });
  }

  private persistLanguage(language: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(this.options.storageKey!, language);
      }
    } catch (error) {
      if (this.options.debug) {
        console.warn('Failed to persist language:', error);
      }
    }
  }

  private loadPersistedLanguage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const persisted = window.localStorage.getItem(this.options.storageKey!);
        if (persisted && this.isLanguageAvailable(persisted)) {
          this.currentLanguage = persisted;
        }
      }
    } catch (error) {
      if (this.options.debug) {
        console.warn('Failed to load persisted language:', error);
      }
    }
  }
} 