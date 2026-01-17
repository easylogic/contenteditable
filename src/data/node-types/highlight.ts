import type { NodeTypeDefinition } from './index';

export const highlight: NodeTypeDefinition = {
  name: 'Highlight',
  category: 'Formatting',
  schema: `{
  highlight: {
    attrs: {
      color: { default: '#ffff00' }
    },
    parseDOM: [{
      tag: 'mark',
      getAttrs: (node) => ({
        color: node.style.backgroundColor || '#ffff00'
      })
    }],
    toDOM: (node) => ['mark', { 
      style: 'background-color: ' + node.attrs.color 
    }, 0]
  }
}`,
  modelExample: `{
  type: 'text',
  text: 'Highlighted text',
  marks: [{
    type: 'highlight',
    attrs: { color: '#ffff00' }
  }]
}`,
  htmlSerialization: `function serializeHighlightMark(text, mark) {
  const color = mark.attrs?.color || '#ffff00';
  return '<mark style="background-color: ' + escapeHtml(color) + '">' + 
         text + '</mark>';
}`,
  htmlDeserialization: `function extractHighlightMark(element) {
  if (element.tagName === 'MARK') {
    const color = element.style.backgroundColor || '#ffff00';
    return {
      type: 'highlight',
      attrs: { color }
    };
  }
  return null;
}`,
  viewIntegration: `// Applying highlight
function applyHighlight(color = '#ffff00') {
  addMark({
    type: 'highlight',
    attrs: { color }
  });
}

// Removing highlight
function removeHighlight() {
  removeMark('highlight');
}`,
  commonIssues: `// Issue: Highlight color format
// Solution: Normalize to hex
function normalizeHighlightColor(color) {
  return normalizeColor(color);
}

// Issue: Nested highlights
// Solution: Merge or flatten nested highlights
function mergeHighlights(element) {
  const marks = element.querySelectorAll('mark');
  // Handle nested marks
}`,
  implementation: `class HighlightMark {
  constructor(attrs) {
    this.type = 'highlight';
    this.attrs = { color: attrs?.color || '#ffff00' };
  }
  
  toDOM() {
    return ['mark', { 
      style: 'background-color: ' + this.attrs.color 
    }, 0];
  }
  
  static fromDOM(element) {
    if (element.tagName === 'MARK') {
      return new HighlightMark({ 
        color: element.style.backgroundColor || '#ffff00' 
      });
    }
    return null;
  }
}`
};
