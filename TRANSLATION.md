# Translation Guide

This document explains how to contribute translations to the contenteditable.lab project.

## Project Structure

```
src/
├── i18n/
│   └── translations.ts    # UI translations and locale config
├── content/
│   └── cases/             # Case content (English)
├── pages/
│   ├── index.astro        # English pages
│   ├── cases/
│   ├── scenarios/
│   └── [locale]/          # Localized pages (auto-generated)
│       ├── index.astro
│       ├── cases/
│       └── scenarios/
└── components/
    └── TranslationNotice.astro  # Translation request banner
```

## Supported Languages

| Code | Language | Status |
|------|----------|--------|
| `en` | English | Default (complete) |
| `ko` | 한국어 | UI complete, cases pending |
| `ja` | 日本語 | UI complete, cases pending |
| `zh` | 中文 | UI complete, cases pending |
| `es` | Español | UI complete, cases pending |
| `de` | Deutsch | UI complete, cases pending |
| `fr` | Français | UI complete, cases pending |

## How to Contribute

### 1. Translate UI Strings

UI strings are located in `src/i18n/translations.ts`. Each language has its own section:

```typescript
export const translations = {
  en: {
    nav: {
      docs: 'Docs',
      cases: 'Cases',
      // ...
    },
    // ...
  },
  ko: {
    nav: {
      docs: '문서',
      cases: '케이스',
      // ...
    },
    // ...
  },
  // Add your language here
};
```

To add or improve translations:

1. Find the language section in `translations.ts`
2. Update the string values
3. Make sure all keys from the English section are present

### 2. Translate Case Content

Case files are Markdown documents in `src/content/cases/`. Currently, all cases are in English.

To translate a case:

1. Fork the repository
2. Create a new issue with the label `translation`
3. Choose a case to translate (e.g., `ce-0001-example.md`)
4. Translate the following sections:
   - `caseTitle` in frontmatter
   - `description` in frontmatter
   - Markdown content (Phenomenon, Expected behavior, etc.)

**Important**: Keep the following in English:
- `id` (e.g., `ce-0001`)
- `scenarioId` (e.g., `scenario-baseline`)
- Technical terms when appropriate
- Code examples

### 3. Add a New Language

To add a completely new language:

#### Step 1: Add locale configuration

In `src/i18n/translations.ts`, add to the `locales` object:

```typescript
export const locales = {
  // ... existing locales
  pt: {
    code: 'pt',
    name: 'Português',
    shortName: 'PT',
    flag: '🇧🇷',
    dir: 'ltr',  // or 'rtl' for right-to-left languages
    isDefault: false,
  },
};
```

#### Step 2: Add translations

Add a new section in the `translations` object with all required keys:

```typescript
export const translations = {
  // ... existing translations
  pt: {
    nav: {
      docs: 'Documentação',
      cases: 'Casos',
      scenarios: 'Cenários',
      playground: 'Playground',
    },
    hero: {
      badge: 'Pesquisa de contenteditable',
      title: 'contenteditable.lab',
      description: '...',
      browseCases: 'Ver todos os casos',
      openPlayground: 'Abrir playground',
    },
    // ... copy all keys from 'en' and translate
  },
};
```

#### Step 3: Add translation notice

In `src/components/TranslationNotice.astro`, add the notice messages:

```typescript
const notices = {
  // ... existing notices
  pt: {
    title: 'Esta página ainda não foi traduzida',
    message: 'O conteúdo original em inglês está sendo exibido.',
    contribute: 'Contribuir com a tradução',
    viewOriginal: 'Ver original em inglês',
  },
};
```

#### Step 4: Build and test

```bash
pnpm build
pnpm dev
```

Visit `http://localhost:4323/pt/` to verify your new language.

## Translation Guidelines

### Terminology

Keep these terms consistent across all languages:

| English | Description |
|---------|-------------|
| contenteditable | HTML attribute, do not translate |
| case | A documented incident/behavior |
| scenario | A group of related cases |
| playground | Interactive testing area |
| IME | Input Method Editor |
| composition | IME composition state |

### Style

1. **Be concise**: Keep translations similar in length to English
2. **Be consistent**: Use the same terms throughout
3. **Be natural**: Use natural phrasing for your language
4. **Be technical**: Maintain technical accuracy

### RTL Languages

For right-to-left languages (Arabic, Hebrew, etc.):

1. Set `dir: 'rtl'` in the locale configuration
2. The site layout will automatically adjust
3. Test thoroughly for layout issues

## Quality Checklist

Before submitting a translation PR:

- [ ] All UI strings are translated
- [ ] No English text remains in translated sections
- [ ] Technical terms are used correctly
- [ ] Build succeeds without errors
- [ ] Pages display correctly in browser
- [ ] Links work correctly
- [ ] No broken layouts

## Getting Help

- Open an issue with the `translation` label
- Join the discussion in existing translation issues
- Tag `@maintainers` for review

## Credits

We appreciate all translation contributions! Contributors will be credited in the project README.

---

Thank you for helping make contenteditable.lab accessible to more developers worldwide! 🌍

