import React from "react";

export default function Loading() {
  return (
    <div className="w-full min-h-[70vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-4 max-w-2xl mx-auto text-center flex flex-col items-center">
        {/* Pill Badge */}
        <div className="h-7 w-40 rounded-full skeleton-shimmer border-2 border-cc-navy/15" />
        
        {/* Title */}
        <div className="h-10 sm:h-12 w-3/4 rounded-2xl skeleton-shimmer border-2 border-cc-navy/15" />
        
        {/* Subtitle */}
        <div className="h-4 w-5/6 rounded-lg skeleton-shimmer" />
        <div className="h-4 w-2/3 rounded-lg skeleton-shimmer" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-3xl border-3 border-cc-navy/20 bg-white/70 p-6 space-y-4 shadow-solid-sm"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl skeleton-shimmer border-2 border-cc-navy/20" />
              <div className="w-20 h-6 rounded-full skeleton-shimmer" />
            </div>

            {/* Title & info */}
            <div className="space-y-2 pt-2">
              <div className="h-6 w-3/4 rounded-xl skeleton-shimmer" />
              <div className="h-3 w-1/2 rounded-md skeleton-shimmer" />
            </div>

            {/* Paragraph lines */}
            <div className="space-y-1.5 pt-2">
              <div className="h-3 w-full rounded skeleton-shimmer" />
              <div className="h-3 w-4/5 rounded skeleton-shimmer" />
            </div>

            {/* Tags */}
            <div className="flex gap-2 pt-2">
              <div className="h-5 w-16 rounded-md skeleton-shimmer" />
              <div className="h-5 w-14 rounded-md skeleton-shimmer" />
              <div className="h-5 w-12 rounded-md skeleton-shimmer" />
            </div>

            {/* Action buttons */}
            <div className="pt-4 space-y-2 border-t-2 border-cc-navy/10">
              <div className="h-10 w-full rounded-xl skeleton-shimmer" />
              <div className="h-10 w-full rounded-xl skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
