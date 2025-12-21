import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const cases = await getCollection('cases');
  
  const docsPages = [
    { id: 'doc-what-is', title: 'What is contenteditable?', description: 'Introduction to the contenteditable attribute', url: '/docs/what-is-contenteditable' },
    { id: 'doc-events', title: 'Events', description: 'Understanding input, beforeinput, composition events', url: '/docs/events' },
    { id: 'doc-ime', title: 'IME & Composition', description: 'How Input Method Editors work with contenteditable', url: '/docs/ime-composition' },
    { id: 'doc-selection', title: 'Selection API', description: 'Working with text selection and ranges', url: '/docs/selection-api' },
    { id: 'doc-range', title: 'Range API', description: 'Comprehensive guide to the Range API for manipulating document content', url: '/docs/range-api' },
    { id: 'doc-clipboard', title: 'Clipboard API', description: 'Using the Clipboard API and paste events for copy, cut, and paste operations', url: '/docs/clipboard-api' },
    { id: 'doc-mobile-toolbar', title: 'Mobile Selection Toolbar', description: 'Understanding mobile browser selection toolbars and their differences across platforms', url: '/docs/mobile-selection-toolbar' },
    { id: 'doc-execcommand', title: 'execCommand alternatives', description: 'Modern alternatives to the deprecated execCommand API', url: '/docs/execCommand-alternatives' },
    { id: 'doc-patterns', title: 'Practical Patterns', description: 'Common patterns and code examples for implementing rich text editing features', url: '/docs/practical-patterns' },
    { id: 'doc-pitfalls', title: 'Common Pitfalls & Debugging', description: 'Common mistakes, pitfalls, and debugging strategies when working with contenteditable', url: '/docs/common-pitfalls' },
    { id: 'doc-performance', title: 'Performance', description: 'Performance considerations and optimization strategies for contenteditable elements', url: '/docs/performance' },
    { id: 'doc-accessibility', title: 'Accessibility', description: 'Accessibility considerations and best practices for contenteditable elements', url: '/docs/accessibility' },
    { id: 'doc-keyboard-navigation', title: 'Keyboard Navigation', description: 'Comprehensive guide to keyboard navigation in contenteditable elements', url: '/docs/keyboard-navigation' },
    { id: 'doc-contenteditable-false', title: 'contenteditable="false"', description: 'Understanding contenteditable="false" behavior and browser differences', url: '/docs/contenteditable-false' },
    { id: 'doc-html-attributes', title: 'HTML Attributes', description: 'Understanding which HTML attributes work with contenteditable elements, browser differences, and workarounds', url: '/docs/html-attributes' },
    { id: 'doc-shadow-dom', title: 'Shadow DOM & Web Components', description: 'Understanding contenteditable behavior inside Shadow DOM and Web Components, including event bubbling, selection, and focus management', url: '/docs/shadow-dom-web-components' },
    { id: 'doc-drag-drop', title: 'Drag & Drop', description: 'Comprehensive guide to drag-and-drop operations in contenteditable elements, including event handling, file drops, and browser differences', url: '/docs/drag-and-drop' },
    { id: 'doc-focus-blur', title: 'Focus & Blur Events', description: 'Understanding focus and blur events in contenteditable elements, including autofocus limitations and focus management', url: '/docs/focus-blur-events' },
    { id: 'doc-iframe', title: 'iframe Integration', description: 'Understanding contenteditable behavior inside iframes, including event handling, selection management, and cross-origin limitations', url: '/docs/iframe-integration' },
    { id: 'doc-css-styling', title: 'CSS & Styling', description: 'Understanding CSS properties that affect contenteditable elements, including caret styling, selection styling, and focus styles', url: '/docs/css-styling' },
    { id: 'doc-compat', title: 'Browser compatibility', description: 'Overview of contenteditable support across browsers', url: '/docs/browser-compatibility' },
    { id: 'doc-input-types', title: 'Input Types', description: 'Comprehensive guide to inputType values in beforeinput and input events', url: '/docs/input-types' },
  ];

  // Build scenario list
  const scenarioMap = new Map<string, { id: string; title: string; description: string }>();
  for (const c of cases) {
    if (!scenarioMap.has(c.data.scenarioId)) {
      scenarioMap.set(c.data.scenarioId, {
        id: c.data.scenarioId,
        title: c.data.caseTitle,
        description: c.data.description,
      });
    }
  }

  const searchItems = [
    // Cases
    ...cases.map((c) => ({
      id: c.data.id,
      title: c.data.caseTitle,
      description: c.data.description,
      type: 'case' as const,
      url: `/cases/${c.slug}`,
      tags: c.data.tags || [],
      os: c.data.os,
      browser: c.data.browser,
    })),
    // Scenarios
    ...Array.from(scenarioMap.values()).map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      type: 'scenario' as const,
      url: `/scenarios/${s.id}`,
    })),
    // Docs
    ...docsPages.map((d) => ({
      ...d,
      type: 'doc' as const,
    })),
  ];

  return new Response(JSON.stringify(searchItems), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

