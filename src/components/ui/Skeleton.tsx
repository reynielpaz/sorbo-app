import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
  rounded?: boolean;
}

/** Componente skeleton para estados de carga con animación shimmer */
export function Skeleton({ className, rounded = false }: SkeletonProps) {
  return (
    <div
      className={cn(
        'shimmer',
        rounded ? 'rounded-full' : 'rounded-xl',
        className
      )}
    />
  );
}

/** Skeleton preconfigurado para tarjeta de producto */
export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[18px] border border-white/8 bg-white/5">
      <Skeleton className="h-[110px] w-full" rounded={false} />
      <div className="relative space-y-2 px-[11px] pb-[13px] pt-[10px] pr-12">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-2.5 w-full" />
        <Skeleton className="mb-2 h-2.5 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="absolute bottom-[13px] right-[11px] h-[28px] w-[28px] rounded-[9px]" />
      </div>
    </div>
  );
}
