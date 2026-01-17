#!/usr/bin/env node

/**
 * Script to continuously collect contenteditable scenarios from the internet
 * 
 * This script searches for contenteditable-related issues, bugs, and scenarios
 * from various sources and generates case files.
 * 
 * Usage:
 *   node scripts/collect-scenarios.js
 * 
 * Or run continuously:
 *   node scripts/collect-scenarios.js --watch
 * 
 * Configuration:
 *   Set environment variables:
 *   - GITHUB_TOKEN: GitHub personal access token (optional, for higher rate limits)
 *   - STACKOVERFLOW_KEY: Stack Overflow API key (optional)
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const casesDir = join(rootDir, 'src/content/cases');

// Search terms for contenteditable scenarios
const SEARCH_TERMS = [
  'contenteditable bug',
  'contenteditable issue',
  'contenteditable problem',
  'contenteditable IME',
  'contenteditable composition',
  'contenteditable paste',
  'contenteditable selection',
  'contenteditable focus',
  'contenteditable mobile',
  'contenteditable iOS',
  'contenteditable Android',
  'contenteditable Firefox',
  'contenteditable Chrome',
  'contenteditable Safari',
  'contenteditable Edge',
  'contenteditable drag drop',
  'contenteditable undo redo',
  'contenteditable table',
  'contenteditable RTL',
  'contenteditable beforeinput',
  'contenteditable execCommand',
];

// Sources to search
const SOURCES = [
  {
    name: 'GitHub Issues',
    url: 'https://api.github.com/search/issues',
    query: (term) => `q=${encodeURIComponent(`${term} is:issue`)}`,
  },
  {
    name: 'Stack Overflow',
    url: 'https://api.stackexchange.com/2.3/search',
    query: (term) => `order=desc&sort=activity&intitle=${encodeURIComponent(term)}&site=stackoverflow`,
  },
];

/**
 * Get the next case ID
 */
