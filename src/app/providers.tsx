'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { store } from '@/store';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ReduxProvider>
  );
}
