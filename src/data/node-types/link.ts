import type { NodeTypeDefinition } from './index';

export const link: NodeTypeDefinition = {
  name: 'Link',
  category: 'Formatting',
  schema: `{
  link: {
    attrs: {
      href: { default: '' },
      title: { default: '' }
    },
    parseDOM: [{ 
      tag: 'a[href]',
      getAttrs: (node) => ({
        href: node.getAttribute('href'),
        title: node.getAttribute('title') || ''
      })
    }],
    toDOM: (node) => ['a', node.attrs, 0]
  }
}`,
  modelExample: `{
  type: 'text',
  text: 'Click here',
  marks: [{
    type: 'link',
    attrs: { href: 'https://example.com', title: 'Example' }
  }]
}`,
  htmlSerialization: `function serializeLinkMark(text, mark) {
  const href = escapeHtml(mark.attrs?.href || '');
  const title = mark.attrs?.title ? 
    ' title="' + escapeHtml(mark.attrs.title) + '"' : '';
  return '<a href="' + href + '"' + title + '>' + text + '</a>';
}`,
  htmlDeserialization: `function extractLinkMark(element) {
  if (element.tagName === 'A' && element.hasAttribute('href')) {
    return {
      type: 'link',
      attrs: {
        href: element.getAttribute('href') || '',
        title: element.getAttribute('title') || ''
      }
    };
  }
  return null;
}`,
  viewIntegration: `// Creating/editing links
function createLink(url, text) {
  return {
    type: 'text',
    text: text,
    marks: [{
      type: 'link',
      attrs: { href: url }
    }]
  };
}

// Updating link URL
function updateLinkUrl(linkMark, newUrl) {
  return {
    ...linkMark,
    attrs: { ...linkMark.attrs, href: newUrl }
  };
}

// Link click handling
function handleLinkClick(e) {
  const link = e.target.closest('a');
  if (link && e.ctrlKey || e.metaKey) {
    // Allow default (open in new tab)
    return;
  }
  e.preventDefault();
  // Handle link navigation in editor
}`,
  commonIssues: `// Issue: Empty href links
// Solution: Validate href before creating link
function validateLink(link) {
  if (!link.attrs.href || link.attrs.href.trim() === '') {
    return false;
  }
  return true;
}

// Issue: Link with other marks
// Solution: Links can coexist with bold, italic, etc.
// But code mark excludes links
function canApplyLinkWithMarks(marks) {
  return !marks.some(m => m.type === 'code');
}

// Issue: Relative vs absolute URLs
// Solution: Normalize URLs
function normalizeUrl(url) {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/')) {
    return url; // Relative to root
  }
  return 'https://' + url; // Assume external
}

// Issue: Link security (XSS)
// Solution: Sanitize href
function sanitizeUrl(url) {
  // Remove javascript:, data:, etc.
  if (url.startsWith('javascript:') || url.startsWith('data:')) {
    return '#';
  }
  return url;
}`,
  implementation: `class LinkMark {
  constructor(attrs) {
    this.type = 'link';
    this.attrs = {
      href: attrs?.href || '',
      title: attrs?.title || ''
    };
  }
  
  toDOM() {
    const attrs = {};
    if (this.attrs.href) attrs.href = this.attrs.href;
    if (this.attrs.title) attrs.title = this.attrs.title;
    return ['a', attrs, 0];
  }
  
  static fromDOM(element) {
    if (element.tagName === 'A' && element.hasAttribute('href')) {
      return new LinkMark({
        href: element.getAttribute('href') || '',
        title: element.getAttribute('title') || ''
      });
    }
    return null;
  }
}`
};
