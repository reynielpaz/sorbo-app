import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { authStore } from '@/store/authStore';

interface ProvidersProps {
  children: React.ReactNode;
}

/** Wrapper de providers globales de la app */
export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    void authStore.getState().initialize().catch(() => undefined);
  }, []);

  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
}
