import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'full';

interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children' | 'className' | 'disabled' | 'size'> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-sorbo-gold to-sorbo-amber text-sorbo-black font-bold shadow-[var(--sorbo-shadow-gold)]',
  secondary:
    'bg-sorbo-dark border border-sorbo-gold/20 text-sorbo-cream hover:border-sorbo-gold/40',
  ghost: 'bg-transparent text-sorbo-cream hover:bg-[var(--sorbo-glass-light)]',
  danger: 'bg-sorbo-red/20 text-sorbo-red border border-sorbo-red/20 hover:bg-sorbo-red/30',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm rounded-lg',
  md: 'h-10 px-4 text-base rounded-xl',
  lg: 'h-12 px-6 text-lg rounded-xl',
  full: 'h-14 w-full text-lg rounded-2xl',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
  type = 'button',
  role,
  'aria-busy': ariaBusy,
  ...buttonProps
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      {...buttonProps}
      type={type}
      role={role ?? 'button'}
      disabled={isDisabled}
      aria-busy={loading ? true : ariaBusy}
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer select-none',
        variantStyles[variant],
        sizeStyles[size],
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </motion.button>
  );
}
