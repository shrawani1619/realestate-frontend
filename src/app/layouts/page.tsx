'use client';

import { useMemo, useState } from 'react';
import LayoutCard from '@/components/layouts/LayoutCard';
import LayoutCardSkeleton from '@/components/layouts/LayoutCardSkeleton';
import LayoutsEmptyState from '@/components/layouts/LayoutsEmptyState';
import NearbyPropertiesMap from '@/components/maps/NearbyPropertiesMap';
import { LayoutStatusFilter, useLayouts } from '@/hooks/useLayouts';
import { Layout } from '@/lib/types';

type SortOption = 'newest' | 'price' | 'available';

function filterAndSortLayouts(
  layouts: Layout[],
  search: string,
  statusFilter: LayoutStatusFilter,
  sortBy: SortOption
): Layout[] {
  const query = search.trim().toLowerCase();

  let result = layouts.filter((layout) => {
    if (statusFilter === 'active' && layout.status !== 'active') return false;
    if (!query) return true;
    return (
      layout.name.toLowerCase().includes(query) ||
      layout.location.toLowerCase().includes(query)
    );
  });

  result = [...result].sort((a, b) => {
    if (sortBy === 'price') {
      const priceA = a.startingPrice ?? Number.MAX_SAFE_INTEGER;
      const priceB = b.startingPrice ?? Number.MAX_SAFE_INTEGER;
      return priceA - priceB;
    }
    if (sortBy === 'available') {
      const availA = a.plotStats?.available ?? a.availablePlots ?? 0;
      const availB = b.plotStats?.available ?? b.availablePlots ?? 0;
      return availB - availA;
    }
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  return result;
}

export default function LayoutsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LayoutStatusFilter>('active');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const { data: layouts = [], error, isLoading, mutate } = useLayouts(
    statusFilter === 'active' ? 'active' : 'all'
  );

  const filteredLayouts = useMemo(
    () => filterAndSortLayouts(layouts, search, statusFilter, sortBy),
    [layouts, search, statusFilter, sortBy]
  );

  const hasActiveFilters =
    search.trim().length > 0 || statusFilter !== 'active' || sortBy !== 'newest';

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('active');
    setSortBy('newest');
  };

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-800 to-primary-600 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Browse Available Properties
          </h1>
          <p className="mt-4 text-lg text-primary-100">
            Discover land layouts, compare prices, and find your perfect plot.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <NearbyPropertiesMap layouts={layouts} />

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <label htmlFor="layout-search" className="mb-1 block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              id="layout-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or location..."
              className="input-field w-full max-w-md"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div>
              <label htmlFor="status-filter" className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as LayoutStatusFilter)}
                className="input-field w-auto min-w-[140px]"
              >
                <option value="active">Active only</option>
                <option value="all">All</option>
              </select>
            </div>

            <div>
              <label htmlFor="sort-by" className="mb-1 block text-sm font-medium text-gray-700">
                Sort by
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="input-field w-auto min-w-[180px]"
              >
                <option value="newest">Newest</option>
                <option value="price">Price: low to high</option>
                <option value="available">Most available</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-10 text-center">
            <p className="text-red-500">Failed to load layouts. Make sure the backend is running.</p>
            <button type="button" onClick={() => mutate()} className="btn-primary mt-4">
              Retry
            </button>
          </div>
        )}

        {isLoading && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <LayoutCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && !error && filteredLayouts.length === 0 && (
          <LayoutsEmptyState hasFilters={hasActiveFilters} onClearFilters={clearFilters} />
        )}

        {!isLoading && !error && filteredLayouts.length > 0 && (
          <>
            <p className="mt-6 text-sm text-gray-500">
              Showing {filteredLayouts.length} layout{filteredLayouts.length !== 1 ? 's' : ''}
            </p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLayouts.map((layout) => (
                <LayoutCard key={layout._id} layout={layout} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
