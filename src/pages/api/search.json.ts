import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const cases = await getCollection('cases');
  
  const docsPages = [
    { id: 'doc-what-is', title: 'What is contenteditable?', description: 'Introduction to the contenteditable attribute', url: '/docs/what-is-contenteditable' },
    { id: 'doc-events', title: 'Events', description: 'Understanding input, beforeinput, composition events', url: '/docs/events' },
    { id: 'doc-ime', title: 'IME & Composition', description: 'How Input Method Editors work with contenteditable', url: '/docs/ime-composition' },
    { id: 'doc-selection', title: 'Selection API', description: 'Working with text selection and ranges', url: '/docs/selection-api' },
    { id: 'doc-execcommand', title: 'execCommand alternatives', description: 'Modern alternatives to the deprecated execCommand API', url: '/docs/execCommand-alternatives' },
    { id: 'doc-compat', title: 'Browser compatibility', description: 'Overview of contenteditable support across browsers', url: '/docs/browser-compatibility' },
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

