'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useConfirm } from '@/context/ConfirmContext';
import { api } from '@/lib/api';
import { Booking, User, UserDetailResponse, UserListResponse } from '@/lib/types';
import { notify } from '@/lib/notify';
import { USER_STATUS } from '@/constants/css';
import Pagination from '@/components/ui/Pagination';
import StatusBadge from '@/components/bookings/StatusBadge';

function UserAvatar({ name }: { name?: string | null }) {
  const safe = name?.trim();
  const initials = safe
    ? safe
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700">
      {initials || '?'}
    </div>
  );
}

export default function AdminUsersPage() {
  const { token, user: currentUser } = useAuth();
  const confirm = useConfirm();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [selectedUser, setSelectedUser] = useState<UserDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = useCallback(() => {
    if (!token) return;
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (search) params.set('search', search);

    api
      .get<UserListResponse>(`/users?${params.toString()}`, token)
      .then((data) => {
        setUsers(data.users);
        setPagination(data.pagination);
      })
      .catch(() => notify.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, [token, page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const updateRole = async (user: User, role: 'user' | 'admin') => {
    if (!token || user.role === role) return;
    if (
      !(await confirm({
        title: 'Change role',
        message: `Change ${user.name}'s role to "${role}"?`,
        confirmLabel: 'Change role',
      }))
    ) {
      return;
    }

    setActionLoading(user._id);
    try {
      const updated = await api.put<User>(`/users/${user._id}/role`, { role }, token);
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, ...updated, role: updated.role } : u))
      );
      notify.success('Role updated');
    } catch (err: unknown) {
      const error = err as { message?: string };
      notify.error(error.message || 'Failed to update role');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleStatus = async (user: User) => {
    if (!token) return;
    const nextActive = !user.isActive;
    const action = nextActive ? 'activate' : 'deactivate';
    if (
      !(await confirm({
        title: nextActive ? 'Activate user' : 'Deactivate user',
        message: `${action.charAt(0).toUpperCase() + action.slice(1)} ${user.name}?`,
        confirmLabel: action.charAt(0).toUpperCase() + action.slice(1),
        variant: nextActive ? 'default' : 'danger',
      }))
    ) {
      return;
    }

    setActionLoading(user._id);
    try {
      const updated = await api.put<User>(
        `/users/${user._id}/status`,
        { isActive: nextActive },
        token
      );
      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id
            ? { ...u, isActive: updated.isActive, status: updated.isActive ? 'active' : 'inactive' }
            : u
        )
      );
      notify.success(`User ${nextActive ? 'activated' : 'deactivated'}`);
    } catch (err: unknown) {
      const error = err as { message?: string };
      notify.error(error.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const openUserDetail = async (userId: string) => {
    if (!token) return;
    setDetailLoading(true);
    try {
      const detail = await api.get<UserDetailResponse>(`/users/${userId}`, token);
      setSelectedUser(detail);
    } catch {
      notify.error('Failed to load user details');
    } finally {
      setDetailLoading(false);
    }
  };

  const deleteUser = async (user: User) => {
    if (!token) return;
    const confirmed = await confirm({
      title: 'Delete user',
      message: `Delete ${user.name}? This cannot be undone.`,
      confirmLabel: 'Delete',
      variant: 'danger',
    });
    if (!confirmed) return;

    setActionLoading(user._id);
    try {
      await api.delete(`/users/${user._id}`, token);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      setSelectedUser(null);
      notify.success('User deleted');
      fetchUsers();
    } catch (err: unknown) {
      const error = err as { message?: string };
      notify.error(error.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const isSelf = (userId: string) => currentUser?._id === userId;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="mt-1 text-sm text-gray-500">Manage accounts, roles, and access</p>
        </div>
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email..."
          className="input-field w-full max-w-xs"
        />
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <p className="text-sm text-gray-400">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-gray-400">No users found.</p>
        ) : (
          <>
            <table className="w-full text-left text-sm">
              <thead className="border-b text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Bookings</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user._id} className="bg-white">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => openUserDetail(user._id)}
                        className="flex items-center gap-3 text-left hover:opacity-80"
                      >
                        <UserAvatar name={user.name} />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        disabled={isSelf(user._id) || actionLoading === user._id}
                        onChange={(e) =>
                          updateRole(user, e.target.value as 'user' | 'admin')
                        }
                        className="rounded-lg border border-gray-200 px-2 py-1 text-xs capitalize"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.isActive ? USER_STATUS.active : USER_STATUS.inactive
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.totalBookings ?? 0}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(user.joinedAt || user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={user.isActive}
                            disabled={isSelf(user._id) || actionLoading === user._id}
                            onChange={() => toggleStatus(user)}
                          />
                          <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-disabled:opacity-50" />
                        </label>
                        {!isSelf(user._id) && (
                          <button
                            type="button"
                            onClick={() => deleteUser(user)}
                            disabled={actionLoading === user._id}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination page={pagination.page} pages={pagination.pages} onPageChange={setPage} />
          </>
        )}
      </div>

      {(selectedUser || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            {detailLoading || !selectedUser ? (
              <p className="text-sm text-gray-400">Loading user details...</p>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={selectedUser.user.name} />
                    <div>
                      <h3 className="text-lg font-semibold">{selectedUser.user.name}</h3>
                      <p className="text-sm text-gray-500">{selectedUser.user.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-gray-500">Role</dt>
                    <dd className="capitalize">{selectedUser.user.role}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Status</dt>
                    <dd>{selectedUser.user.isActive ? 'Active' : 'Inactive'}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Total Bookings</dt>
                    <dd>{selectedUser.user.totalBookings ?? 0}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Joined</dt>
                    <dd>
                      {new Date(
                        selectedUser.user.joinedAt || selectedUser.user.createdAt
                      ).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <h4 className="font-semibold">Booking History</h4>
                  {selectedUser.bookings.length === 0 ? (
                    <p className="mt-2 text-sm text-gray-400">No bookings yet.</p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {selectedUser.bookings.map((booking: Booking) => (
                        <div
                          key={booking._id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        >
                          <div>
                            <p className="font-medium">
                              Plot {booking.plot?.plotNumber} — {booking.layout?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <StatusBadge status={booking.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
