import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { authStore } from '@/store/authStore';
import { APP_NAME } from '@/utils/constants';

interface ProvidersProps {
  children: React.ReactNode;
}

function AuthLoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-sorbo-black">
      <motion.img
        src="/images/brand/logo-sorbo.png"
        alt={APP_NAME}
        className="w-24 object-contain"
        style={{ filter: 'brightness(0) invert(1) sepia(0.2)' }}
        animate={{ opacity: [0.45, 1, 0.45], scale: [0.98, 1.04, 0.98] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/** Wrapper de providers globales de la app */
export function Providers({ children }: ProvidersProps) {
  const { initialized } = useAuth();

  useEffect(() => {
    void authStore.getState().initialize().catch(() => undefined);
  }, []);

  return (
    <BrowserRouter>
      {initialized ? children : <AuthLoadingScreen />}
    </BrowserRouter>
  );
}
