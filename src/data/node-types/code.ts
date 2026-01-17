import type { NodeTypeDefinition } from './index';

export const code: NodeTypeDefinition = {
  name: 'Code',
  category: 'Formatting',
  schema: `{
  code: {
    parseDOM: [{ tag: 'code' }],
    toDOM: () => ['code', 0],
    excludes: 'bold italic underline link'
    // Code mark excludes other formatting marks
  }
}`,
  modelExample: `{
  type: 'text',
  text: 'inline code',
  marks: [{ type: 'code' }]
}`,
  htmlSerialization: `function serializeCodeMark(text, mark) {
  return '<code>' + escapeHtml(text) + '</code>';
}`,
  htmlDeserialization: `function extractCodeMark(element) {
  if (element.tagName === 'CODE') {
    return { type: 'code' };
  }
  return null;
}`,
  viewIntegration: `// Toggling code
function toggleCode() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  
  const range = selection.getRangeAt(0);
  const hasCode = hasMarkInSelection(range, 'code');
  
  if (hasCode) {
    removeMark('code');
  } else {
    // Remove conflicting marks first
    removeConflictingMarks(['bold', 'italic', 'underline', 'link']);
    addMark({ type: 'code' });
  }
}`,
  commonIssues: `// Issue: Code mark excludes other marks
// Solution: Remove conflicting marks when applying code
function applyCodeMark(textNode) {
  // Remove bold, italic, underline, link
  const conflictingMarks = ['bold', 'italic', 'underline', 'link'];
  conflictingMarks.forEach(mark => {
    removeMark(mark);
  });
  addMark({ type: 'code' });
}

// Issue: Code vs codeBlock
// Solution: Distinguish inline code from code blocks
function isCodeBlock(element) {
  return element.tagName === 'PRE' || 
         (element.tagName === 'CODE' && element.parentElement?.tagName === 'PRE');
}

// Issue: Code mark with special characters
// Solution: Escape HTML in code
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}`,
  implementation: `class CodeMark {
  constructor() {
    this.type = 'code';
  }
  
  toDOM() {
    return ['code', 0];
  }
  
  static fromDOM(element) {
    if (element.tagName === 'CODE' && 
        element.parentElement?.tagName !== 'PRE') {
      return new CodeMark();
    }
    return null;
  }
}`
};
