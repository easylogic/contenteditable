import type { NodeTypeDefinition } from './index';

export const italic: NodeTypeDefinition = {
  name: 'Italic',
  category: 'Formatting',
  schema: `{
  italic: {
    parseDOM: [
      { tag: 'em' },
      { tag: 'i', getAttrs: () => ({}) }
    ],
    toDOM: () => ['em', 0]
  }
}`,
  modelExample: `{
  type: 'text',
  text: 'Italic text',
  marks: [{ type: 'italic' }]
}`,
  htmlSerialization: `function serializeItalicMark(text, mark) {
  return '<em>' + text + '</em>';
}`,
  htmlDeserialization: `function extractItalicMark(element) {
  if (element.tagName === 'EM' || element.tagName === 'I') {
    return { type: 'italic' };
  }
  return null;
}`,
  viewIntegration: `// Toggling italic
function toggleItalic() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  
  const range = selection.getRangeAt(0);
  const hasItalic = hasMarkInSelection(range, 'italic');
  
  if (hasItalic) {
    removeMark('italic');
  } else {
    addMark({ type: 'italic' });
  }
}`,
  commonIssues: `// Issue: <i> vs <em> normalization
// Solution: Always convert <i> to <em>
function normalizeItalic(element) {
  element.querySelectorAll('i').forEach(i => {
    const em = document.createElement('em');
    em.innerHTML = i.innerHTML;
    i.parentNode.replaceChild(em, i);
  });
}

// Issue: Bold and italic together
// Solution: Handle nested marks correctly
// <strong><em>text</em></strong> or <em><strong>text</strong></em>
function applyBoldAndItalic(text) {
  // Order matters for semantic HTML
  return '<strong><em>' + text + '</em></strong>';
}`,
  implementation: `class ItalicMark {
  constructor() {
    this.type = 'italic';
  }
  
  toDOM() {
    return ['em', 0];
  }
  
  static fromDOM(element) {
    if (element.tagName === 'EM' || element.tagName === 'I') {
      return new ItalicMark();
    }
    return null;
  }
}`
};
