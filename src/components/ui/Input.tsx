import { useId, useState } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  error?: string;
  rightAdornment?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
}

export function Input({
  label,
  error,
  rightAdornment,
  containerClassName,
  inputClassName,
  labelClassName,
  id,
  className,
  onFocus,
  onBlur,
  value,
  placeholder,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  disabled = false,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const inputAriaDescribedBy =
    [ariaDescribedBy, error ? errorId : undefined].filter(Boolean).join(' ') || undefined;
  const [focused, setFocused] = useState(false);
  const hasValue = typeof value === 'string' ? value.length > 0 : value !== undefined && value !== null;
  const isFloating = focused || hasValue;

  return (
    <div className={cn('relative', containerClassName, className)}>
      <input
        {...props}
        id={inputId}
        value={value}
        disabled={disabled}
        aria-invalid={error ? true : ariaInvalid}
        aria-describedby={inputAriaDescribedBy}
        placeholder={isFloating ? placeholder : ''}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        className={cn(
          'h-12 w-full rounded-xl border bg-sorbo-warm px-4 pb-1 pt-4 text-base text-sorbo-cream',
          'placeholder:text-sorbo-cream/30 outline-none transition-all duration-200',
          rightAdornment && 'pr-14',
          error
            ? 'border-sorbo-red'
            : focused
              ? 'border-sorbo-gold/40 ring-1 ring-sorbo-gold/20'
              : 'border-sorbo-gold/10 hover:border-sorbo-gold/20',
          disabled && 'cursor-not-allowed opacity-50',
          inputClassName
        )}
      />

      <label
        htmlFor={inputId}
        className={cn(
          'pointer-events-none absolute left-4 transition-all duration-200',
          isFloating
            ? 'top-1.5 text-xs text-sorbo-cream/60'
            : 'top-1/2 -translate-y-1/2 text-sm text-sorbo-cream/60',
          labelClassName
        )}
      >
        {label}
      </label>

      {rightAdornment ? (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightAdornment}</div>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="mt-1 text-xs text-sorbo-red">
          {error}
        </p>
      ) : null}
    </div>
  );
}
