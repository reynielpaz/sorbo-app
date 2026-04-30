import { Skeleton } from '@/components/ui';

export function MenuProductListSkeleton() {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="min-h-[144px] overflow-hidden rounded-[22px] border border-white/[0.06] bg-white/[0.035] p-2.5"
        >
          <div className="flex gap-2.5">
            <Skeleton className="h-[124px] w-[108px] shrink-0 rounded-[18px] sm:w-[116px]" rounded={false} />

            <div className="min-w-0 flex-1 px-2.5 py-1">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-2.5 w-24" />
                <Skeleton className="h-4 w-14 rounded-full" />
              </div>
              <Skeleton className="mt-3 h-5 w-3/4" />
              <Skeleton className="mt-2 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-4/5" />
              <div className="mt-5 flex items-center justify-between gap-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-8 w-14 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
