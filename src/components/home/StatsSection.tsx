'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { PublicStats } from '@/lib/types';
import { useCountUp, useInView } from '@/hooks/useCountUp';

const STAT_ITEMS = [
  { key: 'totalLayouts' as const, label: 'Active Layouts', suffix: '+' },
  { key: 'totalPlots' as const, label: 'Total Plots', suffix: '+' },
  { key: 'availablePlots' as const, label: 'Plots Available', suffix: '+' },
  { key: 'happyCustomers' as const, label: 'Happy Customers', suffix: '+' },
];

function StatItem({
  label,
  value,
  suffix,
  animate,
}: {
  label: string;
  value: number;
  suffix: string;
  animate: boolean;
}) {
  const count = useCountUp(value, 1600, animate);

  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-white sm:text-4xl">
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-primary-100">{label}</p>
    </div>
  );
}

export default function StatsSection() {
  const { ref, inView } = useInView(0.15);
  const [stats, setStats] = useState<PublicStats>({
    totalLayouts: 0,
    totalPlots: 0,
    availablePlots: 0,
    happyCustomers: 0,
    completedBookings: 0,
  });

  useEffect(() => {
    api
      .get<PublicStats>('/public/stats')
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <section ref={ref} className="bg-primary-800 py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {STAT_ITEMS.map((item) => (
          <StatItem
            key={item.key}
            label={item.label}
            value={stats[item.key]}
            suffix={item.suffix}
            animate={inView}
          />
        ))}
      </div>
    </section>
  );
}
