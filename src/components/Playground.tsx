import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';

// ============================================================
// Types
// ============================================================

type SiblingInfo = {
  nodeName: string;
  id?: string;
  className?: string;
  textPreview?: string;
};

type NodeInfo = { nodeName: string; id?: string; className?: string; textContent?: string };

type EventLog = {
  id: number;
  timestamp: number;
  type: 'selectionchange' | 'compositionstart' | 'compositionupdate' | 'compositionend' | 'beforeinput' | 'input';
  inputType?: string;
  data?: string | null;
  isComposing?: boolean;
  // Start container info
  parent: { nodeName: string; id?: string; className?: string } | null;
  node: NodeInfo | null;
  startOffset: number;
  startContainerText?: string;
  // End container info (for range selections)
  endParent?: { nodeName: string; id?: string; className?: string } | null;
  endNode?: NodeInfo | null;
  endOffset: number;
  endContainerText?: string;
  range?: Range | null;
  // Boundary info
  startBoundary?: { type: 'start' | 'end'; element: string } | null;
  endBoundary?: { type: 'start' | 'end'; element: string } | null;
  // Sibling info
  leftSibling?: SiblingInfo | null;
  rightSibling?: SiblingInfo | null;
  childIndex?: number;
  childCount?: number;
};

type PhaseBlock = {
  title: string;
  type: string;
  log: EventLog | null;
  delta: number;
  highlight?: 'error' | 'warning';
};

type Environment = {
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  device: string;
  isMobile: boolean;
};

type Anomaly = {
  type: string;
  description: string;
  detail: string;
};

type RangeDrawInfo = {
  range: Range;
  fill: string;
  stroke: string;
  heightScale?: number;
};

// ============================================================
// RangeVisualizer Class (uses external overlay container)
// ============================================================

class RangeVisualizer {
  private editorEl: HTMLElement;
  private overlayEl: HTMLElement;

  constructor(editorEl: HTMLElement, overlayEl: HTMLElement) {
    this.editorEl = editorEl;
    this.overlayEl = overlayEl;
  }

  private ensureSvg(): SVGSVGElement {
    let svg = this.overlayEl.querySelector('.range-overlay') as SVGSVGElement;
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('range-overlay');
      Object.assign(svg.style, {
        position: 'absolute',
        inset: '0',
        zIndex: '10',
        pointerEvents: 'none',
        userSelect: 'none',
        overflow: 'visible',
      });
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      this.overlayEl.appendChild(svg);
    }
    return svg;
  }

  public drawRanges(ranges: RangeDrawInfo[]): void {
    if (!ranges || ranges.length === 0) {
      this.clear();
      return;
    }

    const svg = this.ensureSvg();
    svg.querySelector('g[data-layer="rects"]')?.remove();
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.dataset.layer = 'rects';
    svg.appendChild(g);

    const base = this.overlayEl.getBoundingClientRect();

    for (const item of ranges) {
      const { range, fill, stroke, heightScale = 1 } = item;
      let clientRects: DOMRectList | DOMRect[] = range.getClientRects();

      if (range.collapsed) {
        try {
          const container = range.startContainer;
          const offset = range.startOffset;
          if (container.nodeType === Node.TEXT_NODE) {
            const textNode = container as Text;
            const start = Math.max(0, Math.min(textNode.length, offset));
            const end = Math.min(textNode.length, start + 1);
            if (end > start) {
              const tempRange = document.createRange();
              tempRange.setStart(textNode, start);
              tempRange.setEnd(textNode, end);
              clientRects = tempRange.getClientRects();
            }
          }
        } catch { /* fallback */ }
      }

      for (const r of clientRects) {
        if (r.width === 0 && r.height === 0) continue;

        let x = r.left - base.left + this.editorEl.scrollLeft;
        let y = r.top - base.top + this.editorEl.scrollTop;
        let height = r.height;

        if (heightScale !== 1) {
          const newHeight = r.height * heightScale;
          y -= (newHeight - r.height) / 2;
          height = newHeight;
        }

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x.toString());
        rect.setAttribute('y', y.toString());
        rect.setAttribute('width', Math.max(r.width, 2).toString());
        rect.setAttribute('height', height.toString());
        rect.setAttribute('rx', '2');
        rect.setAttribute('fill', fill);
        rect.setAttribute('stroke', stroke);
        rect.setAttribute('stroke-width', '1');
        g.appendChild(rect);
      }
    }
  }

  public drawBoundaryMarkers(markers: { x: number; y: number; height: number; type: 'start' | 'end'; color: string }[]): void {
    const svg = this.ensureSvg();
    svg.querySelector('g[data-layer="boundary"]')?.remove();
    if (markers.length === 0) return;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.dataset.layer = 'boundary';
    svg.appendChild(g);

    for (const marker of markers) {
      const { x, y, height, type, color } = marker;
      const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const size = 6;
      
      if (type === 'start') {
        triangle.setAttribute('d', `M${x - size},${y - size - 2} L${x + size},${y - size - 2} L${x},${y - 2} Z`);
      } else {
        triangle.setAttribute('d', `M${x - size},${y + height + size + 2} L${x + size},${y + height + size + 2} L${x},${y + height + 2} Z`);
      }
      
      triangle.setAttribute('fill', color);
      g.appendChild(triangle);
    }
  }

  public clear(): void {
    const svg = this.overlayEl.querySelector('.range-overlay');
    if (svg) {
      svg.querySelector('g[data-layer="rects"]')?.remove();
      svg.querySelector('g[data-layer="boundary"]')?.remove();
    }
  }

  public destroy(): void {
    this.overlayEl.querySelector('.range-overlay')?.remove();
  }
}

// ============================================================
// Utility Functions
// ============================================================

