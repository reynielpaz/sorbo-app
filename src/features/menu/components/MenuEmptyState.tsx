import { SearchX, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/utils/cn';

interface MenuEmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'default' | 'error';
}

export function MenuEmptyState({
  title,
  description,
  actionLabel,
  onAction,
  tone = 'default',
}: MenuEmptyStateProps) {
  const Icon = tone === 'error' ? TriangleAlert : SearchX;

  return (
    <div className="rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(18,18,22,0.8)_0%,rgba(9,12,19,0.95)_100%)] px-5 py-8 text-center shadow-[0_20px_42px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div
        className={cn(
          'mx-auto flex h-14 w-14 items-center justify-center rounded-full border',
          tone === 'error'
            ? 'border-[rgba(239,68,68,0.18)] bg-[rgba(239,68,68,0.1)] text-[#F27B7B]'
            : 'border-[rgba(212,168,83,0.18)] bg-[rgba(212,168,83,0.08)] text-[#D4A853]'
        )}
      >
        <Icon size={22} />
      </div>

      <h2 className="mt-4 font-playfair text-[28px] font-semibold text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-[28ch] text-sm leading-6 text-white/56">{description}</p>

      {actionLabel && onAction ? (
        <div className="mt-5 flex justify-center">
          <Button
            variant={tone === 'error' ? 'danger' : 'secondary'}
            size="md"
            onClick={onAction}
            className={cn(
              'min-w-[180px] px-5',
              tone === 'default' && 'border-white/8 bg-white/[0.04]'
            )}
          >
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
