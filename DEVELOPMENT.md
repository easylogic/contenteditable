# Development Guide

This document covers local development setup and deployment.

## Prerequisites

- Node.js 18+
- pnpm

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The dev server runs at `http://localhost:4321`.

## Commands

| Command            | Action                                        |
| :----------------- | :-------------------------------------------- |
| `pnpm dev`         | Starts local dev server at `localhost:4321`   |
| `pnpm build`       | Builds the production site to `./dist/`       |
| `pnpm preview`     | Previews your build locally before deploying  |
| `pnpm astro ...`   | Runs Astro CLI commands                       |

## Project Structure

```
src/
├── components/       # Astro & React components
├── content/
│   └── cases/        # Case markdown files
├── i18n/
│   └── translations.ts   # UI translations
├── pages/
│   ├── api/          # API endpoints
│   ├── cases/        # Case pages
│   ├── docs/         # Documentation pages
│   ├── scenarios/    # Scenario pages
│   └── [locale]/     # Localized routes
├── scripts/          # Build scripts
└── styles/
    └── global.css    # Global styles with CSS variables
```

## Content Management

### Adding a New Case

1. Create a new markdown file in `src/content/cases/`:

```markdown
---
id: 'ce-XXXX-slug-here'
os: 'Windows'
osVersion: '11'
device: 'Desktop'
browser: 'Chrome'
browserVersion: '120+'
keyboard: 'Korean (IME)'
caseTitle: 'Title of the case'
description: 'Brief description'
reproductionSteps:
  - 'Step 1'
  - 'Step 2'
initialHtml: '<p>Initial HTML for playground</p>'
scenarioId: 'scenario-name'
locale: 'en'
tags:
  - 'ime'
  - 'composition'
status: 'draft'
---

## Expected behavior

What should happen.

## Actual behavior

What actually happens.

## Analysis

Technical explanation if known.
```

2. The case will automatically appear in the cases list after build.

### Adding UI Translations

Edit `src/i18n/translations.ts` to add or update translations.

## Theming

The site uses CSS variables for theming. Variables are defined in `src/styles/global.css`:

- Light mode: Default `:root` variables
- Dark mode: `[data-theme="dark"]` selector

Key variables:
- `--bg-page`, `--bg-surface`, `--bg-muted` — Background colors
- `--text-primary`, `--text-secondary`, `--text-muted` — Text colors
- `--accent-primary`, `--accent-secondary` — Accent colors
- `--border-light`, `--border-medium` — Border colors

## Deployment

### GitHub Pages

The project is configured for GitHub Pages with GitHub Actions:

1. Push to `main` branch
2. GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys automatically
3. Site is available at the configured GitHub Pages URL

### Custom Domain

1. Add a `CNAME` record at your DNS provider pointing to your GitHub Pages host
2. Set the custom domain in GitHub repository Settings → Pages
3. The `public/CNAME` file configures the domain automatically

## Internationalization

### Supported Locales

- `en` (English) — Default
- `ko` (Korean)
- `ja` (Japanese)
- `zh` (Chinese)
- `es` (Spanish)
- `de` (German)
- `fr` (French)

### Adding a New Language

1. Add locale config to `src/i18n/translations.ts`:

```typescript
export const locales = {
  // ... existing locales
  pt: { code: 'pt', name: 'Português', shortName: 'PT', flag: '🇧🇷', dir: 'ltr' },
};
```

2. Add translation strings for the new locale in the `translations` object.

3. Pages at `/{locale}/...` will automatically use the new translations.

See [TRANSLATION.md](./TRANSLATION.md) for detailed instructions.

