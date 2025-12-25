import { snapshotTextNodes, type TextNodeInfo } from './text-node-tracker';

/**
 * DOM 변경 감지 결과 타입
 */
export type DomChangeResult = {
  deletedRects: DOMRect[];
  addedRects: DOMRect[];
  modifiedNodes: {
    before: TextNodeInfo | null;
    after: TextNodeInfo | null;
    changeType: 'deleted' | 'added' | 'modified' | 'moved';
  }[];
};

/**
 * 삭제될 텍스트 범위의 rect를 계산한다.
 * @param event InputEvent
 * @param element 편집 가능한 루트 요소
 * @returns 삭제될 텍스트 범위의 rect 배열
 */
export function calculateDeletedRects(
  event: InputEvent,
  element: HTMLElement
): DOMRect[] {
  const deletedRects: DOMRect[] = [];
  
  try {
    const inputType = event.inputType || "";
    const isDelete =
      inputType.startsWith("delete") ||
      inputType === "deleteContentBackward" ||
      inputType === "deleteContentForward" ||
      inputType === "deleteWordBackward" ||
      inputType === "deleteWordForward";

    const currentSelection = window.getSelection();
    const currentRange = currentSelection && currentSelection.rangeCount > 0
      ? currentSelection.getRangeAt(0)
      : null;

    const isReplace =
      !isDelete &&
      (inputType.startsWith("insert") ||
        inputType === "insertText" ||
        inputType === "insertCompositionText");

    if (!isDelete && !isReplace) {
      return deletedRects;
    }

    // getTargetRanges()를 사용해 브라우저가 실제로 지우려는 범위를 기준으로 rect 계산
    let rangesComputed = false;
    let targetRanges: StaticRange[] = [];
    
    try {
      targetRanges = event.getTargetRanges?.() || [];

      if (targetRanges.length > 0) {
        for (const tr of targetRanges) {
          try {
            // StaticRange를 Range로 변환
            const range = document.createRange();
            range.setStart(tr.startContainer, tr.startOffset);
            range.setEnd(tr.endContainer, tr.endOffset);
            
            const rects = range.getClientRects();
            for (let i = 0; i < rects.length; i++) {
              deletedRects.push(rects[i]);
            }
          } catch (e) {
            // StaticRange 변환 실패 시 무시
          }
        }
        if (deletedRects.length > 0) {
          rangesComputed = true;
        }
      }
    } catch {
      // getTargetRanges 사용 실패 시 selection 기반으로 fallback
    }

    // getTargetRanges()로 rect를 얻지 못한 경우, 현재 selection 기준으로 삭제 영역 계산
    if (!rangesComputed && currentRange && !currentRange.collapsed) {
      const rects = currentRange.getClientRects();
      for (let i = 0; i < rects.length; i++) {
        deletedRects.push(rects[i]);
      }
    } else if (!rangesComputed && targetRanges.length === 0 && 
               inputType === "insertCompositionText" && currentRange) {
      // 한글 조합(insertCompositionText)인 경우, caret 기준으로 "직전 1글자"를 삭제 영역으로 간주
      if (currentRange.collapsed && currentRange.startContainer.nodeType === Node.TEXT_NODE) {
        const textNode = currentRange.startContainer as Text;
        const end = currentRange.startOffset;
        const start = Math.max(0, end - 1);
        if (end > start) {
          const tempRange = document.createRange();
          tempRange.setStart(textNode, start);
          tempRange.setEnd(textNode, end);
          const rects = tempRange.getClientRects();
          for (let i = 0; i < rects.length; i++) {
            deletedRects.push(rects[i]);
          }
        }
      }
    }
  } catch (error) {
    console.warn("Failed to compute deleted range rects:", error);
  }
  
  return deletedRects;
}

/**
 * input 시점에 DOM 변경을 감지한다.
 * @param element 편집 가능한 루트 요소
 * @param beforeInfo beforeinput 시점의 Text 노드 정보 맵
 * @param beforeInputDeletedRects beforeinput 시점에 계산한 삭제될 텍스트 범위 rect
 * @returns DOM 변경 감지 결과
 */
export function detectDomChanges(
  element: HTMLElement,
  beforeInfo: Map<string, TextNodeInfo>,
  beforeInputDeletedRects: DOMRect[]
): DomChangeResult {
  const afterInfo = snapshotTextNodes(element);
  const modifiedNodes: DomChangeResult['modifiedNodes'] = [];
  const addedRects: DOMRect[] = [];

  // beforeinput에 있던 노드가 input 후에도 있는지 확인
  for (const [id, beforeNode] of beforeInfo) {
    const afterNode = afterInfo.get(id);
    
    if (!afterNode) {
      // 노드가 삭제됨
      modifiedNodes.push({
        before: beforeNode,
        after: null,
        changeType: 'deleted',
      });
    } else if (beforeNode.text !== afterNode.text) {
      // 노드가 수정됨
      modifiedNodes.push({
        before: beforeNode,
        after: afterNode,
        changeType: 'modified',
      });
    } else if (beforeNode.parentSignature !== afterNode.parentSignature) {
      // 노드가 이동됨 (부모가 변경됨)
      modifiedNodes.push({
        before: beforeNode,
        after: afterNode,
        changeType: 'moved',
      });
    }
  }

  // input 후에 새로 추가된 노드 확인
  for (const [id, afterNode] of afterInfo) {
    if (!beforeInfo.has(id)) {
      // 새로 추가된 노드
      modifiedNodes.push({
        before: null,
        after: afterNode,
        changeType: 'added',
      });
      
      // 추가된 텍스트의 rect 계산
      try {
        const range = document.createRange();
        range.selectNodeContents(afterNode.textNode);
        const rects = range.getClientRects();
        for (let i = 0; i < rects.length; i++) {
          addedRects.push(rects[i]);
        }
      } catch {
        // rect 계산 실패 시 무시
      }
    }
  }

  return {
    deletedRects: beforeInputDeletedRects,
    addedRects,
    modifiedNodes,
  };
}

