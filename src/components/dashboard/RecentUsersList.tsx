import { RecentUser } from '@/lib/types';

interface RecentUsersListProps {
  users: RecentUser[];
}

function getInitials(name?: string | null) {
  const safe = name?.trim();
  if (!safe) return '?';

  return safe
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function RecentUsersList({ users }: RecentUsersListProps) {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
      {users.length === 0 ? (
        <p className="mt-4 text-sm text-gray-400">No users yet</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {users.map((user) => (
            <li key={user.id || user.email} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900">{user.name || 'Unknown user'}</p>
                <p className="truncate text-sm text-gray-500">{user.email || '—'}</p>
              </div>
              <p className="shrink-0 text-xs text-gray-400">
                {user.date ? new Date(user.date).toLocaleDateString() : '—'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
