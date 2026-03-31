import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { cn } from '@/utils/cn';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showBottomNav?: boolean;
  cartCount?: number;
  className?: string;
}

/**
 * Shell principal de la app.
 * Envuelve el contenido con Header y BottomNav,
 * añadiendo el padding necesario para el nav inferior.
 * El fondo Dark Luxury viene del App.tsx global.
 */
export function AppShell({
  children,
  title,
  showHeader = true,
  showBottomNav = true,
  cartCount = 0,
  className,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {showHeader && <Header title={title} />}
      <main
        className={cn(
          'flex-1 overflow-y-auto',
          showBottomNav && 'pb-24',
          className
        )}
      >
        {children}
      </main>
      {showBottomNav && <BottomNav cartCount={cartCount} />}
    </div>
  );
}