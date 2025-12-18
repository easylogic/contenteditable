/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        accent: {
          primary: 'var(--accent-primary)',
          'primary-hover': 'var(--accent-primary-hover)',
          'primary-light': 'var(--accent-primary-light)',
          secondary: 'var(--accent-secondary)',
          'secondary-hover': 'var(--accent-secondary-hover)',
          'secondary-light': 'var(--accent-secondary-light)',
        },
        status: {
          confirmed: 'var(--status-confirmed)',
          'confirmed-light': 'var(--status-confirmed-light)',
          draft: 'var(--status-draft)',
          'draft-light': 'var(--status-draft-light)',
          current: 'var(--status-current)',
        },
        bg: {
          page: 'var(--bg-page)',
          surface: 'var(--bg-surface)',
          muted: 'var(--bg-muted)',
          nav: 'var(--bg-nav)',
        },
        border: {
          light: 'var(--border-light)',
          medium: 'var(--border-medium)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-faint)',
        },
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      spacing: {
        'nav-height': 'var(--nav-height)',
        'sidebar-width': 'var(--sidebar-width)',
        'content-max-width': 'var(--content-max-width)',
      },
      transitionDuration: {
        fast: 'var(--transition-fast)',
        normal: 'var(--transition-normal)',
      },
    },
  },
  plugins: [],
}

