'use client';

import StatCard from '@/components/dashboard/StatCard';
import MonthlyBookingsChart from '@/components/dashboard/MonthlyBookingsChart';
import PlotStatusDonut from '@/components/dashboard/PlotStatusDonut';
import RecentBookingsTable from '@/components/dashboard/RecentBookingsTable';
import RecentUsersList from '@/components/dashboard/RecentUsersList';
import {
  StatCardSkeleton,
  ChartSkeleton,
  TableSkeleton,
  UserListSkeleton,
} from '@/components/dashboard/Skeletons';
import { useAdminStats } from '@/hooks/useAdminStats';
import { DashboardStats } from '@/lib/types';

function getBookingTrend(monthly: DashboardStats['monthlyBookings']) {
  if (monthly.length < 2) return { text: '—', positive: true };
  const last = monthly[monthly.length - 1].count;
  const prev = monthly[monthly.length - 2].count;
  if (prev === 0) return { text: last > 0 ? '+100%' : '0%', positive: true };
  const pct = ((last - prev) / prev) * 100;
  return {
    text: `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%`,
    positive: pct >= 0,
  };
}

function pctOfTotal(part: number, total: number) {
  if (!total) return '0% of total';
  return `${((part / total) * 100).toFixed(0)}% of total`;
}

function newUsersThisMonth(users: DashboardStats['recentUsers']) {
  const now = new Date();
  const count = users.filter((u) => {
    const d = new Date(u.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  return count > 0 ? `+${count} this month` : '—';
}

const UsersIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LayoutsIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const PlotsIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const AvailableIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function DashboardPage() {
  const { data: stats, error, isLoading, mutate } = useAdminStats();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-500">Failed to load dashboard data.</p>
        <button onClick={() => mutate()} className="btn-primary mt-4">
          Retry
        </button>
      </div>
    );
  }

  const bookingTrend = stats ? getBookingTrend(stats.monthlyBookings) : { text: '—', positive: true };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
        <p className="mt-1 text-sm text-gray-500">Property management at a glance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : stats ? (
          <>
            <StatCard
              label="Total Users"
              value={stats.totalUsers}
              icon={<UsersIcon />}
              change={newUsersThisMonth(stats.recentUsers)}
            />
            <StatCard
              label="Total Layouts"
              value={stats.totalLayouts}
              icon={<LayoutsIcon />}
              change="All projects"
              changePositive={false}
            />
            <StatCard
              label="Total Plots"
              value={stats.totalPlots}
              icon={<PlotsIcon />}
              change={bookingTrend.text}
              changePositive={bookingTrend.positive}
            />
            <StatCard
              label="Available Plots"
              value={stats.availablePlots}
              icon={<AvailableIcon />}
              change={pctOfTotal(stats.availablePlots, stats.totalPlots)}
              changePositive={stats.availablePlots > 0}
            />
          </>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : stats ? (
          <>
            <MonthlyBookingsChart data={stats.monthlyBookings} />
            <PlotStatusDonut
              available={stats.availablePlots}
              booked={stats.bookedPlots}
              sold={stats.soldPlots}
            />
          </>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {isLoading ? <TableSkeleton /> : stats ? <RecentBookingsTable bookings={stats.recentBookings} /> : null}
        </div>
        <div>
          {isLoading ? <UserListSkeleton /> : stats ? <RecentUsersList users={stats.recentUsers} /> : null}
        </div>
      </div>
    </div>
  );
}
