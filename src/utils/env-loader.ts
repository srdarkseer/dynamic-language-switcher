/**
 * Simple environment variable loader for browser-based examples
 * In production, use proper environment variable handling
 */

export interface EnvConfig {
  DEEPL_API_KEY?: string;
  GOOGLE_CLOUD_API_KEY?: string;
  CUSTOM_TRANSLATION_ENDPOINT?: string;
  DEFAULT_LANGUAGE?: string;
  AUTO_TRANSLATE?: boolean;
  PRESERVE_ORIGINAL_TEXT?: boolean;
}

export function loadEnvConfig(): EnvConfig {
  // For browser examples, we'll try to load from localStorage or use defaults
  const config: EnvConfig = {
    DEFAULT_LANGUAGE: 'en',
    AUTO_TRANSLATE: true,
    PRESERVE_ORIGINAL_TEXT: true
  };

  // Try to load from localStorage (set by user)
  if (typeof window !== 'undefined' && window.localStorage) {
    const stored = localStorage.getItem('env-config');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        Object.assign(config, parsed);
      } catch (error) {
        console.warn('Failed to parse stored env config:', error);
      }
    }
  }

  return config;
}

export function saveEnvConfig(config: Partial<EnvConfig>): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    const current = loadEnvConfig();
    const updated = { ...current, ...config };
    localStorage.setItem('env-config', JSON.stringify(updated));
  }
}

export function getApiKey(provider: string): string | undefined {
  const config = loadEnvConfig();
  
  switch (provider) {
    case 'deepl':
      return config.DEEPL_API_KEY;
    case 'google-cloud':
      return config.GOOGLE_CLOUD_API_KEY;
    default:
      return undefined;
  }
}

export function getTranslationApiConfig(provider: string) {
  const config = loadEnvConfig();
  
  switch (provider) {
    case 'deepl':
      return {
        provider: 'deepl' as const,
        apiKey: config.DEEPL_API_KEY
      };
    case 'google-cloud':
      return {
        provider: 'google-cloud' as const,
        apiKey: config.GOOGLE_CLOUD_API_KEY
      };
    case 'custom':
      return {
        provider: 'custom' as const,
        endpoint: config.CUSTOM_TRANSLATION_ENDPOINT
      };
    default:
      return null;
  }
}

export function hasValidApiConfig(): boolean {
  const config = loadEnvConfig();
  return !!(config.DEEPL_API_KEY || config.GOOGLE_CLOUD_API_KEY || config.CUSTOM_TRANSLATION_ENDPOINT);
} 