function detectEnvironment(): Environment {
  if (typeof navigator === 'undefined') {
    return { os: 'Unknown', osVersion: '', browser: 'Unknown', browserVersion: '', device: 'Unknown', isMobile: false };
  }
  const ua = navigator.userAgent;
  let os = 'Unknown', osVersion = '', browser = 'Unknown', browserVersion = '', device = 'Desktop';
  const isMobile = /Mobile|Android|iPhone|iPad/i.test(ua);

  if (/Windows NT 10/i.test(ua)) { os = 'Windows'; osVersion = '10/11'; }
  else if (/Windows/i.test(ua)) { os = 'Windows'; osVersion = ua.match(/Windows NT (\d+\.\d+)/)?.[1] || ''; }
  else if (/Mac OS X/i.test(ua)) { os = 'macOS'; osVersion = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace('_', '.') || ''; }
  else if (/Android/i.test(ua)) { os = 'Android'; osVersion = ua.match(/Android (\d+(\.\d+)?)/)?.[1] || ''; }
  else if (/iPhone|iPad/i.test(ua)) { os = 'iOS'; osVersion = ua.match(/OS (\d+[._]\d+)/)?.[1]?.replace('_', '.') || ''; }
  else if (/Linux/i.test(ua)) { os = 'Linux'; }

  if (/Edg\//i.test(ua)) { browser = 'Edge'; browserVersion = ua.match(/Edg\/(\d+(\.\d+)?)/)?.[1] || ''; }
  else if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) { browser = 'Chrome'; browserVersion = ua.match(/Chrome\/(\d+(\.\d+)?)/)?.[1] || ''; }
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) { browser = 'Safari'; browserVersion = ua.match(/Version\/(\d+(\.\d+)?)/)?.[1] || ''; }
  else if (/Firefox\//.test(ua)) { browser = 'Firefox'; browserVersion = ua.match(/Firefox\/(\d+(\.\d+)?)/)?.[1] || ''; }

  if (/iPhone/i.test(ua)) device = 'iPhone';
  else if (/iPad/i.test(ua)) device = 'iPad';
  else if (isMobile) device = 'Mobile';

  return { os, osVersion, browser, browserVersion, device, isMobile };
}

function getNodeInfo(node: Node | null): EventLog['node'] {
  if (!node) return null;
  const el = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  return {
    nodeName: node.nodeName,
    id: el?.id || undefined,
    className: el?.className || undefined,
    textContent: node.textContent?.substring(0, 50) || undefined,
  };
}

function getParentInfo(node: Node | null): EventLog['parent'] {
  if (!node) return null;
  const parent = node.nodeType === Node.ELEMENT_NODE ? (node as Element) : node.parentElement;
  if (!parent) return null;
  return {
    nodeName: parent.nodeName,
    id: parent.id || undefined,
    className: parent.className || undefined,
  };
}

function getSiblingInfo(sibling: Node | null): SiblingInfo | null {
  if (!sibling) return null;
  const info: SiblingInfo = { nodeName: sibling.nodeName };
  if (sibling.nodeType === Node.ELEMENT_NODE) {
    const el = sibling as Element;
    if (el.id) info.id = el.id;
    if (el.className) info.className = el.className;
  } else if (sibling.nodeType === Node.TEXT_NODE) {
    const text = sibling.textContent || '';
    info.textPreview = text.length > 20 ? text.substring(0, 20) + '...' : text;
  }
  return info;
}

function getChildPosition(node: Node): { index: number; count: number } | null {
  const parent = node.parentNode;
  if (!parent) return null;
  const children = parent.childNodes;
  for (let i = 0; i < children.length; i++) {
    if (children[i] === node) {
      return { index: i, count: children.length };
    }
  }
  return null;
}

function checkBoundaryAtNode(node: Node, offset: number): { type: 'start' | 'end'; element: string } | null {
  const parent = node.parentElement;
  if (!parent) return null;
  const blockElements = ['P', 'DIV', 'SECTION', 'ARTICLE', 'MAIN', 'HEADER', 'FOOTER'];
  if (blockElements.includes(parent.nodeName)) return null;
  const textLength = node.textContent?.length || 0;
  if (offset === 0) return { type: 'start', element: parent.nodeName };
  if (offset === textLength && textLength > 0) return { type: 'end', element: parent.nodeName };
  return null;
}

// Format node as NODENAME#id.className (skip id/className for #text nodes)
function formatNodePath(nodeName: string, id?: string, className?: string): string {
  // #text nodes don't have id or className, just return the node name
  if (nodeName === '#text') return '#text';
  
  const idPart = id ? `#${id}` : '';
  const clsPart = className ? `.${className.split(' ')[0]}` : '';
  return `${nodeName}${idPart}${clsPart}`;
}

// Normalize special characters to visible tokens for debugging
function normalizeDebugText(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .replace(/\uFEFF/g, '<zwnbsp>')    // Zero Width No-Break Space
    .replace(/\u00A0/g, '<nbsp>')      // Non-Breaking Space
    .replace(/\n/g, '<lf>')            // Line Feed
    .replace(/\r/g, '<cr>')            // Carriage Return
    .replace(/\t/g, '<tab>')           // Tab
    .replace(/ /g, '<space>');         // Regular Space (last to avoid double-replacement)
}

// Special character token styles
const specialCharStyles: Record<string, React.CSSProperties> = {
  zwnbsp: { background: '#fef3c7', color: '#92400e', padding: '0 2px', borderRadius: '2px', fontSize: '0.55rem' },
  nbsp: { background: '#dbeafe', color: '#1e40af', padding: '0 2px', borderRadius: '2px', fontSize: '0.55rem' },
  space: { background: '#e5e7eb', color: '#374151', padding: '0 2px', borderRadius: '2px', fontSize: '0.55rem' },
  lf: { background: '#dcfce7', color: '#166534', padding: '0 2px', borderRadius: '2px', fontSize: '0.55rem' },
  cr: { background: '#fce7f3', color: '#9d174d', padding: '0 2px', borderRadius: '2px', fontSize: '0.55rem' },
  tab: { background: '#f3e8ff', color: '#6b21a8', padding: '0 2px', borderRadius: '2px', fontSize: '0.55rem' },
};

// Render text with special character highlighting
function DebugText({ text }: { text: string | null | undefined }) {
  if (!text) return <span style={{ color: 'var(--text-muted)' }}>-</span>;
  
  const normalized = normalizeDebugText(text);
  const parts: React.ReactNode[] = [];
  let key = 0;
  
  // Split by special character tokens
  const regex = /<(zwnbsp|nbsp|space|lf|cr|tab)>/g;
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(normalized)) !== null) {
    // Add text before the token
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{normalized.slice(lastIndex, match.index)}</span>);
    }
    // Add the styled token
    const tokenType = match[1] as keyof typeof specialCharStyles;
    parts.push(
      <span key={key++} style={specialCharStyles[tokenType]}>
        {`<${tokenType}>`}
      </span>
    );
    lastIndex = regex.lastIndex;
  }
  
  // Add remaining text
  if (lastIndex < normalized.length) {
    parts.push(<span key={key++}>{normalized.slice(lastIndex)}</span>);
  }
  
  return <>{parts}</>;
}

