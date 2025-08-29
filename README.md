# Dynamic Language Switcher

A lightweight, flexible, and easy-to-use npm package for dynamic language switching in JavaScript/TypeScript applications. This package provides a comprehensive solution for internationalization (i18n) with support for multiple languages, RTL languages, parameter interpolation, and language persistence.

## Features

- 🌍 **Multi-language Support**: Support for unlimited languages with easy configuration
- 🔄 **Dynamic Switching**: Change languages at runtime without page reload
- 💾 **Language Persistence**: Automatically save and restore user's language preference
- 🎯 **Parameter Interpolation**: Support for dynamic content in translations
- 📱 **RTL Support**: Built-in support for right-to-left languages
- 🚀 **Lightweight**: Minimal bundle size with no external dependencies
- 🧪 **TypeScript Ready**: Full TypeScript support with comprehensive type definitions
- 🎨 **Customizable**: Flexible configuration options and extensible architecture
- 🧹 **Clean API**: Simple and intuitive API design

## Installation

```bash
npm install dynamic-language-switcher
```

## Quick Start

### Basic Usage

```typescript
import { createLanguageSwitcher } from "dynamic-language-switcher";

// Create a language switcher instance
const languageSwitcher = createLanguageSwitcher({
  defaultLanguage: "en",
  fallbackLanguage: "en",
  persistLanguage: true,
  debug: true,
});

// Add languages
languageSwitcher.addLanguage("en", {
  code: "en",
  name: "English",
  flag: "🇺🇸",
});

languageSwitcher.addLanguage("es", {
  code: "es",
  name: "Español",
  flag: "🇪🇸",
  rtl: false,
});

languageSwitcher.addLanguage("zh-CN", {
  code: "zh-CN",
  name: "简体中文",
  flag: "🇨🇳",
  rtl: false,
});

languageSwitcher.addLanguage("zh-TW", {
  code: "zh-TW",
  name: "繁體中文",
  flag: "🇹🇼",
  rtl: false,
});

// Add translations
languageSwitcher.addTranslations("en", {
  welcome: "Welcome",
  hello: "Hello, {{name}}!",
  items: "You have {{count}} items",
});

languageSwitcher.addTranslations("es", {
  welcome: "Bienvenido",
  hello: "¡Hola, {{name}}!",
  items: "Tienes {{count}} elementos",
});

languageSwitcher.addTranslations("zh-CN", {
  welcome: "欢迎",
  hello: "你好，{{name}}！",
  items: "您有{{count}}个项目",
});

languageSwitcher.addTranslations("zh-TW", {
  welcome: "歡迎",
  hello: "你好，{{name}}！",
  items: "您有{{count}}個項目",
});

// Switch language
await languageSwitcher.setLanguage("es");

// Get translated text
console.log(languageSwitcher.getText("welcome")); // "Bienvenido"
console.log(languageSwitcher.getText("hello", { name: "Juan" })); // "¡Hola, Juan!"
console.log(languageSwitcher.getText("items", { count: 5 })); // "Tienes 5 elementos"

// Switch to Chinese
await languageSwitcher.setLanguage("zh-CN");
console.log(languageSwitcher.getText("welcome")); // "欢迎"
console.log(languageSwitcher.getText("hello", { name: "张三" })); // "你好，张三！"

await languageSwitcher.setLanguage("zh-TW");
console.log(languageSwitcher.getText("welcome")); // "歡迎"
console.log(languageSwitcher.getText("hello", { name: "張三" })); // "你好，張三！"
```

### Using Utility Functions

```typescript
import {
  getBrowserLanguage,
  getCommonLanguages,
  createLanguageConfig,
  formatNumber,
  formatDate,
} from "dynamic-language-switcher";

// Get browser's preferred language
const browserLang = getBrowserLanguage(); // 'en', 'es', etc.

// Get common language configurations
const commonLanguages = getCommonLanguages();

// Create language config with auto-detection
const arabicConfig = createLanguageConfig("ar"); // Includes RTL detection

// Format numbers and dates
const formattedNumber = formatNumber(1234.56, "es"); // "1.234,56"
const formattedDate = formatDate(new Date(), "fr"); // "1/1/2024"
```

## API Reference

