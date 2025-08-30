# Dynamic Language Switcher

[![npm version](https://img.shields.io/npm/v/dynamic-language-switcher.svg)](https://www.npmjs.com/package/dynamic-language-switcher)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)](https://www.typescriptlang.org/)

A **Weglot-like** automatic translation package for JavaScript/TypeScript applications that **automatically detects and translates content without requiring manual JSON configuration**. Perfect for dynamic websites, SPAs, and applications where content changes frequently.

**📦 Available on npm:** [dynamic-language-switcher](https://www.npmjs.com/package/dynamic-language-switcher)

## 🚀 Quick Installation

```bash
npm install dynamic-language-switcher
```

## ✨ Features

- 🌍 **Automatic Content Detection**: Automatically scans the DOM for translatable content
- 🔄 **No Manual Configuration**: Works like Weglot - no JSON files or manual setup required
- 🚀 **Real-time Translation**: Translates content on-demand when switching languages
- 📱 **Dynamic Content Monitoring**: Automatically detects new content added to the page
- 🌐 **Translation API Integration**: Supports DeepL, Google Cloud Translation (coming soon), and custom APIs
- 🇨🇳 **Multi-language Support**: 20+ languages including English, Spanish, French, German, Italian, Portuguese, Russian, Japanese, Korean, Arabic, Hebrew, Persian, Urdu, Hindi, Bengali, Thai, Vietnamese, Turkish, Dutch, and more
- 🇳🇵 **Nepali Language Support**: Full Nepali language support with Devanagari script
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
```

### Basic Usage (Weglot-like)

```typescript
import { LanguageSwitcher } from "dynamic-language-switcher";

// Initialize with automatic translation
const languageSwitcher = new LanguageSwitcher({
  defaultLanguage: "en",
  autoTranslate: true,
  translationApi: {
    provider: "deepl",
    apiKey: "your-deepl-api-key",
  },
});

// Start automatic content detection and translation
languageSwitcher.startAutoTranslation();

// Switch language - content is automatically translated!
await languageSwitcher.setLanguage("es");
```

### Advanced Configuration

```typescript
const languageSwitcher = new LanguageSwitcher({
  defaultLanguage: "en",
  autoTranslate: true,
  preserveOriginalText: true, // Keep original text for restoration
  contentSelectors: ["h1", "h2", "h3", "p", "span", "div", "a", "button"],
  excludeSelectors: [
    "script",
    "style",
    "code",
    "pre",
    "[data-no-translate]",
    ".no-translate",
  ],
  translationApi: {
    provider: "deepl",
    apiKey: "your-deepl-api-key",
    batchSize: 50,
    rateLimit: 100,
  },
});
```

## 🔧 How It Works

### 1. **Automatic Content Detection**

The system automatically scans your page for translatable content using intelligent selectors:

```typescript
// Automatically detects content in:
// - Headings (h1, h2, h3, etc.)
// - Paragraphs and text elements
// - Buttons and links
// - Form placeholders
// - Meta descriptions
// - And more...
```

### 2. **Dynamic Content Monitoring**

Watches for new content being added to the page:

```typescript
// Content added dynamically is automatically detected
document.body.innerHTML += "<p>New content that will be translated!</p>";

// Content updates are also detected
element.textContent = "Updated content";
```

### 3. **Automatic Translation**

Translates content when switching languages:

```typescript
// Switch to Spanish - all detected content is automatically translated
await languageSwitcher.setLanguage("es");

// Switch to Chinese - content is translated again
await languageSwitcher.setLanguage("zh-CN");
```

### 4. **No Manual Setup Required**

Unlike traditional i18n libraries, you don't need to:

- ❌ Define translation JSON files
- ❌ Manually mark translatable text
- ❌ Configure translation keys
- ❌ Update translation files when content changes

## 🌐 Translation API Support

### DeepL (Recommended)

```typescript
translationApi: {
  provider: "deepl",
  apiKey: "your-deepl-api-key"
}
```

### Google Cloud Translation API (Coming Soon)

```typescript
translationApi: {
  provider: "google-cloud",
  apiKey: "your-google-cloud-api-key"
}
```

_Note: This will be implemented in a future update_

### Custom API

```typescript
translationApi: {
  provider: "custom",
  endpoint: "https://your-translation-api.com/translate"
}
```

## 📚 API Reference

### Core Methods

#### `startAutoTranslation()`

Start automatic content detection and translation.

#### `stopAutoTranslation()`

Stop automatic translation.

#### `translatePage(targetLanguage?)`

Translate the entire page to the specified language.

#### `translateElement(element, targetLanguage?)`

Translate a specific element.

#### `restoreOriginalText()`

Restore all translated content to the original text.

#### `getDetectedContent()`

Get all detected translatable content.

### Content Detection Options

```typescript
{
  contentSelectors: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "span", "div", "a", "button", "label",
    "input[placeholder]", "textarea[placeholder]"
  ],
  excludeSelectors: [
    "script", "style", "code", "pre",
    "[data-no-translate]", ".no-translate",
  ]
}
```

### Excluding Content from Translation

```html
<!-- Exclude specific elements -->
<div data-no-translate>This won't be translated</div>
<div class="no-translate">This also won't be translated</div>

<!-- Exclude entire sections -->
<section data-no-translate>
  <h2>Technical Documentation</h2>
  <p>This entire section is excluded</p>
</section>
```

## ⚛️ React Integration

### Hooks

```typescript
import { useLanguage } from "dynamic-language-switcher";

function MyComponent() {
  const { currentLanguage, switchLanguage, isTranslating } = useLanguage();

  return (
    <div>
      <h1>Welcome to our app</h1>
      <button onClick={() => switchLanguage("es")}>Switch to Spanish</button>
      {isTranslating && <p>Translating...</p>}
    </div>
  );
}
```

### Components

```typescript
import { LanguageSwitcher, RTLDirection } from "dynamic-language-switcher";

function App() {
  return (
    <RTLDirection>
      <header>
        <h1>My App</h1>
        <LanguageSwitcher variant="dropdown" />
      </header>
      <main>
        <p>This content will be automatically translated</p>
      </main>
    </RTLDirection>
  );
}
```

## 🚀 Next.js Integration

### Server-side Rendering

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

### Static Generation

```typescript
import { GetStaticProps } from "next";
import { createLocalizedPage } from "dynamic-language-switcher";

export const getStaticProps = createLocalizedPage(
  async (context) => {
    return {
      props: {
        /* ... */
      },
    };
  },
  ["en", "es", "zh-CN", "np", "ar"]
);
```

## 🌍 Supported Languages

### Western Languages

- English (en), Spanish (es), French (fr), German (de)
- Italian (it), Portuguese (pt), Russian (ru), Dutch (nl)

### Asian Languages

- Japanese (ja), Korean (ko), Chinese (zh-CN/zh-TW)
- Nepali (np), Hindi (hi), Bengali (bn), Thai (th)
- Vietnamese (vi), Turkish (tr)

### RTL Languages

- Arabic (ar), Hebrew (he), Persian (fa), Urdu (ur)
- And many more...

## 🏗️ Project Structure

```
src/
├── core/                 # Core language switcher logic
│   └── language-switcher.ts
├── types/               # TypeScript type definitions
│   └── types.ts
├── utils/               # Utility functions
│   ├── utils.ts
│   ├── content-detector.ts    # Automatic content detection
│   ├── translation-service.ts # Translation API integration
│   └── env-loader.ts          # Environment configuration
├── hooks/               # React hooks
│   └── useLanguage.ts
├── components/          # React components
│   └── components.tsx
├── adapters/            # Framework adapters (Next.js, etc.)
│   └── index.ts
└── index.ts             # Main entry point
```

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sushant R. Dangal** - [GitHub](https://github.com/srdarkseer)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
