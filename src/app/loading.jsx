import React from 'react';

export default function Loading() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-base-100 space-y-6">
      
      {/* Skeleton Top Bar (if owner) */}
      <div className="w-full h-16 bg-base-200 rounded-2xl animate-pulse hidden md:block"></div>

      {/* Main Structural Twin Columns Split Grid Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image & Details Skeleton */}
        <div className="lg:col-span-7 space-y-6">
          {/* Image box fallback wrapper */}
          <div className="w-full aspect-[16/10] bg-base-200 rounded-3xl animate-pulse"></div>
          
          {/* Title and Sub-details lines */}
          <div className="space-y-3">
            <div className="h-10 bg-base-200 rounded-xl w-3/4 animate-pulse"></div>
            <div className="flex gap-4">
              <div className="h-6 bg-base-200 rounded-lg w-32 animate-pulse"></div>
              <div className="h-6 bg-base-200 rounded-lg w-24 animate-pulse"></div>
            </div>
          </div>

          {/* Description Paragraph Blocks */}
          <div className="space-y-2 pt-4">
            <div className="h-4 bg-base-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-base-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-base-200 rounded w-5/6 animate-pulse"></div>
          </div>
        </div>

        {/* Right Column: Checkout Widget Skeleton Card */}
        <div className="lg:col-span-5">
          <div className="bg-base-100 border border-base-content/5 rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-base-content/5 pb-4">
              <div className="h-4 bg-base-200 rounded w-24 animate-pulse"></div>
              <div className="h-8 bg-base-200 rounded w-32 animate-pulse"></div>
            </div>
            
            {/* Input fields mock placeholders */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 bg-base-200 rounded w-20 animate-pulse"></div>
                <div className="h-12 bg-base-200 rounded-xl w-full animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-base-200 rounded w-20 animate-pulse"></div>
                <div className="h-12 bg-base-200 rounded-xl w-full animate-pulse"></div>
              </div>
            </div>

            {/* Action button mock placeholder */}
            <div className="h-12 bg-base-200 rounded-xl w-full animate-pulse mt-4"></div>
          </div>
        </div>

      </div>
    </section>
  );
}