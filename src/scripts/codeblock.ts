interface CodeBlockWrapperElements {
  wrapper: HTMLDivElement;
  header: HTMLDivElement;
  button: HTMLButtonElement;
}

interface CodeBlockState {
  isWrapped: boolean;
}

/**
 * コードブロック用のラッパー要素を作成する
 */
function createCodeBlockWrapper(): CodeBlockWrapperElements {
  const wrapper = document.createElement('div');
  wrapper.className = 'code-block-container';

  const header = document.createElement('div');
  header.className = 'code-block-header';

  const button = document.createElement('button');
  button.className = 'wrap-toggle-button';
  button.textContent = '折り返し';
  button.type = 'button';

  return { wrapper, header, button };
}

/**
 * preエレメントのスタイルを更新する
 */
function updatePreStyles(pre: HTMLPreElement, isWrapped: boolean): void {
  pre.style.whiteSpace = isWrapped ? 'pre-wrap' : 'pre';
  pre.style.overflowX = isWrapped ? 'visible' : 'auto';
  pre.style.wordBreak = isWrapped ? 'break-all' : 'normal';
}

/**
 * ボタンのテキストを更新する
 */
function updateButtonText(button: HTMLButtonElement, isWrapped: boolean): void {
  button.textContent = isWrapped ? '折り返し解除' : '折り返し';
}

/**
 * 単一のコードブロックに折り返し切り替え機能を追加する
 */
function enhanceCodeBlock(pre: HTMLPreElement): void {
  const parentElement = pre.parentNode;
  if (!parentElement) {
    console.warn('Code block has no parent element, skipping enhancement');
    return;
  }

  const { wrapper, header, button } = createCodeBlockWrapper();
  const state: CodeBlockState = { isWrapped: false };

  // イベントリスナーを追加
  button.addEventListener('click', () => {
    state.isWrapped = !state.isWrapped;
    updatePreStyles(pre, state.isWrapped);
    updateButtonText(button, state.isWrapped);
  });

  // DOM構造を構築
  header.appendChild(button);
  parentElement.insertBefore(wrapper, pre);
  wrapper.appendChild(header);
  wrapper.appendChild(pre);
}

/**
 * ページ内のすべてのコードブロックに折り返し切り替え機能を追加する
 */
function initializeCodeBlockEnhancements(): void {
  const codeBlocks = document.querySelectorAll<HTMLPreElement>('pre');

  if (codeBlocks.length === 0) {
    return;
  }

  codeBlocks.forEach(enhanceCodeBlock);
}

// DOM読み込み完了時に初期化
document.addEventListener('DOMContentLoaded', initializeCodeBlockEnhancements);
