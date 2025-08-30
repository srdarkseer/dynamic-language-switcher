import { DetectedContent, LanguageSwitcherOptions } from '../types/types';

export class ContentDetector {
  private options: LanguageSwitcherOptions;
  private observer: MutationObserver | null = null;
  private detectedContent: DetectedContent[] = [];
  private watchCallback: ((_content: DetectedContent[]) => void) | null = null;
  private isWatching = false;

  constructor(options: LanguageSwitcherOptions) {
    this.options = options;
  }

  /**
   * Detect all translatable content in the current page
   */
  public detect(): DetectedContent[] {
    if (typeof document === 'undefined') {
      return [];
    }

    const selectors = this.options.contentSelectors || [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'span', 'div', 'a', 'button', 'label',
      'input[placeholder]', 'textarea[placeholder]',
      'title', 'meta[name="description"]'
    ];

    const excludeSelectors = this.options.excludeSelectors || [
      'script', 'style', 'code', 'pre',
      '[data-no-translate]', '.no-translate',
      '[data-translated]', '.translated'
    ];

    const elements = document.querySelectorAll(selectors.join(','));
    const newContent: DetectedContent[] = [];

    elements.forEach((element) => {
      // Skip if element should be excluded
      if (this.shouldExcludeElement(element as HTMLElement, excludeSelectors)) {
        return;
      }

      // Skip if already detected
      if (this.detectedContent.some(content => content.element === element)) {
        return;
      }

      const text = this.extractText(element as HTMLElement);
      if (text && this.isTranslatableText(text)) {
        const detectedContent: DetectedContent = {
          element: element as HTMLElement,
          originalText: text,
          language: 'auto',
          isTranslated: false,
          timestamp: Date.now()
        };

        newContent.push(detectedContent);
        this.detectedContent.push(detectedContent);
      }
    });

    return newContent;
  }

  /**
   * Start watching for new content being added to the page
   */
  public watch(_callback: (_content: DetectedContent[]) => void): void {
    if (typeof document === 'undefined' || this.isWatching) {
      return;
    }

    this.watchCallback = _callback;
    this.isWatching = true;

    // Initial detection
    const initialContent = this.detect();
    if (initialContent.length > 0) {
      _callback(initialContent);
    }

    // Watch for DOM changes
    this.observer = new MutationObserver((mutations) => {
      const newContent: DetectedContent[] = [];

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              const content = this.detectContentInElement(element);
              newContent.push(...content);
            }
          });
        } else if (mutation.type === 'characterData') {
          // Handle text changes
          const parent = mutation.target.parentElement;
          if (parent && this.isTranslatableElement(parent)) {
            const text = this.extractText(parent);
            if (text && this.isTranslatableText(text)) {
              const existing = this.detectedContent.find(c => c.element === parent);
              if (existing) {
                existing.originalText = text;
                existing.isTranslated = false;
                existing.timestamp = Date.now();
              } else {
                const detectedContent: DetectedContent = {
                  element: parent,
                  originalText: text,
                  language: 'auto',
                  isTranslated: false,
                  timestamp: Date.now()
                };
                this.detectedContent.push(detectedContent);
                newContent.push(detectedContent);
              }
            }
          }
        }
      });

      if (newContent.length > 0 && this.watchCallback) {
        this.watchCallback(newContent);
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: true
    });
  }

  /**
   * Stop watching for content changes
   */
  public unwatch(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.isWatching = false;
    this.watchCallback = null;
  }

  /**
   * Get all detected content
   */
  public getDetectedContent(): DetectedContent[] {
    return [...this.detectedContent];
  }

  /**
   * Clear detected content
   */
  public clear(): void {
    this.detectedContent = [];
  }

  /**
   * Mark content as translated
   */
  public markAsTranslated(element: HTMLElement, translatedText: string): void {
    const content = this.detectedContent.find(c => c.element === element);
    if (content) {
      content.translatedText = translatedText;
      content.isTranslated = true;
      content.timestamp = Date.now();
    }
  }

  /**
   * Check if element should be excluded from translation
   */
  private shouldExcludeElement(element: HTMLElement, excludeSelectors: string[]): boolean {
    // Check for data attributes
    if (element.hasAttribute('data-no-translate') || 
        element.hasAttribute('data-translated') ||
        element.classList.contains('no-translate') ||
        element.classList.contains('translated')) {
      return true;
    }

    // Check for exclude selectors
    for (const selector of excludeSelectors) {
      if (element.matches(selector)) {
        return true;
      }
    }

    // Check if parent is excluded
    let parent = element.parentElement;
    while (parent) {
      if (this.shouldExcludeElement(parent, excludeSelectors)) {
        return true;
      }
      parent = parent.parentElement;
    }

    return false;
  }

  /**
   * Check if element contains translatable content
   */
  private isTranslatableElement(element: HTMLElement): boolean {
    const selectors = this.options.contentSelectors || [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'span', 'div', 'a', 'button', 'label'
    ];

    return selectors.some(selector => element.matches(selector));
  }

  /**
   * Extract text content from an element
   */
  private extractText(element: HTMLElement): string {
    // Handle different types of content
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

    // For other elements, get text content
    let text = element.textContent || '';
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  }

  /**
   * Check if text is translatable
   */
  private isTranslatableText(text: string): boolean {
    if (!text || text.length < 2) {
      return false;
    }

    // Skip if it's just numbers, symbols, or very short
    if (/^[\d\s\W]+$/.test(text) || text.length < 2) {
      return false;
    }

    // Skip if it's already in a different language (basic detection)
    const isEnglish = /^[a-zA-Z\s\W]+$/.test(text);
    const hasUnicode = /[\u0080-\uFFFF]/.test(text);
    
    // If it's English or has unicode characters, it's likely translatable
    return isEnglish || hasUnicode;
  }

  /**
   * Detect content in a specific element and its children
   */
  private detectContentInElement(element: HTMLElement): DetectedContent[] {
    const content: DetectedContent[] = [];
    
    if (this.isTranslatableElement(element)) {
      const text = this.extractText(element);
      if (text && this.isTranslatableText(text)) {
        content.push({
          element,
          originalText: text,
          language: 'auto',
          isTranslated: false,
          timestamp: Date.now()
        });
      }
    }

    // Check children
    const children = element.querySelectorAll('*');
    children.forEach((child) => {
      if (this.isTranslatableElement(child as HTMLElement)) {
        const text = this.extractText(child as HTMLElement);
        if (text && this.isTranslatableText(text)) {
          content.push({
            element: child as HTMLElement,
            originalText: text,
            language: 'auto',
            isTranslated: false,
            timestamp: Date.now()
          });
        }
      }
    });

    return content;
  }
} 