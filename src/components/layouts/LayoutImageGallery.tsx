'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LayoutImageGalleryProps {
  images: string[];
  title?: string;
  /** Skip first image when it's already shown in the page hero */
  skipFirst?: boolean;
}

export default function LayoutImageGallery({
  images,
  title = 'Gallery',
  skipFirst = false,
}: LayoutImageGalleryProps) {
  const displayImages = skipFirst ? images.slice(1) : images;
  const [activeIndex, setActiveIndex] = useState(0);

  if (!displayImages.length) return null;

  const activeImage = displayImages[activeIndex] ?? displayImages[0];

  return (
    <section className="card">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">
        {displayImages.length} photo{displayImages.length !== 1 ? 's' : ''}
      </p>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
        <div className="relative flex min-h-[240px] items-center justify-center sm:min-h-[320px] lg:min-h-[400px]">
          <Image
            src={activeImage}
            alt={`${title} ${activeIndex + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-contain p-4"
            priority={activeIndex === 0}
          />
        </div>

        {displayImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto border-t border-gray-200 bg-white p-3">
            {displayImages.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  index === activeIndex
                    ? 'border-primary-600 ring-2 ring-primary-600/30'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
