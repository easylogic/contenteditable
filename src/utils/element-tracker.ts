/**
 * DOM Element 고유 식별자 관리 (WeakMap 사용으로 메모리 안전)
 */
let _elementIdCounter = 0;
const _elementIdMap = new WeakMap<Element, string>();

/**
 * Element에 고유 ID를 부여하거나 기존 ID를 반환합니다.
 * WeakMap을 사용하므로 메모리 누수 없이 자동으로 정리됩니다.
 *
 * @param element Element 노드
 * @returns 고유 ID 문자열 (예: "element_1_1234567890")
 */
export function getElementId(element: Element): string {
  let id = _elementIdMap.get(element);
  if (!id) {
    id = `element_${++_elementIdCounter}_${Date.now()}`;
    _elementIdMap.set(element, id);
  }
  return id;
}

/**
 * Element의 고유 ID를 가져옵니다 (없으면 생성하지 않고 undefined 반환)
 * @param element Element 노드
 * @returns 기존 ID 또는 undefined
 */
export function getElementIdIfExists(element: Element): string | undefined {
  return _elementIdMap.get(element);
}
