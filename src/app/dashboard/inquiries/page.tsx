'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useConfirm } from '@/context/ConfirmContext';
import { api } from '@/lib/api';
import { Inquiry } from '@/lib/types';
import { notify } from '@/lib/notify';
import { INQUIRY_STATUSES, InquiryStatus } from '@/constants/inquiry';
import InquiryStatusBadge from '@/components/inquiries/InquiryStatusBadge';

export default function AdminInquiriesPage() {
  const { token } = useAuth();
  const confirm = useConfirm();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchInquiries = () => {
    if (!token) return;
    setLoading(true);
    const query = statusFilter ? `?status=${statusFilter}` : '';
    api
      .get<Inquiry[]>(`/inquiries${query}`, token)
      .then(setInquiries)
      .catch(() => notify.error('Failed to load inquiries'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInquiries();
  }, [token, statusFilter]);

  const counts = useMemo(
    () => ({
      new: inquiries.filter((i) => i.status === 'new').length,
    }),
    [inquiries]
  );

  const updateStatus = async (id: string, status: InquiryStatus, silent = false) => {
    if (!token) return;
    setActionLoading(true);
    try {
      const updated = await api.patch<Inquiry>(`/inquiries/${id}/status`, { status }, token);
      setInquiries((prev) => prev.map((i) => (i._id === id ? updated : i)));
      setSelected((prev) => (prev?._id === id ? updated : prev));
      if (!silent) notify.success(`Marked as ${status}`);
    } catch (err: unknown) {
      const error = err as { message?: string };
      notify.error(error.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const remove = async (id: string) => {
    if (!token) return;
    const confirmed = await confirm({
      title: 'Delete inquiry',
      message: 'Delete this inquiry?',
      confirmLabel: 'Delete',
      variant: 'danger',
    });
    if (!confirmed) return;
    try {
      await api.delete(`/inquiries/${id}`, token);
      setInquiries((prev) => prev.filter((i) => i._id !== id));
      setSelected(null);
      notify.success('Inquiry deleted');
    } catch (err: unknown) {
      const error = err as { message?: string };
      notify.error(error.message || 'Failed to delete');
    }
  };

  const openInquiry = (inquiry: Inquiry) => {
    setSelected(inquiry);
    if (inquiry.status === 'new') {
      updateStatus(inquiry._id, 'read', true);
    }
  };

  const replyMailto = (inquiry: Inquiry) => {
    const subject = encodeURIComponent(`Re: ${inquiry.subject}`);
    const body = encodeURIComponent(
      `Hi ${inquiry.name},\n\nThank you for your inquiry regarding "${inquiry.subject}".\n\n`
    );
    window.location.href = `mailto:${inquiry.email}?subject=${subject}&body=${body}`;
    if (inquiry.status !== 'replied') {
      updateStatus(inquiry._id, 'replied');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Inquiries</h2>
          <p className="mt-1 text-sm text-gray-500">
            Messages from the contact form
            {!statusFilter && counts.new > 0 && (
              <span className="ml-2 font-medium text-blue-600">{counts.new} new</span>
            )}
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-auto min-w-[140px]"
        >
          <option value="">All statuses</option>
          {INQUIRY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <p className="text-sm text-gray-400">Loading inquiries...</p>
        ) : inquiries.length === 0 ? (
          <p className="text-sm text-gray-400">No inquiries found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inquiries.map((inq) => (
                <tr
                  key={inq._id}
                  onClick={() => openInquiry(inq)}
                  className={`cursor-pointer transition hover:bg-gray-50 ${
                    inq.status === 'new' ? 'bg-blue-50/40' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{inq.name}</p>
                    <p className="text-xs text-gray-500">{inq.email}</p>
                  </td>
                  <td className="px-4 py-3">{inq.subject}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <InquiryStatusBadge status={inq.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">{selected.name}</h3>
                <p className="text-sm text-gray-500">{selected.email}</p>
                {selected.phone && <p className="text-sm text-gray-500">{selected.phone}</p>}
              </div>
              <InquiryStatusBadge status={selected.status} />
            </div>

            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-gray-500">Subject</dt>
                <dd className="font-medium">{selected.subject}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Received</dt>
                <dd>{new Date(selected.createdAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Message</dt>
                <dd className="mt-1 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-gray-700">
                  {selected.message}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => replyMailto(selected)}
                disabled={actionLoading}
                className="btn-primary text-sm"
              >
                Reply by Email
              </button>
              {selected.status !== 'read' && (
                <button
                  type="button"
                  onClick={() => updateStatus(selected._id, 'read')}
                  disabled={actionLoading}
                  className="btn-secondary text-sm"
                >
                  Mark Read
                </button>
              )}
              {selected.status !== 'replied' && (
                <button
                  type="button"
                  onClick={() => updateStatus(selected._id, 'replied')}
                  disabled={actionLoading}
                  className="btn-secondary text-sm"
                >
                  Mark Replied
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(selected._id)}
                className="btn-danger text-sm"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="btn-secondary ml-auto text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
