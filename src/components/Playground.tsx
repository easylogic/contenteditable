import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { EDITOR_PRESETS, type EditorPreset } from '../data/presets';
import { snapshotTextNodes, type TextNodeInfo } from '../utils/text-node-tracker';
import { calculateDeletedRects, detectDomChanges, type DomChangeResult } from '../utils/dom-change-tracker';
import { saveSnapshot, getAllSnapshots, deleteSnapshot, type Snapshot, type SnapshotTrigger } from '../utils/snapshot-db';
import { getTranslation, type Locale, supportedLocales } from '../i18n/translations';
import { TouchHandler, isTouchDevice, type TouchGesture } from '../utils/touch-handler';
import { MobileEventLog } from './MobileEventLog';

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

type TargetRangeInfo = {
  startContainer: string; // nodeName or '#text'
  startOffset: number;
  endContainer: string;
  endOffset: number;
  collapsed: boolean;
};

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
  // getTargetRanges() info (beforeinput only)
  targetRanges?: TargetRangeInfo[];
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
  type?: string; // 'selection' | 'composition' | 'beforeinput' | 'input'
};

type RectDrawInfo = {
  rect: DOMRect;
  fill: string;
  stroke: string;
  label?: string;
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
    const svg = this.ensureSvg();
    // range 레이어만 제거 (다른 레이어는 유지)
    svg.querySelector('g[data-layer="rects"]')?.remove();
    
    if (!ranges || ranges.length === 0) {
      return;
    }
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.dataset.layer = 'rects';
    g.setAttribute('data-ui', 'range-rects');
    svg.appendChild(g);

    // contenteditable 영역의 경계를 기준으로 계산
    const editorRect = this.editorEl.getBoundingClientRect();
    const overlayRect = this.overlayEl.getBoundingClientRect();

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

        // composition 타입인 경우: width가 2 이상일 때만 표시 (공백이 아닌 실제 글자가 있을 때만)
        if (item.type === 'composition' && r.width < 2) {
          continue;
        }

        // contenteditable 영역 내에서만 표시 (스크롤 고려)
        const x = r.left - editorRect.left + this.editorEl.scrollLeft;
        let y = r.top - editorRect.top + this.editorEl.scrollTop;
        let height = r.height;

        // composition 타입인 경우: 아래쪽 1px 높이로 표시
        if (item.type === 'composition') {
          y = r.top - editorRect.top + this.editorEl.scrollTop + r.height - 1;
          height = 1;
        } else if (item.type === 'beforeinput') {
          // beforeinput 타입인 경우: 아래쪽 1px 높이로 표시 (deleted 영역과 겹치지 않도록)
          y = r.top - editorRect.top + this.editorEl.scrollTop + r.height - 1;
          height = 1;
        } else if (heightScale !== 1) {
          const newHeight = r.height * heightScale;
          y -= (newHeight - r.height) / 2;
          height = newHeight;
        }

        // contenteditable 영역 밖이면 스킵
        if (x < 0 || y < 0 || x > editorRect.width || y > editorRect.height + this.editorEl.scrollHeight) {
          continue;
        }

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('data-ui', `range-rect-${item.type || 'unknown'}`);
        rect.setAttribute('x', x.toString());
        rect.setAttribute('y', y.toString());
        rect.setAttribute('width', Math.max(r.width, 2).toString());
        rect.setAttribute('height', height.toString());
        rect.setAttribute('fill', fill);
        rect.setAttribute('stroke', stroke);
        rect.setAttribute('stroke-width', '1');
        g.appendChild(rect);
      }

      // selection 타입인 경우: contenteditable="false" 영역 찾아서 회색으로 표시
      if (item.type === 'selection' && !range.collapsed) {
        this.drawNonEditableAreas(range, g, editorRect);
      }
    }
  }

  /**
   * 선택 영역 내의 contenteditable="false" 요소들을 회색으로 표시
   */
  private drawNonEditableAreas(range: Range, g: SVGGElement, editorRect: DOMRect): void {
    try {
      // Range 내의 모든 요소를 찾기
      const walker = document.createTreeWalker(
        range.commonAncestorContainer,
        NodeFilter.SHOW_ELEMENT,
        null
      );

      const nonEditableElements: Element[] = [];
      let node: Node | null = walker.nextNode();
      
      while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          // Range와 교차하고 contenteditable="false"인 요소만 선택
          if (range.intersectsNode(element)) {
            const contentEditable = element.getAttribute('contenteditable');
            const htmlContentEditable = (element as HTMLElement).contentEditable;
            
            if (contentEditable === 'false' || htmlContentEditable === 'false') {
              nonEditableElements.push(element);
            }
          }
        }
        node = walker.nextNode();
      }

      // 각 요소의 영역을 회색으로 그리기
      for (const element of nonEditableElements) {
        const rects = element.getClientRects();
        for (const r of rects) {
          if (r.width === 0 && r.height === 0) continue;

          const x = r.left - editorRect.left + this.editorEl.scrollLeft;
          const y = r.top - editorRect.top + this.editorEl.scrollTop;
          const height = r.height;

          // contenteditable 영역 밖이면 스킵
          if (x < 0 || y < 0 || x > editorRect.width || y > editorRect.height + this.editorEl.scrollHeight) {
            continue;
          }

          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('data-ui', 'range-rect-noneditable');
          rect.setAttribute('x', x.toString());
          rect.setAttribute('y', y.toString());
          rect.setAttribute('width', Math.max(r.width, 2).toString());
          rect.setAttribute('height', height.toString());
          rect.setAttribute('fill', 'rgba(107, 114, 128, 0.3)'); // 회색
          rect.setAttribute('stroke', 'rgba(107, 114, 128, 0.8)');
          rect.setAttribute('stroke-width', '1');
          g.appendChild(rect);
        }
      }
    } catch (error) {
      // 오류 발생 시 무시
      console.warn('Failed to draw non-editable areas:', error);
    }
  }

  public drawRects(rects: RectDrawInfo[]): void {
    const svg = this.ensureSvg();
    // 기존 DOM 변경 레이어 제거 (input 시점마다 초기화)
    svg.querySelector('g[data-layer="dom-changes"]')?.remove();
    
    if (!rects || rects.length === 0) return;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.dataset.layer = 'dom-changes';
    g.setAttribute('data-ui', 'dom-change-rects');
    // DOM 변경 레이어는 Range 레이어 위에 표시
    svg.appendChild(g);

    const editorRect = this.editorEl.getBoundingClientRect();

    for (const item of rects) {
      const { rect, fill, stroke, label } = item;
      if (rect.width === 0 && rect.height === 0) continue;

      // contenteditable 영역 내에서만 표시 (스크롤 고려)
      const x = rect.left - editorRect.left + this.editorEl.scrollLeft;
      const y = rect.top - editorRect.top + this.editorEl.scrollTop;

      // contenteditable 영역 밖이면 스킵
      if (x < 0 || y < 0 || x > editorRect.width || y > editorRect.height + this.editorEl.scrollHeight) {
        continue;
      }

      const svgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      svgRect.setAttribute('data-ui', `dom-change-rect-${label || 'unknown'}`);
      svgRect.setAttribute('x', x.toString());
      svgRect.setAttribute('y', y.toString());
      svgRect.setAttribute('width', Math.max(rect.width, 2).toString());
      svgRect.setAttribute('height', rect.height.toString());
      svgRect.setAttribute('fill', fill);
      svgRect.setAttribute('stroke', stroke);
      svgRect.setAttribute('stroke-width', '1');
      if (label) {
        svgRect.setAttribute('data-label', label);
      }
      g.appendChild(svgRect);
    }
  }

  /**
   * beforeinput의 targetRanges를 시각화 (삭제될 영역)
   */
  public drawTargetRanges(targetRanges: StaticRange[]): void {
    const svg = this.ensureSvg();
    // 기존 targetRanges 레이어 제거 (새로운 beforeinput마다 초기화)
    svg.querySelector('g[data-layer="target-ranges"]')?.remove();
    
    if (!targetRanges || targetRanges.length === 0) return;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.dataset.layer = 'target-ranges';
    g.setAttribute('data-ui', 'target-ranges');
    svg.appendChild(g);

    const editorRect = this.editorEl.getBoundingClientRect();

    for (let i = 0; i < targetRanges.length; i++) {
      const tr = targetRanges[i];
      try {
        // StaticRange를 Range로 변환
        const range = document.createRange();
        range.setStart(tr.startContainer, tr.startOffset);
        range.setEnd(tr.endContainer, tr.endOffset);
        
        const clientRects = range.getClientRects();
        for (let j = 0; j < clientRects.length; j++) {
          const r = clientRects[j];
          if (r.width === 0 && r.height === 0) continue;

          const x = r.left - editorRect.left + this.editorEl.scrollLeft;
          const y = r.top - editorRect.top + this.editorEl.scrollTop;

          // contenteditable 영역 밖이면 스킵
          if (x < 0 || y < 0 || x > editorRect.width || y > editorRect.height + this.editorEl.scrollHeight) {
            continue;
          }

          const svgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          svgRect.setAttribute('data-ui', `target-range-rect-${i}-${j}`);
          svgRect.setAttribute('x', x.toString());
          svgRect.setAttribute('y', y.toString());
          svgRect.setAttribute('width', Math.max(r.width, 2).toString());
          svgRect.setAttribute('height', r.height.toString());
          svgRect.setAttribute('rx', '2');
          // 노란색 계열로 삭제될 영역 표시
          svgRect.setAttribute('fill', 'rgba(250, 204, 21, 0.3)'); // 노란색 (삭제될 영역)
          svgRect.setAttribute('stroke', 'rgba(250, 204, 21, 0.9)');
          svgRect.setAttribute('stroke-width', '2');
          svgRect.setAttribute('stroke-dasharray', '4 2'); // 점선으로 구별
          svgRect.setAttribute('data-label', 'deleted-target-range');
          g.appendChild(svgRect);
        }
      } catch (error) {
        // StaticRange 변환 실패 시 무시
        console.warn('Failed to visualize targetRange:', error);
      }
    }
  }

  public drawBoundaryMarkers(markers: { x: number; y: number; height: number; type: 'start' | 'end'; color: string }[]): void {
    const svg = this.ensureSvg();
    svg.querySelector('g[data-layer="boundary"]')?.remove();
    if (markers.length === 0) return;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.dataset.layer = 'boundary';
    g.setAttribute('data-ui', 'boundary-markers');
    svg.appendChild(g);

    for (const marker of markers) {
      const { x, y, height, type, color } = marker;
      const triangle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      triangle.setAttribute('data-ui', `boundary-marker-${type}`);
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

  /**
   * 현재 선택된 영역(또는 collapsed 커서 위치) 기준으로 모든 텍스트 노드들의 보이지 않는 문자 위치를 시각화
   * 멀티 블록 선택도 지원
   */
  public drawInvisibleCharacters(): void {
    const svg = this.ensureSvg();
    // 기존 invisible-characters 레이어 제거
    svg.querySelector('g[data-layer="invisible-characters"]')?.remove();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    // collapsed 여부와 관계없이 처리
    // 선택 영역이 여러 블록에 걸쳐 있어도 모든 텍스트 노드를 찾아야 함
    
    // 선택 영역 내의 모든 텍스트 노드를 찾기 위한 범위 결정
    let rootStart: Node = this.editorEl;
    
    if (range.collapsed) {
      // collapsed인 경우: 커서 위치 기준으로 부모 블록 요소 찾기
      let current: Node | null = range.startContainer;
      if (current.nodeType === Node.TEXT_NODE) {
        current = current.parentElement;
      }
      
      // 블록 레벨 요소 찾기 (p, div, h1-h6, li, blockquote 등)
      while (current && current.nodeType === Node.ELEMENT_NODE) {
        const tagName = (current as Element).tagName;
        if (['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE', 'PRE', 'CODE'].includes(tagName)) {
          rootStart = current;
          break;
        }
        current = current.parentElement;
      }
    } else {
      // 선택 영역이 있는 경우: 공통 조상 요소 찾기
      const commonAncestor = range.commonAncestorContainer;
      
      if (commonAncestor.nodeType === Node.TEXT_NODE) {
        rootStart = commonAncestor.parentElement || this.editorEl;
      } else {
        rootStart = commonAncestor as Element;
      }
    }

    // 범위 내의 모든 텍스트 노드 찾기
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(
      rootStart,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node: Node) => {
          // 선택 영역과 겹치는 텍스트 노드만 포함
          if (range.collapsed) {
            // collapsed인 경우: rootStart 내의 모든 텍스트 노드
            return NodeFilter.FILTER_ACCEPT;
          } else {
            // 선택 영역이 있는 경우: 범위와 겹치는 노드만
            try {
              return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            } catch {
              return NodeFilter.FILTER_ACCEPT;
            }
          }
        }
      }
    );

    let node: Node | null = walker.nextNode();
    const foundTextNodes = new Set<Text>();
    
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        foundTextNodes.add(node as Text);
      }
      node = walker.nextNode();
    }

    // 블록 요소 앞뒤의 형제 텍스트 노드도 찾기
    const blockElements = new Set<Element>();
    
    // 찾은 텍스트 노드들의 부모 요소들을 수집
    foundTextNodes.forEach(tn => {
      let parent = tn.parentElement;
      while (parent && parent !== this.editorEl) {
        const tagName = parent.tagName;
        if (['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE', 'PRE', 'CODE', 'UL', 'OL', 'TABLE', 'TR', 'TD', 'TH'].includes(tagName)) {
          blockElements.add(parent);
        }
        parent = parent.parentElement;
      }
    });

    // 각 블록 요소의 앞뒤 형제 텍스트 노드 찾기
    blockElements.forEach(blockEl => {
      // 앞쪽 형제 텍스트 노드
      let prevSibling = blockEl.previousSibling;
      while (prevSibling) {
        if (prevSibling.nodeType === Node.TEXT_NODE) {
          const textNode = prevSibling as Text;
          // 공백 문자만 있어도 보이지 않는 문자가 있을 수 있으므로 검사
          if (textNode.textContent) {
            foundTextNodes.add(textNode);
          }
          break; // 첫 번째 텍스트 노드만 (연속된 텍스트 노드는 하나로 간주)
        } else if (prevSibling.nodeType === Node.ELEMENT_NODE) {
          // 다른 요소를 만나면 중단
          break;
        }
        prevSibling = prevSibling.previousSibling;
      }

      // 뒤쪽 형제 텍스트 노드
      let nextSibling = blockEl.nextSibling;
      while (nextSibling) {
        if (nextSibling.nodeType === Node.TEXT_NODE) {
          const textNode = nextSibling as Text;
          // 공백 문자만 있어도 보이지 않는 문자가 있을 수 있으므로 검사
          if (textNode.textContent) {
            foundTextNodes.add(textNode);
          }
          break; // 첫 번째 텍스트 노드만
        } else if (nextSibling.nodeType === Node.ELEMENT_NODE) {
          // 다른 요소를 만나면 중단
          break;
        }
        nextSibling = nextSibling.nextSibling;
      }
    });

    // Set을 배열로 변환
    const allTextNodes = Array.from(foundTextNodes);

    if (allTextNodes.length === 0) return;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.dataset.layer = 'invisible-characters';
    g.setAttribute('data-ui', 'invisible-characters');
    svg.appendChild(g);

    const editorRect = this.editorEl.getBoundingClientRect();

    // 각 텍스트 노드에서 보이지 않는 문자 찾기
    for (const tn of allTextNodes) {
      const text = tn.textContent || '';
      
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const charCode = char.charCodeAt(0);
        let markerColor = '';
        let markerLabel = '';

        // 보이지 않는 문자 감지
        if (charCode === 0xFEFF) {
          // ZWNBSP
          markerColor = '#ef4444'; // 빨간색
          markerLabel = 'ZWNBSP';
        } else if (charCode === 0x000A) {
          // LF (\n)
          markerColor = '#3b82f6'; // 파란색
          markerLabel = 'LF';
        } else if (charCode === 0x000D) {
          // CR (\r)
          markerColor = '#8b5cf6'; // 보라색
          markerLabel = 'CR';
        } else if (charCode === 0x0009) {
          // TAB (\t)
          markerColor = '#10b981'; // 초록색
          markerLabel = 'TAB';
        } else if (charCode === 0x00A0) {
          // NBSP
          markerColor = '#f59e0b'; // 주황색
          markerLabel = 'NBSP';
        } else {
          continue; // 보이지 않는 문자가 아니면 스킵
        }

        // 해당 위치의 Range 생성
        try {
          let x = 0;
          let y = 0;
          let height = 0;
          let found = false;

          // LF나 TAB의 경우 getClientRects()가 빈 배열을 반환할 수 있으므로
          // 앞의 텍스트까지의 Range를 사용하여 위치 계산
          if (charCode === 0x000A || charCode === 0x0009 || charCode === 0x000D) {
            // LF, TAB, CR의 경우: 이전 문자까지의 Range로 위치 계산
            if (i > 0) {
              const prevRange = document.createRange();
              prevRange.setStart(tn, i - 1);
              prevRange.setEnd(tn, i);
              const prevRects = prevRange.getClientRects();
              if (prevRects.length > 0) {
                const prevR = prevRects[prevRects.length - 1]; // 마지막 rect 사용
                x = prevR.right - editorRect.left + this.editorEl.scrollLeft;
                y = prevR.top - editorRect.top + this.editorEl.scrollTop;
                height = prevR.height;
                found = true;
              }
            }
            
            // 이전 문자로 위치를 찾지 못한 경우, 다음 문자로 시도
            if (!found && i < text.length - 1) {
              const nextRange = document.createRange();
              nextRange.setStart(tn, i + 1);
              nextRange.setEnd(tn, i + 2);
              const nextRects = nextRange.getClientRects();
              if (nextRects.length > 0) {
                const nextR = nextRects[0];
                x = nextR.left - editorRect.left + this.editorEl.scrollLeft;
                y = nextR.top - editorRect.top + this.editorEl.scrollTop;
                height = nextR.height;
                found = true;
              }
            }
            
            // 여전히 찾지 못한 경우, 텍스트 노드 전체 범위 사용
            if (!found) {
              const nodeRange = document.createRange();
              nodeRange.selectNodeContents(tn);
              const nodeRects = nodeRange.getClientRects();
              if (nodeRects.length > 0) {
                const nodeR = nodeRects[0];
                // 텍스트 노드의 시작 위치에서 offset만큼 이동 (대략적인 계산)
                x = nodeR.left - editorRect.left + this.editorEl.scrollLeft;
                y = nodeR.top - editorRect.top + this.editorEl.scrollTop;
                height = nodeR.height;
                found = true;
              }
            }
          } else {
            // ZWNBSP, NBSP의 경우: 일반적인 방법 사용
            const charRange = document.createRange();
            charRange.setStart(tn, i);
            charRange.setEnd(tn, i + 1);
            
            const rects = charRange.getClientRects();
            if (rects.length > 0) {
              const r = rects[0];
              x = r.left - editorRect.left + this.editorEl.scrollLeft;
              y = r.top - editorRect.top + this.editorEl.scrollTop;
              height = r.height;
              found = true;
            }
          }

          if (!found) continue;

          // contenteditable 영역 밖이면 스킵
          if (x < 0 || y < 0 || x > editorRect.width || y > editorRect.height + this.editorEl.scrollHeight) {
            continue;
          }

          const r = { left: x, top: y, height, width: 0 };

          // 글자 위쪽에 작은 원형 마커 그리기
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('data-ui', `invisible-char-${markerLabel}-${i}`);
          circle.setAttribute('cx', x.toString());
          circle.setAttribute('cy', y.toString());
          circle.setAttribute('r', '3');
          circle.setAttribute('fill', markerColor);
          circle.setAttribute('stroke', markerColor);
          circle.setAttribute('stroke-width', '1');
          circle.setAttribute('opacity', '0.9');
          circle.setAttribute('data-label', markerLabel);
          circle.setAttribute('title', `${markerLabel} at position ${i}`);
          g.appendChild(circle);

          // 글자 높이까지 점선 추가 (height가 0이면 기본값 사용)
          const lineHeight = height > 0 ? height : 16; // 기본 높이 16px
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('data-ui', `invisible-char-line-${markerLabel}-${i}`);
          line.setAttribute('x1', x.toString());
          line.setAttribute('y1', y.toString());
          line.setAttribute('x2', x.toString());
          line.setAttribute('y2', (y + lineHeight).toString());
          line.setAttribute('stroke', markerColor);
          line.setAttribute('stroke-width', '1');
          line.setAttribute('stroke-dasharray', '2 2');
          line.setAttribute('opacity', '0.6');
          line.setAttribute('data-label', markerLabel);
          g.appendChild(line);

          // 라벨 텍스트 (마커 위쪽에 표시)
          const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          textEl.setAttribute('x', (x + 5).toString());
          textEl.setAttribute('y', (y - 2).toString());
          textEl.setAttribute('font-size', '9');
          textEl.setAttribute('fill', markerColor);
          textEl.setAttribute('font-weight', 'bold');
          textEl.textContent = markerLabel;
          g.appendChild(textEl);
        } catch (error) {
          // Range 생성 실패 시 무시
          console.warn('Failed to visualize invisible character:', error);
        }
      }
    }
  }

  public clear(): void {
    const svg = this.overlayEl.querySelector('.range-overlay');
    if (svg) {
      svg.querySelector('g[data-layer="rects"]')?.remove();
      svg.querySelector('g[data-layer="boundary"]')?.remove();
      svg.querySelector('g[data-layer="dom-changes"]')?.remove();
      svg.querySelector('g[data-layer="target-ranges"]')?.remove();
      svg.querySelector('g[data-layer="invisible-characters"]')?.remove();
    }
  }

  public destroy(): void {
    this.overlayEl.querySelector('.range-overlay')?.remove();
  }
}

