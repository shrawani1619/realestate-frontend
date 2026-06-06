'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LayoutCard from '@/components/layouts/LayoutCard';
import { api } from '@/lib/api';
import { Layout } from '@/lib/types';

export default function FeaturedLayouts() {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLayouts = () => {
    setLoading(true);
    setError('');
    api
      .get<Layout[]>('/layouts')
      .then(setLayouts)
      .catch(() => setError('Could not load layouts. Is the backend running?'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLayouts();
  }, []);

  const featured = layouts.slice(0, 3);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">Featured Layouts</h2>
        <p className="mt-2 text-gray-500">
          Explore our latest property layouts with available plots.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((layout) => (
          <LayoutCard key={layout._id} layout={layout} />
        ))}
      </div>

      {loading && <p className="mt-8 text-center text-gray-400">Loading layouts...</p>}

      {error && (
        <div className="mt-8 text-center">
          <p className="text-red-500">{error}</p>
          <button type="button" onClick={fetchLayouts} className="btn-primary mt-4">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && layouts.length === 0 && (
        <p className="mt-8 text-center text-gray-400">No layouts available yet.</p>
      )}

      {layouts.length > 0 && (
        <div className="mt-10 text-center">
          <Link href="/layouts" className="btn-primary">
            View All Layouts
          </Link>
        </div>
      )}
    </section>
  );
}
