'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Plot } from '@/lib/types';
import { PLOT_STATUS } from '@/constants/css';

export default function AdminPlotsPage() {
  const { token } = useAuth();
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const query = statusFilter ? `?status=${statusFilter}` : '';
    api
      .get<Plot[]>(`/plots${query}`, token)
      .then(setPlots)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Plots</h2>
          <p className="mt-1 text-sm text-gray-500">All plots across layouts</p>
        </div>
        <Link href="/dashboard/layouts" className="btn-primary text-sm">
          Manage in Layouts
        </Link>
      </div>

      <div className="flex gap-2">
        {['', 'available', 'booked', 'sold'].map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setStatusFilter(s)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              statusFilter === s
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
            }`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <p className="text-sm text-gray-400">Loading plots...</p>
        ) : plots.length === 0 ? (
          <p className="text-sm text-gray-400">No plots found</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b text-xs uppercase text-gray-500">
              <tr>
                <th className="px-3 py-3">Plot #</th>
                <th className="px-3 py-3">Layout</th>
                <th className="px-3 py-3">Size</th>
                <th className="px-3 py-3">Price</th>
                <th className="px-3 py-3">Facing</th>
                <th className="px-3 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {plots.map((p) => (
                <tr key={p._id}>
                  <td className="px-3 py-3 font-medium">{p.plotNumber}</td>
                  <td className="px-3 py-3 text-gray-500">
                    {typeof p.layoutId === 'object' ? p.layoutId?.name : '—'}
                  </td>
                  <td className="px-3 py-3">{p.size}</td>
                  <td className="px-3 py-3">₹{p.price.toLocaleString()}</td>
                  <td className="px-3 py-3">{p.facing || '—'}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PLOT_STATUS[p.status].badge}`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
