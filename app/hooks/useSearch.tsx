import { useSearchParams } from '@remix-run/react';
import { useEffect, useRef } from 'react';

import type { Profile, Track } from '@prisma/client';
import { useTypedFetcher } from 'remix-typedjson';
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

import type { loader } from '~/routes/api/search/results';

type SearchResult = Track | Profile;

interface SearchStoreType {
  results: SearchResult[];
  search: string;
  setResults: (results: SearchResult[]) => void;
  setSearch: (search: string) => void;
}

const useSearchStore = create<SearchStoreType>()((set) => ({
  results: [],
  search: '',
  setResults: (results) => set({ results }),
  setSearch: (search) => set({ search }),
}));

export const useSearchInput = () =>
  [
    useSearchStore((state) => state.search, shallow),
    useSearchStore((state) => state.setSearch, shallow),
  ] as const;
export const useSearchResults = () =>
  [
    useSearchStore((state) => state.results, shallow),
    useSearchStore((state) => state.setResults, shallow),
  ] as const;

export const useSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useSearchInput();
  const [results, setResults] = useSearchResults();

  const { data, load } = useTypedFetcher<typeof loader>();

  const timeoutRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    let previousTimeout = timeoutRef.current;
    if (previousTimeout) {
      clearTimeout(previousTimeout);
    }

    if (search.trim().length === 0) {
      return setResults([]);
    }

    previousTimeout = setTimeout(() => {
      load(`/api/search/results?keyword=${search}`);
    }, 500);

    return () => clearTimeout(previousTimeout);
  }, [search]);

  useEffect(() => {
    if (data) {
      setResults([...data.users, ...data.tracks]);
    }
  }, [data]);

  const onClose = () => {
    setSearch('');
    setResults([]);
  };

  return { onClose, results, search, setSearch };
};