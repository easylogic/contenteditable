import { defineCollection, z } from 'astro:content';

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
    tags: z.array(z.string()).default([]),
    status: z.enum(['draft', 'confirmed']).default('draft'),
  }),
});

export const collections = {
  cases,
};