// Render text with cursor/selection position visualization
function TextWithCursor({ 
  text, 
  startOffset, 
  endOffset 
}: { 
  text: string | null | undefined; 
  startOffset: number; 
  endOffset: number;
}) {
  if (!text) return <span style={{ color: 'var(--text-muted)' }}>-</span>;
  
  const isCollapsed = startOffset === endOffset;
  const start = Math.min(startOffset, text.length);
  const end = Math.min(endOffset, text.length);
  
  const beforeText = text.slice(0, start);
  const selectedText = text.slice(start, end);
  const afterText = text.slice(end);
  
  const cursorStyle: React.CSSProperties = {
    color: '#ef4444',
    fontWeight: 700,
    fontSize: '0.7rem',
  };
  
  const selectionStyle: React.CSSProperties = {
    background: '#bfdbfe',
    color: '#1e40af',
    borderRadius: '2px',
    padding: '0 1px',
  };
  
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem' }}>
      "<DebugText text={beforeText} />
      {isCollapsed ? (
        <span style={cursorStyle}>|</span>
      ) : (
        <span style={selectionStyle}>[<DebugText text={selectedText} />]</span>
      )}
      <DebugText text={afterText} />"
    </span>
  );
  
  return <>{parts}</>;
}

// Simple diff algorithm - finds common prefix and suffix, marks the difference
function computeDiff(before: string, after: string): { commonPrefix: string; removed: string; added: string; commonSuffix: string } {
  let i = 0;
  while (i < before.length && i < after.length && before[i] === after[i]) {
    i++;
  }
  const commonPrefix = before.slice(0, i);
  
  let j = 0;
  const beforeRest = before.slice(i);
  const afterRest = after.slice(i);
  while (j < beforeRest.length && j < afterRest.length && 
         beforeRest[beforeRest.length - 1 - j] === afterRest[afterRest.length - 1 - j]) {
    j++;
  }
  
  const commonSuffix = j > 0 ? beforeRest.slice(-j) : '';
  const removed = j > 0 ? beforeRest.slice(0, -j) : beforeRest;
  const added = j > 0 ? afterRest.slice(0, -j) : afterRest;
  
  return { commonPrefix, removed, added, commonSuffix };
}

// HTML Syntax Highlighter
function highlightHtml(html: string): React.ReactNode {
  if (!html) return null;
  
  const parts: React.ReactNode[] = [];
  let key = 0;
  
  // Simple regex-based tokenizer
  const regex = /(<\/?)([\w-]+)([^>]*?)(\/?>)|([^<]+)/g;
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    if (match[5]) {
      // Text content
      parts.push(<span key={key++} style={{ color: 'var(--text-primary)' }}>{match[5]}</span>);
    } else {
      // Tag
      const [, open, tagName, attrs, close] = match;
      parts.push(
        <span key={key++}>
          <span style={{ color: '#6b7280' }}>{open}</span>
          <span style={{ color: '#ef4444' }}>{tagName}</span>
          {attrs && <span style={{ color: '#3b82f6' }}>{attrs}</span>}
          <span style={{ color: '#6b7280' }}>{close}</span>
        </span>
      );
    }
  }
  
  return parts;
}

// HTML Syntax Highlighter with diff marks
function highlightHtmlWithDiff(html: string, diffParts: string[], diffType: 'removed' | 'added'): React.ReactNode {
  if (!html) return null;
  
  const parts: React.ReactNode[] = [];
  let key = 0;
  
  const diffStyle = diffType === 'removed' 
    ? { background: '#fee2e2', color: '#991b1b', textDecoration: 'line-through' }
    : { background: '#dcfce7', color: '#166534' };
  
  // Simple regex-based tokenizer
  const regex = /(<\/?)([\w-]+)([^>]*?)(\/?>)|([^<]+)/g;
  let match;
  let currentPos = 0;
  
  while ((match = regex.exec(html)) !== null) {
    const matchStart = match.index;
    const matchEnd = matchStart + match[0].length;
    
    // Check if this part contains diff
    const isDiffPart = diffParts.some(dp => {
      if (!dp) return false;
      const dpStart = html.indexOf(dp);
      return dpStart !== -1 && dpStart < matchEnd && dpStart + dp.length > matchStart;
    });
    
    if (match[5]) {
      // Text content
      const textContent = match[5];
      // Check if this text contains the diff
      let hasRenderedDiff = false;
      for (const dp of diffParts) {
        if (dp && textContent.includes(dp)) {
          const idx = textContent.indexOf(dp);
          parts.push(<span key={key++} style={{ color: 'var(--text-primary)' }}>{textContent.slice(0, idx)}</span>);
          parts.push(<span key={key++} style={diffStyle}>{dp}</span>);
          parts.push(<span key={key++} style={{ color: 'var(--text-primary)' }}>{textContent.slice(idx + dp.length)}</span>);
          hasRenderedDiff = true;
          break;
        }
      }
      if (!hasRenderedDiff) {
        parts.push(<span key={key++} style={{ color: 'var(--text-primary)' }}>{textContent}</span>);
      }
    } else {
      // Tag
      const [, open, tagName, attrs, close] = match;
      const tagIsDiff = isDiffPart;
      parts.push(
        <span key={key++} style={tagIsDiff ? diffStyle : undefined}>
          <span style={{ color: tagIsDiff ? undefined : '#6b7280' }}>{open}</span>
          <span style={{ color: tagIsDiff ? undefined : '#ef4444' }}>{tagName}</span>
          {attrs && <span style={{ color: tagIsDiff ? undefined : '#3b82f6' }}>{attrs}</span>}
          <span style={{ color: tagIsDiff ? undefined : '#6b7280' }}>{close}</span>
        </span>
      );
    }
    currentPos = matchEnd;
  }
  
  return parts;
}

