'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AdminSettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="mt-1 text-sm text-gray-500">Admin account and application shortcuts</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card space-y-4">
          <h3 className="font-semibold text-gray-900">Account</h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="font-medium text-gray-900">{user?.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-gray-900">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Role</dt>
              <dd className="font-medium capitalize text-gray-900">{user?.role}</dd>
            </div>
          </dl>
          <button type="button" onClick={logout} className="btn-secondary text-sm">
            Sign Out
          </button>
        </section>

        <section className="card space-y-4">
          <h3 className="font-semibold text-gray-900">Quick Links</h3>
          <div className="flex flex-col gap-2">
            <Link href="/dashboard/cms" className="text-sm text-primary-600 hover:underline">
              Edit homepage &amp; site content (CMS)
            </Link>
            <Link href="/dashboard/users" className="text-sm text-primary-600 hover:underline">
              Manage users
            </Link>
            <Link href="/" className="text-sm text-primary-600 hover:underline">
              View public site
            </Link>
          </div>
        </section>

        <section className="card space-y-3 lg:col-span-2">
          <h3 className="font-semibold text-gray-900">Production checklist</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
            <li>Set Cloudinary env vars on the backend for persistent image uploads</li>
            <li>Configure Gmail SMTP for booking and inquiry emails</li>
            <li>Set <code className="text-xs">NEXT_PUBLIC_SITE_URL</code> before deploying the frontend</li>
            <li>Change the default admin password after seeding</li>
          </ul>
          <p className="text-sm text-gray-500">
            See <code className="text-xs">DEPLOY.md</code> in the project root for the full deployment guide.
          </p>
        </section>
      </div>
    </div>
  );
}
