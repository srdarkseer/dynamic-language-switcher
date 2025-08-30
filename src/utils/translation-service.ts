import { 
  TranslationService as ITranslationService, 
  TranslationRequest, 
  TranslationResponse, 
  TranslationApiConfig 
} from '../types/types';

export class TranslationService implements ITranslationService {
  private config: TranslationApiConfig;
  private rateLimitDelay = 0;

  constructor(config: TranslationApiConfig) {
    this.config = config;
  }

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    await this.handleRateLimit();
    
    switch (this.config.provider) {
      case 'deepl':
        return this.translateWithDeepL(request);
      case 'google-cloud':
        return this.translateWithGoogleCloud(request);
      case 'custom':
        return this.translateWithCustom(request);
      default:
        throw new Error(`Unsupported translation provider: ${this.config.provider}`);
    }
  }

  async translateBatch(requests: TranslationRequest[]): Promise<TranslationResponse[]> {
    const responses: TranslationResponse[] = [];
    
    for (const request of requests) {
      try {
        const response = await this.translate(request);
        responses.push(response);
      } catch (error) {
        // Fallback to original text on error
        responses.push({
          translatedText: request.text,
          confidence: 0,
          detectedLanguage: request.fromLanguage
        });
      }
    }
    
    return responses;
  }

  async detectLanguage(text: string): Promise<string> {
    // Simple language detection based on character sets
    if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
    if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'ja';
    if (/[\uac00-\ud7af]/.test(text)) return 'ko';
    if (/[\u0600-\u06ff]/.test(text)) return 'ar';
    if (/[\u0590-\u05ff]/.test(text)) return 'he';
    if (/[\u0a80-\u0aff]/.test(text)) return 'gu';
    if (/[\u0b80-\u0bff]/.test(text)) return 'ta';
    if (/[\u0c80-\u0cff]/.test(text)) return 'kn';
    if (/[\u0d80-\u0dff]/.test(text)) return 'ml';
    if (/[\u0e00-\u0e7f]/.test(text)) return 'th';
    if (/[\u0e80-\u0eff]/.test(text)) return 'lo';
    if (/[\u0f00-\u0fff]/.test(text)) return 'bo';
    if (/[\u1000-\u109f]/.test(text)) return 'my';
    if (/[\u1100-\u11ff]/.test(text)) return 'ko';
    if (/[\u1200-\u137f]/.test(text)) return 'am';
    if (/[\u1380-\u139f]/.test(text)) return 'am';
    if (/[\u13a0-\u13ff]/.test(text)) return 'chr';
    if (/[\u1400-\u167f]/.test(text)) return 'iu';
    if (/[\u1680-\u169f]/.test(text)) return 'ga';
    if (/[\u16a0-\u16ff]/.test(text)) return 'rune';
    if (/[\u1700-\u171f]/.test(text)) return 'tl';
    if (/[\u1720-\u173f]/.test(text)) return 'tl';
    if (/[\u1740-\u175f]/.test(text)) return 'tl';
    if (/[\u1760-\u177f]/.test(text)) return 'tl';
    if (/[\u1780-\u17ff]/.test(text)) return 'km';
    if (/[\u1800-\u18af]/.test(text)) return 'mn';
    if (/[\u1900-\u194f]/.test(text)) return 'lmy';
    if (/[\u1950-\u197f]/.test(text)) return 'tai';
    if (/[\u1980-\u19df]/.test(text)) return 'tai';
    if (/[\u19e0-\u19ff]/.test(text)) return 'tai';
    if (/[\u1a00-\u1a1f]/.test(text)) return 'tai';
    if (/[\u1a20-\u1aaf]/.test(text)) return 'tai';
    if (/[\u1ab0-\u1aff]/.test(text)) return 'tai';
    if (/[\u1b00-\u1b7f]/.test(text)) return 'bal';
    if (/[\u1b80-\u1bbf]/.test(text)) return 'su';
    if (/[\u1bc0-\u1bff]/.test(text)) return 'btd';
    if (/[\u1c00-\u1c4f]/.test(text)) return 'lep';
    if (/[\u1c50-\u1c7f]/.test(text)) return 'lep';
    if (/[\u1cc0-\u1ccf]/.test(text)) return 'lep';
    if (/[\u1cd0-\u1cff]/.test(text)) return 'lep';
    if (/[\u1d00-\u1d7f]/.test(text)) return 'lep';
    if (/[\u1d80-\u1dbf]/.test(text)) return 'lep';
    if (/[\u1dc0-\u1dff]/.test(text)) return 'lep';
    if (/[\u1e00-\u1eff]/.test(text)) return 'lep';
    if (/[\u1f00-\u1fff]/.test(text)) return 'grc';
    if (/[\u2000-\u206f]/.test(text)) return 'grc';
    if (/[\u2070-\u209f]/.test(text)) return 'grc';
    if (/[\u20a0-\u20cf]/.test(text)) return 'grc';
    if (/[\u20d0-\u20ff]/.test(text)) return 'grc';
    if (/[\u2100-\u214f]/.test(text)) return 'grc';
    if (/[\u2150-\u218f]/.test(text)) return 'grc';
    if (/[\u2190-\u21ff]/.test(text)) return 'grc';
    if (/[\u2200-\u22ff]/.test(text)) return 'grc';
    if (/[\u2300-\u23ff]/.test(text)) return 'grc';
    if (/[\u2400-\u243f]/.test(text)) return 'grc';
    if (/[\u2440-\u245f]/.test(text)) return 'grc';
    if (/[\u2460-\u24ff]/.test(text)) return 'grc';
    if (/[\u2500-\u257f]/.test(text)) return 'grc';
    if (/[\u2580-\u259f]/.test(text)) return 'grc';
    if (/[\u25a0-\u25ff]/.test(text)) return 'grc';
    if (/[\u2600-\u26ff]/.test(text)) return 'grc';
    if (/[\u2700-\u27bf]/.test(text)) return 'grc';
    if (/[\u27c0-\u27ef]/.test(text)) return 'grc';
    if (/[\u27f0-\u27ff]/.test(text)) return 'grc';
    if (/[\u2800-\u28ff]/.test(text)) return 'grc';
    if (/[\u2900-\u297f]/.test(text)) return 'grc';
    if (/[\u2980-\u29ff]/.test(text)) return 'grc';
    if (/[\u2a00-\u2a7f]/.test(text)) return 'grc';
    if (/[\u2a80-\u2aff]/.test(text)) return 'grc';
    if (/[\u2b00-\u2bff]/.test(text)) return 'grc';
    if (/[\u2c00-\u2c5f]/.test(text)) return 'grc';
    if (/[\u2c60-\u2c7f]/.test(text)) return 'grc';
    if (/[\u2c80-\u2cff]/.test(text)) return 'grc';
    if (/[\u2d00-\u2d2f]/.test(text)) return 'grc';
    if (/[\u2d30-\u2d7f]/.test(text)) return 'grc';
    if (/[\u2d80-\u2ddf]/.test(text)) return 'grc';
    if (/[\u2de0-\u2dff]/.test(text)) return 'grc';
    if (/[\u2e00-\u2e7f]/.test(text)) return 'grc';
    if (/[\u2e80-\u2eff]/.test(text)) return 'grc';
    if (/[\u2f00-\u2fdf]/.test(text)) return 'grc';
    if (/[\u2ff0-\u2fff]/.test(text)) return 'grc';
    if (/[\u3000-\u303f]/.test(text)) return 'grc';
    if (/[\u3040-\u309f]/.test(text)) return 'ja';
    if (/[\u30a0-\u30ff]/.test(text)) return 'ja';
    if (/[\u3100-\u312f]/.test(text)) return 'grc';
    if (/[\u3130-\u318f]/.test(text)) return 'ko';
    if (/[\u3190-\u319f]/.test(text)) return 'grc';
    if (/[\u31a0-\u31bf]/.test(text)) return 'grc';
    if (/[\u31c0-\u31ef]/.test(text)) return 'grc';
    if (/[\u31f0-\u31ff]/.test(text)) return 'grc';
    if (/[\u3200-\u32ff]/.test(text)) return 'grc';
    if (/[\u3300-\u33ff]/.test(text)) return 'grc';
    if (/[\u3400-\u4dbf]/.test(text)) return 'zh';
    if (/[\u4dc0-\u4dff]/.test(text)) return 'grc';
    if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
    if (/[\ua000-\ua48f]/.test(text)) return 'yi';
    if (/[\ua490-\ua4cf]/.test(text)) return 'yi';
    if (/[\ua4d0-\ua4ff]/.test(text)) return 'lrc';
    if (/[\ua500-\ua63f]/.test(text)) return 'vai';
    if (/[\ua640-\ua69f]/.test(text)) return 'cyr';
    if (/[\ua6a0-\ua6ff]/.test(text)) return 'cyr';
    if (/[\ua700-\ua71f]/.test(text)) return 'cyr';
    if (/[\ua720-\ua7ff]/.test(text)) return 'cyr';
    if (/[\ua800-\ua82f]/.test(text)) return 'cyr';
    if (/[\ua830-\ua83f]/.test(text)) return 'cyr';
    if (/[\ua840-\ua87f]/.test(text)) return 'cyr';
    if (/[\ua880-\ua8df]/.test(text)) return 'cyr';
    if (/[\ua8e0-\ua8ff]/.test(text)) return 'cyr';
    if (/[\ua900-\ua92f]/.test(text)) return 'cyr';
    if (/[\ua930-\ua95f]/.test(text)) return 'cyr';
    if (/[\ua960-\ua97f]/.test(text)) return 'cyr';
    if (/[\ua980-\ua9df]/.test(text)) return 'cyr';
    if (/[\ua9e0-\ua9ff]/.test(text)) return 'cyr';
    if (/[\uaa00-\uaa5f]/.test(text)) return 'cyr';
    if (/[\uaa60-\uaa7f]/.test(text)) return 'cyr';
    if (/[\uaa80-\uaadf]/.test(text)) return 'cyr';
    if (/[\uaae0-\uaaff]/.test(text)) return 'cyr';
    if (/[\uab00-\uab2f]/.test(text)) return 'cyr';
    if (/[\uab30-\uab6f]/.test(text)) return 'cyr';
    if (/[\uab70-\uabbf]/.test(text)) return 'cyr';
    if (/[\uabc0-\uabff]/.test(text)) return 'cyr';
    if (/[\uac00-\ud7af]/.test(text)) return 'ko';
    if (/[\ud7b0-\ud7ff]/.test(text)) return 'ko';
    if (/[\ud800-\udb7f]/.test(text)) return 'ko';
    if (/[\udb80-\udbff]/.test(text)) return 'ko';
    if (/[\udc00-\udfff]/.test(text)) return 'ko';
    if (/[\ue000-\uf8ff]/.test(text)) return 'ko';
    if (/[\uf900-\ufaff]/.test(text)) return 'ko';
    if (/[\ufb00-\ufb4f]/.test(text)) return 'ko';
    if (/[\ufb50-\ufdff]/.test(text)) return 'ko';
    if (/[\ufe00-\ufe0f]/.test(text)) return 'ko';
    if (/[\ufe10-\ufe1f]/.test(text)) return 'ko';
    if (/[\ufe20-\ufe2f]/.test(text)) return 'ko';
    if (/[\ufe30-\ufe4f]/.test(text)) return 'ko';
    if (/[\ufe50-\ufe6f]/.test(text)) return 'ko';
    if (/[\ufe70-\ufeff]/.test(text)) return 'ko';
    if (/[\uff00-\uffef]/.test(text)) return 'ko';
    if (/[\ufff0-\uffff]/.test(text)) return 'ko';
    
    // Default to English for Latin script
    return 'en';
  }

  private async translateWithDeepL(request: TranslationRequest): Promise<TranslationResponse> {
    const url = 'https://api-free.deepl.com/v2/translate';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `DeepL-Auth-Key ${this.config.apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          text: request.text,
          source_lang: request.fromLanguage.toUpperCase(),
          target_lang: request.toLanguage.toUpperCase()
        })
      });

      if (!response.ok) {
        throw new Error(`DeepL API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        translatedText: data.translations[0].text,
        confidence: 0.95,
        detectedLanguage: data.translations[0].detected_source_language?.toLowerCase() || request.fromLanguage
      };
    } catch (error) {
      throw new Error(`DeepL translation failed: ${error}`);
    }
  }

  private async translateWithGoogleCloud(_request: TranslationRequest): Promise<TranslationResponse> {
    // Placeholder for Google Cloud Translation API
    // You can implement this later when you have the API key
    throw new Error('Google Cloud Translation API not yet implemented. Please use DeepL or custom service for now.');
  }

  private async translateWithCustom(request: TranslationRequest): Promise<TranslationResponse> {
    if (!this.config.endpoint) {
      throw new Error('Custom endpoint not configured');
    }

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Custom API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        translatedText: data.translatedText || data.text || request.text,
        confidence: data.confidence || 0.8,
        detectedLanguage: data.detectedLanguage || request.fromLanguage
      };
    } catch (error) {
      throw new Error(`Custom translation failed: ${error}`);
    }
  }

  private async handleRateLimit(): Promise<void> {
    if (this.config.rateLimit && this.rateLimitDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, this.rateLimitDelay));
    }
  }
} 