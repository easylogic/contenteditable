import React, { useMemo, useState, useRef, useEffect } from 'react';
import { EDITOR_PRESETS, type EditorPreset } from '../data/presets';
import { getTranslation, type Locale, supportedLocales } from '../i18n/translations';

type CasePlaygroundProps = {
  id: string;
  caseTitle: string;
  os: string;
  osVersion?: string;
  device: string;
  deviceVersion?: string;
  browser: string;
  browserVersion?: string;
  keyboard: string;
  initialHtml?: string;
  locale?: string;
};

type LogEntry = {
  id: number;
  time: string;
  timestamp: number;
  type: string;
  data: Record<string, unknown>;
  inputType?: string;
  targetRanges?: StaticRange[];
};

type DetectedEnv = {
  os: string;
  browser: string;
};

const formatTime = (d: Date) =>
  `${d.toISOString().split('T')[1]?.replace('Z', '') ?? ''}`;

function detectEnvironment(): DetectedEnv {
  if (typeof navigator === 'undefined') {
    return { os: '', browser: '' };
  }

  const ua = navigator.userAgent;
  const platform =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData
      ?.platform ?? navigator.platform;

  let os = '';
  if (/Win/i.test(platform) || /Windows/i.test(ua)) os = 'Windows';
  else if (/Mac/i.test(platform) || /Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(platform) || /X11/i.test(ua)) os = 'Linux';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';

  let browser = '';
  if (/Edg\//.test(ua)) browser = 'Edge';
  else if (/Chrome\//.test(ua)) browser = 'Chrome';
  else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) browser = 'Safari';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';

  return { os, browser };
}

// Get default preset based on keyboard and locale
function getDefaultPresetId(keyboard: string, locale?: string): string {
  const keyboardLower = keyboard.toLowerCase();
  const localeLower = (locale || 'en').toLowerCase();
  
  // Korean IME
  if (keyboardLower.includes('korean') || keyboardLower.includes('한국어')) {
    return 'plain-cjk-paragraph';
  }
  
  // Japanese IME
  if (keyboardLower.includes('japanese') || keyboardLower.includes('日本語')) {
    return 'plain-japanese-paragraph';
  }
  
  // Chinese IME
  if (keyboardLower.includes('chinese') || keyboardLower.includes('中文') || keyboardLower.includes('中国')) {
    return 'plain-chinese-paragraph';
  }
  
  // Thai IME
  if (keyboardLower.includes('thai') || keyboardLower.includes('태국어')) {
    return 'plain-thai-paragraph';
  }
  
  // Vietnamese IME
  if (keyboardLower.includes('vietnamese') || keyboardLower.includes('베트남어')) {
    return 'plain-vietnamese-paragraph';
  }
  
  // Arabic IME
  if (keyboardLower.includes('arabic') || keyboardLower.includes('아랍어')) {
    return 'plain-arabic-paragraph';
  }
  
  // Hindi IME
  if (keyboardLower.includes('hindi') || keyboardLower.includes('힌디어')) {
    return 'plain-hindi-paragraph';
  }
  
  // Korean locale
  if (localeLower === 'ko') {
    return 'plain-cjk-paragraph';
  }
  
  // Default: plain CJK paragraph (works for most cases)
  return 'plain-cjk-paragraph';
}

// Get language-specific default text
function getDefaultText(locale?: string): string {
  const localeLower = (locale || 'en').toLowerCase();
  
  if (localeLower === 'ko') {
    return '<p>이 편집 가능한 영역에서 설명된 케이스를 재현해보세요.</p>';
  }
  
  return '<p>Use this editable area to reproduce the described case.</p>';
}

export function CasePlayground(props: CasePlaygroundProps) {
  const [reportedEnv] = useState({
    os: props.os,
    device: props.device,
    browser: props.browser,
    keyboard: props.keyboard,
  });

  const detectedEnv = useMemo(() => detectEnvironment(), []);

  const [userEnv, setUserEnv] = useState({
    os: detectedEnv.os || reportedEnv.os,
    device: reportedEnv.device,
    browser: detectedEnv.browser || reportedEnv.browser,
    keyboard: reportedEnv.keyboard,
  });

  // Detect UI locale from browser
  const uiLocale = useMemo<Locale>(() => {
    if (typeof navigator === 'undefined') return 'en';
    const browserLang = navigator.language.split('-')[0];
    return supportedLocales.includes(browserLang as Locale) ? (browserLang as Locale) : 'en';
  }, []);

  // Get default preset based on keyboard and locale
  const defaultPresetId = useMemo(() => 
    getDefaultPresetId(props.keyboard, props.locale || uiLocale),
    [props.keyboard, props.locale, uiLocale]
  );

  const [selectedPresetId, setSelectedPresetId] = useState(defaultPresetId);
  const selectedPreset = useMemo(() => 
    EDITOR_PRESETS.find((p) => p.id === selectedPresetId) ?? EDITOR_PRESETS[0],
    [selectedPresetId]
  );

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [anomalies, setAnomalies] = useState<Array<{ type: string; description: string; detail: string }>>([]);
  const editableRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const logIdCounterRef = useRef(0);
  const lastBeforeInputRef = useRef<LogEntry | null>(null);
  const lastInputRef = useRef<LogEntry | null>(null);

  // Initialize content only once
  useEffect(() => {
    if (editableRef.current && !isInitializedRef.current) {
      // Use initialHtml if provided, otherwise use preset or default text
      if (props.initialHtml) {
        editableRef.current.innerHTML = props.initialHtml;
      } else if (selectedPreset.html) {
        editableRef.current.innerHTML = selectedPreset.html;
      } else {
        editableRef.current.innerHTML = getDefaultText(props.locale || uiLocale);
      }
      isInitializedRef.current = true;
    }
  }, [props.initialHtml, selectedPreset.html, props.locale, uiLocale]);

  // Update content when preset changes
  useEffect(() => {
    if (editableRef.current && isInitializedRef.current && selectedPreset.html) {
      editableRef.current.innerHTML = selectedPreset.html;
      // Reset logs when preset changes
      setLogs([]);
      setAnomalies([]);
      logIdCounterRef.current = 0;
      lastBeforeInputRef.current = null;
      lastInputRef.current = null;
    }
  }, [selectedPresetId, selectedPreset.html]);

  const resetLogs = () => {
    setLogs([]);
    setAnomalies([]);
    logIdCounterRef.current = 0;
    lastBeforeInputRef.current = null;
    lastInputRef.current = null;
  };

  const pushLog = (type: string, data: Record<string, unknown>, event?: Event) => {
    logIdCounterRef.current += 1;
    const timestamp = Date.now();
    const inputEvent = event as InputEvent | undefined;
    const inputType = inputEvent?.inputType;
    
    // Serialize targetRanges safely
    let targetRangesSerialized: Array<{
      startContainer: string;
      startOffset: number;
      endContainer: string;
      endOffset: number;
    }> | undefined;
    
    if (inputEvent && 'getTargetRanges' in inputEvent && typeof inputEvent.getTargetRanges === 'function') {
      try {
        const ranges = inputEvent.getTargetRanges();
        targetRangesSerialized = Array.from(ranges).map(r => ({
          startContainer: r.startContainer?.nodeName || '#text',
          startOffset: r.startOffset,
          endContainer: r.endContainer?.nodeName || '#text',
          endOffset: r.endOffset,
        }));
      } catch (e) {
        // getTargetRanges() may throw in some browsers
        console.warn('Failed to get targetRanges:', e);
      }
    }
    
    const logEntry: LogEntry = {
      id: logIdCounterRef.current,
      time: formatTime(new Date(timestamp)),
      timestamp,
      type,
      data: {
        ...data,
        inputType,
        targetRanges: targetRangesSerialized,
      },
      inputType,
      targetRanges: inputEvent && 'getTargetRanges' in inputEvent && typeof inputEvent.getTargetRanges === 'function'
        ? (() => {
            try {
              return Array.from(inputEvent.getTargetRanges());
            } catch {
              return undefined;
            }
          })()
        : undefined,
    };
    
    setLogs((prev) => {
      const newLogs = [logEntry, ...prev];
      
      // Update refs for beforeinput/input tracking
      if (type === 'beforeinput') {
        lastBeforeInputRef.current = logEntry;
      } else if (type === 'input') {
        lastInputRef.current = logEntry;
      }
      
      // Detect anomalies after adding log (use refs for previous state comparison)
      detectAnomalies(newLogs);
      
      return newLogs;
    });
  };
  
  const detectAnomalies = (allLogs: LogEntry[]) => {
    const newAnomalies: Array<{ type: string; description: string; detail: string }> = [];
    
    // Find the most recent events
    const lastBi = allLogs.find(log => log.type === 'beforeinput');
    const lastIn = allLogs.find(log => log.type === 'input');
    const lastComp = allLogs.find(log => 
      log.type === 'compositionstart' || 
      log.type === 'compositionupdate' || 
      log.type === 'compositionend'
    );
    const lastCompStart = allLogs.find(log => log.type === 'compositionstart');
    const lastCompUpdate = allLogs.find(log => log.type === 'compositionupdate');
    const lastCompEnd = allLogs.find(log => log.type === 'compositionend');
    
    // 1. InputType mismatch detection (beforeinput vs input)
    if (lastBi && lastIn && lastBi.inputType && lastIn.inputType && lastBi.inputType !== lastIn.inputType) {
      newAnomalies.push({
        type: 'inputtype-mismatch',
        description: 'beforeinput과 input의 inputType이 다름',
        detail: `beforeinput: "${lastBi.inputType}" vs input: "${lastIn.inputType}"`,
      });
    }
    
    // 2. Missing beforeinput (input without corresponding beforeinput within reasonable time)
    if (lastIn) {
      const inputTime = lastIn.timestamp;
      const hasRecentBeforeInput = allLogs.some(log => 
        log.type === 'beforeinput' && 
        Math.abs(log.timestamp - inputTime) < 100 // within 100ms
      );
      
      if (!hasRecentBeforeInput) {
        newAnomalies.push({
          type: 'missing-beforeinput',
          description: 'input 이벤트에 대응하는 beforeinput이 없음',
          detail: `inputType: "${lastIn.inputType || 'unknown'}"`,
        });
      }
    }
    
    // 3. Parent ID/Node mismatch (beforeinput vs input)
    if (lastBi && lastIn) {
      const biParentTrackingId = (lastBi.data.parentTrackingId as string) || '';
      const inParentTrackingId = (lastIn.data.parentTrackingId as string) || '';
      const biParentName = (lastBi.data.parentNodeName as string) || '';
      const inParentName = (lastIn.data.parentNodeName as string) || '';
      const biParentId = (lastBi.data.parentId as string) || ''; // HTML id (for display)
      const inParentId = (lastIn.data.parentId as string) || ''; // HTML id (for display)
      const biContainerName = (lastBi.data.containerNodeName as string) || '';
      const inContainerName = (lastIn.data.containerNodeName as string) || '';
      
      // Parent 비교: trackingId를 우선 사용 (항상 존재)
      if (biParentTrackingId && inParentTrackingId && biParentTrackingId !== inParentTrackingId) {
        newAnomalies.push({
          type: 'parent-mismatch',
          description: 'beforeinput과 input의 parent가 다름',
          detail: `beforeinput parent: ${biParentName}${biParentId ? `#${biParentId}` : ''} (${biParentTrackingId}) → input parent: ${inParentName}${inParentId ? `#${inParentId}` : ''} (${inParentTrackingId})`,
        });
      }
      
      // Container node name mismatch
      if (biContainerName && inContainerName && biContainerName !== inContainerName) {
        newAnomalies.push({
          type: 'node-mismatch',
          description: 'beforeinput과 input의 container node가 다름',
          detail: `beforeinput container: ${biContainerName} → input container: ${inContainerName}`,
        });
      }
    }
    
    // 4. Data length mismatch (event.data 길이가 예상보다 많이 다름)
    if (lastBi && lastBi.data.data) {
      const dataLength = (lastBi.data.data as string).length;
      const startOffset = (lastBi.data.startOffset as number) || 0;
      const endOffset = (lastBi.data.endOffset as number) || startOffset;
      const selectionLength = Math.abs(endOffset - startOffset);
      const inputType = lastBi.inputType || '';
      
      // 삽입인 경우 data가 1~2글자 정도가 정상, 훨씬 길면 비정상
      if (inputType.startsWith('insert') && dataLength > selectionLength + 5) {
        newAnomalies.push({
          type: 'data-length-mismatch',
          description: '입력 데이터 길이가 예상보다 큼',
          detail: `data.length: ${dataLength}, selection: ${selectionLength}, inputType: ${inputType}`,
        });
      }
    }
    
    // 5. Data content mismatch (beforeinput.data와 input.data가 완전히 다름)
    if (lastBi && lastIn && lastBi.data.data && lastIn.data.data) {
      const beforeData = lastBi.data.data as string;
      const inputData = lastIn.data.data as string;
      
      // 포함관계가 아닌 경우
      if (beforeData.length > 2 && inputData.length > 0) {
        if (!beforeData.includes(inputData) && !inputData.includes(beforeData)) {
          newAnomalies.push({
            type: 'data-content-mismatch',
            description: 'beforeinput과 input의 데이터 내용이 다름',
            detail: `beforeinput.data: "${beforeData}" vs input.data: "${inputData}"`,
          });
        }
      }
    }
    
    // 6. Selection jump detection (beforeinput vs input)
    if (lastBi && lastIn) {
      const biOffset = (lastBi.data.startOffset as number) || 0;
      const inOffset = (lastIn.data.startOffset as number) || 0;
      const biParentId = (lastBi.data.parentId as string) || '';
      const inParentId = (lastIn.data.parentId as string) || '';
      const biParentName = (lastBi.data.parentNodeName as string) || '';
      const inParentName = (lastIn.data.parentNodeName as string) || '';
      
      // 같은 parent 내에서 offset이 크게 다른 경우
      // Parent 비교: ID > (Name + ClassName) > Name 순으로 비교
      let sameParent = false;
      if (biParentId && inParentId) {
        sameParent = biParentId === inParentId;
      } else if (biParentName && inParentName) {
        const biParentClassName = (lastBi.data.parentClassName as string) || '';
        const inParentClassName = (lastIn.data.parentClassName as string) || '';
        const biKey = `${biParentName}${biParentClassName ? `.${biParentClassName}` : ''}`;
        const inKey = `${inParentName}${inParentClassName ? `.${inParentClassName}` : ''}`;
        sameParent = biKey === inKey;
      }
      
      if (sameParent) {
        const offsetDelta = Math.abs(biOffset - inOffset);
        // 입력 후 예상 offset 계산 (insert 이벤트인 경우)
        if (lastBi.inputType?.startsWith('insert') && lastBi.data.data) {
          const insertLength = (lastBi.data.data as string).length;
          const expectedOffset = biOffset + insertLength;
          const expectedDelta = Math.abs(inOffset - expectedOffset);
          
          // 예상 offset과 실제 offset이 크게 다른 경우
          if (expectedDelta > 4) {
            newAnomalies.push({
              type: 'selection-jump',
              description: '입력 후 예상 offset과 실제 offset이 다름',
              detail: `beforeinput offset: ${biOffset}, 입력 길이: ${insertLength}, 예상 offset: ${expectedOffset}, 실제 offset: ${inOffset}, delta: ${expectedDelta}`,
            });
          }
        } else if (offsetDelta > 4) {
          // 일반적인 offset 차이
          newAnomalies.push({
            type: 'selection-jump',
            description: 'beforeinput과 input 사이에 selection이 크게 이동함',
            detail: `beforeinput offset: ${biOffset} → input offset: ${inOffset}, delta: ${offsetDelta}`,
          });
        }
      }
    }
    
    // 7. Compare with previous logs (selection jump detection)
    // Compare last input with current beforeinput
    if (lastInputRef.current && lastBi) {
      const lastInputOffset = (lastInputRef.current.data.startOffset as number) || 0;
      const beforeInputOffset = (lastBi.data.startOffset as number) || 0;
      const timeDelta = lastBi.timestamp - lastInputRef.current.timestamp;
      
      if (timeDelta < 1000 && timeDelta > 0) {
        const offsetDelta = Math.abs(beforeInputOffset - lastInputOffset);
        if (offsetDelta > 4) {
          newAnomalies.push({
            type: 'selection-jump',
            description: '이전 input과 현재 beforeinput 사이에 selection이 크게 이동함',
            detail: `이전 input offset: ${lastInputOffset} → beforeinput offset: ${beforeInputOffset}, delta: ${offsetDelta}, timeDelta: ${timeDelta}ms`,
          });
        }
      }
    }
    
    // 8. Compare previous beforeinput with current beforeinput
    if (lastBeforeInputRef.current && lastBi && lastBeforeInputRef.current.id !== lastBi.id) {
      const prevBeforeInputOffset = (lastBeforeInputRef.current.data.startOffset as number) || 0;
      const currentBeforeInputOffset = (lastBi.data.startOffset as number) || 0;
      const timeDelta = lastBi.timestamp - lastBeforeInputRef.current.timestamp;
      
      if (timeDelta < 1000 && timeDelta > 0) {
        const offsetDelta = Math.abs(currentBeforeInputOffset - prevBeforeInputOffset);
        if (offsetDelta > 4) {
          newAnomalies.push({
            type: 'selection-jump',
            description: '이전 beforeinput과 현재 beforeinput 사이에 selection이 크게 이동함',
            detail: `이전 beforeinput offset: ${prevBeforeInputOffset} → 현재 beforeinput offset: ${currentBeforeInputOffset}, delta: ${offsetDelta}, timeDelta: ${timeDelta}ms`,
          });
        }
      }
    }
    
    // 9. Text leak detection (인라인 요소에서 블록 요소로 텍스트 이동)
    if (lastBi && lastIn && lastBi.data.parentNodeName && lastIn.data.parentNodeName) {
      const biParentName = (lastBi.data.parentNodeName as string) || '';
      const inParentName = (lastIn.data.parentNodeName as string) || '';
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
    
    // 10. Node type change detection (container node 타입 변경)
    if (lastBi && lastIn) {
      const biContainerName = (lastBi.data.containerNodeName as string) || '';
      const inContainerName = (lastIn.data.containerNodeName as string) || '';
      
      if (biContainerName && inContainerName && biContainerName !== inContainerName) {
        newAnomalies.push({
          type: 'node-type-change',
          description: 'container node 타입이 변경됨',
          detail: `${biContainerName} → ${inContainerName}`,
        });
      }
    }
    
    // 11. Composition mismatch (composition과 input 데이터 불일치)
    if (lastComp && lastIn && lastComp.data.data && lastIn.data.data) {
      const compData = (lastComp.data.data as string) || '';
      const inputData = (lastIn.data.data as string) || '';
      
      // composition 데이터가 input 데이터를 포함하지 않는 경우
      if (compData && inputData && !compData.includes(inputData) && !inputData.includes(compData)) {
        newAnomalies.push({
          type: 'composition-mismatch',
          description: 'composition과 input 데이터가 다름',
          detail: `composition: "${compData}" vs input: "${inputData}"`,
        });
      }
    }
    
    // 12. Composition vs input selection mismatch
    if (lastComp && lastIn) {
      const compParentTrackingId = (lastComp.data.parentTrackingId as string) || '';
      const inParentTrackingId = (lastIn.data.parentTrackingId as string) || '';
      const compOffset = (lastComp.data.startOffset as number) || 0;
      const inOffset = (lastIn.data.startOffset as number) || 0;
      
      // 같은 parent 내에서 offset이 크게 다른 경우
      if (compParentTrackingId && inParentTrackingId && compParentTrackingId === inParentTrackingId) {
        const offsetDelta = Math.abs(compOffset - inOffset);
        if (offsetDelta > 10) {
          newAnomalies.push({
            type: 'selection-mismatch',
            description: 'composition과 input 사이에 selection이 크게 이동함',
            detail: `composition offset: ${compOffset} → input offset: ${inOffset}, delta: ${offsetDelta}`,
          });
        }
      }
      
      // 부모가 다른 경우
      if (compParentTrackingId && inParentTrackingId && compParentTrackingId !== inParentTrackingId) {
        newAnomalies.push({
          type: 'selection-mismatch',
          description: 'composition과 input의 parent가 다름',
          detail: `composition parent: ${compParentTrackingId} → input parent: ${inParentTrackingId}`,
        });
      }
    }
    
    // 13. Sibling created detection (새로운 sibling 노드 생성)
    if (lastBi && lastIn) {
      const biChildCount = (lastBi.data.childCount as number) || 0;
      const inChildCount = (lastIn.data.childCount as number) || 0;
      
      if (biChildCount > 0 && inChildCount > biChildCount) {
        newAnomalies.push({
          type: 'sibling-created',
          description: '새로운 sibling 노드가 생성됨',
          detail: `childCount: ${biChildCount} → ${inChildCount}`,
        });
      }
    }
    
    // 14. Composition 이벤트들 간 불일치 감지
    // 14-1. compositionStart vs compositionEnd
    if (lastCompStart && lastCompEnd) {
      const startParentTrackingId = (lastCompStart.data.parentTrackingId as string) || '';
      const endParentTrackingId = (lastCompEnd.data.parentTrackingId as string) || '';
      const startOffset = (lastCompStart.data.startOffset as number) || 0;
      const endOffset = (lastCompEnd.data.startOffset as number) || 0;
      
      // 같은 composition 세션 내에서 parent가 변경된 경우
      if (startParentTrackingId && endParentTrackingId && startParentTrackingId !== endParentTrackingId) {
        newAnomalies.push({
          type: 'composition-mismatch',
          description: 'composition 세션 중 parent가 변경됨',
          detail: `compositionStart parent: ${startParentTrackingId} → compositionEnd parent: ${endParentTrackingId}, offset: ${startOffset} → ${endOffset}`,
        });
      }
      
      // 같은 parent 내에서 offset이 크게 다른 경우
      if (startParentTrackingId && endParentTrackingId && startParentTrackingId === endParentTrackingId) {
        const offsetDelta = Math.abs(endOffset - startOffset);
        if (offsetDelta > 10) {
          newAnomalies.push({
            type: 'composition-mismatch',
            description: 'composition 세션 중 offset이 크게 변경됨',
            detail: `compositionStart offset: ${startOffset} → compositionEnd offset: ${endOffset}, delta: ${offsetDelta}`,
          });
        }
      }
    }
    
    // 14-2. compositionStart vs compositionUpdate
    if (lastCompStart && lastCompUpdate) {
      const startParentTrackingId = (lastCompStart.data.parentTrackingId as string) || '';
      const updateParentTrackingId = (lastCompUpdate.data.parentTrackingId as string) || '';
      const startOffset = (lastCompStart.data.startOffset as number) || 0;
      const updateOffset = (lastCompUpdate.data.startOffset as number) || 0;
      
      // 같은 composition 세션 내에서 parent가 변경된 경우
      if (startParentTrackingId && updateParentTrackingId && startParentTrackingId !== updateParentTrackingId) {
        newAnomalies.push({
          type: 'composition-mismatch',
          description: 'composition 세션 중 parent가 변경됨 (start→update)',
          detail: `compositionStart parent: ${startParentTrackingId} → compositionUpdate parent: ${updateParentTrackingId}, offset: ${startOffset} → ${updateOffset}`,
        });
      }
    }
    
    // 15. Boundary input detection (인라인 요소 경계에서 입력)
    // Note: trackingId로는 DOM 요소를 찾을 수 없으므로, Range 정보를 직접 사용하거나 생략
    // 이 감지는 Playground에서 더 정확하게 수행됨
    // 현재는 parentNodeName과 offset만으로 근사치 판단
    if (lastBi && lastBi.data.parentTrackingId) {
      try {
        // trackingId로는 DOM 요소를 직접 찾을 수 없으므로
        // parentNodeName과 offset만으로 경계 판단 (제한적)
        const parentNodeName = (lastBi.data.parentNodeName as string) || '';
        const inlineElements = ['A', 'B', 'I', 'STRONG', 'EM', 'SPAN', 'CODE', 'MARK', 'U', 'S', 'ABBR', 'CITE', 'DFN', 'KBD', 'Q', 'SAMP', 'SMALL', 'SUB', 'SUP', 'TIME', 'VAR'];
        
        if (parentNodeName && inlineElements.includes(parentNodeName)) {
          const offset = (lastBi.data.startOffset as number) || 0;
          
          // offset이 0이면 시작 경계로 간주
          if (offset === 0) {
            newAnomalies.push({
              type: 'boundary-input',
              description: '인라인 요소 시작 경계에서 입력',
              detail: `${parentNodeName} 시작 경계 (offset: 0)`,
            });
          }
          // offset이 매우 작거나 큰 경우도 경계로 간주할 수 있지만, 정확한 textLength를 알 수 없으므로 제한적
        }
      } catch (e) {
        // Boundary detection 실패는 무시 (optional feature)
      }
    }
    
    setAnomalies(newAnomalies);
  };

  const handleCopyIssueTemplate = async () => {
    const bodyLines = [
      '# contenteditable case report',
      '',
      '## Case',
      `- caseId: \`${props.id}\``,
      `- title: \`${props.caseTitle}\``,
      '',
      '## Reported environment (from case document)',
      `- os: \`${reportedEnv.os}\``,
      `- device: \`${reportedEnv.device}\``,
      `- browser: \`${reportedEnv.browser}\``,
      `- keyboard: \`${reportedEnv.keyboard}\``,
      '',
      '## Your environment (while reproducing)',
      `- os: \`${userEnv.os}\``,
      `- device: \`${userEnv.device}\``,
      `- browser: \`${userEnv.browser}\``,
      `- keyboard: \`${userEnv.keyboard}\``,
      '',
      '## Observed behavior',
      '_Describe what actually happened._',
      '',
      '## Expected behavior',
      '_Describe what you expected instead._',
      '',
      '## Logs',
      '',
      '```json',
      JSON.stringify(
        logs
          .slice()
          .reverse()
          .map(({ id, ...rest }) => rest),
        null,
        2,
      ),
      '```',
    ];

    const text = bodyLines.join('\n');

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Ignore clipboard errors; user can still copy manually.
    }
  };

  return (
    <section
      aria-label="Case playground"
      className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6 mt-7 items-stretch"
    >
      <div className="flex flex-col gap-3.5">
        <header>
          <h2 className="text-lg mb-1.5">
            Playground for this case
          </h2>
          <p className="m-0 text-sm text-text-secondary">
            Use the reported environment as a reference and record what happens in your environment
            while interacting with the editable area.
          </p>
        </header>

        <div className="rounded-xl border border-border-light bg-bg-surface p-3.5 px-3.5 flex flex-col gap-2.5">
          <div className="text-sm leading-normal">
            <div className="mb-0.5 font-semibold">
              Reported environment
            </div>
            <div>
              OS: {reportedEnv.os}
              {props.osVersion && ` ${props.osVersion}`}
            </div>
            <div>
              Device: {reportedEnv.device}
              {props.deviceVersion && ` ${props.deviceVersion}`}
            </div>
            <div>
              Browser: {reportedEnv.browser}
              {props.browserVersion && ` ${props.browserVersion}`}
            </div>
            <div>Keyboard: {reportedEnv.keyboard}</div>
          </div>

          <div className="text-sm leading-normal">
            <div className="mb-0.5 font-semibold">Your environment</div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-1.5 gap-x-2">
              <label className="flex flex-col gap-0.5">
                <span>OS</span>
                <input
                  type="text"
                  value={userEnv.os}
                  onChange={(e) => setUserEnv((prev) => ({ ...prev, os: e.target.value }))}
                  className="px-1.5 py-1 rounded-md border border-border-medium text-sm"
                />
              </label>
              <label className="flex flex-col gap-0.5">
                <span>Device</span>
                <input
                  type="text"
                  value={userEnv.device}
                  onChange={(e) => setUserEnv((prev) => ({ ...prev, device: e.target.value }))}
                  className="px-1.5 py-1 rounded-md border border-border-medium text-sm"
                />
              </label>
              <label className="flex flex-col gap-0.5">
                <span>Browser</span>
                <input
                  type="text"
                  value={userEnv.browser}
                  onChange={(e) => setUserEnv((prev) => ({ ...prev, browser: e.target.value }))}
                  className="px-1.5 py-1 rounded-md border border-border-medium text-sm"
                />
              </label>
              <label className="flex flex-col gap-0.5">
                <span>Keyboard</span>
                <input
                  type="text"
                  value={userEnv.keyboard}
                  onChange={(e) => setUserEnv((prev) => ({ ...prev, keyboard: e.target.value }))}
                  className="px-1.5 py-1 rounded-md border border-border-medium text-sm"
                />
              </label>
            </div>
          </div>

          <div className="flex gap-2 mt-0.5">
            <button
              type="button"
              onClick={resetLogs}
              className="px-3 py-1 text-sm rounded-full border border-border-light bg-bg-muted cursor-pointer hover:bg-bg-surface transition-colors"
            >
              Clear logs
            </button>
            <button
              type="button"
              onClick={handleCopyIssueTemplate}
              className="px-3 py-1 text-sm rounded-full border border-text-primary bg-text-primary text-bg-surface cursor-pointer hover:opacity-90 transition-opacity"
            >
              Copy GitHub issue template (with logs)
            </button>
          </div>

          <div className="border border-border-light rounded-xl p-2.5 bg-bg-surface mt-1">
            {/* Preset selector */}
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs text-text-secondary">
                {getTranslation(uiLocale).playground.sampleHTML}:
              </span>
              <select
                value={selectedPresetId}
                onChange={(e) => setSelectedPresetId(e.target.value)}
                className="h-7 px-2 rounded-md border border-border-light bg-bg-surface text-xs text-text-primary cursor-pointer flex-1 max-w-[300px]"
              >
                {EDITOR_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.labels[uiLocale] ?? preset.labels.en}
                  </option>
                ))}
              </select>
            </div>
            <div
              ref={editableRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(event) => {
                // Don't update state - let the DOM manage itself
                // This prevents React from re-rendering and resetting cursor position
                const target = event.target as HTMLElement;
                const selection = window.getSelection();
                const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
                
                if (!range) {
                  pushLog('input', {
                    textContent: target.textContent,
                  }, event);
                  return;
                }
                
                const startContainer = range.startContainer;
                const endContainer = range.endContainer;
                const startOffset = range.startOffset;
                const endOffset = range.endOffset;
                
                // Get parent element from startContainer (not from event.target)
                const startParent = startContainer.nodeType === Node.TEXT_NODE 
                  ? startContainer.parentElement 
                  : (startContainer as Element);
                const endParent = endContainer.nodeType === Node.TEXT_NODE 
                  ? endContainer.parentElement 
                  : (endContainer as Element);
                
                // Generate unique tracking IDs for elements
                const startParentTrackingId = startParent ? getElementId(startParent) : '';
                const endParentTrackingId = endParent ? getElementId(endParent) : '';
                
                pushLog('input', {
                  textContent: target.textContent,
                  startOffset,
                  endOffset,
                  parentNodeName: startParent?.nodeName || 'UNKNOWN',
                  parentId: startParent?.id || '', // HTML id attribute (for reference)
                  parentTrackingId: startParentTrackingId, // Unique tracking ID
                  parentClassName: (startParent?.className && typeof startParent.className === 'string') ? startParent.className : '',
                  endParentNodeName: endParent?.nodeName || startParent?.nodeName || 'UNKNOWN',
                  endParentId: endParent?.id || startParent?.id || '', // HTML id attribute (for reference)
                  endParentTrackingId: endParentTrackingId || startParentTrackingId, // Unique tracking ID
                  endParentClassName: (endParent?.className && typeof endParent.className === 'string') ? endParent.className : '',
                  containerNodeName: startContainer.nodeName,
                  endContainerNodeName: endContainer.nodeName,
                  childCount: startParent?.childNodes.length || 0, // For sibling created detection
                }, event);
              }}
              onKeyDown={(event) => {
                pushLog('keydown', {
                  key: event.key,
                  code: event.code,
                  keyCode: (event as KeyboardEvent).keyCode,
                  ctrlKey: event.ctrlKey,
                  altKey: event.altKey,
                  metaKey: event.metaKey,
                  shiftKey: event.shiftKey,
                });
              }}
              onBeforeInput={(event) => {
                const selection = window.getSelection();
                const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
                
                if (!range) {
                  pushLog('beforeinput', {
                    inputType: event.inputType,
                    data: event.data,
                  }, event);
                  return;
                }
                
                const startContainer = range.startContainer;
                const endContainer = range.endContainer;
                const startOffset = range.startOffset;
                const endOffset = range.endOffset;
                
                // Get parent element from startContainer (not from event.target)
                const startParent = startContainer.nodeType === Node.TEXT_NODE 
                  ? startContainer.parentElement 
                  : (startContainer as Element);
                const endParent = endContainer.nodeType === Node.TEXT_NODE 
                  ? endContainer.parentElement 
                  : (endContainer as Element);
                
                // Generate unique tracking IDs for elements
                const startParentTrackingId = startParent ? getElementId(startParent) : '';
                const endParentTrackingId = endParent ? getElementId(endParent) : '';
                
                pushLog('beforeinput', {
                  inputType: event.inputType,
                  data: event.data,
                  startOffset,
                  endOffset,
                  parentNodeName: startParent?.nodeName || 'UNKNOWN',
                  parentId: startParent?.id || '', // HTML id attribute (for reference)
                  parentTrackingId: startParentTrackingId, // Unique tracking ID
                  parentClassName: (startParent?.className && typeof startParent.className === 'string') ? startParent.className : '',
                  endParentNodeName: endParent?.nodeName || startParent?.nodeName || 'UNKNOWN',
                  endParentId: endParent?.id || startParent?.id || '', // HTML id attribute (for reference)
                  endParentTrackingId: endParentTrackingId || startParentTrackingId, // Unique tracking ID
                  endParentClassName: (endParent?.className && typeof endParent.className === 'string') ? endParent.className : '',
                  containerNodeName: startContainer.nodeName,
                  endContainerNodeName: endContainer.nodeName,
                  childCount: startParent?.childNodes.length || 0, // For sibling created detection
                }, event);
              }}
              onCompositionStart={(event) => {
                const selection = window.getSelection();
                const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
                
                if (range) {
                  const startContainer = range.startContainer;
                  const startParent = startContainer.nodeType === Node.TEXT_NODE 
                    ? startContainer.parentElement 
                    : (startContainer as Element);
                  const startParentTrackingId = startParent ? getElementId(startParent) : '';
                  
                  pushLog('compositionstart', {
                    data: event.data,
                    startOffset: range.startOffset,
                    parentNodeName: startParent?.nodeName || 'UNKNOWN',
                    parentId: startParent?.id || '',
                    parentTrackingId: startParentTrackingId,
                    containerNodeName: startContainer.nodeName,
                    childCount: startParent?.childNodes.length || 0,
                  });
                } else {
                  pushLog('compositionstart', {
                    data: event.data,
                  });
                }
              }}
              onCompositionUpdate={(event) => {
                const selection = window.getSelection();
                const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
                
                if (range) {
                  const startContainer = range.startContainer;
                  const startParent = startContainer.nodeType === Node.TEXT_NODE 
                    ? startContainer.parentElement 
                    : (startContainer as Element);
                  const startParentTrackingId = startParent ? getElementId(startParent) : '';
                  
                  pushLog('compositionupdate', {
                    data: event.data,
                    startOffset: range.startOffset,
                    parentNodeName: startParent?.nodeName || 'UNKNOWN',
                    parentId: startParent?.id || '',
                    parentTrackingId: startParentTrackingId,
                    containerNodeName: startContainer.nodeName,
                    childCount: startParent?.childNodes.length || 0,
                  });
                } else {
                  pushLog('compositionupdate', {
                    data: event.data,
                  });
                }
              }}
              onCompositionEnd={(event) => {
                const selection = window.getSelection();
                const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
                
                if (range) {
                  const startContainer = range.startContainer;
                  const startParent = startContainer.nodeType === Node.TEXT_NODE 
                    ? startContainer.parentElement 
                    : (startContainer as Element);
                  const startParentTrackingId = startParent ? getElementId(startParent) : '';
                  
                  pushLog('compositionend', {
                    data: event.data,
                    startOffset: range.startOffset,
                    parentNodeName: startParent?.nodeName || 'UNKNOWN',
                    parentId: startParent?.id || '',
                    parentTrackingId: startParentTrackingId,
                    containerNodeName: startContainer.nodeName,
                    childCount: startParent?.childNodes.length || 0,
                  });
                } else {
                  pushLog('compositionend', {
                    data: event.data,
                  });
                }
              }}
              className="min-h-[140px] border border-border-medium rounded-lg p-2.5 text-sm leading-normal outline-none overflow-y-auto"
            />
          </div>
        </div>
      </div>

      <section
        aria-label="Event log"
        className="border border-border-light rounded-xl p-3 bg-bg-muted flex flex-col gap-1.5 h-full"
      >
        <header className="flex justify-between items-center">
          <div>
            <div className="text-[0.95rem] font-semibold">Event log</div>
            <div className="text-sm text-text-secondary">
              Use this log together with the case description when filing or updating an issue.
            </div>
          </div>
          <div className="text-xs text-text-muted">
            {logs.length} event{logs.length === 1 ? '' : 's'}
            {anomalies.length > 0 && (
              <span className="ml-2 text-red-600 dark:text-red-400">
                · {anomalies.length} anomaly{anomalies.length === 1 ? '' : 'ies'}
              </span>
            )}
          </div>
        </header>
        
        {anomalies.length > 0 && (
          <div className="border border-red-300 dark:border-red-700 rounded-lg p-2 bg-red-50 dark:bg-red-900/20">
            <div className="text-xs font-semibold text-red-800 dark:text-red-300 mb-1">Detected Anomalies:</div>
            {anomalies.map((anomaly, idx) => (
              <div key={idx} className="text-xs text-red-700 dark:text-red-400 mb-1 last:mb-0">
                <span className="font-semibold">{anomaly.type}:</span> {anomaly.description} - {anomaly.detail}
              </div>
            ))}
          </div>
        )}

        <div className="flex-1 min-h-[180px] overflow-y-auto border border-border-light rounded-lg bg-bg-surface p-2 font-mono text-[0.78rem]">
          {logs.length === 0 ? (
            <div className="text-text-faint p-1">
              Interact with the editable area to see events here.
            </div>
          ) : (
            logs.map((entry) => {
              // Check if this entry has an anomaly
              const hasAnomaly = anomalies.some(a => {
                if (a.type === 'inputtype-mismatch') {
                  return entry.type === 'input' || entry.type === 'beforeinput';
                }
                if (a.type === 'missing-beforeinput') {
                  return entry.type === 'input';
                }
                if (a.type === 'selection-jump') {
                  return entry.type === 'beforeinput';
                }
                return false;
              });
              
              return (
                <div
                  key={entry.id}
                  className={`
                    p-1 px-1.5 rounded border mb-1
                    ${hasAnomaly 
                      ? 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20' 
                      : 'border-border-light bg-bg-surface'
                    }
                  `}
                >
                  <div className="flex justify-between mb-0.5">
                    <span className={`font-semibold lowercase ${hasAnomaly ? 'text-red-700 dark:text-red-400' : ''}`}>
                      {entry.type}
                      {entry.inputType && (
                        <span className="ml-2 text-text-secondary">({entry.inputType})</span>
                      )}
                    </span>
                    <span className="text-text-faint">{entry.time}</span>
                  </div>
                  <pre className="m-0 whitespace-pre-wrap break-words">
                    {JSON.stringify(entry.data, null, 2)}
                  </pre>
                  {entry.data.targetRanges && Array.isArray(entry.data.targetRanges) && entry.data.targetRanges.length > 0 && (
                    <div className="mt-1 text-xs text-text-secondary">
                      <div className="font-semibold">targetRanges:</div>
                      {entry.data.targetRanges.map((range: any, idx: number) => (
                        <div key={idx} className="ml-2">
                          {range.startContainer}[{range.startOffset}] → {range.endContainer}[{range.endOffset}]
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>
    </section>
  );
}


