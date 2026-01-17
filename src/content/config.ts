import { defineCollection, z } from 'astro:content';

// Schema for DOM change animation steps
const domStepSchema = z.object({
  label: z.string(),
  html: z.string(),
  description: z.string().optional(),
});

const cases = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    scenarioId: z.string(),
    locale: z.string().default('en'),
    os: z.string(),
    osVersion: z.string().optional(),
    device: z.string(),
    deviceVersion: z.string().optional(),
    browser: z.string(),
    browserVersion: z.string().optional(),
    keyboard: z.string(),
    caseTitle: z.string(),
    description: z.string().optional(), // Case-specific description
    tags: z.array(z.string()).default([]),
    status: z.enum(['draft', 'confirmed']).default('draft'),
    // Initial HTML for playground (optional)
    initialHtml: z.string().optional(),
    // DOM change animation steps
    domSteps: z.array(domStepSchema).optional(),
  }),
});

const scenarios = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(), // scenarioId (e.g., "scenario-ime-enter-breaks")
    title: z.string(), // Human-readable title
    description: z.string().optional(), // Detailed description of the phenomenon
    category: z.string().optional(), // Category (ime, formatting, paste, etc.)
    tags: z.array(z.string()).default([]), // Additional tags
    status: z.enum(['draft', 'confirmed']).default('draft'),
    locale: z.string().default('en'), // Locale for the scenario content
  }),
});

const tips = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(), // tip ID (e.g., "tip-001-caret-preservation-react")
    title: z.string(), // Human-readable title
    description: z.string().optional(), // Brief description
    category: z.string().optional(), // Category (framework, browser-feature, performance, etc.)
    tags: z.array(z.string()).default([]), // Additional tags
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    relatedScenarios: z.array(z.string()).default([]), // Related scenario IDs
    relatedCases: z.array(z.string()).default([]), // Related case IDs
    locale: z.string().default('en'), // Locale for the tip content
  }),
});

export const collections = {
  cases,
  scenarios,
  tips,
};


