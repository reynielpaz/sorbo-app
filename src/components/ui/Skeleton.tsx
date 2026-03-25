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
        'skeleton',
        rounded ? 'rounded-full' : 'rounded-xl',
        className
      )}
    />
  );
}

/** Skeleton preconfigurado para tarjeta de producto */
export function ProductCardSkeleton() {
  return (
    <div className="bg-sorbo-dark rounded-2xl overflow-hidden border border-sorbo-gold/10">
      <Skeleton className="w-full aspect-[4/3]" rounded={false} />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-1/3 mt-2" />
      </div>
    </div>
  );
}
