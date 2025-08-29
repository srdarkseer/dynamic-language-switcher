# Dynamic Language Switcher

[![npm version](https://badge.fury.io/js/dynamic-language-switcher.svg)](https://badge.fury.io/js/dynamic-language-switcher)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)

A lightweight, flexible, and production-ready package for dynamic language switching in JavaScript/TypeScript applications with full React & Next.js support, comprehensive RTL language support, and Chinese language variants.

## ✨ Features

- 🌍 **Multi-language Support**: English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Arabic, Hebrew, Persian, Urdu, and more
- 🇨🇳 **Chinese Language Support**: Both Simplified (zh-CN) and Traditional (zh-TW) Chinese
- 🔄 **RTL Support**: Full Right-to-Left language support for Arabic, Hebrew, Persian, Urdu, and more
- ⚛️ **React Integration**: Hooks, components, and context providers for seamless React integration
- 🚀 **Next.js Support**: Server-side rendering, static generation, and middleware integration
- 🎯 **TypeScript**: Full TypeScript support with comprehensive type definitions
- 💾 **Persistence**: Language preference persistence with localStorage
- 🔧 **Flexible**: Easy to integrate with any JavaScript/TypeScript project
- 📱 **Responsive**: Mobile-friendly components and utilities
- 🧪 **Tested**: Comprehensive test coverage with Jest

## 🚀 Quick Start

### Installation

```bash
npm install dynamic-language-switcher
# or
yarn add dynamic-language-switcher
```

### Basic Usage

```typescript
import { LanguageSwitcher } from "dynamic-language-switcher";

// Initialize
const languageSwitcher = new LanguageSwitcher({
  defaultLanguage: "en",
  fallbackLanguage: "en",
  persistLanguage: true,
});

// Add languages
languageSwitcher.addLanguage("en", {
  code: "en",
  name: "English",
  flag: "🇺🇸",
});

languageSwitcher.addLanguage("zh-CN", {
  code: "zh-CN",
  name: "简体中文",
  flag: "🇨🇳",
});

// Add translations
languageSwitcher.addTranslations("en", {
  welcome: "Welcome",
  hello: "Hello, {name}!",
});

languageSwitcher.addTranslations("zh-CN", {
  welcome: "欢迎",
  hello: "你好，{name}！",
});

// Switch language
await languageSwitcher.setLanguage("zh-CN");

// Get translated text
const text = languageSwitcher.getText("hello", { name: "World" });
// Output: 你好，World！
```

## 📚 Documentation

### Core API

#### LanguageSwitcher Class

The main class for managing languages and translations.

```typescript
const languageSwitcher = new LanguageSwitcher(options);
```

**Options:**

- `defaultLanguage`: Initial language (default: 'en')
- `fallbackLanguage`: Fallback language for missing translations (default: 'en')
- `persistLanguage`: Whether to persist language choice (default: false)
- `storageKey`: Key for localStorage persistence (default: 'language')
- `debug`: Enable debug logging (default: false)

#### Methods

- `addLanguage(code, config)`: Add a new language
- `addTranslations(language, translations)`: Add translations for a language
- `setLanguage(language)`: Switch to a language
- `getText(key, params)`: Get translated text with parameter interpolation
- `isRTL()`: Check if current language is RTL
- `getDocumentDirection()`: Get current document direction

### React Integration

#### Hooks

```typescript
import { useLanguage, useTranslation } from "dynamic-language-switcher";

function MyComponent() {
  const { currentLanguage, switchLanguage, t, isRTL } = useLanguage();

  return (
    <div>
      <h1>{t("welcome")}</h1>
      <button onClick={() => switchLanguage("zh-CN")}>Switch to Chinese</button>
    </div>
  );
}
```

#### Components

```typescript
import {
  LanguageSwitcher,
  Translation,
  RTLDirection,
} from "dynamic-language-switcher";

function App() {
  return (
    <RTLDirection>
      <header>
        <h1>
          <Translation key="app.title" />
        </h1>
        <LanguageSwitcher variant="dropdown" />
      </header>
    </RTLDirection>
  );
}
```

### Next.js Integration

#### Server-side Rendering

```typescript
import { GetServerSideProps } from "next";
import { detectLanguageFromRequest } from "dynamic-language-switcher";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const language = detectLanguageFromRequest(context);

  return {
    props: {
      language,
      // ... other props
    },
  };
};
```

#### Static Generation

```typescript
import { GetStaticProps } from "next";
import { createLocalizedPage } from "dynamic-language-switcher";

export const getStaticProps = createLocalizedPage(
  async (context) => {
    // Your existing getStaticProps logic
    return {
      props: {
        /* ... */
      },
    };
  },
  ["en", "es", "zh-CN", "ar"]
);
```

## 🏗️ Project Structure

```
src/
├── core/                 # Core language switcher logic
│   └── language-switcher.ts
├── types/               # TypeScript type definitions
│   └── types.ts
├── utils/               # Utility functions
│   └── utils.ts
├── hooks/               # React hooks and components
│   ├── useLanguage.ts
│   └── components.tsx
├── adapters/            # Framework adapters (Next.js, etc.)
│   └── index.ts
└── index.ts             # Main entry point

examples/
├── vanilla/             # Vanilla JavaScript/TypeScript examples
├── react/               # React integration examples
└── nextjs/              # Next.js integration examples

tests/                   # Test files
dist/                    # Build output
```

## 🌍 Supported Languages

### Western Languages

- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)

### Asian Languages

- Japanese (ja)
- Korean (ko)
- **Simplified Chinese (zh-CN)**
- **Traditional Chinese (zh-TW)**

### RTL Languages

- **Arabic (ar)**
- **Hebrew (he)**
- **Persian (fa)**
- **Urdu (ur)**
- **Pashto (ps)**
- **Sindhi (sd)**
- **Yiddish (yi)**
- **Kurdish (ku)**
- **Azerbaijani (az)**
- **Divehi (dv)**
- **Kashmiri (ks)**
- **Punjabi (pa)**
- **Tajik (tg)**
- **Uzbek (uz)**

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Run linting
npm run lint

# Run type checking
npm run type-check

# Clean build artifacts
npm run clean
```

## 📦 Publishing

```bash
# Login to npm
npm login

# Publish the package
npm publish
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sushant R. Dangal** - [GitHub](https://github.com/srdarkseer)

## 🙏 Acknowledgments

- Inspired by modern i18n solutions like Weglot
- Built with TypeScript for type safety
- Comprehensive RTL language support
- React and Next.js ecosystem integration

---

**Made with ❤️ for the global developer community**
