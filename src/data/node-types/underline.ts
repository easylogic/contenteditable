import type { NodeTypeDefinition } from './index';

export const underline: NodeTypeDefinition = {
  name: 'Underline',
  category: 'Formatting',
  schema: `{
  underline: {
    parseDOM: [{ tag: 'u' }],
    toDOM: () => ['u', 0]
  }
}`,
  modelExample: `{
  type: 'text',
  text: 'Underlined text',
  marks: [{ type: 'underline' }]
}`,
  htmlSerialization: `function serializeUnderlineMark(text, mark) {
  return '<u>' + text + '</u>';
}`,
  htmlDeserialization: `function extractUnderlineMark(element) {
  if (element.tagName === 'U') {
    return { type: 'underline' };
  }
  return null;
}`,
  viewIntegration: `// Toggling underline
function toggleUnderline() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  
  const range = selection.getRangeAt(0);
  const hasUnderline = hasMarkInSelection(range, 'underline');
  
  if (hasUnderline) {
    removeMark('underline');
  } else {
    addMark({ type: 'underline' });
  }
}`,
  commonIssues: `// Issue: <u> is deprecated in some contexts
// Solution: Consider using CSS or <span> with style
function serializeUnderlineAlternative(text) {
  return '<span style="text-decoration: underline">' + text + '</span>';
}

// Issue: Underline with links
// Solution: Handle nested underline in links
function handleUnderlineInLink(link, underline) {
  // Links often have underline by default
  // May need to distinguish intentional underline
}`,
  implementation: `class UnderlineMark {
  constructor() {
    this.type = 'underline';
  }
  
  toDOM() {
    return ['u', 0];
  }
  
  static fromDOM(element) {
    if (element.tagName === 'U') {
      return new UnderlineMark();
    }
    return null;
  }
}`
};
