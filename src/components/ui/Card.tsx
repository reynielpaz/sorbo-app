import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

type CardVariant = 'default' | 'glass';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
  onClick?: () => void;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-sorbo-dark border border-sorbo-gold/10 hover:border-sorbo-gold/25',
  glass:
    'bg-[var(--sorbo-glass)] backdrop-blur-md border border-[var(--sorbo-glass-border)] hover:border-sorbo-gold/25',
};

export function Card({ children, variant = 'default', className, onClick }: CardProps) {
  const isClickable = Boolean(onClick);

  return (
    <motion.div
      onClick={onClick}
      whileHover={isClickable ? { scale: 1.01 } : {}}
      whileTap={isClickable ? { scale: 0.99 } : {}}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-2xl overflow-hidden transition-colors duration-300',
        variantStyles[variant],
        isClickable && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
