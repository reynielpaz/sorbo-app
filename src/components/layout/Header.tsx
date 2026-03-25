import { cn } from '@/utils/cn';
import { APP_NAME } from '@/utils/constants';

interface HeaderProps {
  title?: string;
  className?: string;
}

export function Header({ title, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-20',
        'bg-sorbo-dark/95 backdrop-blur-lg',
        'border-b border-sorbo-gold/10',
        'pt-[env(safe-area-inset-top)]',
        className
      )}
    >
      <div className="flex items-center justify-between px-4 h-14">
        <span className="font-playfair text-lg font-bold text-sorbo-cream">
          {title ?? APP_NAME}
        </span>
      </div>
    </header>
  );
}