// Render HTML with diff highlighting
function DomDiffView({ before, after, type }: { before: string; after: string; type: 'before' | 'after' }) {
  const diff = useMemo(() => computeDiff(before || '', after || ''), [before, after]);
  const html = type === 'before' ? before : after;
  
  if (!html) {
    return <span style={{ color: 'var(--text-muted)' }}>{type === 'before' ? '(입력 전 DOM)' : '(입력 후 DOM)'}</span>;
  }
  
  // If no difference or same
  if (!diff.removed && !diff.added) {
    return <>{highlightHtml(html)}</>;
  }
  
  const parts: React.ReactNode[] = [];
  let key = 0;
  
  // Common prefix (no highlighting)
  if (diff.commonPrefix) {
    parts.push(<span key={key++}>{highlightHtml(diff.commonPrefix)}</span>);
  }
  
  // Diff part
  if (type === 'before' && diff.removed) {
    parts.push(
      <span key={key++} style={{ background: '#fee2e2', color: '#991b1b', textDecoration: 'line-through', borderRadius: '2px', padding: '0 2px' }}>
        {diff.removed}
      </span>
    );
  } else if (type === 'after' && diff.added) {
    parts.push(
      <span key={key++} style={{ background: '#dcfce7', color: '#166534', borderRadius: '2px', padding: '0 2px' }}>
        {diff.added}
      </span>
    );
  }
  
  // Common suffix (no highlighting)
  if (diff.commonSuffix) {
    parts.push(<span key={key++}>{highlightHtml(diff.commonSuffix)}</span>);
  }
  
  return <>{parts}</>;
}

// ============================================================
// Main Component
// ============================================================

