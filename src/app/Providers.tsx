import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import { preloadHomeData } from '@/services/preloader';
import { authStore } from '@/store/authStore';

interface ProvidersProps {
  children: React.ReactNode;
}

/** Wrapper de providers globales de la app */
export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    void authStore.getState().initialize().catch(() => undefined);
    void preloadHomeData().catch(() => undefined);
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ErrorBoundary>
  );
}
