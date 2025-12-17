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

type GlobalSearchProps = {
  items: SearchItem[];
  locale?: string;
};

export function GlobalSearch({ items, locale = 'en' }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <SearchButton onClick={() => setIsOpen(true)} />
      <SearchDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        locale={locale}
      />
    </>
  );
}

