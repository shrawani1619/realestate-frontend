'use client';

import { FeaturesCms } from '@/lib/cms';

interface FeaturesSectionProps {
  features: FeaturesCms;
}

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Why Choose Us</h2>
          <p className="mt-2 text-gray-500">Everything you need to find and book the perfect plot.</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.cards.slice(0, 6).map((feature, index) => (
            <div key={`${feature.title}-${index}`} className="card text-center transition hover:shadow-md">
              <div className="text-3xl">{feature.icon || '✨'}</div>
              <h3 className="mt-3 font-semibold text-primary-700">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
