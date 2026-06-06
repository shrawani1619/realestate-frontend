'use client';

import Link from 'next/link';
import Image from 'next/image';
import { HeroCms } from '@/lib/cms';

interface HeroProps {
  hero: HeroCms;
}

function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2" aria-hidden="true">
      <div className="flex h-11 w-7 items-start justify-center rounded-full border-2 border-white/30 p-1.5">
        <div className="h-2 w-1 animate-bounce rounded-full bg-white/70" />
      </div>
    </div>
  );
}

export default function Hero({ hero }: HeroProps) {
  const hasImage = Boolean(hero.backgroundImage);

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-4 pb-28 pt-24 text-white sm:px-6 lg:px-8">
      {hasImage ? (
        <>
          <Image
            src={hero.backgroundImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-black/80"
            aria-hidden
          />
        </>
      ) : (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-emerald-950/40 to-emerald-900/60"
          aria-hidden
        />
      )}

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {hero.badge && (
          <span className="inline-block rounded-full bg-[#c8ff00] px-4 py-1.5 text-xs font-semibold text-black sm:text-sm">
            {hero.badge}
          </span>
        )}

        <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
          {hero.title}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg lg:text-xl">
          {hero.subtitle}
        </p>

        <div className="mt-10">
          <Link
            href={hero.ctaLink || '/layouts'}
            className="inline-flex items-center justify-center rounded-full bg-[#c8ff00] px-8 py-3.5 text-sm font-semibold text-black transition hover:bg-[#b8ef00] focus:outline-none focus:ring-2 focus:ring-[#c8ff00] focus:ring-offset-2 focus:ring-offset-black sm:text-base"
          >
            {hero.ctaText || 'View Layouts'}
          </Link>
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
