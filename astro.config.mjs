// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://contenteditable.realerror.com',
  base: '/',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false, // We'll use our own base styles
    }),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          ko: 'ko',
          ja: 'ja',
          zh: 'zh',
          es: 'es',
          de: 'de',
          fr: 'fr',
        },
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});