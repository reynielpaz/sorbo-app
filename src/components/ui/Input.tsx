import { useState } from 'react';
import { cn } from '@/utils/cn';

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  name?: string;
  autoComplete?: string;
}

export function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  className,
  name,
  autoComplete,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = Boolean(value);
  const isFloating = focused || hasValue;

  return (
    <div className={cn('relative', className)}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={isFloating ? placeholder : ''}
        disabled={disabled}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          'w-full h-12 px-4 pt-4 pb-1 text-base rounded-xl bg-sorbo-warm',
          'text-sorbo-cream placeholder:text-sorbo-cream/30',
          'border transition-all duration-200 outline-none',
          error
            ? 'border-sorbo-red/50'
            : focused
              ? 'border-sorbo-gold/40 ring-1 ring-sorbo-gold/20'
              : 'border-sorbo-gold/10 hover:border-sorbo-gold/20',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
      {/* Label flotante */}
      <label
        className={cn(
          'absolute left-4 pointer-events-none transition-all duration-200',
          isFloating
            ? 'top-1.5 text-xs text-sorbo-gold/70'
            : 'top-1/2 -translate-y-1/2 text-base text-sorbo-cream/40'
        )}
      >
        {label}
      </label>
      {/* Mensaje de error */}
      {error && <p className="mt-1 text-xs text-sorbo-red">{error}</p>}
    </div>
  );
}
