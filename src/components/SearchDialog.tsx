import React, { useState, useEffect, useRef, useMemo } from 'react';

type SearchItem = {
  id: string;
  title: string;
  description: string;
  type: 'case' | 'scenario' | 'doc';
  url: string;
  tags?: string[];
  os?: string;
  browser?: string;
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
        const searchText = `${item.title} ${item.description} ${item.tags?.join(' ') || ''} ${item.os || ''} ${item.browser || ''}`.toLowerCase();
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
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          background: 'var(--bg-surface)',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid var(--border-light)',
        }}
      >
        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            borderBottom: '1px solid var(--border-light)',
          }}
        >
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
            placeholder="Search cases, scenarios, docs..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              background: 'transparent',
              color: 'var(--text-primary)',
            }}
          />
          <kbd
            style={{
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              background: 'var(--bg-muted)',
              borderRadius: '4px',
              color: 'var(--text-muted)',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '0.5rem',
          }}
        >
          {filteredItems.length === 0 ? (
            <div
              style={{
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}
            >
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
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    background: isSelected ? 'var(--accent-primary-light)' : 'transparent',
                    marginBottom: '0.25rem',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.25rem',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        background: typeInfo.color,
                        color: 'white',
                        textTransform: 'uppercase',
                      }}
                    >
                      {typeInfo.label}
                    </span>
                    <span
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.description}
                  </p>
                </a>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            borderTop: '1px solid var(--border-light)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>
              <kbd style={{ padding: '0.15rem 0.3rem', background: 'var(--bg-muted)', borderRadius: '3px' }}>↑</kbd>
              <kbd style={{ padding: '0.15rem 0.3rem', background: 'var(--bg-muted)', borderRadius: '3px', marginLeft: '0.25rem' }}>↓</kbd>
              {' '}to navigate
            </span>
            <span>
              <kbd style={{ padding: '0.15rem 0.3rem', background: 'var(--bg-muted)', borderRadius: '3px' }}>↵</kbd>
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
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.75rem',
        background: 'var(--bg-muted)',
        border: '1px solid var(--border-light)',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        transition: 'all 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-medium)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-light)';
      }}
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
      <kbd
        style={{
          padding: '0.15rem 0.4rem',
          fontSize: '0.7rem',
          background: 'var(--bg-surface)',
          borderRadius: '4px',
          border: '1px solid var(--border-light)',
        }}
      >
        ⌘K
      </kbd>
    </button>
  );
}

