---
id: ce-0242-ime-start-delay-android-ja
scenarioId: scenario-ime-start-delay-android
locale: ja
os: Android
osVersion: "10-14"
device: Mobile (Samsung Galaxy Tab S9)
deviceVersion: Any
browser: Chrome for Android
browserVersion: "120+"
keyboard: Japanese (IME) - Gboard
caseTitle: Androidで全選択後IMEが遅延する (日本語)
description: "Android仮想キーボードでcontenteditable要素内のテキストを全選択(Ctrl+A)した後、最初の文字を入力してもIME変換がすぐに開始されません。最初の文字はプレーンテキストとして挿入され、2文字目からIME変換が始まります。"
tags:
  - ime
  - composition
  - android
  - mobile
  - japanese
status: draft
initialHtml: |
  <div contenteditable="true" style="padding: 20px; border: 1px solid #ccc; min-height: 100px;">
    ここにテキストを入力してください。例えば「こんにちは」と入力してから、全選択(Ctrl+A)して、文字を入力してIMEの挙動を観察してください。
  </div>
domSteps:
  - label: "Before"
    html: '<div contenteditable="true">こんにちは</div>'
    description: "テキストが入力済み"
  - label: "Step 1: 全選択(Ctrl+A)"
    html: '<div contenteditable="true">こんにちは</div>'
    description: "全テキストが選択済み"
  - label: "Step 2: 最初の文字「あ」を入力"
    html: '<div contenteditable="true">こんにちはあ</div>'
    description: "❌ バグ: 「あ」がプレーンテキストとして挿入され、IME候補なし"
  - label: "Step 3: 2文字目「い」を入力"
    html: '<div contenteditable="true">こんにちはあい</div>'
    description: "2文字目「い」からIME変換が開始"
  - label: "✅ Expected"
    html: '<div contenteditable="true">あい</div>'
    description: "期待値: 最初の文字からIME変換が開始されるべき"
---

## 現象

Android仮想キーボードでcontenteditable要素内のテキストを全選択した後、最初の文字を入力してもIME変換がすぐに開始されません。

## 再現手順

1. contenteditable要素にテキストを入力します（例：「こんにちは」）。
2. Ctrl+Aを押して全テキストを選択します。
3. 最初の文字を入力します（例：「あ」）。

## 観察される動作

- **最初の文字プレーンテキスト**: 「あ」がプレーンテキストとして挿入され（IME変換の一部ではない）
- **選択が残る**: 「全選択」の選択範囲がそのまま残っている
- **IME遅延**: 2文字目からIME候補ウィンドウが表示され、変換が開始される
- **結果**: 最初の文字がプレーンテキストとして残り、2文字目からIME変換が開始

## 期待される動作

- 最初の文字を入力した直後にIME変換が開始されるべき
- 選択範囲がIME変換で置換されるべき

## 参考事項及び可能な回避策

- **入力前に選択を解除**: ユーザーが新しい入力を開始する前に既存の選択を解除する
- **最初の文字を個別に処理**: プレーンテキストが挿入されたかを検出し、必要に応じて削除する
- **beforeinputイベントを監視**: `inputType = 'insertText'`を検出してプレーンテキスト挿入を検知する
- **ユーザーへの案内**: 全選択後に新しい入力を開始する際、UIメッセージを表示する

## コード例

```javascript
const editor = document.querySelector('div[contenteditable]');
let imeStarted = false;
let wasSelectAll = false;

// 全選択を検出
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'a') {
    wasSelectAll = true;
  }
});

// 変換開始を追跡
editor.addEventListener('compositionstart', () => {
  imeStarted = true;
  // 選択があれば解除
  const selection = window.getSelection();
  if (selection.rangeCount > 0 && !selection.isCollapsed) {
    selection.removeAllRanges();
  }
});

// プレーンテキストとIMEを区別
editor.addEventListener('beforeinput', (e) => {
  if (e.inputType === 'insertText' && !imeStarted && wasSelectAll) {
    // プレーンテキストがIME開始前に挿入された
    console.warn('Plain text inserted before IME started:', e.data);
  }
});

editor.addEventListener('keydown', (e) => {
  if (wasSelectAll) {
    // 全選択後の最初の文字入力を検出
    console.log('First letter after select all:', e.key);
    // 必要に応じてクリーンアップロジックを追加
  }
});
```
