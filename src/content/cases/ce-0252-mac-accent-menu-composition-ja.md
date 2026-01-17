---
id: ce-0252-mac-accent-menu-composition-ja
scenarioId: scenario-mac-accent-menu-composition
locale: ja
os: macOS
osVersion: "13+"
device: Desktop (Mac)
deviceVersion: Any
browser: Safari
browserVersion: "17+"
keyboard: Japanese (IME) - macOS Japanese Input
caseTitle: macOSでアクセントメニュー使用時のコンポジションイベント不一致（日本語）
description: "macOSでアクセントメニュー（母音キー長押しやoptionキー組み合わせ）を使用して特殊文字（é, ü, öなど）を入力する際、標準的なIMEコンポジションイベント（compositionstart, compositionupdate, compositionend）が一貫して発生しません。アクセントメニュー入力とIME入力をプログラム的に区別するのが困難です。"
tags:
  - composition
  - ime
  - macos
  - accent-menu
  - keyboard
  - japanese
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    ここにテキストを入力してください。アクセントメニュー（母音キー長押しやoptionキー）を使用して特殊文字（é, ü, öなど）を入力して、コンポジションイベントが発火するか観察してください。
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true"></div>'
    description: "空のエディター"
  - label: "Step 1: アクセントメニューで'é'を入力"
    html: '<div contenteditable="true">é</div>'
    description: "アクセントメニューで'é'入力（コンポジションイベントが発生しない場合あり）"
  - label: "Step 2: 続けて入力"
    html: '<div contenteditable="true">éこんにちは</div>'
    description: "通常キーボードで入力を継続"
  - label: "Observation"
    html: '<div contenteditable="true">éこんにちは</div>'
    description: "compositionstartイベントが発生しない、動作が不一致"
  - label: "✅ Expected"
    html: '<div contenteditable="true">こんにちは</div>'
    description: "期待値：IME使用時はコンポジションイベントが発火すべき"
---

## 現象

macOSでアクセントメニューを使用して特殊文字や記号を入力する際、標準的なIMEコンポジションイベントが一貫して発生しません。

## 再現手順

1. contenteditable要素にフォーカスします。
2. アクセントメニュー（母音キー長押しやoptionキー組み合わせ）を使用して特殊文字（例：é）を入力します。
3. 通常キーボードで入力を継続します。

## 観察される動作

- **compositionstart不在**: アクセントメニュー使用時に`compositionstart`イベントが発生しない場合あり
- **compositionupdate不一致**: `compositionupdate`が発生しないか、予期外のタイミングで発生
- **compositionend不在または遅延**: `compositionend`が発生しないか、予期外に遅延
- **区別が困難**: アクセントメニュー入力かIME入力かをプログラム的に区別するのが困難

## 期待される動作

- アクセントメニュー使用時もコンポジションイベントが一貫して発生すべき
- 通常キーボード入力と区別可能すべき

## 参考事項及び可能な回避策

- **beforeinputのinputTypeを使用**: `inputType = 'insertCompositionText'`をチェックしてIME入力を検出
- **キーボード状態追跡**: keydown/keyupイベントをフォールバックとして監視
- **代替の状態管理**: 追加の状態フラグを使用
- **macOS固有の理解**: アクセントメニューがシステムレベルで動作することを理解

## コード例

```javascript
const editor = document.querySelector('div[contenteditable]');
let isComposing = false;
let lastInputType = '';
let keyDownCount = 0;
let keyUpCount = 0;

editor.addEventListener('beforeinput', (e) => {
  lastInputType = e.inputType || '';
  if (e.inputType === 'insertCompositionText') {
    // IMEコンポジション
    isComposing = true;
  } else if (e.inputType === 'insertText') {
    // 通常キーボード入力
    if (isComposing && lastInputType !== 'insertCompositionText') {
      // compositionstartなしでinsertTextが来た = アクセントメニューの可能性
      console.warn('Potential accent menu usage without composition events');
    }
  }
});

editor.addEventListener('compositionstart', () => {
  isComposing = true;
  console.log('Composition started');
});

editor.addEventListener('compositionupdate', (e) => {
  console.log('Composition update:', e.data);
});

editor.addEventListener('compositionend', () => {
  isComposing = false;
  console.log('Composition ended');
});

// アクセントメニュー検出（代替案）
editor.addEventListener('keydown', (e) => {
  keyDownCount++;
  
  const isAccentMenu = e.altKey || isVowelKey(e.key) || isLongKeyPress();
  
  if (isAccentMenu) {
    console.log('Potential accent menu usage detected');
  }
});

editor.addEventListener('keyup', (e) => {
  keyUpCount++;
});

function isVowelKey(key) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  return vowels.includes(key.toLowerCase());
}

function isLongKeyPress() {
  return keyDownCount > keyUpCount + 1;
}
```
