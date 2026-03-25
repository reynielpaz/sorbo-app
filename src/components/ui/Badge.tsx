import { cn } from '@/utils/cn';

type BadgeVariant = 'nuevo' | 'popular' | 'promo' | 'agotado';

interface BadgeProps {
  variant: BadgeVariant;
  children?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  nuevo: 'bg-sorbo-amber/20 text-sorbo-amber',
  popular: 'bg-sorbo-gold/20 text-sorbo-gold',
  promo: 'bg-sorbo-red/20 text-sorbo-red',
  agotado: 'bg-sorbo-red/10 text-sorbo-red/70',
};

const defaultLabels: Record<BadgeVariant, string> = {
  nuevo: '✨ Nuevo',
  popular: '🔥 Popular',
  promo: 'Promo',
  agotado: 'Agotado',
};

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full',
        variantStyles[variant],
        className
      )}
    >
      {children ?? defaultLabels[variant]}
    </span>
  );
}
