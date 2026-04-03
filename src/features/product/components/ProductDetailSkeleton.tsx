export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="min-h-[420px] rounded-b-[36px] bg-[linear-gradient(180deg,rgba(14,17,24,0.96)_0%,rgba(8,10,15,0.98)_100%)]" />

      <div className="-mt-7 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+132px)]">
        <div className="space-y-4">
          <div className="rounded-[30px] border border-white/[0.06] bg-[rgba(12,15,22,0.92)] px-5 py-6">
            <div className="h-3 w-24 rounded-full bg-white/10" />
            <div className="mt-4 h-10 w-40 rounded-[18px] bg-white/10" />
            <div className="mt-6 h-3 w-16 rounded-full bg-white/10" />
            <div className="mt-3 h-8 w-28 rounded-[16px] bg-white/10" />
            <div className="mt-5 space-y-2">
              <div className="h-3 w-full rounded-full bg-white/10" />
              <div className="h-3 w-10/12 rounded-full bg-white/10" />
              <div className="h-3 w-8/12 rounded-full bg-white/10" />
            </div>
          </div>

          <div className="rounded-[30px] border border-white/[0.06] bg-[rgba(12,15,22,0.88)] px-5 py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="h-3 w-24 rounded-full bg-white/10" />
                <div className="h-4 w-32 rounded-full bg-white/10" />
              </div>
              <div className="h-12 w-32 rounded-full bg-white/10" />
            </div>
          </div>

          <div className="rounded-[30px] border border-white/[0.06] bg-[rgba(12,15,22,0.88)] px-5 py-6">
            <div className="h-3 w-28 rounded-full bg-white/10" />
            <div className="mt-4 flex flex-wrap gap-2.5">
              <div className="h-9 w-24 rounded-full bg-white/10" />
              <div className="h-9 w-28 rounded-full bg-white/10" />
              <div className="h-9 w-20 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
