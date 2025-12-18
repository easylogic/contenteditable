import presetsMetadata from './presets.json';

// Load all HTML files using Vite's import.meta.glob
const htmlModules = import.meta.glob('./*.html', { query: '?raw', import: 'default', eager: true });

export type EditorPreset = {
  id: string;
  labels: {
    en: string;
    ko: string;
  };
  html: string;
};

// Combine metadata with HTML content
export const EDITOR_PRESETS: EditorPreset[] = presetsMetadata.map((meta) => {
  const htmlPath = `./${meta.id}.html`;
  const html = htmlModules[htmlPath] as string | undefined;
  
  if (!html) {
    console.warn(`HTML file not found for preset: ${meta.id}`);
    return {
      ...meta,
      html: '',
    };
  }
  
  return {
    ...meta,
    html: html.trim(),
  };
});

