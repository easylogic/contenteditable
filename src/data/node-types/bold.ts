import type { NodeTypeDefinition } from './index';

export const bold: NodeTypeDefinition = {
  name: 'Bold',
  category: 'Formatting',
  schema: `{
  bold: {
    // Marks don't have content, they wrap text nodes
    parseDOM: [
      { tag: 'strong' },
      { tag: 'b', getAttrs: () => ({}) }
    ],
    toDOM: () => ['strong', 0]
  }
}`,
  modelExample: `{
  type: 'text',
  text: 'Bold text',
  marks: [{ type: 'bold' }]
}`,
  htmlSerialization: `function serializeBoldMark(text, mark) {
  return '<strong>' + text + '</strong>';
}

// When multiple marks, apply in order
function applyMarks(text, marks) {
  let html = text;
  marks.forEach(mark => {
    if (mark.type === 'bold') {
      html = '<strong>' + html + '</strong>';
    }
  });
  return html;
}`,
  htmlDeserialization: `function extractBoldMark(element) {
  if (element.tagName === 'STRONG' || element.tagName === 'B') {
    return { type: 'bold' };
  }
  return null;
}

// Extract all marks from parent chain
function extractMarks(textNode) {
  const marks = [];
  let current = textNode.parentElement;
  
  while (current && current !== editor) {
    const mark = getMarkFromElement(current);
    if (mark) marks.push(mark);
    current = current.parentElement;
  }
  
  return marks;
}`,
  viewIntegration: `// Toggling bold
function toggleBold() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  
  const range = selection.getRangeAt(0);
  const hasBold = hasMarkInSelection(range, 'bold');
  
  if (hasBold) {
    removeMark('bold');
  } else {
    addMark({ type: 'bold' });
  }
}

// Checking if selection has bold
function hasBoldMark(selection) {
  const range = selection.getRangeAt(0);
  const commonAncestor = range.commonAncestorContainer;
  
  if (commonAncestor.nodeType === Node.TEXT_NODE) {
    return commonAncestor.parentElement?.tagName === 'STRONG';
  }
  
  return range.commonAncestorContainer.querySelector('strong');
}`,
  commonIssues: `// Issue: <b> vs <strong> normalization
// Solution: Always convert <b> to <strong>
function normalizeBold(element) {
  element.querySelectorAll('b').forEach(b => {
    const strong = document.createElement('strong');
    strong.innerHTML = b.innerHTML;
    b.parentNode.replaceChild(strong, b);
  });
}

// Issue: Nested bold tags
// Solution: Remove nested bold
function removeNestedBold(element) {
  const strongs = element.querySelectorAll('strong');
  strongs.forEach(strong => {
    if (strong.closest('strong') !== strong) {
      // Nested, unwrap inner
      unwrapElement(strong);
    }
  });
}

// Issue: Bold mark with other marks
// Solution: Handle mark ordering
function applyMarksInOrder(text, marks) {
  // Apply bold first, then other marks
  const sortedMarks = sortMarks(marks);
  let html = text;
  sortedMarks.forEach(mark => {
    html = wrapWithMark(html, mark);
  });
  return html;
}`,
  implementation: `class BoldMark {
  constructor() {
    this.type = 'bold';
  }
  
  toDOM() {
    return ['strong', 0];
  }
  
  static fromDOM(element) {
    if (element.tagName === 'STRONG' || element.tagName === 'B') {
      return new BoldMark();
    }
    return null;
  }
}`
};
