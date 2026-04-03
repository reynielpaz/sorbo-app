import { Skeleton } from '@/components/ui';

export function MenuProductListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(20,20,22,0.82)_0%,rgba(11,15,26,0.94)_100%)] p-3.5"
        >
          <div className="flex gap-3.5">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-3 h-7 w-3/4" />
              <Skeleton className="mt-3 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-5/6" />
              <Skeleton className="mt-5 h-6 w-20 rounded-full" />
              <Skeleton className="mt-3 h-5 w-24" />
            </div>

            <Skeleton className="h-[118px] w-[110px] rounded-[22px]" rounded={false} />
          </div>
        </div>
      ))}
    </div>
  );
}
