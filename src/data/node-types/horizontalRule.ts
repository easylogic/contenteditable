import type { NodeTypeDefinition } from './index';

export const horizontalRule: NodeTypeDefinition = {
  name: 'Horizontal Rule',
  category: 'Basic',
  schema: `{
  horizontalRule: {
    group: 'block',
    parseDOM: [{ tag: 'hr' }],
    toDOM: () => ['hr']
  }
}`,
  modelExample: `{
  type: 'horizontalRule'
}`,
  htmlSerialization: `function serializeHorizontalRule(node) {
  return '<hr>';
}`,
  htmlDeserialization: `function parseHorizontalRule(domNode) {
  return {
    type: 'horizontalRule'
  };
}`,
  viewIntegration: `// Rendering
const hr = document.createElement('hr');
// Horizontal rules are self-closing block elements

// Inserting horizontal rule
function insertHorizontalRule() {
  const hr = {
    type: 'horizontalRule'
  };
  insertNode(hr);
}`,
  commonIssues: `// Issue: Horizontal rule styling
// Solution: Apply consistent styles
function styleHorizontalRule(hr) {
  hr.style.border = 'none';
  hr.style.borderTop = '1px solid #ccc';
  hr.style.margin = '1em 0';
}

// Issue: Selection around <hr>
// Solution: Handle cursor positioning
function getPositionAroundHr(hr) {
  // Position cursor after <hr>
  const range = document.createRange();
  range.setStartAfter(hr);
  range.collapse(true);
  return range;
}

// Issue: <hr> in nested contexts
// Solution: Ensure <hr> is always a direct child of block
function validateHorizontalRule(hr) {
  const parent = hr.parentNode;
  if (!isBlockNode(parent)) {
    // Move to block parent
    moveToBlockParent(hr);
  }
}`,
  implementation: `class HorizontalRuleNode {
  constructor() {
    this.type = 'horizontalRule';
  }
  
  toDOM() {
    const hr = document.createElement('hr');
    return hr;
  }
  
  static fromDOM(domNode) {
    return new HorizontalRuleNode();
  }
}`
};
