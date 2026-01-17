import type { NodeTypeDefinition } from './index';

export const text: NodeTypeDefinition = {
  name: 'Text',
  category: 'Basic',
  schema: `{
  text: {
    group: 'inline',
    // Text nodes are leaf nodes, no children
  }
}`,
  modelExample: `{
  type: 'text',
  text: 'Hello world',
  marks: [
    { type: 'bold' },
    { type: 'italic' }
  ]
}`,
  htmlSerialization: `function serializeText(node) {
  let html = escapeHtml(node.text);
  
  // Apply marks in order
  if (node.marks && node.marks.length > 0) {
    node.marks.forEach(mark => {
      html = wrapWithMark(html, mark);
    });
  }
  
  return html;
}

function wrapWithMark(html, mark) {
  const tagMap = {
    bold: 'strong',
    italic: 'em',
    underline: 'u',
    code: 'code'
  };
  const tag = tagMap[mark.type];
  return tag ? '<' + tag + '>' + html + '</' + tag + '>' : html;
}`,
  htmlDeserialization: `function parseText(domNode) {
  return {
    type: 'text',
    text: domNode.textContent,
    marks: extractMarks(domNode)
  };
}

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
  viewIntegration: `// Rendering
const textNode = document.createTextNode(node.text);
// Marks are applied by wrapping in parent elements
// during serialization

// Text node editing
textNode.addEventListener('input', (e) => {
  // Update text content
  const newText = textNode.textContent;
  updateTextNode(node, newText);
});

// Selection in text nodes
function getTextPosition(textNode, offset) {
  return {
    path: getPathToNode(textNode),
    offset: offset
  };
}`,
  commonIssues: `// Issue: Text nodes must be inside block or inline nodes
// Solution: Validate parent node type
function validateTextNode(textNode) {
  const parent = textNode.parentNode;
  if (!isBlockNode(parent) && !isInlineNode(parent)) {
    // Wrap in paragraph
    wrapInParagraph(textNode);
  }
}

// Issue: Empty text nodes
// Solution: Remove or merge empty text nodes
function normalizeTextNodes(element) {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT
  );
  const toRemove = [];
  let node;
  
  while (node = walker.nextNode()) {
    if (node.textContent.trim() === '') {
      toRemove.push(node);
    }
  }
  
  toRemove.forEach(n => n.remove());
}

// Issue: Adjacent text nodes
// Solution: Merge adjacent text nodes
function mergeAdjacentTextNodes(element) {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT
  );
  let prevNode = null;
  let node;
  
  while (node = walker.nextNode()) {
    if (prevNode && prevNode.parentNode === node.parentNode) {
      prevNode.textContent += node.textContent;
      node.remove();
    } else {
      prevNode = node;
    }
  }
}`,
  implementation: `class TextNode {
  constructor(text, marks = []) {
    this.type = 'text';
    this.text = text;
    this.marks = marks;
  }
  
  toDOM() {
    const textNode = document.createTextNode(this.text);
    // Marks are applied by parent during serialization
    return textNode;
  }
  
  static fromDOM(domNode) {
    const text = domNode.textContent;
    const marks = extractMarks(domNode);
    return new TextNode(text, marks);
  }
}`
};
