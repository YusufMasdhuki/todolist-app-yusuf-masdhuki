'use client';
import { useState, useEffect } from 'react';

import SearchBar from '@/components/container/searchBar/search-bar';

const ClientOnlySearchBar = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <SearchBar />;
};
export default ClientOnlySearchBar;
