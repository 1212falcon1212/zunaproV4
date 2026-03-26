'use client';

import { useState, useEffect, useCallback, use } from 'react';
import {
  User,
  Building2,
  Users,
  KeyRound,
  LifeBuoy,
  Plus,
  Search,
  Save,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@zunapro/ui';
import { panelApi } from '@/lib/panel-api';

type SettingsTab = 'profile' | 'company' | 'users' | 'security' | 'support';

interface AuthMe {
  email: string;
  role: string;
}

interface ProfileInfo {
  value?: {
    name?: string;
    phone?: string;
  };
}

interface StoreInfo {
  store_name?: Record<string, string>;
  store_phone?: string;
  store_email?: string;
  store_address?: string;
}

const TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
  { id: 'company', label: 'Company', icon: <Building2 className="h-4 w-4" /> },
  { id: 'users', label: 'Users', icon: <Users className="h-4 w-4" /> },
  { id: 'security', label: 'Password & Security', icon: <KeyRound className="h-4 w-4" /> },
  { id: 'support', label: 'Support', icon: <LifeBuoy className="h-4 w-4" /> },
];

const TEAM = [
  { name: 'John Doe', email: 'john@demo.com', role: 'Admin', status: 'Active' },
  { name: 'Jane Smith', email: 'jane@demo.com', role: 'Editor', status: 'Active' },
  { name: 'Bob Wilson', email: 'bob@demo.com', role: 'Accountant', status: 'Pending Invite' },
];

function StatusMessage({ type, message }: { type: 'success' | 'error'; message: string }) {
  if (!message) return null;
  return (
    <div
      className={cn(
        'mt-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm',
        type === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : 'border-rose-200 bg-rose-50 text-rose-700',
      )}
    >
      {type === 'success' ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" />
      ) : (
        <XCircle className="h-4 w-4 shrink-0" />
      )}
      {message}
    </div>
  );
}

/* ───────────────────────── Profile Tab ───────────────────────── */

function ProfileTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [me, profile] = await Promise.all([
          panelApi.get<AuthMe>('/auth/me'),
          panelApi.get<ProfileInfo>('/settings/profile_info').catch(() => null),
        ]);
        setEmail(me.email ?? '');
        setRole(me.role ?? '');
        setName(profile?.value?.name ?? '');
        setPhone(profile?.value?.phone ?? '');
      } catch {
        setStatus({ type: 'error', message: 'Failed to load profile data.' });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setStatus(null);
    try {
      await panelApi.put('/settings/profile_info', {
        value: { name, phone },
        group: 'profile',
      });
      setStatus({ type: 'success', message: 'Profile saved successfully.' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save profile.';
      setStatus({ type: 'error', message });
    } finally {
      setSaving(false);
    }
  }, [name, phone]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-800">Profile Information</h3>
      </div>
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Email</span>
            <input
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500 outline-none"
              value={email}
              readOnly
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Role</span>
            <div className="flex items-center pt-1">
              <span className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                {role}
              </span>
            </div>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Full Name</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Phone</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 123 4567"
            />
          </label>
        </div>

        {status && <StatusMessage type={status.type} message={status.message} />}

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────── Company Tab ───────────────────────── */

function CompanyTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [storeName, setStoreName] = useState<Record<string, string>>({ tr: '', en: '' });
  const [storePhone, setStorePhone] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [storeAddress, setStoreAddress] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await panelApi
          .get<StoreInfo>('/storefront/settings/store-info')
          .catch(() => ({} as StoreInfo));
        setStoreName(data.store_name ?? { tr: '', en: '' });
        setStorePhone(data.store_phone ?? '');
        setStoreEmail(data.store_email ?? '');
        setStoreAddress(data.store_address ?? '');
      } catch {
        setStatus({ type: 'error', message: 'Failed to load store information.' });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setStatus(null);
    try {
      await panelApi.put('/settings/store_info', {
        value: {
          store_name: storeName,
          store_phone: storePhone,
          store_email: storeEmail,
          store_address: storeAddress,
        },
        group: 'store',
      });
      setStatus({ type: 'success', message: 'Company info saved successfully.' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save company info.';
      setStatus({ type: 'error', message });
    } finally {
      setSaving(false);
    }
  }, [storeName, storePhone, storeEmail, storeAddress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-800">Company Information</h3>
      </div>
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Store Name (TR)</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              value={storeName.tr ?? ''}
              onChange={(e) => setStoreName((prev) => ({ ...prev, tr: e.target.value }))}
              placeholder="Store name in Turkish"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Store Name (EN)</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              value={storeName.en ?? ''}
              onChange={(e) => setStoreName((prev) => ({ ...prev, en: e.target.value }))}
              placeholder="Store name in English"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Phone</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              value={storePhone}
              onChange={(e) => setStorePhone(e.target.value)}
              placeholder="+1 212 555 0000"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-medium text-slate-500">Email</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              value={storeEmail}
              onChange={(e) => setStoreEmail(e.target.value)}
              placeholder="info@yourstore.com"
            />
          </label>
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-medium text-slate-500">Address</span>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              placeholder="Full address"
            />
          </label>
        </div>

        {status && <StatusMessage type={status.type} message={status.message} />}

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}

/* ───────────────────────── Main Settings Page ───────────────────────── */

export default function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [tab, setTab] = useState<SettingsTab>('profile');
  const { locale } = use(params);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your panel and account settings
        </p>
      </div>

      <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            data-state={tab === item.id ? 'active' : 'inactive'}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition',
              'data-[state=active]:bg-white data-[state=active]:shadow-sm',
              tab === item.id
                ? 'text-slate-900'
                : 'text-slate-600 hover:text-slate-800',
            )}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'profile' && <ProfileTab />}

      {tab === 'company' && <CompanyTab />}

      {tab === 'users' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-800">Users</h3>
              <button className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">
                <Plus className="h-4 w-4" />
                Create User
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
              <Search className="h-4 w-4 text-slate-400" />
              <input placeholder="Search users..." className="w-full text-sm outline-none" />
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {TEAM.map((user) => (
                    <tr key={user.email}>
                      <td className="py-3 text-sm font-medium text-slate-900">{user.name}</td>
                      <td className="py-3 text-sm text-slate-600">{user.email}</td>
                      <td className="py-3 text-sm text-slate-600">{user.role}</td>
                      <td className="py-3">
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-xs font-medium',
                            user.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700',
                          )}
                        >
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h3 className="text-sm font-semibold text-slate-800">Change Password</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-slate-500">Current Password</span>
                  <input
                    type="password"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-slate-500">New Password</span>
                  <input
                    type="password"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-slate-500">Confirm New Password</span>
                  <input
                    type="password"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                  />
                </label>
              </div>
              <button className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">
                <KeyRound className="h-4 w-4" />
                Update Password
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
              <h3 className="text-sm font-semibold text-slate-800">Security Settings</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {[
                  { title: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account' },
                  { title: 'Login Alerts', desc: 'Email notifications on new sign-ins' },
                  { title: 'IP Restriction', desc: 'Allow access from specific IP addresses only' },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <button className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200">
                      Enable
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'support' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50/50 px-6 py-4">
            <h3 className="text-sm font-semibold text-slate-800">Support & Ticket System</h3>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-600">
              E-commerce site owners and marketplace sellers can create support requests as tickets.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Open Tickets</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">8</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">In Review</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">3</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Resolved</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">41</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={`/${locale}/panel/support`}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                View Support Tickets
              </Link>
              <Link
                href={`/${locale}/panel/support/new`}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Create New Ticket
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
