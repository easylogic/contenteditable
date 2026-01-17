import type { NodeTypeDefinition } from './index';

export const strikethrough: NodeTypeDefinition = {
  name: 'Strikethrough',
  category: 'Formatting',
  schema: `{
  strikethrough: {
    parseDOM: [
      { tag: 's' },
      { tag: 'strike' },
      { tag: 'del' }
    ],
    toDOM: () => ['s', 0]
  }
}`,
  modelExample: `{
  type: 'text',
  text: 'Deleted text',
  marks: [{ type: 'strikethrough' }]
}`,
  htmlSerialization: `function serializeStrikethroughMark(text, mark) {
  return '<s>' + text + '</s>';
}`,
  htmlDeserialization: `function extractStrikethroughMark(element) {
  if (element.tagName === 'S' || 
      element.tagName === 'STRIKE' || 
      element.tagName === 'DEL') {
    return { type: 'strikethrough' };
  }
  return null;
}`,
  viewIntegration: `// Toggling strikethrough
function toggleStrikethrough() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  
  const range = selection.getRangeAt(0);
  const hasStrikethrough = hasMarkInSelection(range, 'strikethrough');
  
  if (hasStrikethrough) {
    removeMark('strikethrough');
  } else {
    addMark({ type: 'strikethrough' });
  }
}`,
  commonIssues: `// Issue: <s> vs <del> vs <strike>
// Solution: Normalize to <s>
function normalizeStrikethrough(element) {
  element.querySelectorAll('strike, del').forEach(el => {
    const s = document.createElement('s');
    s.innerHTML = el.innerHTML;
    el.parentNode.replaceChild(s, el);
  });
}

// Issue: Strikethrough semantic meaning
// Solution: <del> has semantic meaning (deleted content)
// Consider using <del> for version control scenarios`,
  implementation: `class StrikethroughMark {
  constructor() {
    this.type = 'strikethrough';
  }
  
  toDOM() {
    return ['s', 0];
  }
  
  static fromDOM(element) {
    if (['S', 'STRIKE', 'DEL'].includes(element.tagName)) {
      return new StrikethroughMark();
    }
    return null;
  }
}`
};
