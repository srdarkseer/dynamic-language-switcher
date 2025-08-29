# Dynamic Language Switcher Examples

This directory contains comprehensive examples demonstrating how to use the Dynamic Language Switcher package with different frameworks and styling approaches.

## 🎨 **Tailwind CSS Integration**

All examples now use **Tailwind CSS** for modern, responsive styling with:

- **shadcn/ui Design System**: Professional color schemes and components
- **Dark Mode Support**: Automatic dark/light theme switching
- **Responsive Design**: Mobile-first responsive layouts
- **Modern UI Patterns**: Cards, gradients, shadows, and animations

## 📁 **Example Structure**

### **Vanilla JavaScript/TypeScript** (`/vanilla`)

- **File**: `basic-usage.ts`
- **Description**: Core functionality without framework dependencies
- **Features**: Language switching, translations, RTL support
- **Use Case**: Node.js applications, vanilla web projects

### **React Integration** (`/react`)

- **File**: `app.tsx`
- **Description**: Full React application with hooks and components
- **Features**:
  - `useLanguage` hook for state management
  - `LanguageSwitcher` component with multiple variants
  - `Translation` component for automatic text updates
  - `RTLDirection` component for RTL layout support
- **Use Case**: React applications, single-page applications

### **Next.js Integration** (`/nextjs`)

- **File**: `page.tsx`
- **Description**: Next.js page with server-side rendering
- **Features**:
  - `getStaticProps` for static generation
  - `getServerSideProps` for server-side rendering
  - `getStaticPaths` for dynamic routes
  - Language detection from request context
- **Use Case**: Next.js applications, static sites, SSR applications

## 🚀 **Quick Start with Tailwind CSS**

### **1. Install Dependencies**

```bash
npm install dynamic-language-switcher
npm install -D tailwindcss @tailwindcss/typography
```

### **2. Configure Tailwind CSS**

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./examples/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // shadcn/ui color system
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... more colors
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
```

### **3. Import CSS**

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    /* ... more CSS variables */
  }
}
```

## 🎯 **Component Variants**

### **Language Switcher Component**

```tsx
import { LanguageSwitcher } from 'dynamic-language-switcher';

// Select variant
<LanguageSwitcher variant="select" size="lg" />

// Dropdown variant
<LanguageSwitcher variant="dropdown" showFlags={true} />

// Buttons variant
<LanguageSwitcher variant="buttons" showNames={true} />
```

### **Translation Component**

```tsx
import { Translation } from 'dynamic-language-switcher';

// Simple translation
<Translation key="welcome.message" />

// With parameters
<Translation key="hello.user" params={{ name: 'John' }} />

// With fallback
<Translation key="missing.key" fallback="Default text" />
```

### **RTL Direction Component**

```tsx
import { RTLDirection } from "dynamic-language-switcher";

<RTLDirection>
  <div>Your content here</div>
</RTLDirection>;
```

## 🌍 **Language Support**

### **Western Languages**

- English (en) 🇺🇸
- Spanish (es) 🇪🇸
- French (fr) 🇫🇷
- German (de) 🇩🇪
- Italian (it) 🇮🇹
- Portuguese (pt) 🇵🇹

### **Asian Languages**

- Japanese (ja) 🇯🇵
- Korean (ko) 🇰🇷
- **Simplified Chinese (zh-CN)** 🇨🇳
- **Traditional Chinese (zh-TW)** 🇹🇼

### **RTL Languages**

- **Arabic (ar)** 🇸🇦
- **Hebrew (he)** 🇮🇱
- **Persian (fa)** 🇮🇷
- **Urdu (ur)** 🇵🇰
- And many more...

## 🎨 **Styling Features**

### **Modern Design System**

- **Cards**: Rounded corners, shadows, borders
- **Gradients**: Beautiful background gradients
- **Responsive**: Mobile-first responsive design
- **Dark Mode**: Automatic theme switching
- **Animations**: Smooth transitions and hover effects

### **Color Palette**

- **Primary**: Blue tones for main actions
- **Secondary**: Gray tones for secondary elements
- **Accent**: Purple/orange for highlights
- **Semantic**: Success, warning, error colors

### **Typography**

- **Headings**: Clear hierarchy with proper sizing
- **Body Text**: Readable font sizes and line heights
- **Interactive**: Hover states and focus indicators

## 🔧 **Customization**

### **Custom Colors**

```css
@layer base {
  :root {
    --primary: 220 14% 96%;
    --primary-foreground: 220 9% 46%;
  }
}
```

### **Custom Components**

```css
@layer components {
  .custom-language-button {
    @apply px-4 py-2 bg-blue-500 text-white rounded-lg;
  }
}
```

### **Responsive Breakpoints**

- **sm**: 640px and up
- **md**: 768px and up
- **lg**: 1024px and up
- **xl**: 1280px and up

## 📱 **Mobile-First Approach**

All examples are built with a mobile-first approach:

- **Touch-friendly**: Proper button sizes and spacing
- **Responsive grids**: Adapt to different screen sizes
- **Mobile navigation**: Optimized for small screens
- **Performance**: Optimized for mobile devices

## 🌙 **Dark Mode Support**

Automatic dark mode with CSS variables:

- **Light Theme**: Clean, bright interface
- **Dark Theme**: Easy on the eyes
- **System Preference**: Follows user's system setting
- **Toggle Support**: Easy to implement theme switching

## 🚀 **Performance Features**

- **CSS-in-JS**: No external CSS files needed
- **Tree Shaking**: Only used styles are included
- **Minification**: Optimized for production
- **Caching**: Efficient browser caching

## 📚 **Additional Resources**

- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com/
- **Package Documentation**: See main README.md
- **TypeScript Support**: Full type definitions included

---

**Built with ❤️ using Tailwind CSS and modern web technologies**
