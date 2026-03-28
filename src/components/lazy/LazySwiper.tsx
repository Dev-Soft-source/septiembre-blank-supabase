
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load Swiper components
const Swiper = React.lazy(() => 
  import("swiper/react").then(module => ({ default: module.Swiper }))
);

const SwiperSlide = React.lazy(() => 
  import("swiper/react").then(module => ({ default: module.SwiperSlide }))
);

const SwiperLoadingFallback = ({ slidesCount = 3 }: { slidesCount?: number }) => (
  <div className="flex gap-4 overflow-hidden">
    {Array.from({ length: slidesCount }).map((_, index) => (
      <div key={index} className="flex-shrink-0 w-64">
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="mt-2 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

interface LazySwiperProps {
  children: React.ReactNode;
  className?: string;
  slidesCount?: number;
  [key: string]: any;
}

export function LazySwiper({ children, className, slidesCount, ...props }: LazySwiperProps) {
  return (
    <Suspense fallback={<SwiperLoadingFallback slidesCount={slidesCount} />}>
      <Swiper className={className} {...props}>
        {children}
      </Swiper>
    </Suspense>
  );
}

export function LazySwiperSlide(props: any) {
  return (
    <Suspense fallback={<Skeleton className="h-48 w-full rounded-lg" />}>
      <SwiperSlide {...props} />
    </Suspense>
  );
}

// Dynamic import hook for Swiper modules
export const useSwiperModules = () => {
  const importModules = async () => {
    const [
      { Navigation },
      { Pagination },
      { Autoplay },
      { EffectFade }
    ] = await Promise.all([
      import("swiper/modules"),
      import("swiper/modules"),
      import("swiper/modules"),
      import("swiper/modules")
    ]);

    return { Navigation, Pagination, Autoplay, EffectFade };
  };

  return { importModules };
};