### LanguageSwitcher Class

#### Constructor Options

```typescript
interface LanguageSwitcherOptions {
  defaultLanguage: string; // Required: Default language code
  fallbackLanguage?: string; // Optional: Fallback language (default: 'en')
  persistLanguage?: boolean; // Optional: Save language preference (default: true)
  storageKey?: string; // Optional: LocalStorage key (default: 'preferred-language')
  onLanguageChange?: (language: string) => void; // Optional: Change callback
  debug?: boolean; // Optional: Enable debug logging (default: false)
}
```

#### Methods

- `setLanguage(language: string): Promise<void>` - Switch to specified language
- `getText(key: string, params?: Record<string, string | number>): string` - Get translated text
- `addLanguage(language: string, config: LanguageConfig): void` - Add new language
- `addTranslations(language: string, translations: TranslationData): void` - Add translations
- `removeLanguage(language: string): void` - Remove language
- `isRTL(): boolean` - Check if current language is RTL
- `getLanguageConfig(language: string): LanguageConfig | undefined` - Get language config
- `setInterpolationFunction(fn: InterpolationFunction): void` - Set custom interpolation

### Utility Functions

- `getBrowserLanguage(): string` - Get browser's preferred language
- `getBrowserLanguages(): string[]` - Get all browser languages
- `isValidLanguageCode(code: string): boolean` - Validate language code
- `normalizeLanguageCode(code: string): string` - Normalize language code
- `getLanguageName(code: string): string` - Get language name from code
- `getLanguageFlag(code: string): string` - Get flag emoji for language
- `isRTLLanguage(code: string): boolean` - Check if language is RTL
- `createLanguageConfig(code: string, name?: string): LanguageConfig` - Create language config
- `getCommonLanguages(): LanguageConfig[]` - Get popular languages
- `formatNumber(value: number, locale: string): string` - Format number by locale
- `formatDate(date: Date, locale: string, options?: Intl.DateTimeFormatOptions): string` - Format date by locale
- `formatCurrency(value: number, locale: string, currency: string): string` - Format currency by locale

## Advanced Usage

### Custom Interpolation

```typescript
// Custom interpolation function
const customInterpolation = (
  text: string,
  params: Record<string, string | number>
) => {
  return text.replace(/\$(\w+)/g, (match, key) => {
    return params[key]?.toString() || match;
  });
};

languageSwitcher.setInterpolationFunction(customInterpolation);

// Use with $ syntax
languageSwitcher.addTranslations("en", {
  greeting: "Hello, $name! You have $count messages.",
});

console.log(languageSwitcher.getText("greeting", { name: "John", count: 3 }));
// Output: "Hello, John! You have 3 messages."
```

### Language Change Callback

```typescript
const languageSwitcher = createLanguageSwitcher({
  defaultLanguage: "en",
  onLanguageChange: (language: string) => {
    console.log(`Language changed to: ${language}`);

    // Update document direction for RTL languages
    const config = languageSwitcher.getLanguageConfig(language);
    if (config?.rtl) {
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.dir = "ltr";
    }

    // Trigger UI updates
    document.dispatchEvent(
      new CustomEvent("languageChanged", { detail: { language } })
    );
  },
});
```

### Loading Translations Dynamically

```typescript
// Load translations from API
async function loadTranslations(language: string) {
  try {
    const response = await fetch(`/api/translations/${language}`);
    const translations = await response.json();
    languageSwitcher.addTranslations(language, translations);
  } catch (error) {
    console.error(`Failed to load translations for ${language}:`, error);
  }
}

// Load translations when switching languages
languageSwitcher.onLanguageChange = async (language: string) => {
  await loadTranslations(language);
};
```

## React & Next.js Integration

### React Hooks

```tsx
import {
  useLanguage,
  useTranslation,
  useTranslations,
} from "dynamic-language-switcher";

function MyComponent() {
  const { currentLanguage, switchLanguage, t, isRTL, direction } =
    useLanguage();

  // Translate a single key
  const welcomeText = useTranslation("welcome");

  // Translate multiple keys at once
  const navigationTexts = useTranslations([
    "nav.home",
    "nav.about",
    "nav.contact",
  ]);

  // Translate with parameters
  const greeting = t("hello", { name: "John" });

  return (
    <div dir={direction}>
      <h1>{welcomeText}</h1>
      <p>{greeting}</p>
      <nav>
        <a href="/">{navigationTexts["nav.home"]}</a>
        <a href="/about">{navigationTexts["nav.about"]}</a>
        <a href="/contact">{navigationTexts["nav.contact"]}</a>
      </nav>
    </div>
  );
}
```

