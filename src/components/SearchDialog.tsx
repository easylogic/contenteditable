import React, { useState, useEffect, useRef, useMemo } from 'react';

type SearchItem = {
  id: string;
  title: string;
  description: string;
  type: 'case' | 'scenario' | 'doc' | 'tip';
  url: string;
  tags?: string[];
  os?: string;
  browser?: string;
  category?: string;
  difficulty?: string;
};

type SearchDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  items: SearchItem[];
  locale?: string;
};

export function SearchDialog({ isOpen, onClose, items, locale = 'en' }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items.slice(0, 10);
    
    const lowerQuery = query.toLowerCase();
    return items
      .filter((item) => {
        const searchText = `${item.title} ${item.description} ${item.tags?.join(' ') || ''} ${item.os || ''} ${item.browser || ''} ${item.category || ''} ${item.difficulty || ''}`.toLowerCase();
        return searchText.includes(lowerQuery);
      })
      .slice(0, 20);
  }, [query, items]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
        window.location.href = filteredItems[selectedIndex].url;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filteredItems, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  const typeLabels = {
    case: { label: 'Case', color: 'var(--category-ime)' },
    scenario: { label: 'Scenario', color: 'var(--category-formatting)' },
    doc: { label: 'Doc', color: 'var(--category-events)' },
    tip: { label: 'Tip', color: 'var(--accent-primary)' },
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[600px] bg-bg-surface rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden border border-border-light">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-border-light">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases, scenarios, docs, tips..."
            className="flex-1 border-none outline-none text-base bg-transparent text-text-primary"
          />
          <kbd className="px-2 py-1 text-xs bg-bg-muted rounded text-text-muted">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="max-h-[400px] overflow-y-auto p-2"
        >
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-text-muted">
              No results found for "{query}"
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const typeInfo = typeLabels[item.type];
              const isSelected = index === selectedIndex;

              return (
                <a
                  key={item.id}
                  href={item.url}
                  data-index={index}
                  className={`block px-4 py-3 rounded-lg no-underline mb-1 transition-colors ${
                    isSelected ? 'bg-accent-primary-light' : 'bg-transparent'
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[0.7rem] font-semibold px-1.5 py-0.5 rounded uppercase text-white"
                      style={{ backgroundColor: typeInfo.color }}
                    >
                      {typeInfo.label}
                    </span>
                    <span className="text-sm font-medium text-text-primary overflow-hidden text-ellipsis whitespace-nowrap">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.description}
                  </p>
                </a>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border-light text-xs text-text-muted">
          <div className="flex gap-4">
            <span>
              <kbd className="px-1 py-0.5 bg-bg-muted rounded">↑</kbd>
              <kbd className="px-1 py-0.5 bg-bg-muted rounded ml-1">↓</kbd>
              {' '}to navigate
            </span>
            <span>
              <kbd className="px-1 py-0.5 bg-bg-muted rounded">↵</kbd>
              {' '}to select
            </span>
          </div>
          <span>{filteredItems.length} results</span>
        </div>
      </div>
    </div>
  );
}

export function SearchButton({ onClick }: { onClick: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClick]);

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 bg-bg-muted border border-border-light rounded-lg cursor-pointer text-sm text-text-muted transition-all hover:border-border-medium"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <span>Search...</span>
      <kbd className="px-1.5 py-0.5 text-[0.7rem] bg-bg-surface rounded border border-border-light">
        ⌘K
      </kbd>
    </button>
  );
}

