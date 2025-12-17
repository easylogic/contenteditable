import React, { useState, useEffect } from 'react';
import { SearchDialog, SearchButton } from './SearchDialog';

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

export function SearchIsland() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<SearchItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load search data on first open
  useEffect(() => {
    if (isOpen && !isLoaded) {
      fetch('/api/search.json')
        .then((res) => res.json())
        .then((data) => {
          setItems(data);
          setIsLoaded(true);
        })
        .catch((err) => {
          console.error('Failed to load search data:', err);
        });
    }
  }, [isOpen, isLoaded]);

  return (
    <>
      <SearchButton onClick={() => setIsOpen(true)} />
      <SearchDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
      />
    </>
  );
}

export default SearchIsland;

