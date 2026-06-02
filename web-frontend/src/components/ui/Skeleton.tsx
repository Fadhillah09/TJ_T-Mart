import React from 'react';
import { cn } from '@/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 p-4 border border-gray-100 rounded-xl">
      <Skeleton className="w-full aspect-square rounded-lg" />
      <Skeleton className="h-4 w-2/3 mt-2" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-1/3 mt-1" />
      <Skeleton className="h-10 w-full mt-2 rounded-md" />
    </div>
  );
};

export const BannerSkeleton = () => {
  return <Skeleton className="w-full h-[160px] md:h-[220px] lg:h-[280px] rounded-xl" />;
};

export const ListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center p-3 border border-gray-100 rounded-lg">
          <Skeleton className="w-16 h-16 rounded-md" />
          <div className="flex flex-col gap-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};
