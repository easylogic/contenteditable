import type { NodeTypeDefinition } from './index';

export const blockquote: NodeTypeDefinition = {
  name: 'Blockquote',
  category: 'Structural',
  schema: `{
  blockquote: {
    content: 'block+',
    group: 'block',
    parseDOM: [{ tag: 'blockquote' }],
    toDOM: () => ['blockquote', 0]
  }
}`,
  modelExample: `{
  type: 'blockquote',
  children: [
    {
      type: 'paragraph',
      children: [{ type: 'text', text: 'Quoted text' }]
    }
  ]
}`,
  htmlSerialization: `function serializeBlockquote(node) {
  return '<blockquote>' + serializeChildren(node.children) + '</blockquote>';
}`,
  htmlDeserialization: `function parseBlockquote(domNode) {
  return {
    type: 'blockquote',
    children: parseChildren(domNode.childNodes)
  };
}`,
  viewIntegration: `// Rendering
const blockquote = document.createElement('blockquote');
blockquote.contentEditable = 'true';
node.children.forEach(child => {
  blockquote.appendChild(renderNode(child));
});

// Creating blockquote
function createBlockquote() {
  return {
    type: 'blockquote',
    children: [{
      type: 'paragraph',
      children: []
    }]
  };
}`,
  commonIssues: `// Issue: Empty blockquote
// Solution: Ensure at least one block
if (node.children.length === 0) {
  node.children.push({
    type: 'paragraph',
    children: []
  });
}

// Issue: Nested blockquotes
// Solution: Handle or prevent nesting
function validateBlockquote(blockquote) {
  // Check for nested blockquotes
  const nested = blockquote.querySelector('blockquote');
  if (nested) {
    // Unwrap or handle
  }
}`,
  implementation: `class BlockquoteNode {
  constructor(children) {
    this.type = 'blockquote';
    this.children = children || [];
  }
  
  toDOM() {
    const blockquote = document.createElement('blockquote');
    this.children.forEach(child => {
      blockquote.appendChild(child.toDOM());
    });
    return blockquote;
  }
  
  static fromDOM(domNode) {
    const children = Array.from(domNode.childNodes)
      .map(node => parseNode(node))
      .filter(Boolean);
    return new BlockquoteNode(children);
  }
}`
};
