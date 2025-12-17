// Auto-add copy buttons to all <pre> elements
export function initCodeCopy() {
  document.querySelectorAll('pre').forEach((pre) => {
    // Skip if already has a copy button
    if (pre.querySelector('.code-copy-btn')) return;
    
    // Create wrapper if not already wrapped
    let wrapper = pre.parentElement;
    if (!wrapper?.classList.contains('code-block-wrapper')) {
      wrapper = document.createElement('div');
      wrapper.className = 'code-block-auto-wrapper';
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
    }
    
    // Create copy button
    const btn = document.createElement('button');
    btn.className = 'code-copy-btn-auto';
    btn.setAttribute('aria-label', 'Copy code');
    btn.innerHTML = `
      <svg class="copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <svg class="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    
    btn.addEventListener('click', async () => {
      const code = pre.textContent || '';
      
      try {
        await navigator.clipboard.writeText(code);
        btn.classList.add('copied');
        btn.querySelector('.copy-icon')?.setAttribute('style', 'display: none;');
        btn.querySelector('.check-icon')?.setAttribute('style', 'display: block;');
        
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.querySelector('.copy-icon')?.setAttribute('style', '');
          btn.querySelector('.check-icon')?.setAttribute('style', 'display: none;');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
    
    wrapper.style.position = 'relative';
    wrapper.appendChild(btn);
  });
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCodeCopy);
  } else {
    initCodeCopy();
  }
}

