/**
 * Text node 고유 식별자 관리 (WeakMap 사용으로 메모리 안전)
 */
let _textNodeIdCounter = 0;
const _textNodeIdMap = new WeakMap<Text, string>();

/**
 * Text node에 고유 ID를 부여하거나 기존 ID를 반환합니다.
 * WeakMap을 사용하므로 메모리 누수 없이 자동으로 정리됩니다.
 *
 * @param textNode Text 노드
 * @returns 고유 ID 문자열
 */
export function getTextNodeId(textNode: Text): string {
  let id = _textNodeIdMap.get(textNode);
  if (!id) {
    id = `text_${++_textNodeIdCounter}_${Date.now()}`;
    _textNodeIdMap.set(textNode, id);
  }
  return id;
}

/**
 * Text 노드 정보 타입
 */
export type TextNodeInfo = {
  id: string;
  textNode: Text;
  parentElement: Element;
  parentSignature: string;
  text: string;
  offset: number; // 부모 요소 내에서의 offset
};

/**
 * beforeinput 시점의 Text 노드 스냅샷을 생성한다.
 * @param element 편집 가능한 루트 요소
 * @returns Text 노드 정보 맵 (textNodeId -> TextNodeInfo)
 */
export function snapshotTextNodes(element: HTMLElement): Map<string, TextNodeInfo> {
  const infoMap = new Map<string, TextNodeInfo>();
  
  try {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    let globalOffset = 0;
    
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const textNode = node as Text;
        const id = getTextNodeId(textNode);
        const parentElement = textNode.parentElement;
        
        if (parentElement) {
          // 부모 요소 내에서의 offset 계산
          let offset = 0;
          let sibling = textNode.previousSibling;
          while (sibling) {
            if (sibling.nodeType === Node.TEXT_NODE) {
              offset += (sibling as Text).length;
            }
            sibling = sibling.previousSibling;
          }
          
          // 부모 요소 시그니처 생성
          const tagName = parentElement.tagName.toLowerCase();
          const directParent = parentElement.parentElement;
          let nthChild = 0;
          if (directParent) {
            const siblings = Array.from(directParent.children).filter(
              el => el.tagName === parentElement.tagName,
            );
            nthChild = siblings.indexOf(parentElement);
          }
          const className = parentElement.className || "";
          const parentSignature = `${tagName}[${nthChild}].${className}`;
          
          infoMap.set(id, {
            id,
            textNode,
            parentElement,
            parentSignature,
            text: textNode.data,
            offset,
          });
        }
      }
      node = walker.nextNode();
    }
  } catch (error) {
    console.warn("Failed to snapshot text nodes:", error);
  }
  
  return infoMap;
}

