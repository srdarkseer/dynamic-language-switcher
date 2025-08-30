import {
  LanguageSwitcherOptions,
  LanguageSwitcherInstance,
  LanguageConfig,
  TranslationData,
  InterpolationFunction,
  TranslationApiConfig,
  DetectedContent
} from '../types/types';
import { ContentDetector } from '../utils/content-detector';
import { TranslationService } from '../utils/translation-service';

export class LanguageSwitcher implements LanguageSwitcherInstance {
  public currentLanguage: string;
  public availableLanguages: LanguageConfig[] = [];
  public translations: Record<string, TranslationData> = {};
  public onLanguageChange?: (_language: string) => void;

  private options: LanguageSwitcherOptions;
  private interpolationFunction: InterpolationFunction;
  private contentDetector: ContentDetector;
  private translationService: TranslationService | null = null;
  private isAutoTranslating = false;
  private originalTexts = new Map<HTMLElement, string>();

  constructor(options: LanguageSwitcherOptions) {
    this.options = {
      fallbackLanguage: 'en',
      persistLanguage: true,
      storageKey: 'preferred-language',
      debug: false,
      autoTranslate: false,
      preserveOriginalText: true,
      ...options
    };

    this.currentLanguage = this.options.defaultLanguage;
    this.interpolationFunction = this.defaultInterpolation;
    this.contentDetector = new ContentDetector(this.options);

    // Initialize with default language
    this.addLanguage(this.options.defaultLanguage, {
      code: this.options.defaultLanguage,
      name: this.options.defaultLanguage.toUpperCase()
    });

    // Load persisted language if enabled
    if (this.options.persistLanguage) {
      this.loadPersistedLanguage();
    }

    // Initialize translation service if API config is provided
    if (this.options.translationApi) {
      this.setTranslationApi(this.options.translationApi);
    }

    // Start auto-translation if enabled
    if (this.options.autoTranslate) {
      this.startAutoTranslation();
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

    const previousLanguage = this.currentLanguage;
    this.currentLanguage = language;

    // Persist language if enabled
    if (this.options.persistLanguage) {
      this.persistLanguage(language);
    }

    // Update document direction for RTL support
    this.updateDocumentDirection();

    // Auto-translate page content if enabled and translation service is available
    if (this.options.autoTranslate && this.translationService && previousLanguage !== language) {
      await this.translatePage(language);
    }

    // Call change callback if provided
    if (this.onLanguageChange) {
      this.onLanguageChange(language);
    }
  }

  /**
   * Start automatic translation
   */
  public startAutoTranslation(): void {
    if (this.isAutoTranslating) return;

    this.isAutoTranslating = true;
    
    // Start watching for content changes
    this.contentDetector.watch(async (newContent) => {
      if (this.translationService && this.currentLanguage !== this.options.defaultLanguage) {
        await this.translateNewContent(newContent);
      }
    });
  }

  /**
   * Stop automatic translation
   */
  public stopAutoTranslation(): void {
    if (!this.isAutoTranslating) return;

    this.isAutoTranslating = false;
    this.contentDetector.unwatch();
  }

  /**
   * Translate the entire page
   */
  public async translatePage(targetLanguage?: string): Promise<void> {
    if (!this.translationService) {
      throw new Error('Translation service not configured');
    }

    const language = targetLanguage || this.currentLanguage;
    if (language === this.options.defaultLanguage) {
      this.restoreOriginalText();
      return;
    }

    const content = this.contentDetector.getDetectedContent();
    await this.translateContent(content, language);
  }

  /**
   * Translate a specific element
   */
  public async translateElement(element: HTMLElement, targetLanguage?: string): Promise<void> {
    if (!this.translationService) {
      throw new Error('Translation service not configured');
    }

    const language = targetLanguage || this.currentLanguage;
    if (language === this.options.defaultLanguage) {
      this.restoreElementText(element);
      return;
    }

    const text = this.extractElementText(element);
    if (text && this.isTranslatableText(text)) {
      try {
        const response = await this.translationService.translate({
          text,
          fromLanguage: this.options.defaultLanguage,
          toLanguage: language,
          element
        });

        this.applyTranslation(element, response.translatedText);
        this.contentDetector.markAsTranslated(element, response.translatedText);
      } catch (error) {
        if (this.options.debug) {
          console.error('Translation failed for element:', element, error);
        }
      }
    }
  }

  /**
   * Restore original text for all translated elements
   */
  public restoreOriginalText(): void {
    this.originalTexts.forEach((originalText, element) => {
      this.restoreElementText(element);
    });
  }

  /**
   * Get all detected content
   */
  public getDetectedContent(): DetectedContent[] {
    return this.contentDetector.getDetectedContent();
  }

  /**
   * Set translation API configuration
   */
  public setTranslationApi(config: TranslationApiConfig): void {
    this.translationService = new TranslationService(config);
  }

  /**
   * Get translated text by key with optional parameter interpolation
   */
  public getText(key: string, params?: Record<string, string | number>): string {
    const translation = this.getTranslationByKey(key);
    
    if (!translation) {
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
  }

  /**
   * Add translations for a specific language
   */
  public addTranslations(language: string, translations: TranslationData): void {
    this.translations[language] = {
      ...this.translations[language],
      ...translations
    };
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

    if (this.currentLanguage === language) {
      this.setLanguage(this.options.defaultLanguage);
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

  // Private methods for translation functionality
  private async translateNewContent(content: DetectedContent[]): Promise<void> {
    if (!this.translationService) return;

    const translatableContent = content.filter(item => 
      !item.isTranslated && 
      this.isTranslatableText(item.originalText)
    );

    if (translatableContent.length === 0) return;

    try {
      const requests = translatableContent.map(item => ({
        text: item.originalText,
        fromLanguage: this.options.defaultLanguage,
        toLanguage: this.currentLanguage,
        element: item.element
      }));

      const responses = await this.translationService.translateBatch(requests);
      
      responses.forEach((response, index) => {
        const content = translatableContent[index];
        if (content && response.translatedText) {
          this.applyTranslation(content.element, response.translatedText);
          this.contentDetector.markAsTranslated(content.element, response.translatedText);
        }
      });
    } catch (error) {
      if (this.options.debug) {
        console.error('Batch translation failed:', error);
      }
    }
  }

  private async translateContent(content: DetectedContent[], targetLanguage: string): Promise<void> {
    if (!this.translationService) return;

    const translatableContent = content.filter(item => 
      this.isTranslatableText(item.originalText)
    );

    if (translatableContent.length === 0) return;

    try {
      const requests = translatableContent.map(item => ({
        text: item.originalText,
        fromLanguage: this.options.defaultLanguage,
        toLanguage: targetLanguage,
        element: item.element
      }));

      const responses = await this.translationService.translateBatch(requests);
      
      responses.forEach((response, index) => {
        const content = translatableContent[index];
        if (content && response.translatedText) {
          this.applyTranslation(content.element, response.translatedText);
          this.contentDetector.markAsTranslated(content.element, response.translatedText);
        }
      });
    } catch (error) {
      if (this.options.debug) {
        console.error('Page translation failed:', error);
      }
    }
  }

  private applyTranslation(element: HTMLElement, translatedText: string): void {
    if (this.options.preserveOriginalText) {
      this.originalTexts.set(element, this.extractElementText(element));
    }

    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      const placeholder = element.getAttribute('placeholder');
      if (placeholder) {
        element.setAttribute('placeholder', translatedText);
      } else {
        (element as HTMLInputElement | HTMLTextAreaElement).value = translatedText;
      }
    } else if (element.tagName === 'META') {
      element.setAttribute('content', translatedText);
    } else if (element.tagName === 'TITLE') {
      element.textContent = translatedText;
    } else {
      element.textContent = translatedText;
    }

    element.setAttribute('data-translated', 'true');
    element.classList.add('translated');
  }

  private restoreElementText(element: HTMLElement): void {
    const originalText = this.originalTexts.get(element);
    if (originalText) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        const placeholder = element.getAttribute('placeholder');
        if (placeholder) {
          element.setAttribute('placeholder', originalText);
        } else {
          (element as HTMLInputElement | HTMLTextAreaElement).value = originalText;
        }
      } else if (element.tagName === 'META') {
        element.setAttribute('content', originalText);
      } else if (element.tagName === 'TITLE') {
        element.textContent = originalText;
      } else {
        element.textContent = originalText;
      }

      element.removeAttribute('data-translated');
      element.classList.remove('translated');
      this.originalTexts.delete(element);
    }
  }

  private extractElementText(element: HTMLElement): string {
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
      const placeholder = element.getAttribute('placeholder');
      if (placeholder) {
        return placeholder;
      }
      return (element as HTMLInputElement | HTMLTextAreaElement).value || '';
    }

    if (element.tagName === 'META') {
      const content = element.getAttribute('content');
      return content || '';
    }

    if (element.tagName === 'TITLE') {
      return element.textContent || '';
    }

    let text = element.textContent || '';
    text = text.replace(/\s+/g, ' ').trim();
    return text;
  }

  private isTranslatableText(text: string): boolean {
    if (!text || text.length < 2) {
      return false;
    }

    if (/^[\d\s\W]+$/.test(text) || text.length < 2) {
      return false;
    }

    const isEnglish = /^[a-zA-Z\s\W]+$/.test(text);
    const hasUnicode = /[\u0080-\uFFFF]/.test(text);
    
    return isEnglish || hasUnicode;
  }

  private getTranslationByKey(key: string): string | undefined {
    const keys = key.split('.');
    let current: any = this.translations[this.currentLanguage];

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
        console.error('Failed to persist language:', error);
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
        console.error('Failed to load persisted language:', error);
      }
    }
  }
} 