### React Components

```tsx
import {
  LanguageSwitcher,
  Translation,
  RTLDirection,
  LanguageProvider,
} from "dynamic-language-switcher";

function App() {
  return (
    <LanguageProvider options={{ defaultLanguage: "en" }}>
      <div className="app">
        <header>
          <LanguageSwitcher
            variant="dropdown"
            showFlags={true}
            showNames={true}
            size="lg"
          />
        </header>

        <main>
          <h1>
            <Translation key="welcome" />
          </h1>

          <RTLDirection>
            <p>
              This content automatically adjusts direction for RTL languages
            </p>
          </RTLDirection>
        </main>
      </div>
    </LanguageProvider>
  );
}
```

### Next.js Integration

```tsx
// pages/[lang]/index.tsx
import { GetStaticProps, GetStaticPaths } from "next";
import {
  detectLanguageFromRequest,
  createNextJSLanguageSwitcher,
} from "dynamic-language-switcher";

export default function LocalizedPage({ language, translations }) {
  return (
    <div>
      <h1>{translations.welcome}</h1>
      <p>{translations.description}</p>
    </div>
  );
}

export const getStaticPaths = async () => {
  const languages = ["en", "zh-CN", "zh-TW", "ar"];

  return {
    paths: languages.map((lang) => ({ params: { lang } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const language = detectLanguageFromRequest(context);
  const translations = await loadTranslations(language);

  return {
    props: { language, translations },
  };
};
```

### Next.js Middleware

```typescript
// middleware.ts
import { createLanguageMiddleware } from "dynamic-language-switcher";

export default createLanguageMiddleware("en", ["en", "zh-CN", "zh-TW", "ar"]);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

## Examples

```tsx
import React, { useState, useEffect } from "react";
import { createLanguageSwitcher } from "dynamic-language-switcher";

const languageSwitcher = createLanguageSwitcher({
  defaultLanguage: "en",
  persistLanguage: true,
});

function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState(
    languageSwitcher.currentLanguage
  );

  useEffect(() => {
    languageSwitcher.onLanguageChange = setCurrentLanguage;
  }, []);

  const handleLanguageChange = async (language: string) => {
    await languageSwitcher.setLanguage(language);
  };

  return (
    <div>
      <select
        value={currentLanguage}
        onChange={(e) => handleLanguageChange(e.target.value)}
      >
        {languageSwitcher.availableLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

### Vue.js Component

```vue
<template>
  <div>
    <select v-model="currentLanguage" @change="changeLanguage">
      <option
        v-for="lang in availableLanguages"
        :key="lang.code"
        :value="lang.code"
      >
        {{ lang.flag }} {{ lang.name }}
      </option>
    </select>
  </div>
</template>

<script>
import { createLanguageSwitcher } from "dynamic-language-switcher";

export default {
  data() {
    return {
      languageSwitcher: createLanguageSwitcher({
        defaultLanguage: "en",
        persistLanguage: true,
      }),
      currentLanguage: "en",
    };
  },
  computed: {
    availableLanguages() {
      return this.languageSwitcher.availableLanguages;
    },
  },
  methods: {
    async changeLanguage() {
      await this.languageSwitcher.setLanguage(this.currentLanguage);
    },
  },
  mounted() {
    this.currentLanguage = this.languageSwitcher.currentLanguage;
    this.languageSwitcher.onLanguageChange = (language) => {
      this.currentLanguage = language;
    };
  },
};
</script>
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Node.js Support

- Node.js 14+

## Author

**Sushant R. Dangal** ([@srdarkseer](https://github.com/srdarkseer))

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### 1.0.0

- Initial release
- Core language switching functionality
- Utility functions for language operations
- TypeScript support
- RTL language support
- Parameter interpolation
- Language persistence
