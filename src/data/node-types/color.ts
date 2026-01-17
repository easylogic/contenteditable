import type { NodeTypeDefinition } from './index';

export const color: NodeTypeDefinition = {
  name: 'Color',
  category: 'Formatting',
  schema: `{
  color: {
    attrs: {
      color: { default: '#000000' }
    },
    parseDOM: [{
      tag: 'span[style*="color"]',
      getAttrs: (node) => ({
        color: extractColorFromStyle(node.style.color)
      })
    }],
    toDOM: (node) => ['span', { style: 'color: ' + node.attrs.color }, 0]
  }
}`,
  modelExample: `{
  type: 'text',
  text: 'Colored text',
  marks: [{
    type: 'color',
    attrs: { color: '#ff0000' }
  }]
}`,
  htmlSerialization: `function serializeColorMark(text, mark) {
  const color = mark.attrs?.color || '#000000';
  return '<span style="color: ' + escapeHtml(color) + '">' + text + '</span>';
}`,
  htmlDeserialization: `function extractColorMark(element) {
  if (element.tagName === 'SPAN' && element.style.color) {
    return {
      type: 'color',
      attrs: { color: element.style.color }
    };
  }
  return null;
}

function extractColorFromStyle(colorString) {
  // Convert rgb/rgba to hex if needed
  return colorString;
}`,
  viewIntegration: `// Applying color
function applyColor(color) {
  addMark({
    type: 'color',
    attrs: { color }
  });
}

// Color picker integration
function showColorPicker() {
  const picker = createColorPicker();
  picker.onChange = (color) => {
    applyColor(color);
  };
}`,
  commonIssues: `// Issue: Color format normalization
// Solution: Normalize to hex format
function normalizeColor(color) {
  if (color.startsWith('rgb')) {
    return rgbToHex(color);
  }
  return color;
}

// Issue: Color with other marks
// Solution: Color can coexist with other marks
function applyColorWithMarks(text, color, otherMarks) {
  let html = text;
  html = '<span style="color: ' + color + '">' + html + '</span>';
  otherMarks.forEach(mark => {
    html = wrapWithMark(html, mark);
  });
  return html;
}`,
  implementation: `class ColorMark {
  constructor(attrs) {
    this.type = 'color';
    this.attrs = { color: attrs?.color || '#000000' };
  }
  
  toDOM() {
    return ['span', { style: 'color: ' + this.attrs.color }, 0];
  }
  
  static fromDOM(element) {
    if (element.tagName === 'SPAN' && element.style.color) {
      return new ColorMark({ color: element.style.color });
    }
    return null;
  }
}`
};
