import type { NodeTypeDefinition } from './index';

export const document: NodeTypeDefinition = {
  name: 'Document',
  category: 'Basic',
  schema: `{
  document: {
    content: 'block+',
    // Document is the root node, always present
  }
}`,
  modelExample: `{
  type: 'document',
  children: [
    {
      type: 'paragraph',
      children: [{ type: 'text', text: 'Hello' }]
    }
  ]
}`,
  htmlSerialization: `function serializeDocument(node) {
  return serializeChildren(node.children);
}

// Document itself doesn't create a wrapper element
// It's the container for all top-level blocks`,
  htmlDeserialization: `function parseDocument(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  return {
    type: 'document',
    children: Array.from(doc.body.childNodes)
      .map(node => parseNode(node))
      .filter(Boolean)
  };
}`,
  viewIntegration: `// Rendering
const container = document.createElement('div');
container.contentEditable = 'true';
node.children.forEach(child => {
  container.appendChild(renderNode(child));
});

// Document-level event handling
container.addEventListener('input', handleDocumentInput);
container.addEventListener('paste', handleDocumentPaste);
container.addEventListener('keydown', handleDocumentKeydown);

// Selection management
function getDocumentSelection() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;
  return getModelPosition(selection);
}`,
  commonIssues: `// Issue: Document must always have at least one block
// Solution: Ensure document always has content
if (node.children.length === 0) {
  node.children.push({
    type: 'paragraph',
    children: []
  });
}

// Issue: Document structure validation
// Solution: Validate all children are block nodes
function validateDocument(doc) {
  return doc.children.every(child => 
    isBlockNode(child)
  );
}

// Issue: Empty document handling
// Solution: Always maintain at least one empty paragraph
function ensureDocumentNotEmpty(doc) {
  if (doc.children.length === 0) {
    doc.children.push(createEmptyParagraph());
  }
}`,
  implementation: `class DocumentNode {
  constructor(children) {
    this.type = 'document';
    this.children = children || [];
  }
  
  toDOM() {
    const fragment = document.createDocumentFragment();
    this.children.forEach(child => {
      fragment.appendChild(child.toDOM());
    });
    return fragment;
  }
  
  static fromDOM(domNode) {
    const children = Array.from(domNode.childNodes)
      .map(node => parseNode(node))
      .filter(Boolean);
    return new DocumentNode(children);
  }
}`
};
