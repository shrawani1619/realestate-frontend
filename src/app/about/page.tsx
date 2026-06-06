'use client';

import { useCmsSection, mergeCmsData } from '@/hooks/useCmsSection';

export default function AboutPage() {
  const { data } = useCmsSection('about');
  const about = mergeCmsData('about', data);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="text-3xl font-bold">{about.title}</h1>
          <div className="mt-8 text-gray-600">
            <p className="leading-relaxed">{about.description}</p>
          </div>
        </div>
        {about.image ? (
          <img
            src={about.image}
            alt={about.title}
            className="w-full rounded-xl border border-gray-200 object-cover shadow-sm"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-400">
            About image not set
          </div>
        )}
      </div>
    </div>
  );
}