// ============================================================
// Utility Functions
// ============================================================

/**
 * Range 객체를 직렬화 가능한 형태로 변환
 */
function serializeRange(range: Range | null | undefined): any {
  if (!range) return null;
  
  try {
    return {
      collapsed: range.collapsed,
      startContainer: range.startContainer.nodeType === Node.TEXT_NODE 
        ? '#text' 
        : (range.startContainer as Element).tagName || 'unknown',
      startOffset: range.startOffset,
      endContainer: range.endContainer.nodeType === Node.TEXT_NODE 
        ? '#text' 
        : (range.endContainer as Element).tagName || 'unknown',
      endOffset: range.endOffset,
      startContainerText: range.startContainer.textContent?.substring(0, 100) || '',
      endContainerText: range.endContainer.textContent?.substring(0, 100) || '',
    };
  } catch {
    return null;
  }
}

/**
 * EventLog에서 직렬화 불가능한 객체 제거
 */
function serializeEventLog(log: EventLog): any {
  const { range, ...rest } = log;
  return {
    ...rest,
    range: serializeRange(range),
  };
}

/**
 * DOMRect를 직렬화 가능한 형태로 변환
 */
function serializeDOMRect(rect: DOMRect): any {
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
    bottom: rect.bottom,
    right: rect.right,
  };
}

