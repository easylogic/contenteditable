import type { NodeTypeDefinition } from './index';

export const heading: NodeTypeDefinition = {
  name: 'Heading',
  category: 'Basic',
  schema: `{
  heading: {
    content: 'inline*',
    group: 'block',
    attrs: {
      level: { default: 1 }
    },
    parseDOM: [
      { tag: 'h1', attrs: { level: 1 } },
      { tag: 'h2', attrs: { level: 2 } },
      { tag: 'h3', attrs: { level: 3 } },
      { tag: 'h4', attrs: { level: 4 } },
      { tag: 'h5', attrs: { level: 5 } },
      { tag: 'h6', attrs: { level: 6 } }
    ],
    toDOM: (node) => ['h' + node.attrs.level, 0]
  }
}`,
  modelExample: `{
  type: 'heading',
  attrs: { level: 1 },
  children: [
    { type: 'text', text: 'Main Title' }
  ]
}`,
  htmlSerialization: `function serializeHeading(node) {
  const level = node.attrs?.level || 1;
  return '<h' + level + '>' + 
         serializeChildren(node.children) + 
         '</h' + level + '>';
}`,
  htmlDeserialization: `function parseHeading(domNode) {
  const level = parseInt(domNode.tagName[1]) || 1;
  return {
    type: 'heading',
    attrs: { level },
    children: parseChildren(domNode.childNodes)
  };
}`,
  viewIntegration: `// Rendering
const level = node.attrs?.level || 1;
const h = document.createElement('h' + level);
h.contentEditable = 'true';
node.children.forEach(child => {
  h.appendChild(renderNode(child));
});

// Level change handling
function changeHeadingLevel(node, newLevel) {
  if (newLevel < 1 || newLevel > 6) return;
  return {
    ...node,
    attrs: { ...node.attrs, level: newLevel }
  };
}`,
  commonIssues: `// Issue: Heading level validation
// Solution: Always validate level
if (node.attrs.level < 1 || node.attrs.level > 6) {
  node.attrs.level = 1;
}

// Issue: Empty headings
// Solution: Prevent or handle empty headings
if (node.children.length === 0) {
  return '<h' + level + '><br></h' + level + '>';
}

// Issue: Heading hierarchy (h1 after h3)
// Solution: Validate document structure
function validateHeadingHierarchy(doc) {
  let lastLevel = 0;
  // Check heading order
}`,
  implementation: `class HeadingNode {
  constructor(attrs, children) {
    this.type = 'heading';
    this.attrs = { level: attrs?.level || 1 };
    this.children = children || [];
  }
  
  toDOM() {
    const level = this.attrs.level;
    const h = document.createElement('h' + level);
    this.children.forEach(child => {
      h.appendChild(child.toDOM());
    });
    return h;
  }
  
  static fromDOM(domNode) {
    const level = parseInt(domNode.tagName[1]) || 1;
    const children = Array.from(domNode.childNodes)
      .map(node => parseNode(node))
      .filter(Boolean);
    return new HeadingNode({ level }, children);
  }
}`
};
