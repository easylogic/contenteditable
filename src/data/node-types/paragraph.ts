import type { NodeTypeDefinition } from './index';

export const paragraph: NodeTypeDefinition = {
  name: 'Paragraph',
  category: 'Basic',
  schema: `{
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM: () => ['p', 0]
  }
}`,
  modelExample: `{
  type: 'paragraph',
  children: [
    { type: 'text', text: 'This is a paragraph.' }
  ]
}`,
  htmlSerialization: `function serializeParagraph(node) {
  return '<p>' + serializeChildren(node.children) + '</p>';
}`,
  htmlDeserialization: `function parseParagraph(domNode) {
  return {
    type: 'paragraph',
    children: parseChildren(domNode.childNodes)
  };
}`,
  viewIntegration: `// Rendering
const p = document.createElement('p');
p.contentEditable = 'true';
node.children.forEach(child => {
  p.appendChild(renderNode(child));
});

// Input handling
p.addEventListener('input', (e) => {
  const newModel = parseDOMToModel(p);
  updateModel(newModel);
});

// Selection mapping
function getParagraphPosition(selection) {
  const range = selection.getRangeAt(0);
  const offset = getTextOffset(range.startContainer, range.startOffset);
  return { path: [0], offset };
}`,
  commonIssues: `// Issue: Empty paragraphs collapse
// Solution: Always render at least <br> or &nbsp;
if (node.children.length === 0) {
  return '<p><br></p>';
}

// Issue: Browser adds extra <br> tags
// Solution: Normalize on deserialization
function normalizeParagraph(domNode) {
  const brs = domNode.querySelectorAll('br');
  if (brs.length > 1) {
    // Remove extra <br> tags
  }
}

// Issue: Paste creates nested paragraphs
// Solution: Unwrap on paste
function handlePaste(e) {
  const pasted = e.clipboardData.getData('text/html');
  const parsed = parseHTML(pasted);
  // Unwrap nested paragraphs
  return unwrapNestedParagraphs(parsed);
}`,
  implementation: `class ParagraphNode {
  constructor(attrs, children) {
    this.type = 'paragraph';
    this.attrs = attrs || {};
    this.children = children || [];
  }
  
  toDOM() {
    const p = document.createElement('p');
    this.children.forEach(child => {
      p.appendChild(child.toDOM());
    });
    return p;
  }
  
  static fromDOM(domNode) {
    const children = Array.from(domNode.childNodes)
      .map(node => parseNode(node))
      .filter(Boolean);
    return new ParagraphNode({}, children);
  }
}`
};
