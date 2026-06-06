'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Layout } from '@/lib/types';

interface LayoutDetailHeroProps {
  layout: Layout;
  heroImage?: string;
  galleryImages?: string[];
}

export default function LayoutDetailHero({
  layout,
  heroImage,
  galleryImages = [],
}: LayoutDetailHeroProps) {
  const total = layout.plotStats?.total ?? layout.totalPlots ?? 0;
  const available =
    layout.plotStats?.available ??
    layout.availablePlots ??
    0;
  const booked = layout.plotStats?.booked ?? 0;
  const sold = layout.plotStats?.sold ?? 0;
  const hasHeroImage = Boolean(heroImage);

  return (
    <section className="relative overflow-hidden bg-gray-900">
      {hasHeroImage ? (
        <>
          <div className="absolute inset-0">
            <Image
              src={heroImage!}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
              aria-hidden
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />
      )}

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Link
          href="/layouts"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition hover:text-white"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to layouts
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            {layout.status === 'inactive' && (
              <span className="mb-3 inline-block rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold text-white">
                Inactive
              </span>
            )}
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {layout.name}
            </h1>
            <p className="mt-3 flex items-start gap-2 text-base text-white/80 sm:text-lg">
              <svg
                className="mt-1 h-5 w-5 shrink-0 text-primary-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {layout.location}
            </p>
            {layout.description && (
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                {layout.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <StatPill label="Available" value={available} accent="text-emerald-300" />
            <StatPill label="Total plots" value={total} />
            {layout.startingPrice != null && (
              <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-white/60">Starting from</p>
                <p className="mt-0.5 text-lg font-bold text-white">
                  ₹{layout.startingPrice.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {(booked > 0 || sold > 0) && (
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/60">
            {booked > 0 && <span>{booked} booked</span>}
            {sold > 0 && <span>{sold} sold</span>}
          </div>
        )}

        {galleryImages.length > 1 && (
          <div className="mt-8 flex gap-2 overflow-x-auto pb-1">
            {galleryImages.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 border-white/30 ring-offset-2 ring-offset-transparent"
              >
                <Image src={src} alt="" fill sizes="96px" className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StatPill({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-white/60">{label}</p>
      <p className={`mt-0.5 text-2xl font-bold text-white ${accent ?? ''}`}>{value}</p>
    </div>
  );
}