/**
 * DomChangeResult를 직렬화 가능한 형태로 변환
 */
function serializeDomChangeResult(result: DomChangeResult | null | undefined): any {
  if (!result) return null;
  
  return {
    deletedRects: result.deletedRects.map(serializeDOMRect),
    addedRects: result.addedRects.map(serializeDOMRect),
    modifiedNodes: result.modifiedNodes.map(node => ({
      before: node.before ? {
        id: node.before.id,
        parentSignature: node.before.parentSignature,
        text: node.before.text,
        offset: node.before.offset,
      } : null,
      after: node.after ? {
        id: node.after.id,
        parentSignature: node.after.parentSignature,
        text: node.after.text,
        offset: node.after.offset,
      } : null,
      changeType: node.changeType,
    })),
  };
}

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

// Special character token class names
const specialCharClasses: Record<string, string> = {
  zwnbsp: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 px-1 rounded text-[0.65rem]',
  nbsp: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-1 rounded text-[0.65rem]',
  space: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-1 rounded text-[0.65rem]',
  lf: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-1 rounded text-[0.65rem]',
  cr: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200 px-1 rounded text-[0.65rem]',
  tab: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 px-1 rounded text-[0.65rem]',
};

// Render text with special character highlighting
export function DebugText({ text }: { text: string | null | undefined }) {
  if (!text) return <span className="text-text-muted">-</span>;
  
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
    const tokenType = match[1] as keyof typeof specialCharClasses;
    parts.push(
      <span key={key++} className={specialCharClasses[tokenType]}>
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
  if (!text) return <span className="text-text-muted">-</span>;
  
  const isCollapsed = startOffset === endOffset;
  const start = Math.min(startOffset, text.length);
  const end = Math.min(endOffset, text.length);
  
  const beforeText = text.slice(0, start);
  const selectedText = text.slice(start, end);
  const afterText = text.slice(end);
  
  return (
    <span className="font-mono text-sm leading-relaxed">
      "<DebugText text={beforeText} />
      {isCollapsed ? (
        <span className="text-red-500 font-bold text-base">|</span>
      ) : (
        <span className="bg-blue-200 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded px-1 py-0.5 font-medium">[<DebugText text={selectedText} />]</span>
      )}
      <DebugText text={afterText} />"
    </span>
  );
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
      parts.push(<span key={key++} className="text-text-primary">{match[5]}</span>);
    } else {
      // Tag
      const [, open, tagName, attrs, close] = match;
      parts.push(
        <span key={key++}>
          <span className="text-gray-500">{open}</span>
          <span className="text-red-500">{tagName}</span>
          {attrs && <span className="text-blue-500">{attrs}</span>}
          <span className="text-gray-500">{close}</span>
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
  
  const diffClass = diffType === 'removed' 
    ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 line-through'
    : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
  
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
          parts.push(<span key={key++} className="text-text-primary">{textContent.slice(0, idx)}</span>);
          parts.push(<span key={key++} className={diffClass}>{dp}</span>);
          parts.push(<span key={key++} className="text-text-primary">{textContent.slice(idx + dp.length)}</span>);
          hasRenderedDiff = true;
          break;
        }
      }
      if (!hasRenderedDiff) {
        parts.push(<span key={key++} className="text-text-primary">{textContent}</span>);
      }
    } else {
      // Tag
      const [, open, tagName, attrs, close] = match;
      const tagIsDiff = isDiffPart;
      parts.push(
        <span key={key++} className={tagIsDiff ? diffClass : undefined}>
          <span className={tagIsDiff ? undefined : 'text-gray-500'}>{open}</span>
          <span className={tagIsDiff ? undefined : 'text-red-500'}>{tagName}</span>
          {attrs && <span className={tagIsDiff ? undefined : 'text-blue-500'}>{attrs}</span>}
          <span className={tagIsDiff ? undefined : 'text-gray-500'}>{close}</span>
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
    return <span className="text-text-muted">{type === 'before' ? '(입력 전 DOM)' : '(입력 후 DOM)'}</span>;
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
  
  // Diff part - make it more visible
  if (type === 'before' && diff.removed) {
    parts.push(
      <span key={key++} className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 line-through rounded px-1.5 py-0.5 font-semibold inline-block mx-0.5 border border-red-300 dark:border-red-700">
        {diff.removed}
      </span>
    );
  } else if (type === 'after' && diff.added) {
    parts.push(
      <span key={key++} className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded px-1.5 py-0.5 font-semibold inline-block mx-0.5 border border-green-300 dark:border-green-700">
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
  // DOM Change Tracker 관련
  const beforeInputTextNodesRef = useRef<Map<string, TextNodeInfo>>(new Map());
  const beforeInputDeletedRectsRef = useRef<DOMRect[]>([]);
  const beforeInputTargetRangesRef = useRef<StaticRange[]>([]);
  const [domChangeResult, setDomChangeResult] = useState<DomChangeResult | null>(null);
  // Environment: 초기값을 "Unknown"으로 설정하여 서버/클라이언트 일치 보장
  const [environment, setEnvironment] = useState<Environment>(() => ({
    os: 'Unknown',
    osVersion: '',
    browser: 'Unknown',
    browserVersion: '',
    device: 'Unknown',
    isMobile: false,
  }));
  const [uiLocale, setUiLocale] = useState<Locale>('en');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('rich-inline-list-previous-default');
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [activeTab, setActiveTab] = useState<'snapshots' | 'events'>('events');
  const [isMobileView, setIsMobileView] = useState(false);
  const [touchScale, setTouchScale] = useState(1);
  const [touchPan, setTouchPan] = useState({ x: 0, y: 0 });
  const touchHandlerRef = useRef<TouchHandler | null>(null);
  const selectedPreset = useMemo(
    () => EDITOR_PRESETS.find((p) => p.id === selectedPresetId) ?? EDITOR_PRESETS[0],
    [selectedPresetId],
  );

  // Initialize visualizer once
  useEffect(() => {
    if (editorRef.current && overlayRef.current) {
      visualizerRef.current = new RangeVisualizer(editorRef.current, overlayRef.current);
    }
    return () => {
      visualizerRef.current?.destroy();
    };
  }, []);

  // Detect environment on client side only (after hydration)
  useEffect(() => {
    const detectedEnv = detectEnvironment();
    setEnvironment(detectedEnv);
  }, []);

  // Detect UI locale from browser language
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.language) {
      const browserLang = navigator.language.toLowerCase();
      // Try to match supported locale
      const matchedLocale = supportedLocales.find(locale => {
        const localeCode = locale.toLowerCase();
        return browserLang === localeCode || browserLang.startsWith(localeCode + '-');
      });
      setUiLocale(matchedLocale || 'en');
    }
  }, []);

  // Get translations for current locale
  const t = useMemo(() => getTranslation(uiLocale), [uiLocale]);

  // Mobile detection and responsive handling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Touch handling setup with range interaction
  useEffect(() => {
    if (!isTouchDevice() || !editorRef.current || !overlayRef.current) return;

    const touchHandler = new TouchHandler({
      tapTimeout: 300,
      doubleTapTimeout: 300,
      longPressTimeout: 500,
      pinchThreshold: 10,
      swipeThreshold: 50,
      panThreshold: 10,
    });

    touchHandlerRef.current = touchHandler;

    // Register gesture callbacks
    touchHandler.on('double-tap', () => {
      setTouchScale(1);
      setTouchPan({ x: 0, y: 0 });
    });

    touchHandler.on('pinch', (gesture: TouchGesture) => {
      if (gesture.scale) {
        const newScale = Math.max(0.5, Math.min(3, touchScale * gesture.scale));
        setTouchScale(newScale);
      }
    });

    touchHandler.on('pan', (gesture: TouchGesture) => {
      if (gesture.velocity) {
        setTouchPan(prev => ({
          x: prev.x + gesture.velocity!.x * 0.1,
          y: prev.y + gesture.velocity!.y * 0.1,
        }));
      }
    });

    touchHandler.on('long-press', (gesture: TouchGesture) => {
      // Toggle invisible character visualization on long press
      if (visualizerRef.current) {
        visualizerRef.current.drawInvisibleCharacters();
      }
    });

    // Touch events for editor and overlay
    const editor = editorRef.current;
    const overlay = overlayRef.current;
    
    const handleTouchStart = (e: TouchEvent) => {
      // Check if touch is on a visualized range
      const touch = e.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (element && element.closest('[data-ui^="range-rect"]')) {
        // Show tooltip for range info
        const rangeType = element.getAttribute('data-ui')?.split('-')[2];
        if (rangeType) {
          console.log(`Touch detected on: ${rangeType} range`);
        }
      }
      
      touchHandler.handleTouchStart(e);
    };
    
    const handleTouchMove = (e: TouchEvent) => touchHandler.handleTouchMove(e);
    const handleTouchEnd = (e: TouchEvent) => touchHandler.handleTouchEnd(e);

    editor.addEventListener('touchstart', handleTouchStart, { passive: true });
    editor.addEventListener('touchmove', handleTouchMove, { passive: true });
    editor.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    overlay.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      editor.removeEventListener('touchstart', handleTouchStart);
      editor.removeEventListener('touchmove', handleTouchMove);
      editor.removeEventListener('touchend', handleTouchEnd);
      overlay.removeEventListener('touchstart', handleTouchStart);
      touchHandler.destroy();
    };
  }, [touchScale]);

  // 스크롤 이벤트 리스너: 보이지 않는 문자 시각화 업데이트
  useEffect(() => {
    if (!editorRef.current) return;

    const handleScroll = () => {
      // 선택이 있으면 스크롤 시 위치 업데이트
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && visualizerRef.current) {
        // drawInvisibleCharacters 내부에서 선택 여부를 확인하므로 여기서는 단순히 호출
        visualizerRef.current.drawInvisibleCharacters();
      }
    };

    const editor = editorRef.current;
    editor.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      editor.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Load snapshots on mount
  useEffect(() => {
    loadSnapshots();
  }, []);

  const loadSnapshots = useCallback(async () => {
    try {
      const allSnapshots = await getAllSnapshots();
      setSnapshots(allSnapshots);
    } catch (error) {
      console.error('Failed to load snapshots:', error);
    }
  }, []);

  // 트리거를 anomalies에서 감지
  const detectTriggerFromAnomalies = useCallback((anomalies: Anomaly[]): { trigger: SnapshotTrigger; detail: string } | null => {
    if (anomalies.length === 0) return null;

    // 첫 번째 anomaly를 트리거로 사용
    const firstAnomaly = anomalies[0];
    const trigger = firstAnomaly.type as SnapshotTrigger;
    const detail = `${firstAnomaly.description}: ${firstAnomaly.detail}`;

    // 여러 anomaly가 있으면 조합
    if (anomalies.length > 1) {
      const combinedTrigger = anomalies.map(a => a.type).join('+') as SnapshotTrigger;
      const combinedDetail = anomalies.map(a => `- **${a.type}**: ${a.description}: ${a.detail}`).join('\n');
      return { trigger: combinedTrigger, detail: combinedDetail };
    }

    return { trigger, detail };
  }, []);

  // 자동 스냅샷 저장 (트리거 기반)
  const autoSaveSnapshot = useCallback(async (trigger: SnapshotTrigger, triggerDetail: string) => {
    if (!editorRef.current) return;

    try {
      // Range 객체와 직렬화 불가능한 객체를 제거하여 순수 객체로 변환
      const serializedRanges = {
        sel: serializeRange(rangesRef.current.sel),
        comp: serializeRange(rangesRef.current.comp),
        bi: serializeRange(rangesRef.current.bi),
        input: serializeRange(rangesRef.current.input),
      };

      const snapshot: Omit<Snapshot, 'id'> = {
        timestamp: Date.now(),
        trigger,
        triggerDetail,
        environment,
        eventLogs: logsRef.current.map(serializeEventLog),
        domBefore,
        domAfter,
        ranges: serializedRanges,
        phases: phases.map(phase => ({
          ...phase,
          log: phase.log ? serializeEventLog(phase.log) : null,
        })),
        anomalies,
        domChangeResult: serializeDomChangeResult(domChangeResult),
      };

      await saveSnapshot(snapshot);
      await loadSnapshots();
      
      // 콘솔에 로그 출력
      console.groupCollapsed(
        `%c[Playground] Auto-saved snapshot: ${trigger}`,
        'color: #10b981; font-weight: bold; font-size: 12px;'
      );
      console.log('Trigger:', trigger);
      console.log('Detail:', triggerDetail);
      console.log('Snapshot saved to IndexedDB');
      console.groupEnd();
    } catch (error) {
      console.error('Failed to auto-save snapshot:', error);
    }
  }, [environment, domBefore, domAfter, phases, anomalies, domChangeResult, loadSnapshots]);

  const handleSaveSnapshot = useCallback(async () => {
    if (!editorRef.current) return;

    try {
      // Range 객체와 직렬화 불가능한 객체를 제거하여 순수 객체로 변환
      const serializedRanges = {
        sel: serializeRange(rangesRef.current.sel),
        comp: serializeRange(rangesRef.current.comp),
        bi: serializeRange(rangesRef.current.bi),
        input: serializeRange(rangesRef.current.input),
      };

      const snapshot: Omit<Snapshot, 'id'> = {
        timestamp: Date.now(),
        environment,
        eventLogs: logsRef.current.map(serializeEventLog),
        domBefore,
        domAfter,
        ranges: serializedRanges,
        phases: phases.map(phase => ({
          ...phase,
          log: phase.log ? serializeEventLog(phase.log) : null,
        })),
        anomalies,
        domChangeResult: serializeDomChangeResult(domChangeResult),
      };

      await saveSnapshot(snapshot);
      await loadSnapshots();
      alert('Snapshot saved!');
    } catch (error) {
      console.error('Failed to save snapshot:', error);
      alert('Failed to save snapshot');
    }
  }, [environment, domBefore, domAfter, phases, anomalies, domChangeResult, loadSnapshots]);

  const handleRestoreSnapshot = useCallback(async (snapshot: Snapshot) => {
    if (!editorRef.current) return;

    try {
      // Restore DOM
      editorRef.current.innerHTML = snapshot.domAfter || snapshot.domBefore || '';
      
      // Restore state
      logsRef.current = snapshot.eventLogs || [];
      rangesRef.current = snapshot.ranges || {};
      setPhases(snapshot.phases || []);
      setAnomalies(snapshot.anomalies || []);
      setDomBefore(snapshot.domBefore || '');
      setDomAfter(snapshot.domAfter || '');
      setDomChangeResult(snapshot.domChangeResult || null);
      
      // Trigger visualization update after state is set
      setTimeout(() => {
        if (visualizerRef.current) {
          const ranges: RangeDrawInfo[] = [];
          const r = rangesRef.current;
          
          if (r.sel && !r.sel.collapsed) {
            ranges.push({ range: r.sel, fill: 'rgba(59, 130, 246, 0.1)', stroke: 'rgba(59, 130, 246, 0)', heightScale: 1, type: 'selection' });
          }
          if (r.comp) {
            ranges.push({ range: r.comp, fill: 'rgba(139, 92, 246, 0.3)', stroke: 'rgba(139, 92, 246, 1)', heightScale: 1.3, type: 'composition' });
          }
          if (r.bi) {
            ranges.push({ range: r.bi, fill: 'rgba(249, 115, 22, 0.3)', stroke: 'rgba(249, 115, 22, 1)', heightScale: 1.5, type: 'beforeinput' });
          }
          if (r.input) {
            ranges.push({ range: r.input, fill: 'rgba(34, 197, 94, 0.3)', stroke: 'rgba(34, 197, 94, 1)', heightScale: 1.7, type: 'input' });
          }
          
          visualizerRef.current.drawRanges(ranges);
          
          if (snapshot.domChangeResult) {
            const domChangeRects: RectDrawInfo[] = [];
            for (const rect of snapshot.domChangeResult.deletedRects || []) {
              domChangeRects.push({
                rect,
                fill: 'rgba(239, 68, 68, 0.2)',
                stroke: 'rgba(239, 68, 68, 0.8)',
                label: 'deleted',
              });
            }
            for (const rect of snapshot.domChangeResult.addedRects || []) {
              domChangeRects.push({
                rect,
                fill: 'rgba(34, 197, 94, 0.2)',
                stroke: 'rgba(34, 197, 94, 0.8)',
                label: 'added',
              });
            }
            visualizerRef.current.drawRects(domChangeRects);
          }
        }
      }, 0);
    } catch (error) {
      console.error('Failed to restore snapshot:', error);
      alert('Failed to restore snapshot');
    }
  }, []);

  const handleDeleteSnapshot = useCallback(async (id: number) => {
    if (!confirm('Delete this snapshot?')) return;

    try {
      await deleteSnapshot(id);
      await loadSnapshots();
    } catch (error) {
      console.error('Failed to delete snapshot:', error);
      alert('Failed to delete snapshot');
    }
  }, [loadSnapshots]);

  const applyPreset = useCallback(
    (preset: EditorPreset) => {
      logsRef.current = [];
      rangesRef.current = {};
      setPhases([]);
      setAnomalies([]);
      setDomBefore('');
      setDomAfter('');
      setDomChangeResult(null);
      beforeInputTextNodesRef.current = new Map();
      beforeInputDeletedRectsRef.current = [];
      startTimeRef.current = Date.now();
      visualizerRef.current?.clear();
      if (editorRef.current) {
        editorRef.current.innerHTML = preset.html;
        editorRef.current.scrollTop = 0;
      }
    },
    [],
  );

  // Apply preset when selection changes (including initial mount)
  useEffect(() => {
    if (selectedPreset) {
      applyPreset(selectedPreset);
    }
  }, [selectedPreset, applyPreset]);

  const drawVisualization = useCallback(() => {
    if (!visualizerRef.current || !editorRef.current || !overlayRef.current) return;

    const ranges: RangeDrawInfo[] = [];
    const r = rangesRef.current;
    const base = overlayRef.current.getBoundingClientRect();
    const boundaryMarkers: { x: number; y: number; height: number; type: 'start' | 'end'; color: string }[] = [];

    if (r.sel && !r.sel.collapsed) {
      ranges.push({ range: r.sel, fill: 'rgba(59, 130, 246, 0.1)', stroke: 'rgba(59, 130, 246, 0.5)', heightScale: 1, type: 'selection' });
    }
    if (r.comp) {
      ranges.push({ range: r.comp, fill: 'rgba(139, 92, 246, 0.3)', stroke: 'rgba(139, 92, 246, 1)', heightScale: 1.3, type: 'composition' });
    }
    if (r.bi) {
      ranges.push({ range: r.bi, fill: 'rgba(249, 115, 22, 0.3)', stroke: 'rgba(249, 115, 22, 1)', heightScale: 1.5, type: 'beforeinput' });
    }
    // input 타입은 표시하지 않음

    visualizerRef.current.drawRanges(ranges);

    // 보이지 않는 문자 시각화 (collapsed든 아니든 상관없이)
    if (r.sel) {
      visualizerRef.current.drawInvisibleCharacters();
    }

    // DOM Change Tracker 결과 표시 (삭제/추가 영역)
    // targetRanges가 있으면 deleted 영역은 중복이므로 제외
    if (domChangeResult) {
      const domChangeRects: RectDrawInfo[] = [];
      
      // targetRanges가 없을 때만 deleted 영역 표시 (중복 방지)
      const hasTargetRanges = beforeInputTargetRangesRef.current && beforeInputTargetRangesRef.current.length > 0;
      
      if (!hasTargetRanges) {
        // 삭제된 영역 (노란색 계열) - targetRanges가 없을 때만
        for (const rect of domChangeResult.deletedRects) {
          domChangeRects.push({
            rect,
            fill: 'rgba(250, 204, 21, 0.3)',
            stroke: 'rgba(250, 204, 21, 0.9)',
            label: 'deleted',
          });
        }
      }
      
      // 추가된 영역 (초록색) - 항상 표시
      for (const rect of domChangeResult.addedRects) {
        domChangeRects.push({
          rect,
          fill: 'rgba(34, 197, 94, 0.2)',
          stroke: 'rgba(34, 197, 94, 0.8)',
          label: 'added',
        });
      }
      
      if (domChangeRects.length > 0) {
        visualizerRef.current.drawRects(domChangeRects);
      }
    }

    if (r.sel) {
      const startBoundary = checkBoundaryAtNode(r.sel.startContainer, r.sel.startOffset);
      const endBoundary = checkBoundaryAtNode(r.sel.endContainer, r.sel.endOffset);
      const editorRect = editorRef.current.getBoundingClientRect();

      if (startBoundary) {
        try {
          const tempRange = document.createRange();
          tempRange.setStart(r.sel.startContainer, r.sel.startOffset);
          tempRange.setEnd(r.sel.startContainer, Math.min(r.sel.startOffset + 1, r.sel.startContainer.textContent?.length || 0));
          const rect = tempRange.getBoundingClientRect();
          if (rect.width > 0 || rect.height > 0) {
            boundaryMarkers.push({
              x: rect.left - editorRect.left + editorRef.current!.scrollLeft,
              y: rect.top - editorRect.top + editorRef.current!.scrollTop,
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
              x: rect.right - editorRect.left + editorRef.current!.scrollLeft,
              y: rect.top - editorRect.top + editorRef.current!.scrollTop,
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
  }, [domChangeResult]);

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
            description: t.playground.parentMismatch,
            detail: `${biKey} → ${inKey}`,
          });
        }
      }
    }

    // 2. Boundary input detection
    if (lastBi && lastBi.startBoundary) {
      newAnomalies.push({
        type: 'boundary-input',
        description: t.playground.inlineElementBoundary,
        detail: `${lastBi.startBoundary.element} ${lastBi.startBoundary.type === 'start' ? t.playground.boundaryStart : t.playground.boundaryEnd} ${t.playground.boundary} (offset: ${lastBi.startOffset})`,
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

    // 9. InputType mismatch detection
    if (lastBi && lastIn && lastBi.inputType && lastIn.inputType) {
      if (lastBi.inputType !== lastIn.inputType) {
        newAnomalies.push({
          type: 'inputtype-mismatch',
          description: 'beforeinput과 input의 inputType이 다름',
          detail: `beforeinput: "${lastBi.inputType}" vs input: "${lastIn.inputType}"`,
        });
      }
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
      highlight: newAnomalies.some(a => ['parent-mismatch', 'text-leak', 'node-type-change', 'sibling-created', 'missing-beforeinput', 'inputtype-mismatch'].includes(a.type)) ? 'error' : undefined,
    });

    setPhases(blocks);
    drawVisualization();

    // 트리거 감지: anomalies가 있으면 자동으로 스냅샷 저장
    if (newAnomalies.length > 0 && editorRef.current) {
      const detectedTrigger = detectTriggerFromAnomalies(newAnomalies);
      if (detectedTrigger) {
        autoSaveSnapshot(detectedTrigger.trigger, detectedTrigger.detail);
      }
    }
  }, [drawVisualization, detectTriggerFromAnomalies, autoSaveSnapshot]);

  const createLog = useCallback((
    type: EventLog['type'],
    range: Range | null,
    extra: Partial<EventLog> = {},
    targetRanges?: StaticRange[]
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

    // Extract targetRanges info (for beforeinput events)
    let targetRangesInfo: TargetRangeInfo[] | undefined;
    if (targetRanges && targetRanges.length > 0) {
      targetRangesInfo = targetRanges.map(tr => ({
        startContainer: tr.startContainer.nodeType === Node.TEXT_NODE ? '#text' : (tr.startContainer as Element).tagName || 'unknown',
        startOffset: tr.startOffset,
        endContainer: tr.endContainer.nodeType === Node.TEXT_NODE ? '#text' : (tr.endContainer as Element).tagName || 'unknown',
        endOffset: tr.endOffset,
        collapsed: tr.collapsed,
      }));
    }

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
      targetRanges: targetRangesInfo,
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
      // DOM Before/After 수집 제거
      
      // DOM Change Tracker: beforeinput 시점의 텍스트 노드 스냅샷
      beforeInputTextNodesRef.current = snapshotTextNodes(editor);
      
      // 삭제될 영역 계산
      beforeInputDeletedRectsRef.current = calculateDeletedRects(e, editor);
      
      // getTargetRanges() 수집 및 시각화
      let targetRanges: StaticRange[] = [];
      try {
        targetRanges = e.getTargetRanges?.() || [];
        beforeInputTargetRangesRef.current = targetRanges;
        
        // beforeinput의 targetRanges 시각화
        if (visualizerRef.current && targetRanges.length > 0) {
          visualizerRef.current.drawTargetRanges(targetRanges);
        }
      } catch (error) {
        // getTargetRanges 사용 실패 시 빈 배열
        beforeInputTargetRangesRef.current = [];
      }
      
      const sel = window.getSelection();
      const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
      pushLog(createLog('beforeinput', range, { inputType: e.inputType, data: e.data, isComposing: e.isComposing }, targetRanges));
    };

    const handleInput = (e: Event) => {
      const inputEvent = e as InputEvent;
      // DOM Before/After 수집 제거
      
      // targetRanges는 유지 (input 후에도 삭제될 영역 확인 가능)
      // 새로운 beforeinput이 발생하면 자동으로 교체됨
      
      // DOM Change Tracker: input 시점에 변경사항 감지
      if (beforeInputTextNodesRef.current.size > 0) {
        const changeResult = detectDomChanges(
          editor,
          beforeInputTextNodesRef.current,
          beforeInputDeletedRectsRef.current
        );
        setDomChangeResult(changeResult);
      }
      
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
    if (selectedPreset) {
      applyPreset(selectedPreset);
    }
  }, [selectedPreset, applyPreset]);

  const copyReport = useCallback(() => {
    const lines: string[] = [
      t.playground.eventAnalysis,
      '',
      `## ${t.playground.environmentInfo}`,
      `- OS: ${environment.os} ${environment.osVersion}`,
      `- Browser: ${environment.browser} ${environment.browserVersion}`,
      `- Device: ${environment.device}`,
      '',
    ];

    if (anomalies.length > 0) {
      lines.push(`## ⚠️ ${t.playground.detectedAnomalies}`);
      anomalies.forEach(a => lines.push(`- **${a.type}**: ${a.description}\n  - ${a.detail}`));
      lines.push('');
    }

    lines.push(t.playground.eventLogSection, '```');
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
    lines.push('```');
    // DOM Before/After 제거됨

    navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
  }, [environment, anomalies, phases]);

  return (
    <div className={`${isMobileView ? 'flex flex-col' : 'grid grid-cols-[1.5fr_1fr]'} gap-4 flex-1 min-h-0`}>
      {/* Left: Editor */}
      <div className="flex flex-col gap-2 min-h-0 h-full">
        {/* Preset selector + Legend */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3 px-3 py-1.5 bg-bg-muted rounded-md text-xs text-text-secondary flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[0.7rem] text-text-muted">
                {t.playground.sampleHTML}
              </span>
              <select
                value={selectedPresetId}
                onChange={(e) => setSelectedPresetId(e.target.value)}
                className="h-7 px-2 rounded-md border border-border-light bg-bg-surface text-[0.75rem] text-text-primary cursor-pointer"
              >
                {EDITOR_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.labels[uiLocale] ?? preset.labels.en}
                  </option>
                ))}
              </select>
            </div>
            {/* Mobile zoom controls */}
            {isMobileView && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTouchScale(Math.max(0.5, touchScale - 0.1))}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-bg-surface border border-border-light text-text-primary text-xs hover:bg-bg-muted"
                >
                  −
                </button>
                <span className="text-xs text-text-muted min-w-[3rem] text-center">
                  {Math.round(touchScale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setTouchScale(Math.min(3, touchScale + 0.1))}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-bg-surface border border-border-light text-text-primary text-xs hover:bg-bg-muted"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => { setTouchScale(1); setTouchPan({ x: 0, y: 0 }); }}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-bg-surface border border-border-light text-text-primary text-xs hover:bg-muted"
                >
                  ⟲
                </button>
              </div>
            )}
          </div>
{/* Visualization Legend */}
          <div className="px-3 py-2 bg-bg-muted rounded-md text-xs">
            <div className={`${isMobileView ? 'space-y-2' : 'flex flex-wrap gap-x-4 gap-y-1.5'}`}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded border" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.5)' }}></div>
                <span className="text-text-secondary">{t.playground.legendSelection}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 rounded" style={{ backgroundColor: 'rgba(139, 92, 246, 0.3)', borderTop: '1px solid rgba(139, 92, 246, 1)' }}></div>
                <span className="text-text-secondary">{t.playground.legendComposition}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 rounded" style={{ backgroundColor: 'rgba(249, 115, 22, 0.3)', borderTop: '1px solid rgba(249, 115, 22, 1)' }}></div>
                <span className="text-text-secondary">{t.playground.legendBeforeinput}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded border" style={{ backgroundColor: 'rgba(250, 204, 21, 0.3)', borderColor: 'rgba(250, 204, 21, 0.9)', borderStyle: 'dashed' }}></div>
                <span className="text-text-secondary">{t.playground.legendDeleted}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded border" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', borderColor: 'rgba(34, 197, 94, 0.8)' }}></div>
                <span className="text-text-secondary">{t.playground.legendAdded}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded border" style={{ backgroundColor: 'rgba(107, 114, 128, 0.3)', borderColor: 'rgba(107, 114, 128, 0.8)' }}></div>
                <span className="text-text-secondary">{t.playground.legendNonEditable}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 flex items-center justify-center relative">
                  <div className="w-2 h-2 rounded-full border-2 border-purple-500"></div>
                  <div className="absolute top-3 w-0.5 h-2 bg-purple-500"></div>
                </div>
                <span className="text-text-secondary">{t.playground.legendInvisibleChars}</span>
              </div>
            </div>
          </div>
          </div>
          
          {/* Mobile Touch Controls Legend */}
          {isMobileView && (
            <div className="px-3 py-2 bg-bg-muted rounded-md text-xs">
              <div className="font-medium text-text-primary mb-2">Touch Controls:</div>
              <div className="space-y-1 text-text-secondary">
                <div>• Double-tap: Reset zoom</div>
                <div>• Pinch: Zoom in/out</div>
                <div>• Pan: Move view</div>
                <div>• Long-press: Show context</div>
              </div>
            </div>
          )}

        {/* Editor */}
        <div className="flex-1 min-h-0 h-full">
          {/* Editor with overlay wrapper */}
          <div 
            ref={overlayRef} 
            className="relative h-full min-h-0 overflow-hidden"
            style={{ 
              transform: isMobileView ? `scale(${touchScale}) translate(${touchPan.x}px, ${touchPan.y}px)` : 'none',
              transformOrigin: 'top left',
              transition: isMobileView ? 'transform 0.2s ease-out' : 'none'
            }}
          >
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className={`h-full p-3 text-base leading-[1.8] outline-none focus:outline-none focus-visible:outline-none bg-bg-surface border-2 border-accent-primary rounded-lg box-border ${
                isMobileView ? 'overflow-y-auto' : 'overflow-y-auto'
              }`}
              style={{
                fontSize: isMobileView ? `${16 * touchScale}px` : '16px',
                touchAction: isMobileView ? 'manipulation' : 'auto'
              }}
            />
          </div>
        </div>
      </div>

      {/* Right: Event Phases & Snapshot History */}
      <div className={`flex flex-col gap-1.5 overflow-x-hidden min-h-0 ${isMobileView ? 'h-96' : 'h-full'}`}>
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-bg-muted rounded-md">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('events')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                activeTab === 'events'
                  ? 'bg-accent-primary text-white'
                  : 'bg-bg-surface text-text-primary hover:bg-bg-muted'
              }`}
            >
              {t.playground.eventLog}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('snapshots')}
              className={`px-3 py-1 text-xs rounded-md transition-colors relative ${
                activeTab === 'snapshots'
                  ? 'bg-accent-primary text-white'
                  : 'bg-bg-surface text-text-primary hover:bg-bg-muted'
              }`}
            >
              📚 {t.playground.snapshotHistory}
              {snapshots.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[0.65rem] rounded-full w-4 h-4 flex items-center justify-center">
                  {snapshots.length}
                </span>
              )}
            </button>
          </div>
          <button
            type="button"
            onClick={copyReport}
            className={`px-2.5 py-1 text-xs rounded-md border-none bg-accent-primary text-white cursor-pointer hover:bg-accent-primary-hover transition-colors ${
              isMobileView ? 'px-2 py-0.5 text-[0.65rem]' : ''
            }`}
          >
            {t.playground.copyReport}
          </button>
        </div>

        {/* Anomalies - Always visible */}
        {anomalies.length > 0 && (
          <div className="flex flex-col gap-1">
            {anomalies.map((a, i) => (
              <div key={i} className="p-1.5 bg-red-50 dark:bg-red-950/20 border border-red-500 dark:border-red-600 rounded">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-red-600 dark:text-red-400 text-sm whitespace-nowrap">
                    ⚠️ {a.type}
                  </span>
                  <span className="text-xs text-red-800 dark:text-red-300">{a.description}</span>
                </div>
                <code className="text-xs text-red-900 dark:text-red-200 block mt-1.5">
                  {a.detail}
                </code>
              </div>
            ))}
          </div>
        )}

{/* Tab Content */}
        <div className={`flex-1 min-h-0 overflow-y-auto ${isMobileView ? 'pb-4' : ''}`}>
          {activeTab === 'snapshots' ? (
            <div className="flex flex-col gap-2">
              {snapshots.length === 0 ? (
                <div className="p-6 text-center text-text-muted bg-bg-muted rounded-lg text-sm">
                  {t.playground.noSnapshots}
                </div>
              ) : (
                snapshots.map((snap) => (
                  <div key={snap.id} className="p-3 bg-bg-surface rounded-lg border border-border-light hover:border-accent-primary-hover transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-sm text-text-primary">
                        {new Date(snap.timestamp).toLocaleString()}
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleRestoreSnapshot(snap)}
                          className={`px-2 py-1 text-xs rounded bg-accent-primary text-white hover:bg-accent-primary-hover transition-colors ${isMobileView ? 'text-xs px-1.5 py-0.5' : ''}`}
                        >
                          {t.playground.restore}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSnapshot(snap.id)}
                          className={`px-2 py-1 text-xs rounded bg-red-500 text-white hover:bg-red-600 transition-colors ${isMobileView ? 'text-xs px-1.5 py-0.5' : ''}`}
                        >
                          {t.playground.delete}
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-text-muted mb-2">
                      {snap.trigger && (
                        <div className="mb-1">
                          <strong>Trigger:</strong> {snap.trigger}
                        </div>
                      )}
                      {snap.triggerDetail && (
                        <div className="mb-1">
                          <strong>Detail:</strong> {snap.triggerDetail}
                        </div>
                      )}
                      <div>
                        <strong>Environment:</strong> {snap.environment.os} {snap.environment.browser} {snap.environment.device}
                      </div>
                    </div>
                    {snap.anomalies && snap.anomalies.length > 0 && (
                      <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded border border-red-500">
                        <div className="font-semibold text-red-600 dark:text-red-400 text-xs mb-1">
                          Anomalies ({snap.anomalies.length}):
                        </div>
                        {snap.anomalies.map((a, i) => (
                          <div key={i} className="text-xs text-red-800 dark:text-red-300">
                            • {a.type}: {a.description}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : isMobileView ? (
            <MobileEventLog phases={phases} isMobileView={isMobileView} />
          ) : (
            <div className="space-y-2">
              {phases.length === 0 ? (
                <div className="p-6 text-center text-text-muted bg-bg-muted rounded-lg text-sm">
                  {t.playground.noEvents}
                </div>
              ) : (
                phases.map((phase, i) => (
                  <EventPhase key={i} phase={phase} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Phase Block Component
// ============================================================

function buildSelectionSegmentsFromLog(log: EventLog): { path: string; start: number; end: number; text: string }[] {
  const segments: { path: string; start: number; end: number; text: string }[] = [];
  if (!log.range) return segments;
  const range = log.range;
  if (range.collapsed) return segments;

  try {
    const root = range.commonAncestorContainer || range.startContainer;
    const doc = (root as Node).ownerDocument || document;
    
    // First, collect text nodes
    const textWalker = doc.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node: Node) {
          try {
            // Some browsers may throw for intersectsNode on detached nodes
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (range as any).intersectsNode && (range as any).intersectsNode(node)
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT;
          } catch {
            return NodeFilter.FILTER_REJECT;
          }
        },
      } as unknown as NodeFilter,
    );

    let textNode: Node | null = textWalker.currentNode;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
      textNode = textWalker.nextNode();
    }

    while (textNode) {
      const text = (textNode as Text).data ?? '';
      let segStart = 0;
      let segEnd = text.length;

      if (textNode === range.startContainer) {
        segStart = range.startOffset;
      }
      if (textNode === range.endContainer) {
        segEnd = range.endOffset;
      }

      if (segStart < 0) segStart = 0;
      if (segEnd > text.length) segEnd = text.length;

      if (segStart < segEnd) {
        const selectedText = text.slice(segStart, segEnd);
        const parent = textNode.parentNode as Element | null;
        const parentName = parent ? parent.nodeName : '#text';
        const parentId = parent instanceof Element ? parent.id || undefined : undefined;
        const parentClass = parent instanceof Element ? (parent.className as string) || undefined : undefined;
        const path = formatNodePath(parentName, parentId, parentClass);

        segments.push({
          path,
          start: segStart,
          end: segEnd,
          text: selectedText,
        });
      }

      textNode = textWalker.nextNode();
    }

    // Then, collect element nodes (images, etc.) that are fully or partially selected
    const elementWalker = doc.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode(node: Node) {
          try {
            if (node.nodeType !== Node.ELEMENT_NODE) return NodeFilter.FILTER_REJECT;
            // Check if the element is fully contained or intersects with the range
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!(range as any).intersectsNode) return NodeFilter.FILTER_REJECT;
            
            // For element nodes, we need to check if they're within the range
            const element = node as Element;
            const elementRange = doc.createRange();
            try {
              elementRange.selectNodeContents(element);
              // Check if element range intersects with selection range
              const intersects = 
                elementRange.compareBoundaryPoints(Range.START_TO_END, range) > 0 &&
                elementRange.compareBoundaryPoints(Range.END_TO_START, range) < 0;
              
              // Also check if the element itself is the start or end container
              const isStartContainer = element === range.startContainer;
              const isEndContainer = element === range.endContainer;
              const isContained = 
                range.compareBoundaryPoints(Range.START_TO_START, elementRange) <= 0 &&
                range.compareBoundaryPoints(Range.END_TO_END, elementRange) >= 0;
              
              return (intersects || isStartContainer || isEndContainer || isContained)
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT;
            } catch {
              // Fallback: use intersectsNode
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              return (range as any).intersectsNode(element)
                ? NodeFilter.FILTER_ACCEPT
                : NodeFilter.FILTER_REJECT;
            }
          } catch {
            return NodeFilter.FILTER_REJECT;
          }
        },
      } as unknown as NodeFilter,
    );

    const processedElements = new Set<Element>();
    let elementNode: Node | null = elementWalker.currentNode;
    if (!elementNode || elementNode.nodeType !== Node.ELEMENT_NODE) {
      elementNode = elementWalker.nextNode();
    }

    while (elementNode) {
      const element = elementNode as Element;
      
      // Skip if already processed (avoid duplicates)
      if (processedElements.has(element)) {
        elementNode = elementWalker.nextNode();
        continue;
      }
      
      // Skip if this element is just a container (has text children that we already processed)
      // Only include elements that are meaningful (img, br, etc.) or are directly selected
      const isDirectlySelected = 
        element === range.startContainer || 
        element === range.endContainer ||
        (range.startContainer.nodeType === Node.ELEMENT_NODE && 
         range.startContainer === element) ||
        (range.endContainer.nodeType === Node.ELEMENT_NODE && 
         range.endContainer === element);
      
      // Check if element is a leaf node (img, br, input, etc.) or is directly selected
      const isLeafElement = 
        element.tagName === 'IMG' ||
        element.tagName === 'BR' ||
        element.tagName === 'HR' ||
        element.tagName === 'INPUT' ||
        element.tagName === 'VIDEO' ||
        element.tagName === 'AUDIO' ||
        element.tagName === 'IFRAME' ||
        element.tagName === 'EMBED' ||
        element.tagName === 'OBJECT';
      
      // Check if element is fully contained in range (not just a parent container)
      let isFullyContained = false;
      try {
        const elementRange = doc.createRange();
        elementRange.selectNodeContents(element);
        isFullyContained = 
          range.compareBoundaryPoints(Range.START_TO_START, elementRange) <= 0 &&
          range.compareBoundaryPoints(Range.END_TO_END, elementRange) >= 0;
      } catch {
        // ignore
      }

      if (isDirectlySelected || (isLeafElement && isFullyContained)) {
        const elementName = element.tagName;
        const elementId = element.id || undefined;
        const elementClass = (element.className as string) || undefined;
        const path = formatNodePath(elementName, elementId, elementClass);
        
        // For element nodes, offset represents child index
        let segStart = 0;
        let segEnd = 1;
        
        if (element === range.startContainer) {
          segStart = range.startOffset;
        }
        if (element === range.endContainer) {
          segEnd = range.endOffset;
        }
        
        // Determine element type label
        let elementLabel = `[${elementName}]`;
        if (elementName === 'IMG') {
          const alt = (element as HTMLImageElement).alt || '';
          elementLabel = `[IMG${alt ? `: ${alt}` : ''}]`;
        } else if (elementName === 'BR') {
          elementLabel = '[BR]';
        } else if (elementName === 'VIDEO') {
          elementLabel = '[VIDEO]';
        } else if (elementName === 'AUDIO') {
          elementLabel = '[AUDIO]';
        }

        segments.push({
          path,
          start: segStart,
          end: segEnd,
          text: elementLabel,
        });
        
        processedElements.add(element);
      }

      elementNode = elementWalker.nextNode();
    }
  } catch {
    // ignore errors in segment construction
  }

  return segments;
}

function PhaseBlockView({ phase, t }: { phase: PhaseBlock; t: ReturnType<typeof getTranslation> }) {
  const log = phase.log;
  if (!log) return null;

  const isError = phase.highlight === 'error';
  const isWarning = phase.highlight === 'warning';
  const borderClass = isError ? 'border-red-500' : isWarning ? 'border-amber-500' : 'border-border-light';
  const headerBgClass = isError ? 'bg-red-100 dark:bg-red-950/30' : isWarning ? 'bg-amber-100 dark:bg-amber-950/30' : 'bg-bg-muted';
  const bodyBgClass = isError ? 'bg-red-50 dark:bg-red-950/20' : isWarning ? 'bg-amber-50 dark:bg-amber-950/20' : 'bg-bg-surface';

  const typeColorClass: Record<string, string> = {
    selectionchange: 'text-blue-500',
    compositionstart: 'text-purple-500',
    compositionupdate: 'text-purple-500',
    compositionend: 'text-purple-500',
    beforeinput: 'text-orange-500',
    input: 'text-green-500',
  };

  const formatSibling = (s: SiblingInfo | null | undefined, label: string) => {
    if (!s) return null;
    const path = formatNodePath(s.nodeName, s.id, s.className);
    const text = s.textPreview ? ` "${s.textPreview}"` : '';
    return <Line label={label} value={`${path}${text}`} />;
  };

  const selectionSegments =
    log.type === 'selectionchange'
      ? buildSelectionSegmentsFromLog(log)
      : [];

  return (
    <div className={`border-[1.5px] ${borderClass} rounded-md overflow-hidden ${bodyBgClass}`}>
      <div className={`px-2 py-1.5 ${headerBgClass} border-b ${borderClass} flex justify-between items-center`}>
        <span className={`font-bold text-sm ${typeColorClass[log.type] || 'text-text-primary'}`}>
          {phase.title}
        </span>
        <span className="text-xs text-text-muted">Δ={phase.delta}ms</span>
      </div>

      <div className="p-2 px-2.5 text-xs font-mono leading-relaxed">
        <Line label="type" value={`${log.type} (${log.inputType || '-'})`} />
        <Line 
          label="parent" 
          value={formatNodePath(log.parent?.nodeName || '-', log.parent?.id, log.parent?.className)} 
          color={typeColorClass[log.type]} 
        />
        <Line 
          label="  node" 
          value={formatNodePath(log.node?.nodeName || '-', log.node?.id, log.node?.className)} 
        />
        {/* Offset display */}
        {log.endNode ? (
          // Cross-node selection - show detailed Range Selection box
          <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-500 rounded px-2 py-1.5 mt-1 text-xs">
            <div className="flex gap-1.5">
              <span className="text-amber-900 dark:text-amber-200 min-w-[40px] text-xs">start:</span>
              <span className="text-amber-800 dark:text-amber-300 text-xs">
                {log.node?.nodeName === '#text' && log.parent ? (
                  <>{formatNodePath(log.parent.nodeName, log.parent.id, log.parent.className)} &gt; #text @ {log.startOffset}</>
                ) : (
                  <>{formatNodePath(log.node?.nodeName || '-', log.node?.id, log.node?.className)} @ {log.startOffset}</>
                )}
              </span>
            </div>
            <div className="flex gap-1.5 bg-orange-200 dark:bg-orange-900/40 px-1.5 py-1 rounded -mx-2 mt-1">
              <span className="text-amber-900 dark:text-amber-200 min-w-[40px] text-xs">end:</span>
              <span className="text-orange-800 dark:text-orange-200 font-semibold text-xs">
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
          <div className="flex gap-1.5">
            <span className="text-text-muted min-w-[45px]">offset:</span>
            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-1 rounded">
              {log.startOffset}..{log.endOffset} <span className="text-[0.7rem]">(range: {log.endOffset - log.startOffset})</span>
            </span>
          </div>
        ) : (
          // Collapsed cursor
          <div className="flex gap-1.5">
            <span className="text-text-muted min-w-[45px]">offset:</span>
            <span className="text-text-primary">
              {log.startOffset} <span className="text-text-muted text-[0.7rem]">(collapsed)</span>
            </span>
          </div>
        )}
        {log.childIndex !== undefined && (
          <Line label="index" value={`${log.childIndex} / ${log.childCount}`} />
        )}
        {formatSibling(log.leftSibling, 'left')}
        {formatSibling(log.rightSibling, 'right')}
        {/* Selection segments: show only the actually selected ranges, not the entire text */}
        {log.type === 'selectionchange' && selectionSegments.length > 0 && (
          <div className="mt-1">
            {selectionSegments.map((seg, idx) => (
              <div key={idx} className="flex gap-2 text-xs">
                <span className="text-text-muted min-w-[55px] text-xs">
                  {idx === 0 ? 'segments:' : ''}
                </span>
                <span className="text-text-primary text-xs">
                  {`seg${idx}: ${seg.path} [${seg.start}..${seg.end}] "`}
                  <DebugText text={seg.text} />
                  {'"'}
                </span>
              </div>
            ))}
          </div>
        )}
        {/* Show data for beforeinput, input, and composition events */}
        {['beforeinput', 'input', 'compositionstart', 'compositionupdate', 'compositionend'].includes(log.type) && (
          <div className="flex gap-2 text-xs">
            <span className="text-text-muted min-w-[55px] text-xs">data:</span>
            <span className="text-green-600 dark:text-green-400 font-semibold text-xs">
              {log.data !== null && log.data !== undefined ? (
                <>"<DebugText text={log.data} />"</>
              ) : (
                <span className="text-gray-400 dark:text-gray-500 italic">null</span>
              )}
            </span>
          </div>
        )}
        {log.isComposing !== undefined && (
          <div className="flex gap-2 text-xs">
            <span className="text-text-muted min-w-[55px] text-xs">composing:</span>
            <span className={`font-medium text-xs ${log.isComposing ? 'text-purple-500' : 'text-gray-500'}`}>
              {log.isComposing ? 'true' : 'false'}
            </span>
          </div>
        )}
        {/* Show getTargetRanges() for beforeinput events */}
        {log.type === 'beforeinput' && log.targetRanges && log.targetRanges.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-500 rounded px-2 py-1.5 mt-1 text-xs">
            <div className="text-blue-900 dark:text-blue-200 font-semibold mb-1">getTargetRanges() ({log.targetRanges.length}):</div>
            {log.targetRanges.map((tr, idx) => (
              <div key={idx} className="text-blue-800 dark:text-blue-300 text-xs mb-1 last:mb-0">
                [{idx}] {tr.startContainer}@{tr.startOffset} → {tr.endContainer}@{tr.endOffset}
                {tr.collapsed && <span className="text-blue-600 dark:text-blue-400"> (collapsed)</span>}
              </div>
            ))}
          </div>
        )}
        {log.type === 'beforeinput' && (!log.targetRanges || log.targetRanges.length === 0) && (
          <div className="flex gap-2 text-xs mt-1">
            <span className="text-text-muted min-w-[55px] text-xs">targetRanges:</span>
            <span className="text-gray-400 dark:text-gray-500 italic text-xs">(empty or not available)</span>
          </div>
        )}
        {/* Show text content with cursor position for #text nodes in input-related events */}
        {['beforeinput', 'input', 'compositionstart', 'compositionupdate', 'compositionend'].includes(log.type) && 
         log.node?.nodeName === '#text' && log.startContainerText && (
          <div className="mt-1.5 p-1.5 px-2 bg-bg-muted rounded border border-border-light">
            <TextWithCursor 
              text={log.startContainerText} 
              startOffset={log.startOffset} 
              endOffset={log.endNode ? log.startContainerText.length : log.endOffset} 
            />
          </div>
        )}
        {log.startBoundary && <Line label={`⚠️ ${t.playground.boundaryStart}`} value={`${log.startBoundary.element} ${log.startBoundary.type === 'start' ? t.playground.boundaryStart : t.playground.boundaryEnd} ${t.playground.boundary}`} color="text-amber-600 dark:text-amber-400" />}
        {log.endBoundary && <Line label={`⚠️ ${t.playground.boundaryEnd}`} value={`${log.endBoundary.element} ${log.endBoundary.type === 'start' ? t.playground.boundaryStart : t.playground.boundaryEnd} ${t.playground.boundary}`} color="text-red-600 dark:text-red-400" />}
      </div>
    </div>
  );
}

function Line({ label, value, color, highlight }: { label: string; value: string; color?: string; highlight?: boolean }) {
  const valueColorClass = highlight 
    ? 'text-green-600 dark:text-green-400 font-semibold' 
    : color 
      ? color 
      : 'text-text-primary';
  
  return (
    <div className="flex gap-2 text-xs">
      <span className="text-text-muted min-w-[55px] text-xs">{label}:</span>
      <span className={`${valueColorClass} text-xs`}>{value}</span>
    </div>
  );
}