function getNextCaseId() {
  const files = readdirSync(casesDir);
  const caseIds = files
    .filter(f => f.match(/^ce-\d{4}-/))
    .map(f => {
      const match = f.match(/^ce-(\d{4})-/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(id => id > 0);
  
  const maxId = caseIds.length > 0 ? Math.max(...caseIds) : 298;
  return String(maxId + 1).padStart(4, '0');
}

/**
 * Generate case file content
 */
function generateCaseFile(caseData) {
  const {
    id,
    scenarioId,
    locale = 'en',
    os,
    osVersion,
    device,
    deviceVersion,
    browser,
    browserVersion,
    keyboard,
    caseTitle,
    description,
    tags = [],
    status = 'draft',
    initialHtml,
    domSteps = [],
  } = caseData;

  const frontmatter = {
    id: `ce-${id}`,
    scenarioId,
    locale,
    os,
    ...(osVersion && { osVersion }),
    device,
    ...(deviceVersion && { deviceVersion }),
    browser,
    ...(browserVersion && { browserVersion }),
    keyboard,
    caseTitle,
    ...(description && { description }),
    tags,
    status,
    ...(initialHtml && { initialHtml }),
    ...(domSteps.length > 0 && { domSteps }),
  };

  const frontmatterYaml = Object.entries(frontmatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.map(v => `  - ${v}`).join('\n')}`;
      }
      if (typeof value === 'string' && (value.includes('\n') || value.includes('|'))) {
        return `${key}: |\n${value.split('\n').map(line => `  ${line}`).join('\n')}`;
      }
      if (typeof value === 'object' && value !== null) {
        return `${key}:\n${JSON.stringify(value, null, 2).split('\n').map(line => `  ${line}`).join('\n')}`;
      }
      return `${key}: ${typeof value === 'string' ? `"${value}"` : value}`;
    })
    .join('\n');

  return `---
${frontmatterYaml}
---

## Phenomenon

${caseData.phenomenon || description || 'Describe the observed behavior...'}

## Reproduction example

${caseData.reproductionSteps || '1. Step one\n2. Step two\n3. Step three'}

## Observed behavior

${caseData.observedBehavior || 'What actually happens...'}

## Expected behavior

${caseData.expectedBehavior || 'What should happen...'}

## Impact

${caseData.impact || 'Describe the impact...'}

## Browser Comparison

${caseData.browserComparison || 'Compare behavior across browsers...'}

## Notes and possible direction for workarounds

${caseData.workarounds || 'Possible solutions or workarounds...'}

${caseData.codeExample ? `## Code example\n\n\`\`\`javascript\n${caseData.codeExample}\n\`\`\`` : ''}
`;
}

/**
 * Make HTTP request
 */
function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        req.setHeader(key, value);
      });
    }
    req.end();
  });
}

/**
 * Search GitHub issues
 */
async function searchGitHub(term) {
  const token = process.env.GITHUB_TOKEN;
  const query = encodeURIComponent(`${term} is:issue`);
  const url = `https://api.github.com/search/issues?q=${query}&per_page=10&sort=updated`;
  
  const headers = {
    'User-Agent': 'contenteditable-lab-collector',
    'Accept': 'application/vnd.github.v3+json',
  };
  
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  
  try {
    const response = await httpRequest(url, { headers });
    if (response.status === 200 && response.data.items) {
      return response.data.items.map(item => ({
        source: 'github',
        title: item.title,
        url: item.html_url,
        body: item.body,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        labels: item.labels.map(l => l.name),
      }));
    }
  } catch (error) {
    console.error(`GitHub search error for "${term}":`, error.message);
  }
  
  return [];
}

/**
 * Search Stack Overflow
 */
async function searchStackOverflow(term) {
  const key = process.env.STACKOVERFLOW_KEY;
  const query = encodeURIComponent(term);
  const url = `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=activity&q=${query}&site=stackoverflow&pagesize=10${key ? `&key=${key}` : ''}`;
  
  try {
    const response = await httpRequest(url);
    if (response.status === 200 && response.data.items) {
      return response.data.items.map(item => ({
        source: 'stackoverflow',
        title: item.title,
        url: item.link,
        body: item.body,
        createdAt: new Date(item.creation_date * 1000).toISOString(),
        updatedAt: new Date(item.last_activity_date * 1000).toISOString(),
        tags: item.tags,
        score: item.score,
      }));
    }
  } catch (error) {
    console.error(`Stack Overflow search error for "${term}":`, error.message);
  }
  
  return [];
}

/**
 * Search for contenteditable scenarios
 */
async function searchScenarios(term) {
  console.log(`Searching for: ${term}`);
  
  const results = [];
  
  // Search GitHub
  const githubResults = await searchGitHub(term);
  results.push(...githubResults);
  
  // Rate limiting: wait between API calls
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Search Stack Overflow
  const stackOverflowResults = await searchStackOverflow(term);
  results.push(...stackOverflowResults);
  
  // Rate limiting: wait between searches
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return results;
}

/**
 * Extract case data from search result
 */
function extractCaseData(result) {
  // Try to extract browser, OS, and other metadata from title/body
  const text = `${result.title} ${result.body || ''}`.toLowerCase();
  
  const browsers = ['chrome', 'firefox', 'safari', 'edge', 'opera'];
  const oses = ['windows', 'macos', 'linux', 'ios', 'android'];
  const devices = ['desktop', 'mobile', 'tablet', 'laptop'];
  
  let browser = 'Chrome'; // default
  let os = 'Windows'; // default
  let device = 'Desktop or Laptop'; // default
  let keyboard = 'US QWERTY'; // default
  
  for (const b of browsers) {
    if (text.includes(b)) {
      browser = b.charAt(0).toUpperCase() + b.slice(1);
      break;
    }
  }
  
  for (const o of oses) {
    if (text.includes(o)) {
      if (o === 'macos') os = 'macOS';
      else if (o === 'ios') os = 'iOS';
      else os = o.charAt(0).toUpperCase() + o.slice(1);
      break;
    }
  }
  
  if (text.includes('mobile') || text.includes('iphone') || text.includes('android')) {
    device = 'Mobile';
  } else if (text.includes('tablet') || text.includes('ipad')) {
    device = 'Tablet';
  }
  
  if (text.includes('ime') || text.includes('korean') || text.includes('japanese') || text.includes('chinese')) {
    if (text.includes('korean')) keyboard = 'Korean (IME)';
    else if (text.includes('japanese')) keyboard = 'Japanese (IME)';
    else if (text.includes('chinese')) keyboard = 'Chinese (IME)';
    else keyboard = 'IME';
  }
  
  // Generate scenario ID from keywords
  let scenarioId = 'scenario-other';
  if (text.includes('ime') || text.includes('composition')) {
    scenarioId = 'scenario-ime-composition';
  } else if (text.includes('paste')) {
    scenarioId = 'scenario-paste';
  } else if (text.includes('focus')) {
    scenarioId = 'scenario-focus';
  } else if (text.includes('selection')) {
    scenarioId = 'scenario-selection';
  } else if (text.includes('drag') || text.includes('drop')) {
    scenarioId = 'scenario-drag-drop';
  }
  
  return {
    scenarioId,
    os,
    device,
    browser,
    keyboard,
    caseTitle: result.title.substring(0, 100), // Limit title length
    description: result.body ? result.body.substring(0, 500) : result.title,
    tags: [
      ...(result.labels || result.tags || []).slice(0, 5),
      result.source,
    ],
    status: 'draft',
    locale: 'en',
    sourceUrl: result.url,
    sourceCreatedAt: result.createdAt,
    sourceUpdatedAt: result.updatedAt,
  };
}

/**
 * Check if case already exists (by source URL)
 */
function caseExists(sourceUrl) {
  if (!sourceUrl) return false;
  
  const files = readdirSync(casesDir);
  for (const file of files) {
    if (file.endsWith('.md')) {
      const content = readFileSync(join(casesDir, file), 'utf-8');
      if (content.includes(sourceUrl)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Process search results and generate case files
 */
async function processSearchResults(results) {
  const nextId = getNextCaseId();
  let currentId = parseInt(nextId, 10);
  let created = 0;
  let skipped = 0;
  
  for (const result of results) {
    // Skip if already exists
    if (caseExists(result.url)) {
      skipped++;
      continue;
    }
    
    const extractedData = extractCaseData(result);
    const caseData = {
      id: String(currentId).padStart(4, '0'),
      ...extractedData,
      phenomenon: `Found on ${result.source}: ${result.title}`,
      reproductionSteps: `1. Visit: ${result.url}\n2. Review the issue description\n3. Reproduce the behavior if possible`,
      observedBehavior: result.body ? result.body.substring(0, 1000) : 'See source for details',
      expectedBehavior: 'Behavior should be consistent across browsers',
      impact: 'See source issue for impact details',
      browserComparison: `Issue reported for ${extractedData.browser} on ${extractedData.os}`,
      workarounds: 'See source issue for potential workarounds',
    };
    
    const filename = `ce-${caseData.id}-${caseData.caseTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 50)}-${caseData.locale || 'en'}.md`;
    
    const filepath = join(casesDir, filename);
    
    // Add source information to the case file
    const content = generateCaseFile(caseData);
    const contentWithSource = content + `\n## Source\n\n- **URL**: ${result.url}\n- **Source**: ${result.source}\n- **Created**: ${result.createdAt}\n- **Updated**: ${result.updatedAt}\n`;
    
    writeFileSync(filepath, contentWithSource, 'utf-8');
    console.log(`Created: ${filename} (from ${result.source})`);
    
    currentId++;
    created++;
  }
  
  console.log(`\nSummary: ${created} cases created, ${skipped} skipped (already exist)`);
}

/**
 * Main function
 */
async function main() {
  console.log('Starting contenteditable scenario collection...');
  console.log(`Cases directory: ${casesDir}`);
  console.log(`Next case ID: ce-${getNextCaseId()}`);
  console.log('');
  
  if (!existsSync(casesDir)) {
    console.error(`Error: Cases directory does not exist: ${casesDir}`);
    process.exit(1);
  }
  
  const watch = process.argv.includes('--watch');
  const limit = process.argv.includes('--limit') 
    ? parseInt(process.argv[process.argv.indexOf('--limit') + 1], 10) 
    : SEARCH_TERMS.length;
  
  const searchTerms = SEARCH_TERMS.slice(0, limit);
  
  if (watch) {
    console.log('Running in watch mode. Press Ctrl+C to stop.');
    console.log(`Will search ${searchTerms.length} terms every 5 minutes.\n`);
    
    // Run immediately
    await runSearch(searchTerms);
    
    // Then run periodically
    setInterval(async () => {
      await runSearch(searchTerms);
    }, 5 * 60 * 1000); // Run every 5 minutes
  } else {
    // Run once
    await runSearch(searchTerms);
  }
}

/**
 * Run search for all terms
 */
async function runSearch(terms) {
  console.log(`\n[${new Date().toISOString()}] Starting search cycle...\n`);
  
  for (let i = 0; i < terms.length; i++) {
    const term = terms[i];
    console.log(`[${i + 1}/${terms.length}] Searching: ${term}`);
    
    try {
      const results = await searchScenarios(term);
      if (results.length > 0) {
        console.log(`  Found ${results.length} results`);
        await processSearchResults(results);
      } else {
        console.log(`  No results found`);
      }
    } catch (error) {
      console.error(`  Error searching "${term}":`, error.message);
    }
    
    // Rate limiting: wait between searches (except for last one)
    if (i < terms.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log(`\n[${new Date().toISOString()}] Search cycle completed.\n`);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { getNextCaseId, generateCaseFile, searchScenarios, processSearchResults };
