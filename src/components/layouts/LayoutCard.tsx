'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Layout } from '@/lib/types';
import { getLayoutImages, getPrimaryLayoutImage } from '@/lib/layoutImages';

interface LayoutCardProps {
  layout: Layout;
}

export default function LayoutCard({ layout }: LayoutCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const images = getLayoutImages(layout);
  const primaryImage = getPrimaryLayoutImage(layout);
  const total = layout.plotStats?.total ?? layout.totalPlots ?? 0;
  const available = layout.plotStats?.available ?? layout.availablePlots ?? 0;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-video bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" aria-hidden="true" />
        )}
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={layout.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition duration-300 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        )}
        {layout.status === 'inactive' && (
          <span className="absolute left-3 top-3 rounded-full bg-gray-800/80 px-2.5 py-0.5 text-xs font-medium text-white">
            Inactive
          </span>
        )}
        {images.length > 1 && (
          <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-medium text-white">
            +{images.length - 1} photos
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-gray-900">{layout.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{layout.location}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
            {available} / {total} plots available
          </span>
        </div>

        <p className="mt-3 text-sm text-gray-600">
          Starting from{' '}
          <span className="font-semibold text-gray-900">
            {layout.startingPrice != null
              ? `₹${layout.startingPrice.toLocaleString()}`
              : 'Price on request'}
          </span>
        </p>

        <Link
          href={`/layouts/${layout._id}`}
          className="btn-primary mt-4 w-full text-center text-sm"
        >
          View Layout
        </Link>
      </div>
    </article>
  );
}