export function Playground() {
  const editorRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<RangeVisualizer | null>(null);
  const logsRef = useRef<EventLog[]>([]);
  const rangesRef = useRef<{ sel?: Range; comp?: Range; bi?: Range; input?: Range }>({});
  const startTimeRef = useRef<number>(Date.now());
  const [phases, setPhases] = useState<PhaseBlock[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [domBefore, setDomBefore] = useState<string>('');
  const [domAfter, setDomAfter] = useState<string>('');
  const environment = useMemo(() => detectEnvironment(), []);

  const sampleHtml = useMemo(() => `<p id="para-1" class="paragraph intro">일반 텍스트 <a id="link-1" href="https://example.com" class="external-link" data-type="url">링크텍스트</a> 뒤에 이어지는 글</p>
<p id="para-2" class="paragraph content"><b id="bold-1" class="emphasis strong">굵은글씨</b>와 <i id="italic-1" class="emphasis italic">이탤릭</i> 그리고 <span id="span-blue" class="colored" style="color:blue" data-color="blue">파란색</span> 텍스트</p>
<p id="para-3" class="paragraph nested">중첩: <b id="bold-nested" class="emphasis"><i id="italic-nested" class="inner">굵은이탤릭</i></b> | <a id="link-2" href="#section" class="internal-link"><b id="bold-link" class="link-text">굵은링크</b></a></p>
<p id="para-4" class="paragraph boundary-test">경계: <code id="code-1" class="inline-code" data-lang="text">코드블록</code>끝 | 시작<mark id="mark-1" class="highlight" data-highlight="yellow">하이라이트</mark>끝</p>
<p id="para-5" class="paragraph complex">복잡한 구조: <span id="outer" class="wrapper level-1"><span id="middle" class="wrapper level-2"><span id="inner" class="wrapper level-3" data-depth="3">깊은 중첩</span></span></span> 후 텍스트</p>
<ul id="list-1" class="list unordered"><li id="item-1" class="list-item">목록 <b class="item-bold">항목1</b></li><li id="item-2" class="list-item">목록 <i class="item-italic">항목2</i></li></ul>`, []);

  // Initialize editor and visualizer
  useEffect(() => {
    if (editorRef.current && overlayRef.current) {
      editorRef.current.innerHTML = sampleHtml;
      visualizerRef.current = new RangeVisualizer(editorRef.current, overlayRef.current);
    }
    return () => {
      visualizerRef.current?.destroy();
    };
  }, []);

  const drawVisualization = useCallback(() => {
    if (!visualizerRef.current || !editorRef.current || !overlayRef.current) return;

    const ranges: RangeDrawInfo[] = [];
    const r = rangesRef.current;
    const base = overlayRef.current.getBoundingClientRect();
    const boundaryMarkers: { x: number; y: number; height: number; type: 'start' | 'end'; color: string }[] = [];

    if (r.sel && !r.sel.collapsed) {
      ranges.push({ range: r.sel, fill: 'rgba(59, 130, 246, 0.3)', stroke: 'rgba(59, 130, 246, 1)', heightScale: 1 });
    }
    if (r.comp) {
      ranges.push({ range: r.comp, fill: 'rgba(139, 92, 246, 0.3)', stroke: 'rgba(139, 92, 246, 1)', heightScale: 1.3 });
    }
    if (r.bi) {
      ranges.push({ range: r.bi, fill: 'rgba(249, 115, 22, 0.3)', stroke: 'rgba(249, 115, 22, 1)', heightScale: 1.5 });
    }
    if (r.input) {
      ranges.push({ range: r.input, fill: 'rgba(34, 197, 94, 0.3)', stroke: 'rgba(34, 197, 94, 1)', heightScale: 1.7 });
    }

    visualizerRef.current.drawRanges(ranges);

    if (r.sel) {
      const startBoundary = checkBoundaryAtNode(r.sel.startContainer, r.sel.startOffset);
      const endBoundary = checkBoundaryAtNode(r.sel.endContainer, r.sel.endOffset);

      if (startBoundary) {
        try {
          const tempRange = document.createRange();
          tempRange.setStart(r.sel.startContainer, r.sel.startOffset);
          tempRange.setEnd(r.sel.startContainer, Math.min(r.sel.startOffset + 1, r.sel.startContainer.textContent?.length || 0));
          const rect = tempRange.getBoundingClientRect();
          if (rect.width > 0 || rect.height > 0) {
            boundaryMarkers.push({
              x: rect.left - base.left + editorRef.current!.scrollLeft,
              y: rect.top - base.top + editorRef.current!.scrollTop,
              height: rect.height,
              type: startBoundary.type,
              color: '#f59e0b',
            });
          }
        } catch { /* ignore */ }
      }

      if (endBoundary && !r.sel.collapsed) {
        try {
          const tempRange = document.createRange();
          tempRange.setStart(r.sel.endContainer, Math.max(0, r.sel.endOffset - 1));
          tempRange.setEnd(r.sel.endContainer, r.sel.endOffset);
          const rect = tempRange.getBoundingClientRect();
          if (rect.width > 0 || rect.height > 0) {
            boundaryMarkers.push({
              x: rect.right - base.left + editorRef.current!.scrollLeft,
              y: rect.top - base.top + editorRef.current!.scrollTop,
              height: rect.height,
              type: endBoundary.type,
              color: '#ef4444',
            });
          }
        } catch { /* ignore */ }
      }

      visualizerRef.current.drawBoundaryMarkers(boundaryMarkers);
    } else {
      visualizerRef.current.drawBoundaryMarkers([]);
    }
  }, []);

  const updatePhaseView = useCallback(() => {
    const logs = logsRef.current;
    if (logs.length === 0) return;

    let lastSel: EventLog | null = null;
    let lastComp: EventLog | null = null;
    let lastBi: EventLog | null = null;
    let lastIn: EventLog | null = null;

    for (let i = logs.length - 1; i >= 0; i--) {
      const log = logs[i];
      if (log.type === 'selectionchange' && !lastSel) lastSel = log;
      else if ((log.type === 'compositionstart' || log.type === 'compositionupdate' || log.type === 'compositionend') && !lastComp) lastComp = log;
      else if (log.type === 'beforeinput' && !lastBi) lastBi = log;
      else if (log.type === 'input' && !lastIn) lastIn = log;
      if (lastSel && lastComp && lastBi && lastIn) break;
    }

    const timestamps = [lastSel?.timestamp, lastComp?.timestamp, lastBi?.timestamp, lastIn?.timestamp].filter(Boolean) as number[];
    const baseTs = timestamps.length > 0 ? Math.min(...timestamps) : startTimeRef.current;

    const newAnomalies: Anomaly[] = [];
    
    // 1. Parent mismatch detection
    if (lastBi && lastIn) {
      const biParent = lastBi.parent;
      const inParent = lastIn.parent;
      if (biParent && inParent) {
        const biKey = `${biParent.nodeName}${biParent.id ? '#' + biParent.id : ''}`;
        const inKey = `${inParent.nodeName}${inParent.id ? '#' + inParent.id : ''}`;
        if (biKey !== inKey) {
          newAnomalies.push({
            type: 'parent-mismatch',
            description: 'beforeinput과 input의 parent 요소가 다름',
            detail: `${biKey} → ${inKey}`,
          });
        }
      }
    }

    // 2. Boundary input detection
    if (lastBi && lastBi.startBoundary) {
      newAnomalies.push({
        type: 'boundary-input',
        description: '인라인 요소 경계에서 입력 발생',
        detail: `${lastBi.startBoundary.element} ${lastBi.startBoundary.type} 경계 (offset: ${lastBi.startOffset})`,
      });
    }

    // 3. Node type change detection
    if (lastBi && lastIn) {
      const biNode = lastBi.node?.nodeName;
      const inNode = lastIn.node?.nodeName;
      if (biNode && inNode && biNode !== inNode) {
        newAnomalies.push({
          type: 'node-type-change',
          description: '노드 타입이 변경됨',
          detail: `${biNode} → ${inNode}`,
        });
      }
    }

    // 4. Text leak detection (text moved outside its container)
    if (lastBi && lastIn && lastBi.parent && lastIn.parent) {
      // If beforeinput was in an inline element but input landed in a block parent
      const biParentName = lastBi.parent.nodeName;
      const inParentName = lastIn.parent.nodeName;
      const inlineElements = ['A', 'B', 'I', 'STRONG', 'EM', 'SPAN', 'CODE', 'MARK', 'U', 'S'];
      const blockElements = ['P', 'DIV', 'LI', 'TD', 'TH', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
      
      if (inlineElements.includes(biParentName) && blockElements.includes(inParentName)) {
        newAnomalies.push({
          type: 'text-leak',
          description: '텍스트가 인라인 요소 밖으로 이동함',
          detail: `${biParentName} → ${inParentName}`,
        });
      }
    }

    // 5. Sibling created detection
    if (lastBi && lastIn) {
      const biChildCount = lastBi.childCount;
      const inChildCount = lastIn.childCount;
      if (biChildCount !== undefined && inChildCount !== undefined && inChildCount > biChildCount) {
        newAnomalies.push({
          type: 'sibling-created',
          description: '새로운 sibling 노드가 생성됨',
          detail: `childCount: ${biChildCount} → ${inChildCount}`,
        });
      }
    }

    // 6. Selection jump detection
    if (lastSel && lastIn) {
      const selParent = lastSel.parent;
      const inParent = lastIn.parent;
      if (selParent && inParent && selParent.id && inParent.id && selParent.id !== inParent.id) {
        // Selection was in a different element before input
        newAnomalies.push({
          type: 'selection-jump',
          description: '선택 영역이 다른 요소로 점프함',
          detail: `${selParent.nodeName}#${selParent.id} → ${inParent.nodeName}#${inParent.id}`,
        });
      }
    }

    // 7. Composition data mismatch
    if (lastComp && lastIn && lastComp.data && lastIn.data) {
      // Check if composition data doesn't end with input data (indicates unexpected change)
      if (!lastComp.data.includes(lastIn.data) && !lastIn.data.includes(lastComp.data)) {
        newAnomalies.push({
          type: 'composition-mismatch',
          description: 'composition과 input 데이터가 다름',
          detail: `comp: "${lastComp.data}" vs input: "${lastIn.data}"`,
        });
      }
    }

    // 8. Missing beforeinput detection
    if (lastIn && !lastBi) {
      newAnomalies.push({
        type: 'missing-beforeinput',
        description: 'beforeinput 없이 input만 발생',
        detail: `inputType: ${lastIn.inputType || 'unknown'}, data: "${lastIn.data || ''}"`,
      });
    }

    setAnomalies(newAnomalies);

    const blocks: PhaseBlock[] = [];
    if (lastSel) blocks.push({ title: 'SELECTION', type: 'selectionchange', log: lastSel, delta: lastSel.timestamp - baseTs });
    if (lastComp) blocks.push({ title: 'COMPOSITION', type: lastComp.type, log: lastComp, delta: lastComp.timestamp - baseTs });
    if (lastBi) blocks.push({
      title: 'BEFOREINPUT',
      type: 'beforeinput',
      log: lastBi,
      delta: lastBi.timestamp - baseTs,
      highlight: newAnomalies.some(a => a.type === 'boundary-input') ? 'warning' : undefined,
    });
    if (lastIn) blocks.push({
      title: 'INPUT',
      type: 'input',
      log: lastIn,
      delta: lastIn.timestamp - baseTs,
      highlight: newAnomalies.some(a => ['parent-mismatch', 'text-leak', 'node-type-change', 'sibling-created', 'missing-beforeinput'].includes(a.type)) ? 'error' : undefined,
    });

    setPhases(blocks);
    drawVisualization();
  }, [drawVisualization]);

  const createLog = useCallback((
    type: EventLog['type'],
    range: Range | null,
    extra: Partial<EventLog> = {}
  ): Omit<EventLog, 'id'> => {
    const startContainer = range?.startContainer || null;
    const startBoundary = startContainer ? checkBoundaryAtNode(startContainer, range?.startOffset || 0) : null;
    const endBoundary = range?.endContainer ? checkBoundaryAtNode(range.endContainer, range?.endOffset || 0) : null;
    
    // Get sibling info
    let leftSibling: SiblingInfo | null = null;
    let rightSibling: SiblingInfo | null = null;
    let childIndex: number | undefined;
    let childCount: number | undefined;
    
    if (startContainer) {
      leftSibling = getSiblingInfo(startContainer.previousSibling);
      rightSibling = getSiblingInfo(startContainer.nextSibling);
      const pos = getChildPosition(startContainer);
      if (pos) {
        childIndex = pos.index;
        childCount = pos.count;
      }
    }

    // Check if start and end containers are different
    const endContainer = range?.endContainer || null;
    const isDifferentContainer = range && range.startContainer !== range.endContainer;

    return {
      timestamp: Date.now(),
      type,
      // Start container info
      parent: range ? getParentInfo(range.startContainer) : null,
      node: range ? getNodeInfo(range.startContainer) : null,
      startOffset: range?.startOffset ?? 0,
      startContainerText: range?.startContainer.textContent || undefined,
      // End container info (only if different from start)
      endParent: isDifferentContainer && endContainer ? getParentInfo(endContainer) : null,
      endNode: isDifferentContainer && endContainer ? getNodeInfo(endContainer) : null,
      endOffset: range?.endOffset ?? 0,
      endContainerText: isDifferentContainer ? range?.endContainer.textContent || undefined : undefined,
      range,
      startBoundary,
      endBoundary,
      leftSibling,
      rightSibling,
      childIndex,
      childCount,
      ...extra,
    };
  }, []);

  const pushLog = useCallback((log: Omit<EventLog, 'id'>) => {
    logsRef.current = [...logsRef.current.slice(-49), { ...log, id: Date.now() + Math.random() }];
    
    if (log.range) {
      if (log.type === 'selectionchange') rangesRef.current.sel = log.range;
      else if (log.type.startsWith('composition')) rangesRef.current.comp = log.range;
      else if (log.type === 'beforeinput') rangesRef.current.bi = log.range;
      else if (log.type === 'input') rangesRef.current.input = log.range;
    }

    updatePhaseView();
  }, [updatePhaseView]);

  useEffect(() => {
    const handleSelectionChange = () => {
      if (!editorRef.current?.contains(document.activeElement)) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0).cloneRange();
      pushLog(createLog('selectionchange', range));
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, [pushLog, createLog]);

  // Use native event listeners for more reliable event capture
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleBeforeInput = (e: InputEvent) => {
      setDomBefore(editor.innerHTML);
      const sel = window.getSelection();
      const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
      pushLog(createLog('beforeinput', range, { inputType: e.inputType, data: e.data, isComposing: e.isComposing }));
    };

    const handleInput = (e: Event) => {
      const inputEvent = e as InputEvent;
      setDomAfter(editor.innerHTML);
      const sel = window.getSelection();
      const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
      pushLog(createLog('input', range, { inputType: inputEvent.inputType, data: inputEvent.data }));
    };

    const handleCompositionStart = (e: CompositionEvent) => {
      const sel = window.getSelection();
      const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
      pushLog(createLog('compositionstart', range, { data: e.data }));
    };

    const handleCompositionUpdate = (e: CompositionEvent) => {
      const sel = window.getSelection();
      const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
      pushLog(createLog('compositionupdate', range, { data: e.data }));
    };

    const handleCompositionEnd = (e: CompositionEvent) => {
      const sel = window.getSelection();
      const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
      pushLog(createLog('compositionend', range, { data: e.data }));
    };

    // Use native event listeners with capture phase for better reliability
    editor.addEventListener('beforeinput', handleBeforeInput, { capture: true });
    editor.addEventListener('input', handleInput, { capture: true });
    editor.addEventListener('compositionstart', handleCompositionStart, { capture: true });
    editor.addEventListener('compositionupdate', handleCompositionUpdate, { capture: true });
    editor.addEventListener('compositionend', handleCompositionEnd, { capture: true });

    return () => {
      editor.removeEventListener('beforeinput', handleBeforeInput, { capture: true });
      editor.removeEventListener('input', handleInput, { capture: true });
      editor.removeEventListener('compositionstart', handleCompositionStart, { capture: true });
      editor.removeEventListener('compositionupdate', handleCompositionUpdate, { capture: true });
      editor.removeEventListener('compositionend', handleCompositionEnd, { capture: true });
    };
  }, [pushLog, createLog]);

  const resetAll = useCallback(() => {
    logsRef.current = [];
    rangesRef.current = {};
    setPhases([]);
    setAnomalies([]);
    setDomBefore('');
    setDomAfter('');
    startTimeRef.current = Date.now();
    visualizerRef.current?.clear();
    if (editorRef.current) editorRef.current.innerHTML = sampleHtml;
  }, [sampleHtml]);

  const copyReport = useCallback(() => {
    const lines: string[] = [
      '# ContentEditable 이벤트 분석',
      '',
      '## 환경 정보',
      `- OS: ${environment.os} ${environment.osVersion}`,
      `- Browser: ${environment.browser} ${environment.browserVersion}`,
      `- Device: ${environment.device}`,
      '',
    ];

    if (anomalies.length > 0) {
      lines.push('## ⚠️ 감지된 비정상 동작');
      anomalies.forEach(a => lines.push(`- **${a.type}**: ${a.description}\n  - ${a.detail}`));
      lines.push('');
    }

    lines.push('## 이벤트 로그', '```');
    phases.forEach(phase => {
      if (!phase.log) return;
      const log = phase.log;
      lines.push(`=== ${phase.title} (Δ=${phase.delta}ms) ===`);
      lines.push(`type: ${log.type} (${log.inputType || '-'})`);
      lines.push(`parent: ${log.parent?.nodeName || '-'}${log.parent?.id ? '#' + log.parent.id : ''}`);
      lines.push(`  node: ${log.node?.nodeName || '-'}`);
      lines.push(`offset: start=${log.startOffset}, end=${log.endOffset}`);
      if (log.childIndex !== undefined) lines.push(`index: ${log.childIndex} / ${log.childCount}`);
      if (log.leftSibling) lines.push(`left: ${log.leftSibling.nodeName}${log.leftSibling.id ? '#' + log.leftSibling.id : ''}`);
      if (log.rightSibling) lines.push(`right: ${log.rightSibling.nodeName}${log.rightSibling.id ? '#' + log.rightSibling.id : ''}`);
      if (log.data) lines.push(`data: "${normalizeDebugText(log.data)}"`);
      lines.push('');
    });
    lines.push('```', '', '## DOM Before', '```html', domBefore || '(empty)', '```', '', '## DOM After', '```html', domAfter || '(empty)', '```');

    navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
  }, [environment, anomalies, phases, domBefore, domAfter]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1, minHeight: 0 }}>
      {/* Left: Editor */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}>
        {/* Environment */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem',
          background: 'var(--accent-primary-light)', border: '1px solid var(--accent-primary)',
          borderRadius: '6px', fontSize: '0.7rem',
        }}>
          <span style={{ fontWeight: 600 }}>🔍</span>
          <span>{environment.os} {environment.osVersion}</span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span>{environment.browser} {environment.browserVersion}</span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span>{environment.device}</span>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '0.75rem', padding: '0.3rem 0.75rem', background: 'var(--bg-muted)', borderRadius: '6px', fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, background: 'rgba(59,130,246,0.4)', border: '2px solid #3b82f6', borderRadius: 2, marginRight: 3, verticalAlign: 'middle' }}></span>SEL</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, background: 'rgba(139,92,246,0.4)', border: '2px solid #8b5cf6', borderRadius: 2, marginRight: 3, verticalAlign: 'middle' }}></span>COMP</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, background: 'rgba(249,115,22,0.4)', border: '2px solid #f97316', borderRadius: 2, marginRight: 3, verticalAlign: 'middle' }}></span>BI</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, background: 'rgba(34,197,94,0.4)', border: '2px solid #22c55e', borderRadius: 2, marginRight: 3, verticalAlign: 'middle' }}></span>IN</span>
        </div>

        {/* Editor & DOM Diff */}
        <div style={{ flex: 1, display: 'grid', gridTemplateRows: '1fr 1fr', gap: '0.5rem', minHeight: 0 }}>
          {/* Editor with overlay wrapper */}
          <div ref={overlayRef} style={{ position: 'relative', minHeight: 0 }}>
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              style={{ height: '100%', padding: '0.75rem', fontSize: '1rem', lineHeight: 1.8, outline: 'none', background: 'var(--bg-surface)', border: '2px solid var(--accent-primary)', borderRadius: '8px', overflowY: 'auto', boxSizing: 'border-box' }}
            />
          </div>

          {/* DOM Diff with syntax highlighting */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', minHeight: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                Before {domBefore && domAfter && domBefore !== domAfter && <span style={{ color: '#dc2626', fontSize: '0.55rem' }}>(-)</span>}
              </div>
              <div style={{ flex: 1, fontSize: '0.55rem', padding: '0.4rem', background: 'var(--bg-muted)', borderRadius: '4px', overflow: 'auto', fontFamily: 'var(--font-mono)', lineHeight: 1.4, border: '1px solid var(--border-light)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                <DomDiffView before={domBefore} after={domAfter} type="before" />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                After {domBefore && domAfter && domBefore !== domAfter && <span style={{ color: '#16a34a', fontSize: '0.55rem' }}>(+)</span>}
              </div>
              <div style={{ flex: 1, fontSize: '0.55rem', padding: '0.4rem', background: 'var(--bg-muted)', borderRadius: '4px', overflow: 'auto', fontFamily: 'var(--font-mono)', lineHeight: 1.4, border: '1px solid var(--border-light)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                <DomDiffView before={domBefore} after={domAfter} type="after" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={resetAll} style={{ padding: '0.35rem 0.65rem', fontSize: '0.7rem', borderRadius: '6px', border: '1px solid var(--border-light)', background: 'var(--bg-surface)', color: 'var(--text-primary)', cursor: 'pointer' }}>
            🗑️ 초기화
          </button>
          <button type="button" onClick={copyReport} style={{ padding: '0.35rem 0.65rem', fontSize: '0.7rem', borderRadius: '6px', border: 'none', background: 'var(--accent-primary)', color: 'white', cursor: 'pointer' }}>
            📋 리포트 복사
          </button>
        </div>
      </div>

      {/* Right: Event Phases */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', overflow: 'auto', minHeight: 0 }}>
        {/* Anomalies */}
        {anomalies.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {anomalies.map((a, i) => (
              <div key={i} style={{ 
                padding: '0.3rem 0.5rem', 
                background: '#fef2f2', 
                border: '1px solid #ef4444', 
                borderRadius: '4px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: '#dc2626', fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                    ⚠️ {a.type}
                  </span>
                  <span style={{ fontSize: '0.6rem', color: '#991b1b' }}>{a.description}</span>
                </div>
                <code style={{ fontSize: '0.55rem', color: '#7f1d1d', display: 'block', marginTop: '0.2rem' }}>
                  {a.detail}
                </code>
              </div>
            ))}
          </div>
        )}

        {/* Phase Blocks */}
        {phases.length === 0 ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-muted)', borderRadius: '8px', fontSize: '0.8rem' }}>
            에디터에 입력하면 이벤트가 여기에 표시됩니다.
          </div>
        ) : (
          phases.map((phase, i) => <PhaseBlockView key={i} phase={phase} />)
        )}
      </div>
    </div>
  );
}

// ============================================================
// Phase Block Component
// ============================================================

function PhaseBlockView({ phase }: { phase: PhaseBlock }) {
  const log = phase.log;
  if (!log) return null;

  const isError = phase.highlight === 'error';
  const isWarning = phase.highlight === 'warning';
  const borderColor = isError ? '#ef4444' : isWarning ? '#f59e0b' : 'var(--border-light)';
  const headerBg = isError ? '#fee2e2' : isWarning ? '#fef3c7' : 'var(--bg-muted)';
  const bodyBg = isError ? '#fef2f2' : isWarning ? '#fffbeb' : 'var(--bg-surface)';

  const typeColor: Record<string, string> = {
    selectionchange: '#3b82f6',
    compositionstart: '#8b5cf6',
    compositionupdate: '#8b5cf6',
    compositionend: '#8b5cf6',
    beforeinput: '#f97316',
    input: '#22c55e',
  };

  const formatSibling = (s: SiblingInfo | null | undefined, label: string) => {
    if (!s) return null;
    const path = formatNodePath(s.nodeName, s.id, s.className);
    const text = s.textPreview ? ` "${s.textPreview}"` : '';
    return <Line label={label} value={`${path}${text}`} color="var(--text-muted)" />;
  };

  return (
    <div style={{ border: `1.5px solid ${borderColor}`, borderRadius: '6px', overflow: 'hidden', background: bodyBg }}>
      <div style={{
        padding: '0.3rem 0.5rem',
        background: headerBg,
        borderBottom: `1px solid ${borderColor}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontWeight: 700, fontSize: '0.65rem', color: typeColor[log.type] || 'var(--text-primary)' }}>
          {phase.title}
        </span>
        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Δ={phase.delta}ms</span>
      </div>

      <div style={{ padding: '0.4rem 0.5rem', fontSize: '0.62rem', fontFamily: 'var(--font-mono)', lineHeight: 1.5 }}>
        <Line label="type" value={`${log.type} (${log.inputType || '-'})`} />
        <Line 
          label="parent" 
          value={formatNodePath(log.parent?.nodeName || '-', log.parent?.id, log.parent?.className)} 
          color={typeColor[log.type]} 
        />
        <Line 
          label="  node" 
          value={formatNodePath(log.node?.nodeName || '-', log.node?.id, log.node?.className)} 
        />
        {/* Offset display */}
        {log.endNode ? (
          // Cross-node selection - show detailed Range Selection box
          <div style={{ 
            background: '#fef3c7', 
            border: '1px solid #f59e0b',
            borderRadius: '4px',
            padding: '0.3rem 0.4rem',
            marginTop: '0.2rem',
          }}>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <span style={{ color: '#78350f', minWidth: '35px' }}>start:</span>
              <span style={{ color: '#92400e' }}>
                {log.node?.nodeName === '#text' && log.parent ? (
                  <>{formatNodePath(log.parent.nodeName, log.parent.id, log.parent.className)} &gt; #text @ {log.startOffset}</>
                ) : (
                  <>{formatNodePath(log.node?.nodeName || '-', log.node?.id, log.node?.className)} @ {log.startOffset}</>
                )}
              </span>
            </div>
            <div style={{ 
              display: 'flex', 
              gap: '0.4rem',
              background: '#fed7aa',
              padding: '0.15rem 0.3rem',
              borderRadius: '3px',
              marginLeft: '-0.3rem',
              marginRight: '-0.3rem',
            }}>
              <span style={{ color: '#78350f', minWidth: '35px' }}>end:</span>
              <span style={{ color: '#c2410c', fontWeight: 600 }}>
                {log.endNode.nodeName === '#text' && log.endParent ? (
                  <>{formatNodePath(log.endParent.nodeName, log.endParent.id, log.endParent.className)} &gt; #text @ {log.endOffset}</>
                ) : (
                  <>{formatNodePath(log.endNode.nodeName, log.endNode.id, log.endNode.className)} @ {log.endOffset}</>
                )}
              </span>
            </div>
          </div>
        ) : log.startOffset !== log.endOffset ? (
          // Same node range selection - simple format with range highlight
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <span style={{ color: 'var(--text-muted)', minWidth: '45px' }}>offset:</span>
            <span style={{ 
              background: '#fef3c7', 
              color: '#92400e', 
              padding: '0 4px', 
              borderRadius: '3px',
            }}>
              {log.startOffset}..{log.endOffset} <span style={{ fontSize: '0.55rem' }}>(range: {log.endOffset - log.startOffset})</span>
            </span>
          </div>
        ) : (
          // Collapsed cursor
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <span style={{ color: 'var(--text-muted)', minWidth: '45px' }}>offset:</span>
            <span style={{ color: 'var(--text-primary)' }}>
              {log.startOffset} <span style={{ color: 'var(--text-muted)', fontSize: '0.55rem' }}>(collapsed)</span>
            </span>
          </div>
        )}
        {log.childIndex !== undefined && (
          <Line label="index" value={`${log.childIndex} / ${log.childCount}`} />
        )}
        {formatSibling(log.leftSibling, 'left')}
        {formatSibling(log.rightSibling, 'right')}
        {/* Show data for beforeinput, input, and composition events */}
        {['beforeinput', 'input', 'compositionstart', 'compositionupdate', 'compositionend'].includes(log.type) && (
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <span style={{ color: 'var(--text-muted)', minWidth: '45px' }}>data:</span>
            <span style={{ color: '#22c55e', fontWeight: 600 }}>
              {log.data !== null && log.data !== undefined ? (
                <>"<DebugText text={log.data} />"</>
              ) : (
                <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>null</span>
              )}
            </span>
          </div>
        )}
        {log.isComposing !== undefined && (
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <span style={{ color: 'var(--text-muted)', minWidth: '45px' }}>composing:</span>
            <span style={{ color: log.isComposing ? '#8b5cf6' : '#6b7280', fontWeight: 500 }}>
              {log.isComposing ? 'true' : 'false'}
            </span>
          </div>
        )}
        {/* Show text content with cursor position for #text nodes in input-related events */}
        {['beforeinput', 'input', 'compositionstart', 'compositionupdate', 'compositionend'].includes(log.type) && 
         log.node?.nodeName === '#text' && log.startContainerText && (
          <div style={{ 
            marginTop: '0.3rem',
            padding: '0.3rem 0.4rem',
            background: 'var(--bg-muted)',
            borderRadius: '4px',
            border: '1px solid var(--border-light)',
          }}>
            <TextWithCursor 
              text={log.startContainerText} 
              startOffset={log.startOffset} 
              endOffset={log.endNode ? log.startContainerText.length : log.endOffset} 
            />
          </div>
        )}
        {log.startBoundary && <Line label="⚠️ start" value={`${log.startBoundary.element} ${log.startBoundary.type} 경계`} color="#f59e0b" />}
        {log.endBoundary && <Line label="⚠️ end" value={`${log.endBoundary.element} ${log.endBoundary.type} 경계`} color="#ef4444" />}
      </div>
    </div>
  );
}

function Line({ label, value, color, highlight }: { label: string; value: string; color?: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: '0.4rem' }}>
      <span style={{ color: 'var(--text-muted)', minWidth: '45px' }}>{label}:</span>
      <span style={{ color: highlight ? '#22c55e' : color || 'var(--text-primary)', fontWeight: highlight ? 600 : 400 }}>{value}</span>
    </div>
  );
}
