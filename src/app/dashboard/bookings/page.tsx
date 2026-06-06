'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Booking, Layout } from '@/lib/types';
import StatusBadge from '@/components/bookings/StatusBadge';
import { notify } from '@/lib/notify';

export default function AdminBookingsPage() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [layoutFilter, setLayoutFilter] = useState('');
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [bulkRejectOpen, setBulkRejectOpen] = useState(false);
  const [bulkRejectNote, setBulkRejectNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = () => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (layoutFilter) params.set('layoutId', layoutFilter);
    const query = params.toString() ? `?${params.toString()}` : '';

    api
      .get<Booking[]>(`/bookings${query}`, token)
      .then((data) => {
        setBookings(data);
        setSelected(new Set());
      })
      .catch(() => notify.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) {
      api.get<Layout[]>('/layouts/admin/all', token).then(setLayouts).catch(() => {});
    }
  }, [token]);

  useEffect(() => {
    fetchBookings();
  }, [token, statusFilter, layoutFilter]);

  const pendingBookings = bookings.filter((b) => b.status === 'pending');
  const pendingIds = pendingBookings.map((b) => b._id);
  const allPendingSelected =
    pendingIds.length > 0 && pendingIds.every((id) => selected.has(id));

  const toggleAll = () => {
    if (allPendingSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(pendingIds));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApprove = async (id: string) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await api.patch(`/bookings/${id}/approve`, {}, token);
      notify.success('Booking approved');
      fetchBookings();
    } catch (err: unknown) {
      const error = err as { message?: string };
      notify.error(error.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!token || !rejectId || !rejectNote.trim()) {
      notify.error('Please provide a rejection reason');
      return;
    }
    setActionLoading(true);
    try {
      await api.patch(`/bookings/${rejectId}/reject`, { adminNote: rejectNote }, token);
      notify.success('Booking rejected');
      setRejectId(null);
      setRejectNote('');
      fetchBookings();
    } catch (err: unknown) {
      const error = err as { message?: string };
      notify.error(error.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulk = async (action: 'approve' | 'reject', note?: string) => {
    if (!token || selected.size === 0) return;
    if (action === 'reject' && !note?.trim()) {
      notify.error('Please provide a rejection reason');
      return;
    }

    setActionLoading(true);
    try {
      const result = await api.patch<{ processed: string[]; failed: { id: string; reason: string }[] }>(
        '/bookings/bulk-status',
        { ids: Array.from(selected), action, adminNote: note },
        token
      );
      const count = result.processed?.length ?? 0;
      const failCount = result.failed?.length ?? 0;
      if (count > 0) notify.success(`Processed ${count} booking(s)`);
      if (failCount > 0) notify.error(`${failCount} booking(s) could not be processed`);
      setBulkRejectOpen(false);
      setBulkRejectNote('');
      fetchBookings();
    } catch (err: unknown) {
      const error = err as { message?: string };
      notify.error(error.message || 'Bulk action failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bookings</h2>
        <p className="mt-1 text-sm text-gray-500">Review and manage plot booking requests</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-auto min-w-[140px]"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={layoutFilter}
          onChange={(e) => setLayoutFilter(e.target.value)}
          className="input-field w-auto min-w-[180px]"
        >
          <option value="">All layouts</option>
          {layouts.map((l) => (
            <option key={l._id} value={l._id}>
              {l.name}
            </option>
          ))}
        </select>

        {selected.size > 0 && (
          <div className="ml-auto flex gap-2">
            <span className="self-center text-sm text-gray-500">{selected.size} selected</span>
            <button
              type="button"
              onClick={() => handleBulk('approve')}
              disabled={actionLoading}
              className="btn-primary text-xs"
            >
              Bulk Approve
            </button>
            <button
              type="button"
              onClick={() => setBulkRejectOpen(true)}
              disabled={actionLoading}
              className="btn-danger text-xs"
            >
              Bulk Reject
            </button>
          </div>
        )}
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <p className="text-sm text-gray-400">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-gray-400">No bookings found</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b text-xs uppercase text-gray-500">
              <tr>
                <th className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={allPendingSelected}
                    onChange={toggleAll}
                    disabled={pendingIds.length === 0}
                    aria-label="Select all pending"
                  />
                </th>
                <th className="px-3 py-3">User</th>
                <th className="px-3 py-3">Plot</th>
                <th className="px-3 py-3">Layout</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td className="px-3 py-3">
                    {b.status === 'pending' && (
                      <input
                        type="checkbox"
                        checked={selected.has(b._id)}
                        onChange={() => toggleOne(b._id)}
                        aria-label={`Select booking ${b._id}`}
                      />
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium">{b.fullName}</p>
                    <p className="text-xs text-gray-500">{b.email}</p>
                  </td>
                  <td className="px-3 py-3">{b.plot?.plotNumber}</td>
                  <td className="px-3 py-3 text-gray-500">{b.layout?.name}</td>
                  <td className="px-3 py-3 text-gray-500">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-3 py-3">
                    {b.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(b._id)}
                          disabled={actionLoading}
                          className="btn-primary text-xs"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRejectId(b._id);
                            setRejectNote('');
                          }}
                          disabled={actionLoading}
                          className="btn-danger text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {b.status === 'rejected' && b.adminNote && (
                      <p className="text-xs text-gray-500">Reason: {b.adminNote}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Reject Booking</h3>
            <p className="mt-1 text-sm text-gray-500">Provide a reason for the customer.</p>
            <textarea
              className="input-field mt-4"
              rows={4}
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Rejection reason..."
              required
            />
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setRejectId(null)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={actionLoading}
                className="btn-danger flex-1"
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {bulkRejectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold">Bulk Reject ({selected.size})</h3>
            <p className="mt-1 text-sm text-gray-500">
              This reason will apply to all selected bookings.
            </p>
            <textarea
              className="input-field mt-4"
              rows={4}
              value={bulkRejectNote}
              onChange={(e) => setBulkRejectNote(e.target.value)}
              placeholder="Rejection reason..."
              required
            />
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setBulkRejectOpen(false);
                  setBulkRejectNote('');
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleBulk('reject', bulkRejectNote)}
                disabled={actionLoading}
                className="btn-danger flex-1"
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Bulk Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
